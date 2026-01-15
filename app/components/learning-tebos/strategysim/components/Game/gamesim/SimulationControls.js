import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const SimulationControls = ({
  runMode = 'stopped',
  speedMultiplier = 1,
  onPlaySimulation = () => {},
  onLoopSimulation = () => {},
  onStopSimulation = () => {},
  onSpeedChange = () => {},
}) => {
  const incrementIntervalRef = useRef(null);
  const decrementIntervalRef = useRef(null);
  const incrementTimeoutRef = useRef(null);
  const decrementTimeoutRef = useRef(null);

  // Handle press and hold for increment
  const handleIncrementStart = () => {
    if (runMode !== 'stopped' || speedMultiplier >= 50) return;

    // Clear any existing intervals/timeouts first
    handleIncrementEnd();

    // Immediate increment
    onSpeedChange(Math.min(50, speedMultiplier + 0.25));

    // Start repeating increment after a short delay
    incrementTimeoutRef.current = setTimeout(() => {
      incrementIntervalRef.current = setInterval(() => {
        onSpeedChange(prev => {
          const newValue = Math.min(50, prev + 1);
          return newValue;
        });
      }, 150); // Repeat every 150ms (faster)
    }, 400); // Initial delay before repeating starts
  };

  const handleIncrementEnd = () => {
    if (incrementTimeoutRef.current) {
      clearTimeout(incrementTimeoutRef.current);
      incrementTimeoutRef.current = null;
    }
    if (incrementIntervalRef.current) {
      clearInterval(incrementIntervalRef.current);
      incrementIntervalRef.current = null;
    }
  };

  // Handle press and hold for decrement
  const handleDecrementStart = () => {
    if (runMode !== 'stopped' || speedMultiplier <= 0.25) return;

    // Clear any existing intervals/timeouts first
    handleDecrementEnd();

    // Immediate decrement
    onSpeedChange(Math.max(0.25, speedMultiplier - 0.25));

    // Start repeating decrement after a short delay
    decrementTimeoutRef.current = setTimeout(() => {
      decrementIntervalRef.current = setInterval(() => {
        onSpeedChange(prev => {
          const newValue = Math.max(0.25, prev - 1);
          return newValue;
        });
      }, 150); // Repeat every 150ms (faster)
    }, 400); // Initial delay before repeating starts
  };

  const handleDecrementEnd = () => {
    if (decrementTimeoutRef.current) {
      clearTimeout(decrementTimeoutRef.current);
      decrementTimeoutRef.current = null;
    }
    if (decrementIntervalRef.current) {
      clearInterval(decrementIntervalRef.current);
      decrementIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleIncrementEnd();
      handleDecrementEnd();
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        padding: '8px 20px',
        backgroundColor: 'rgba(248, 249, 250, 0.95)',
        borderBottom: '1px solid rgba(128, 128, 128, 0.1)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backdropFilter: 'blur(5px)',
        gap: '12px',
      }}
    >
      {/* Play/Loop/Stop Controls */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={onPlaySimulation}
          disabled={runMode !== 'stopped'}
          style={{
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: runMode !== 'stopped' ? '#cccccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: runMode !== 'stopped' ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          Play
        </button>
        <button
          onClick={onLoopSimulation}
          disabled={runMode !== 'stopped'}
          style={{
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: runMode !== 'stopped' ? '#cccccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: runMode !== 'stopped' ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          Loop
        </button>
        <button
          onClick={onStopSimulation}
          disabled={runMode === 'stopped'}
          style={{
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: runMode === 'stopped' ? '#cccccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: runMode === 'stopped' ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          Stop
        </button>
      </div>

      {/* Speed Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
        }}
      >
        <button
          onMouseDown={handleDecrementStart}
          onMouseUp={handleDecrementEnd}
          onMouseLeave={handleDecrementEnd}
          disabled={runMode !== 'stopped' || speedMultiplier <= 0.25}
          style={{
            padding: '3px 6px',
            fontSize: '10px',
            fontWeight: 'bold',
            backgroundColor:
              runMode !== 'stopped' || speedMultiplier <= 0.25
                ? '#cccccc'
                : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor:
              runMode !== 'stopped' || speedMultiplier <= 0.25
                ? 'not-allowed'
                : 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            userSelect: 'none', // Prevent text selection during hold
          }}
        >
          −
        </button>
        <span
          style={{
            padding: '3px 6px',
            fontSize: '10px',
            fontWeight: 'bold',
            backgroundColor: 'white',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '3px',
            minWidth: '36px',
            textAlign: 'center',
          }}
        >
          {speedMultiplier.toFixed(1)}x
        </span>
        <button
          onMouseDown={handleIncrementStart}
          onMouseUp={handleIncrementEnd}
          onMouseLeave={handleIncrementEnd}
          disabled={runMode !== 'stopped' || speedMultiplier >= 50}
          style={{
            padding: '3px 6px',
            fontSize: '10px',
            fontWeight: 'bold',
            backgroundColor:
              runMode !== 'stopped' || speedMultiplier >= 50
                ? '#cccccc'
                : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor:
              runMode !== 'stopped' || speedMultiplier >= 50
                ? 'not-allowed'
                : 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            userSelect: 'none', // Prevent text selection during hold
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

SimulationControls.propTypes = {
  runMode: PropTypes.string,
  speedMultiplier: PropTypes.number,
  onPlaySimulation: PropTypes.func,
  onLoopSimulation: PropTypes.func,
  onStopSimulation: PropTypes.func,
  onSpeedChange: PropTypes.func,
};

export default SimulationControls;
