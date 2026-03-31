import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { calculateScore, calculateUniqueHits } from "./helpers";
import { DURATIONS, DURATION_DISPLAY_DIVISOR } from "./Constants";

const TrialsLog = ({ trialsLog }) => {
  const [trialsLogVisible, setTrialsLogVisible] = useState(true);
  const trialsLogRef = useRef(null);

  // Auto-scroll to bottom when new trial is added
  useEffect(() => {
    if (trialsLog.length > 0) {
      setTimeout(() => {
        if (trialsLogRef.current && trialsLogRef.current.parentElement) {
          trialsLogRef.current.parentElement.scrollTop =
            trialsLogRef.current.parentElement.scrollHeight;
        }
      }, DURATIONS.INTERVALS.SCROLL_DELAY);
    }
  }, [trialsLog.length]);

  // Helper function to convert side name to shorthand
  const getSideShorthand = (sideName) => {
    const mapping = {
      "Top-Right": "TR",
      "Bottom-Right": "BR",
      Bottom: "B",
      "Bottom-Left": "BL",
      "Top-Left": "TL",
      Top: "T",
    };
    return mapping[sideName] || sideName;
  };

  // Helper function to count position moves
  const countMoves = (fromPos, toPos) => {
    if (fromPos === toPos) return 0;
    if (
      (fromPos === "A" && toPos === "B") ||
      (fromPos === "B" && toPos === "A") ||
      (fromPos === "B" && toPos === "C") ||
      (fromPos === "C" && toPos === "B")
    ) {
      return 1; // Adjacent positions = 1 move
    }
    if (
      (fromPos === "A" && toPos === "C") ||
      (fromPos === "C" && toPos === "A")
    ) {
      return 2; // A↔C = 2 moves
    }
    return 0;
  };

  // Helper function to generate detailed movement sequence
  const generateMovementSequence = (events) => {
    const sequence = [];
    let totalMoves = 0;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const { startPosition, requiredPosition, sideName } = event;

      // Process each action in the event to show errors in correct positions
      if (event.actions) {
        for (const action of event.actions) {
          if (action.actionType === "turn") {
            // Add turn display (t for quarter turn, tt for half turn)
            if (action.turnType === "quarter") {
              sequence.push({
                type: "movement", // Use same type as moves for blue color
                text: "t",
                moves: 0,
              });
            } else if (action.turnType === "half") {
              sequence.push({
                type: "movement", // Use same type as moves for blue color
                text: "tt",
                moves: 0,
              });
            }
            // Add turn error if present
            if (action.hasError) {
              sequence.push({
                type: "error",
                text: "E",
                moves: 0,
              });
            }
          } else if (action.actionType === "move") {
            // Add position movement if needed
            if (startPosition !== requiredPosition) {
              sequence.push({
                type: "movement",
                text: `${startPosition.toLowerCase()}_${requiredPosition.toLowerCase()}`,
                moves: countMoves(startPosition, requiredPosition),
              });
              totalMoves += countMoves(startPosition, requiredPosition);
            }
            if (action.hasError) {
              sequence.push({
                type: "error",
                text: "E",
                moves: 0,
              });
            }
          } else if (action.actionType === "pass") {
            // Add wall hit
            sequence.push({
              type: "wall",
              text: getSideShorthand(sideName),
              moves: 0,
            });
            if (action.hasError) {
              sequence.push({
                type: "error",
                text: "E",
                moves: 0,
              });
            }
          }
        }
      } else {
        // Fallback for events without actions array (backward compatibility)
        // Add position movement if needed
        if (startPosition !== requiredPosition) {
          sequence.push({
            type: "movement",
            text: `${startPosition.toLowerCase()}_${requiredPosition.toLowerCase()}`,
            moves: countMoves(startPosition, requiredPosition),
          });
          totalMoves += countMoves(startPosition, requiredPosition);
        }

        // Add wall hit
        sequence.push({
          type: "wall",
          text: getSideShorthand(sideName),
          moves: 0,
        });

        // Add error if present (old format)
        if (event.error) {
          sequence.push({
            type: "error",
            text: "E",
            moves: 0,
          });
        }
      }
    }

    return { sequence, totalMoves };
  };

  // Helper function to get trial summary stats
  const getTrialStats = () => {
    if (trialsLog.length === 0) return null;

    const durations = trialsLog.map(
      (t) => t.totalDuration / DURATION_DISPLAY_DIVISOR
    );
    return {
      shortest: Math.min(...durations).toFixed(1),
      longest: Math.max(...durations).toFixed(1),
      average: (
        durations.reduce((a, b) => a + b, 0) / durations.length
      ).toFixed(1),
    };
  };

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "white",
        borderRadius: "6px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: trialsLogVisible ? "150px" : "auto",
        overflowY: trialsLogVisible ? "auto" : "visible",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={() => setTrialsLogVisible(!trialsLogVisible)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "10px",
            color: "#666",
            padding: "2px 4px",
            borderRadius: "2px",
          }}
          title={trialsLogVisible ? "Hide trials log" : "Show trials log"}
        >
          {trialsLogVisible ? "▼" : "▶"}
        </button>
        <h3
          style={{
            margin: "0",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#212529",
          }}
        >
          Trials Log
        </h3>
      </div>

      {trialsLogVisible && (
        <>
          {/* Trials Summary */}
          {trialsLog.length > 0 && (
            <div
              style={{
                marginBottom: "6px",
                marginTop: "8px",
                padding: "4px 6px",
                fontSize: "10px",
                color: "#666",
              }}
            >
              Summary: Shortest {getTrialStats()?.shortest}s | Longest{" "}
              {getTrialStats()?.longest}s | Avg {getTrialStats()?.average}s |
              Trials: {trialsLog.length}
            </div>
          )}

          <div
            ref={trialsLogRef}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            {trialsLog.length === 0 ? (
              <div
                style={{
                  padding: "8px",
                  fontStyle: "italic",
                  color: "#666",
                  fontSize: "10px",
                }}
              >
                No trials completed yet...
              </div>
            ) : (
              trialsLog.map((trial, index) => (
                <div
                  key={index}
                  style={{
                    padding: "4px 6px",
                    borderBottom:
                      index < trialsLog.length - 1 ? "1px solid #eee" : "none",
                    fontSize: "9px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <span>
                      {(() => {
                        const { sequence } = generateMovementSequence(
                          trial.events
                        );
                        return sequence.map((item, idx) => (
                          <span
                            key={idx}
                            style={{
                              color:
                                item.type === "movement"
                                  ? "#007bff"
                                  : item.type === "error"
                                  ? "#ff3333"
                                  : "#333",
                            }}
                          >
                            {item.text}
                            {idx < sequence.length - 1 ? "\u00A0\u00A0" : ""}
                          </span>
                        ));
                      })()}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", marginTop: "6px" }}>
                    <span style={{ color: "#666" }}>
                      {(() => {
                        const totalActions = trial.events.reduce(
                          (sum, event) =>
                            sum + (event.actions ? event.actions.length : 4),
                          0
                        );

                        // Count half-turns and quarter-turns based on actual durations
                        let halfTurns = 0;
                        let quarterTurns = 0;

                        trial.events.forEach((event) => {
                          if (event.actions) {
                            event.actions.forEach((action) => {
                              if (action.actionType === "turn") {
                                // Use turnType property if available
                                if (action.turnType === "half") {
                                  halfTurns++;
                                } else if (action.turnType === "quarter") {
                                  quarterTurns++;
                                }
                                // Ignore identity turns (turnType === 'identity' or undefined)
                              }
                            });
                          } else {
                            // Default for events without actions: assume 2 quarter-turns per event
                            quarterTurns += 2;
                          }
                        });

                        const totalMoves = generateMovementSequence(
                          trial.events
                        ).totalMoves;
                        const uniqueHits = calculateUniqueHits(trial.events);
                        const hits = trial.events.length;
                        const score = calculateScore(trial.events);
                        return (
                          <>
                            {`unique hits: ${uniqueHits} | hits: ${hits} | actions: ${totalActions} | half-turns: ${halfTurns} | quarter-turns: ${quarterTurns} | moves: ${totalMoves} | `}
                            <strong>score: {score}</strong>
                          </>
                        );
                      })()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

TrialsLog.propTypes = {
  trialsLog: PropTypes.array.isRequired,
};

export default TrialsLog;
