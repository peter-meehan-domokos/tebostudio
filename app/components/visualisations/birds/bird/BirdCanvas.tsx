import { Bird } from './Bird';

interface BirdPosition {
  readonly x: number;
  readonly y: number;
  readonly index: number;
}

interface BirdCanvasProps {
  readonly width: number;
  readonly height: number;
  readonly birdPositions: readonly BirdPosition[];
  readonly birdSize: number;
}

export const BirdCanvas = ({ width, height, birdPositions, birdSize }: BirdCanvasProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
    >
      {birdPositions.map(({ x, y, index }) => (
        <Bird key={index} x={x} y={y} size={birdSize} />
      ))}
    </svg>
  );
};
