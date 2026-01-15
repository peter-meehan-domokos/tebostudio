import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { pitch } from "./pitch";
import { simulation } from "./simulation";
import Header from "./header/Header";
import SimulationLogs from "./SimulationLogs";
import { downloadToCSV } from "./download";
import { calculateScore } from "./helpers";
import { DURATIONS, MAX_SIMULATION_TIME } from "./Constants";

const GameSim = ({ runMode, runModeRef, speedMultiplier, onRunModeChange }) => {
  const containerRef = useRef(null);
  const pitchRef = useRef(null); // Store pitch component reference
  const fadeTimeoutRef = useRef(null); // Store timeout ID for duration fade
  const [simulationLog, setSimulationLog] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [fadeDuration, setFadeDuration] = useState(false);
  const currentSimulationRef = useRef(null);
  const [trialsLog, setTrialsLog] = useState([]);
  const [orderType, setOrderType] = useState("random");
  const [fixedSideOrder, setFixedSideOrder] = useState(null);
  const [simulationName, setSimulationName] = useState("Simulation");
  const [player, setPlayer] = useState({
    name: "No name",
    passing: 5,
    control: 5,
    dribbling: 5,
  });

  const handlePlayerChange = (updater) => {
    setPlayer((prevPlayer) =>
      typeof updater === "function" ? updater(prevPlayer) : updater
    );
  };

  const handleOrderTypeChange = (newOrderType, sideOrder = null) => {
    setOrderType(newOrderType);
    if (newOrderType === "specified" && sideOrder) {
      setFixedSideOrder(sideOrder);
    } else {
      setFixedSideOrder(null);
    }
  };

  const handleSimulationNameChange = (newName) => {
    setSimulationName(newName || "Simulation");
  };

  useEffect(() => {
    if (containerRef.current) {
      const svg = d3.select(containerRef.current);

      // Create and configure the pitch component
      const pitchComponent = pitch()
        .width(532)
        .height(532)
        .rectWidth(266)
        .rectHeight(426);

      // Store reference for later use
      pitchRef.current = pitchComponent;

      // Apply the pitch component to the SVG
      svg.call(pitchComponent);
    }
  }, []);

  const startSingleTrial = useCallback(() => {
    setSimulationLog([]); // Clear previous log
    setTotalDuration(0); // Reset total duration

    // Clear any pending fade timeout and reset fade state
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    setFadeDuration(false);

    // Reset pitch colors to grey at start of new trial
    if (pitchRef.current) {
      pitchRef.current.resetWalls();
    }

    // Keep track of current trial events to avoid stale state
    let currentTrialEvents = [];

    // Create simulation instance with event callback
    const sim = simulation()
      .rectWidth(266)
      .rectHeight(426)
      .speedMultiplier(speedMultiplier)
      .fixedSideOrder(fixedSideOrder)
      .player(player)
      .pitchComponent(pitchRef.current) // Pass pitch component reference for player movement
      .onEventComplete((eventData) => {
        // Add event to both state and local tracking
        currentTrialEvents.push(eventData);
        setSimulationLog((prev) => [...prev, eventData]);

        // Only update totalDuration if event doesn't exceed time limit
        if (!eventData.exceedsTimeLimit) {
          setTotalDuration(eventData.totalDuration);
        }

        // Highlight the wall that was just hit
        if (pitchRef.current && eventData.sideNumber) {
          pitchRef.current.highlightWall(eventData.sideNumber);
        }
      })
      .onSimulationComplete(() => {
        // Set total duration display to MAX when simulation completes
        setTotalDuration(MAX_SIMULATION_TIME);

        // Set timeout to fade out duration after 3 seconds
        fadeTimeoutRef.current = setTimeout(() => {
          setFadeDuration(true);
        }, 3000);

        // Only add trial if simulation wasn't cancelled
        if (runModeRef.current !== "stopped") {
          // Filter out events that exceeded time limit
          const validEvents = currentTrialEvents.filter(
            (e) => !e.exceedsTimeLimit
          );
          const finalDuration =
            validEvents.length > 0
              ? validEvents[validEvents.length - 1].totalDuration
              : 0;

          const score = calculateScore(validEvents);
          const trial = {
            trialNumber: trialsLog.length + 1,
            events: validEvents,
            totalDuration: finalDuration,
            errorCount: validEvents.filter((e) => e.error).length,
            score, // <-- add score property
          };
          setTrialsLog((prev) => [...prev, trial]);
        }

        // Handle next action based on mode
        if (runModeRef.current === "continuous") {
          // Start next trial immediately
          setTimeout(
            () => startSingleTrial(),
            DURATIONS.INTERVALS.TRIAL_START_DELAY
          );
        } else {
          // Single trial completed, stop
          onRunModeChange("stopped");
          runModeRef.current = "stopped";
          currentSimulationRef.current = null;
        }
      });

    // Store simulation reference for cancellation
    currentSimulationRef.current = sim;

    // Generate events and bind to ballG
    const events = sim.generateEvents();

    // Find the ballG element and run simulation
    const ballG = d3.select(".ball-g");
    if (!ballG.empty()) {
      ballG.datum(events).call(sim);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    speedMultiplier,
    fixedSideOrder,
    player,
    trialsLog.length,
    onRunModeChange,
  ]);

  // Watch for runMode changes and start simulation accordingly
  useEffect(() => {
    if (
      (runMode === "running" || runMode === "continuous") &&
      (!currentSimulationRef.current || currentSimulationRef.current === null)
    ) {
      // Start trial when switching from stopped to running or continuous
      startSingleTrial();
    }
    // Note: continuous mode is handled in the simulation completion callback
  }, [runMode, startSingleTrial]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to get trial score stats
  const getScoreStats = () => {
    if (trialsLog.length === 0) return null;
    const scores = trialsLog.map((t) => t.score);
    return {
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
    };
  };

  // Handle CSV download
  const handleDownloadCSV = () => {
    if (trialsLog.length === 0) {
      console.warn("No trials to download.");
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10); // Just the date (YYYY-MM-DD)
    const safeName = simulationName.replace(/[^a-zA-Z0-9-_]/g, "_"); // Replace invalid filename characters
    const filename = `${safeName}-${timestamp}.csv`;
    downloadToCSV(trialsLog, filename);
  };

  // Render

  return (
    <>
      <div style={{ marginTop: "40px" }}>
        <Header
          simulationNumber={trialsLog.length + 1}
          simulationName={simulationName}
          orderType={orderType}
          fixedSideOrder={fixedSideOrder}
          onOrderTypeChange={handleOrderTypeChange}
          onSimulationNameChange={handleSimulationNameChange}
          trialsCount={trialsLog.length}
          scoreStats={getScoreStats()}
          onDownloadCSV={handleDownloadCSV}
          player={player}
          onPlayerChange={handlePlayerChange}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          padding: "20px",
        }}
        className="game-sim-container"
      >
        {/* Left side: Pitch */}
        <div
          style={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <svg
            ref={containerRef}
            width={532}
            height={532}
            style={{ border: "0.5px solid rgba(128, 128, 128, 0.3)" }}
          />
        </div>

        {/* Right side: Logs (Events + Trials) */}
        <SimulationLogs
          simulationLog={simulationLog}
          totalDuration={totalDuration}
          fadeDuration={fadeDuration}
          trialsLog={trialsLog}
        />
      </div>
      <style jsx>{`
        @media (max-width: 400px) {
          .game-sim-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </>
  );
};

GameSim.propTypes = {
  runMode: PropTypes.string.isRequired,
  runModeRef: PropTypes.object.isRequired,
  speedMultiplier: PropTypes.number.isRequired,
  onRunModeChange: PropTypes.func.isRequired,
};

export default GameSim;
