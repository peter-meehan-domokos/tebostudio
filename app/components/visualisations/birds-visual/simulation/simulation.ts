import { forceSimulation, Simulation } from 'd3-force';
import { BirdData } from './types';
import { createCollisionForce, SimulationConfig, defaultSimulationConfig } from './forces';

export { defaultSimulationConfig };

/**
 * Creates and configures a D3 force simulation for bird movement
 * @param birds - Initial array of bird data
 * @param config - Simulation configuration
 * @returns Configured D3 simulation
 */
export const createBirdSimulation = (
  birds: BirdData[],
  config: SimulationConfig
): Simulation<BirdData, undefined> => {
  const simulation = forceSimulation<BirdData>(birds)
    .velocityDecay(config.velocityDecay)
    .alphaDecay(0.05) // Higher = faster cooldown (default is 0.0228)
    .force('collide', createCollisionForce((d) => config.collisionRadiusBase * d.size));

  return simulation;
};

/**
 * Angle stability threshold to prevent jittery rotation
 * Birds moving slower than this won't update their angle
 */
export const ANGLE_THRESHOLD = 0.5;
export const ANGLE_THRESHOLD_SQUARED = ANGLE_THRESHOLD * ANGLE_THRESHOLD;

/**
 * Smoothing factor for angle interpolation (0-1)
 * Lower = smoother turns, Higher = snappier turns
 */
export const ANGLE_LERP_FACTOR = 0.2;

/**
 * Linear interpolation for angles, handling wraparound
 * @param current - Current angle in radians
 * @param target - Target angle in radians
 * @param factor - Interpolation factor (0-1)
 * @returns Interpolated angle in radians
 */
export const lerpAngle = (current: number, target: number, factor: number): number => {
  // Handle angle wraparound
  let diff = target - current;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  
  return current + diff * factor;
};

/**
 * Calculates rotation angle from velocity
 * @param vx - X velocity
 * @param vy - Y velocity
 * @returns Angle in radians
 */
export const calculateAngle = (vx: number, vy: number): number => {
  return Math.atan2(vy, vx);
};

/**
 * Updates bird angle based on velocity with stability threshold and smoothing
 * @param bird - Bird data to update
 * @returns Updated bird with new angle
 */
export const updateBirdAngle = (bird: BirdData): BirdData => {
  const speed2 = bird.vx * bird.vx + bird.vy * bird.vy;
  
  // Only update angle if bird is moving fast enough
  if (speed2 > ANGLE_THRESHOLD_SQUARED) {
    const targetAngle = calculateAngle(bird.vx, bird.vy);
    const newAngle = lerpAngle(bird.angle, targetAngle, ANGLE_LERP_FACTOR);
    
    return { ...bird, angle: newAngle };
  }
  
  // Keep current angle if moving too slowly
  return bird;
};
