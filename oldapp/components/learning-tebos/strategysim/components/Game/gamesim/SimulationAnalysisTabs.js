import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import TrialsHistogram from "./TrialsHistogram";
import { calculateScore } from "./helpers";
import { DURATIONS, DURATION_DISPLAY_DIVISOR } from "./Constants";

const SimulationAnalysisTabs = ({
  simulationLog,
  totalDuration,
  fadeDuration,
  trialsLog,
}) => {
  const [activeTab, setActiveTab] = useState("events");
  const eventsLogRef = useRef(null);

  // Auto-scroll events log to bottom after 6 events to keep latest event visible
  useEffect(() => {
    if (simulationLog.length > 6 && eventsLogRef.current) {
      setTimeout(() => {
        eventsLogRef.current.scrollTop = eventsLogRef.current.scrollHeight;
      }, DURATIONS.INTERVALS.SCROLL_DELAY);
    }
  }, [simulationLog.length]);

  return (
    <div
      style={{
        flex: "1",
        backgroundColor: "white",
        borderRadius: "6px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: "242px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tab Headers */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={() => setActiveTab("events")}
          style={{
            padding: "8px 16px",
            fontSize: "11px",
            fontWeight: "bold",
            backgroundColor: activeTab === "events" ? "#f8f9fa" : "white",
            color: activeTab === "events" ? "#007bff" : "#666",
            border: "none",
            borderBottom: activeTab === "events" ? "2px solid #007bff" : "none",
            cursor: "pointer",
            borderTopLeftRadius: "6px",
          }}
        >
          Event Log
        </button>
        <button
          onClick={() => setActiveTab("histogram")}
          style={{
            padding: "8px 16px",
            fontSize: "11px",
            fontWeight: "bold",
            backgroundColor: activeTab === "histogram" ? "#f8f9fa" : "white",
            color: activeTab === "histogram" ? "#007bff" : "#666",
            border: "none",
            borderBottom:
              activeTab === "histogram" ? "2px solid #007bff" : "none",
            cursor: "pointer",
          }}
        >
          Histogram
        </button>
      </div>

      {/* Tab Content */}
      <div
        style={{
          flex: "1",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeTab === "events" ? (
          <>
            <div
              style={{
                marginBottom: "6px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#212529",
              }}
            >
              Score: {calculateScore(simulationLog)}
              <span
                style={{
                  marginLeft: "8px",
                  opacity: fadeDuration ? 0 : 1,
                  transition: "opacity 0.2s ease-out",
                }}
              >
                | Time:{" "}
                {(totalDuration / DURATION_DISPLAY_DIVISOR) % 1 === 0
                  ? (totalDuration / DURATION_DISPLAY_DIVISOR).toFixed(0)
                  : (totalDuration / DURATION_DISPLAY_DIVISOR).toFixed(1)}
                s
              </span>
            </div>
            <div
              ref={eventsLogRef}
              style={{
                flex: "1",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "4px",
                maxHeight: "170px", // Constrain height to enable scrolling
              }}
            >
              {simulationLog.length === 0 ? (
                <div
                  style={{
                    padding: "8px",
                    fontStyle: "italic",
                    color: "#666",
                    fontSize: "10px",
                  }}
                >
                  No events yet...
                </div>
              ) : (
                simulationLog.map((event, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "6px 8px",
                      borderBottom:
                        index < simulationLog.length - 1
                          ? "1px solid #eee"
                          : "none",
                      fontSize: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      opacity: event.exceedsTimeLimit ? 0.5 : 1,
                      fontStyle: event.exceedsTimeLimit ? "italic" : "normal",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#212529" }}>
                      {event.sideName}
                      {event.exceedsTimeLimit && (
                        <span
                          style={{
                            fontSize: "8px",
                            color: "#999",
                            marginLeft: "4px",
                          }}
                        >
                          (not counted)
                        </span>
                      )}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {event.error && (
                        <>
                          <span
                            style={{
                              color: "#ff0000",
                              fontSize: "9px",
                              fontWeight: "bold",
                            }}
                          >
                            {event.errorCount > 1
                              ? `Error x ${event.errorCount}`
                              : "Error"}
                          </span>
                          <span
                            style={{
                              color: "#ddd",
                              fontSize: "9px",
                            }}
                          >
                            |
                          </span>
                        </>
                      )}
                      <span
                        style={{
                          color: "#666",
                          fontSize: "9px",
                          textAlign: "left",
                          width: "150px",
                          display: "inline-block",
                        }}
                      >
                        Duration:{" "}
                        {(
                          event.eventDuration / DURATION_DISPLAY_DIVISOR
                        ).toFixed(1)}
                        s | Position:{" "}
                        {event.startPosition === event.requiredPosition
                          ? event.startPosition
                          : `${event.startPosition} → ${event.requiredPosition}`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Histogram Tab Content */
          <div style={{ flex: "1", display: "flex", minHeight: 0 }}>
            <TrialsHistogram trialsLog={trialsLog} />
          </div>
        )}
      </div>
    </div>
  );
};

SimulationAnalysisTabs.propTypes = {
  simulationLog: PropTypes.array.isRequired,
  totalDuration: PropTypes.number.isRequired,
  fadeDuration: PropTypes.bool.isRequired,
  trialsLog: PropTypes.array.isRequired,
};

export default SimulationAnalysisTabs;
