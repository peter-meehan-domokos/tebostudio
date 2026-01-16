'use client';
import { useEffect, useRef, useState } from 'react';
import { BirdCanvas } from './bird/BirdCanvas';
import { calculateGrid, generateBirdPositions } from './utils';
import './bird/birds.css';

interface Dimensions {
  readonly width: number;
  readonly height: number;
}

export default function Birds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get initial dimensions immediately
    const updateDimensions = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
      });
    };
    
    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
    return <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#E8F4F8' }} />;
  }

  const gridConfig = calculateGrid(dimensions.width, dimensions.height);
  const birdPositions = generateBirdPositions(
    gridConfig.cols,
    gridConfig.rows,
    gridConfig.cellWidth,
    gridConfig.cellHeight
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#E8F4F8' }}>
      <BirdCanvas
        width={dimensions.width}
        height={dimensions.height}
        birdPositions={birdPositions}
        birdSize={50 * gridConfig.scale}
      />
    </div>
  );
}
