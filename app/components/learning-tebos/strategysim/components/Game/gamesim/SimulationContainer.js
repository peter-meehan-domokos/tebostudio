import React, { useState, useRef } from "react";
import SimulationControls from "./SimulationControls";
import GameSim from "./GameSim";

const SimulationContainer = () => {
  // Move simulation state up from GameSim
  const [runMode, setRunMode] = useState("stopped");
  const runModeRef = useRef("stopped");
  const [speedMultiplier, setSpeedMultiplier] = useState(5);

  // Pass handlers down to GameSim
  const handlePlaySimulation = () => {
    setRunMode("running");
    runModeRef.current = "running";
  };

  const handleLoopSimulation = () => {
    setRunMode("continuous");
    runModeRef.current = "continuous";
  };

  const handleStopSimulation = () => {
    setRunMode("stopped");
    runModeRef.current = "stopped";
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeedMultiplier(newSpeed);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Simulation Controls Header */}
      <SimulationControls
        runMode={runMode}
        speedMultiplier={speedMultiplier}
        onPlaySimulation={handlePlaySimulation}
        onLoopSimulation={handleLoopSimulation}
        onStopSimulation={handleStopSimulation}
        onSpeedChange={handleSpeedChange}
      />

      {/* Grouped Simulation Content */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "calc(100vh - 60px)", // Subtract controls header height
        }}
      >
        <GameSim
          runMode={runMode}
          runModeRef={runModeRef}
          speedMultiplier={speedMultiplier}
          onPlaySimulation={handlePlaySimulation}
          onLoopSimulation={handleLoopSimulation}
          onStopSimulation={handleStopSimulation}
          onRunModeChange={setRunMode}
        />
      </div>
    </div>
  );
};

export default SimulationContainer;
