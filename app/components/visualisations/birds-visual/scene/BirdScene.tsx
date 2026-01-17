interface BirdCanvasProps {
  readonly width: number;
  readonly height: number;
  readonly children?: React.ReactNode;
}

export const BirdScene = ({ width, height, children }: BirdCanvasProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
    >
      {children}
    </svg>
  );
};
