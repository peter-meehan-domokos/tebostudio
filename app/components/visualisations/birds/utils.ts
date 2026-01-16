import { BIRD_WIDTH, BIRD_HEIGHT, TOTAL_BIRDS, MARGIN_PERCENT } from './constants';

interface GridConfig {
  readonly cols: number;
  readonly rows: number;
  readonly birdWidth: number;
  readonly birdHeight: number;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly scale: number;
}

export const calculateGrid = (containerWidth: number, containerHeight: number): GridConfig => {
  // Total space per bird including margins (10% on each side = 20% total)
  const horizontalBirdSpace = BIRD_WIDTH * (1 + 2 * MARGIN_PERCENT);
  const verticalBirdSpace = BIRD_HEIGHT * (1 + 2 * MARGIN_PERCENT);
  
  const containerAspect = containerWidth / containerHeight;
  const birdSpaceAspect = horizontalBirdSpace / verticalBirdSpace;
  
  // For optimal fit: rows/cols = birdSpaceAspect / containerAspect
  const cols = Math.ceil(Math.sqrt(TOTAL_BIRDS * containerAspect / birdSpaceAspect));
  const rows = Math.ceil(TOTAL_BIRDS / cols);
  
  // Calculate scale based on total space needed (including margins)
  const scaleX = containerWidth / (cols * horizontalBirdSpace);
  const scaleY = containerHeight / (rows * verticalBirdSpace);
  const scale = Math.min(scaleX, scaleY);
  
  return {
    cols,
    rows,
    birdWidth: BIRD_WIDTH * scale,
    birdHeight: BIRD_HEIGHT * scale,
    cellWidth: horizontalBirdSpace * scale,
    cellHeight: verticalBirdSpace * scale,
    scale
  };
};

interface BirdPosition {
  readonly x: number;
  readonly y: number;
  readonly index: number;
}

export const generateBirdPositions = (
  cols: number,
  rows: number,
  cellWidth: number,
  cellHeight: number
): readonly BirdPosition[] => {
  return Array.from({ length: TOTAL_BIRDS }, (_, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // Center bird in its cell
    return {
      index,
      x: col * cellWidth + cellWidth / 2,
      y: row * cellHeight + cellHeight / 2
    };
  });
};
