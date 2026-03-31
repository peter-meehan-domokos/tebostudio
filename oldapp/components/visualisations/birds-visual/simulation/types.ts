/**
 * Bird data structure used by D3 simulation
 */
export interface BirdData {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  jitter: number;
  index: number;
  angle: number; // Current rotation angle in radians
  colorGroup?: 'blue' | 'orange' | 'purple'; // Color group for bird
  slotX?: number; // For line mode positioning
  slotY?: number; // For line mode positioning
  color?: string; // Color value from scale
  colorRank?: number; // Position in color sort within group (0 = lightest, 199 = darkest)
}

/**
 * Click repulsor data for temporary interaction
 */
export interface Repulsor {
  x: number;
  y: number;
  radius: number;
  strength: number;
  until: number; // Timestamp when repulsor expires
}

/**
 * Available visualization modes
 */
export type Mode = 'chaos' | 'bunch' | 'circle' | 'line';
