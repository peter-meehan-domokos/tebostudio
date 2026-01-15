import React from "react";
import PropTypes from "prop-types";
import SimulationAnalysisTabs from "./SimulationAnalysisTabs";
import TrialsLog from "./TrialsLog";

const SimulationLogs = ({
  simulationLog,
  totalDuration,
  fadeDuration,
  trialsLog,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        flex: "1",
        minWidth: 0, // Allow flex item to shrink below content size
      }}
    >
      {/* Top: Events Log and Histogram */}
      <SimulationAnalysisTabs
        simulationLog={simulationLog}
        totalDuration={totalDuration}
        fadeDuration={fadeDuration}
        trialsLog={trialsLog}
      />

      {/* Bottom: Trials Log */}
      <TrialsLog trialsLog={trialsLog} />
    </div>
  );
};

SimulationLogs.propTypes = {
  simulationLog: PropTypes.array.isRequired,
  totalDuration: PropTypes.number.isRequired,
  fadeDuration: PropTypes.bool.isRequired,
  trialsLog: PropTypes.array.isRequired,
};

export default SimulationLogs;
