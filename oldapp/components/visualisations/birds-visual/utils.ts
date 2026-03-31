import { TOTAL_BIRDS } from './constants';
import { BirdData } from './simulation/types';

interface BirdPosition {
  readonly id: string; // Unique identifier for each bird
  readonly x: number; // X position within viewport
  readonly y: number; // Y position within viewport
  readonly vx: number; // Horizontal velocity for movement
  readonly vy: number; // Vertical velocity for movement
  readonly size: number; // Size scale factor (0.7-1.3 range)
  readonly jitter: number; // Per-bird variation for noise/wander strength
  readonly index: number;
}

/**
 * Clamps a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Applies position clamping to keep birds within viewport bounds
 * @param bird - Bird to clamp
 * @param width - Viewport width
 * @param height - Viewport height
 * @param padding - Padding from edges
 */
export const clampPosition = (
  bird: BirdData,
  width: number,
  height: number,
  padding: number = 10
): void => {
  bird.x = clamp(bird.x ?? 0, padding, width - padding);
  bird.y = clamp(bird.y ?? 0, padding, height - padding);
};

/**
 * Applies speed clamping to prevent birds from moving too fast
 * @param bird - Bird to clamp
 * @param maxSpeed - Maximum speed in pixels per tick
 */
export const clampSpeed = (
  bird: BirdData,
  maxSpeed: number = 3.5
): void => {
  const vx = bird.vx ?? 0;
  const vy = bird.vy ?? 0;
  const speed2 = vx * vx + vy * vy;
  const maxSpeed2 = maxSpeed * maxSpeed;
  
  if (speed2 > maxSpeed2) {
    const speed = Math.sqrt(speed2);
    const scale = maxSpeed / speed;
    bird.vx = vx * scale;
    bird.vy = vy * scale;
  }
};

export const generateBirdPositions = (
  viewportWidth: number,
  viewportHeight: number
): readonly BirdPosition[] => {
  // Add margin to prevent birds from spawning too close to edges
  const margin = 20; // pixels from edge
  const safeWidth = viewportWidth - margin * 2;
  const safeHeight = viewportHeight - margin * 2;
  
  return Array.from({ length: TOTAL_BIRDS }, (_, index) => {
    return {
      id: `bird-${index}`, // Unique identifier for each bird
      index,
      x: margin + Math.random() * safeWidth, // Random X position with margin
      y: margin + Math.random() * safeHeight, // Random Y position with margin
      vx: (Math.random() - 0.5) * 2, // Small random horizontal velocity (-1 to 1)
      vy: (Math.random() - 0.5) * 2, // Small random vertical velocity (-1 to 1)
      size: 0.7 + Math.random() * 0.6, // Random size in tight range (0.7-1.3)
      jitter: Math.random() * 0.1, // Tiny per-bird variation (0-0.1)
      angle: Math.random() * Math.PI * 2 // Random initial angle (0-2π radians)
    };
  });
};

/**
 * Assigns line mode slot positions for birds
 * @param birds - Array of birds to assign slots to
 * @param width - Viewport width
 * @param height - Viewport height
 * @param margin - Margin from edges
 */
export const assignLineSlots = (
  birds: BirdData[],
  width: number,
  height: number,
  margin: number = 40
): void => {
  const cx = width / 2;
  const usable = Math.max(1, height - margin * 2);
  const sorted = [...birds].sort((a, b) => a.index - b.index);

  sorted.forEach((b, idx) => {
    const t = sorted.length <= 1 ? 0.5 : idx / (sorted.length - 1);
    b.slotX = cx;
    b.slotY = margin + t * usable;
  });
};
