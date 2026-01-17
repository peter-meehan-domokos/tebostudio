import { forceCollide } from 'd3-force';
import { BirdData } from './types';

/**
 * Creates a collision force to prevent birds from overlapping
 * @param radiusFn - Function to get collision radius for each bird based on size
 * @returns D3 collision force
 */
export const createCollisionForce = (radiusFn: (d: BirdData) => number) => {
  return forceCollide<BirdData>()
    .radius(radiusFn)
    .strength(0.4)
    .iterations(1);
};

/**
 * Creates a wander force that adds subtle random velocity for chaos mode
 * @param wanderStrength - Strength of wander effect (0.02-0.08 typical)
 * @returns Force function that can be called to apply wander
 */
export const createWanderForce = (wanderStrength: number = 0.05) => {
  return (birds: BirdData[]): void => {
    birds.forEach(bird => {
      bird.vx = (bird.vx ?? 0) + (Math.random() * 2 - 1) * wanderStrength;
      bird.vy = (bird.vy ?? 0) + (Math.random() * 2 - 1) * wanderStrength;
    });
  };
};

/**
 * Configuration for the D3 force simulation
 */
export interface SimulationConfig {
  readonly collisionRadiusBase: number;
  readonly velocityDecay: number;
  readonly maxSpeed: number;
  readonly positionPadding: number;
  readonly wanderStrength: number;
}

/**
 * Default simulation configuration values
 */
export const defaultSimulationConfig: SimulationConfig = {
  collisionRadiusBase: 2.25,
  velocityDecay: 0.15, // Lower = slower, smoother movement (default is 0.4)
  maxSpeed: 3.5,
  positionPadding: 10,
  wanderStrength: 0.08
};
