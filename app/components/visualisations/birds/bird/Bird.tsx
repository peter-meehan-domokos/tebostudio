interface BirdProps {
  readonly x: number;
  readonly y: number;
  readonly size?: number;
}

export const Bird = ({ x, y, size = 50 }: BirdProps) => {
  const scale = size / 50;
  
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Small body - compressed front view */}
      <ellipse
        cx="0"
        cy="0"
        rx="4"
        ry="5"
        fill="#2C3E50"
      />
      
      {/* Head - small and round */}
      <circle cx="0" cy="-4" r="3" fill="#2C3E50" />
      
      {/* Left wing - dominant feature, spread wide */}
      <path
        d="M -4,0 Q -18,-6 -24,-3 Q -26,0 -24,2 Q -18,4 -10,3 Q -6,1 -4,0 Z"
        fill="#2C3E50"
        className="wing-left"
        style={{
          transformOrigin: '-4px 0px',
          animation: 'flapLeft 0.3s ease-in-out infinite alternate'
        }}
      />
      
      {/* Right wing - dominant feature, spread wide */}
      <path
        d="M 4,0 Q 18,-6 24,-3 Q 26,0 24,2 Q 18,4 10,3 Q 6,1 4,0 Z"
        fill="#2C3E50"
        className="wing-right"
        style={{
          transformOrigin: '4px 0px',
          animation: 'flapRight 0.3s ease-in-out infinite alternate'
        }}
      />
    </g>
  );
};
