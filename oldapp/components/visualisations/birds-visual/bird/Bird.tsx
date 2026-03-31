interface BirdProps {
  readonly x: number;
  readonly y: number;
  readonly size?: number;
  readonly angle?: number; // Rotation angle in radians
}

export const Bird = ({ x, y, size = 50, angle = 0 }: BirdProps) => {
  const scale = size / 50;
  const rotation = (angle * 180) / Math.PI; // Convert radians to degrees
  
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      <defs>
        <filter id="blur-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
      </defs>
      {/* Circle dot with blur */}
      <circle
        cx="0"
        cy="0"
        r="6"
        fill="blue"
        opacity="0.5"
        filter="url(#blur-filter)"
      />
    </g>
  );
};
