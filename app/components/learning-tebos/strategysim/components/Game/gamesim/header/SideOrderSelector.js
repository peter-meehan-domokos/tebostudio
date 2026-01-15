import React, { useState } from "react";
import PropTypes from "prop-types";

const SideOrderSelector = ({ isOpen, onClose, onSave, initialOrder }) => {
  // Color constants - same as game pitch
  const GREEN_COLOR = "#7ba05b"; // Soft sage green (selected state)
  const GREY_COLOR = "#9b8aa0"; // Soft lavender grey (default state)

  // Default side names mapping
  const sideNames = {
    1: "Top-Right",
    2: "Bottom-Right",
    3: "Bottom",
    4: "Bottom-Left",
    5: "Top-Left",
    6: "Top",
  };

  // Initialize with empty array for 20 selections, or use initialOrder if provided
  const [sideOrder, setSideOrder] = useState(
    initialOrder && initialOrder.length === 20 ? initialOrder : []
  );

  const handleSideClick = (sideNumber) => {
    // Don't allow selection if we have 20 sides already
    if (sideOrder.length >= 20) {
      alert("You have already selected 20 sides!");
      return;
    }

    // Don't allow consecutive duplicates (check last selected side)
    const lastSide = sideOrder[sideOrder.length - 1];
    if (lastSide === sideNumber) {
      alert(
        `You cannot select the same side (${sideNames[sideNumber]}) twice in a row!`
      );
      return;
    }

    setSideOrder((prev) => [...prev, sideNumber]);
  };

  const handleDeleteLast = () => {
    if (sideOrder.length > 0) {
      setSideOrder((prev) => prev.slice(0, -1));
    }
  };

  const handleSave = () => {
    if (sideOrder.length === 20) {
      onSave(sideOrder);
      onClose();
    }
  };

  const handleReset = () => {
    setSideOrder([]);
  };

  const isSideSelected = (sideNumber) => {
    // Check if this side has been selected at least once
    return sideOrder.includes(sideNumber);
  };

  const getSideColor = (sideNumber) => {
    return isSideSelected(sideNumber) ? GREEN_COLOR : GREY_COLOR;
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
        boxSizing: "border-box",
        overflow: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          minWidth: "600px",
          maxWidth: "700px",
          maxHeight: "80vh",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          position: "relative",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "12px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Specify Side Order ({sideOrder.length}/20)
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#666",
              padding: "4px",
            }}
          >
            ×
          </button>
        </div>

        {/* Instructions */}
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "20px",
            lineHeight: "1.4",
          }}
        >
          Click on the sides of the pitch to build your sequence. You need
          exactly 20 sides.
          {sideOrder.length > 0 &&
            ` Grey side (${
              sideNames[sideOrder[sideOrder.length - 1]]
            }) cannot be selected again.`}
        </p>

        <div style={{ display: "flex", gap: "24px" }}>
          {/* Pitch Visualization */}
          <div style={{ flex: "none" }}>
            <svg
              width="240"
              height="200"
              style={{ border: "1px solid #ddd", borderRadius: "6px" }}
            >
              {/* Rectangle (Pitch) */}
              <rect
                x="70"
                y="20"
                width="100"
                height="160"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />

              {/* Side 6 - Top */}
              <g
                onClick={() => handleSideClick(6)}
                style={{
                  cursor: "pointer",
                }}
              >
                <line
                  x1="70"
                  y1="20"
                  x2="170"
                  y2="20"
                  stroke={getSideColor(6)}
                  strokeWidth="8"
                />
                <text
                  x="120"
                  y="15"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={getSideColor(6)}
                >
                  6
                </text>
                <text
                  x="120"
                  y="35"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  Top
                </text>
              </g>

              {/* Side 1 - Top-Right */}
              <g
                onClick={() => handleSideClick(1)}
                style={{
                  cursor: "pointer",
                }}
              >
                <line
                  x1="170"
                  y1="20"
                  x2="170"
                  y2="90"
                  stroke={getSideColor(1)}
                  strokeWidth="8"
                />
                <text
                  x="185"
                  y="55"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={getSideColor(1)}
                >
                  1
                </text>
                <text
                  x="185"
                  y="70"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  Top-Right
                </text>
              </g>

              {/* Side 2 - Bottom-Right */}
              <g
                onClick={() => handleSideClick(2)}
                style={{
                  cursor: "pointer",
                }}
              >
                <line
                  x1="170"
                  y1="110"
                  x2="170"
                  y2="180"
                  stroke={getSideColor(2)}
                  strokeWidth="8"
                />
                <text
                  x="185"
                  y="145"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={getSideColor(2)}
                >
                  2
                </text>
                <text
                  x="185"
                  y="160"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  Bottom-Right
                </text>
              </g>

              {/* Side 3 - Bottom */}
              <g
                onClick={() => handleSideClick(3)}
                style={{
                  cursor: "pointer",
                }}
              >
                <line
                  x1="170"
                  y1="180"
                  x2="70"
                  y2="180"
                  stroke={getSideColor(3)}
                  strokeWidth="8"
                />
                <text
                  x="120"
                  y="195"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={getSideColor(3)}
                >
                  3
                </text>
                <text
                  x="120"
                  y="210"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  Bottom
                </text>
              </g>

              {/* Side 4 - Bottom-Left */}
              <g
                onClick={() => handleSideClick(4)}
                style={{
                  cursor: "pointer",
                }}
              >
                <line
                  x1="70"
                  y1="180"
                  x2="70"
                  y2="110"
                  stroke={getSideColor(4)}
                  strokeWidth="8"
                />
                <text
                  x="55"
                  y="145"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={getSideColor(4)}
                >
                  4
                </text>
                <text
                  x="55"
                  y="160"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  Bottom-Left
                </text>
              </g>

              {/* Side 5 - Top-Left */}
              <g
                onClick={() => handleSideClick(5)}
                style={{
                  cursor: "pointer",
                }}
              >
                <line
                  x1="70"
                  y1="90"
                  x2="70"
                  y2="20"
                  stroke={getSideColor(5)}
                  strokeWidth="8"
                />
                <text
                  x="55"
                  y="55"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={getSideColor(5)}
                >
                  5
                </text>
                <text
                  x="55"
                  y="70"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  Top-Left
                </text>
              </g>
            </svg>
          </div>

          {/* Selected Order List */}
          <div style={{ flex: "1" }}>
            <h4
              style={{
                margin: "0 0 12px 0",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Selected Order:
            </h4>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "6px",
                maxHeight: "300px",
                overflowY: "auto",
                padding: "8px",
              }}
            >
              {sideOrder.length === 0 ? (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    fontStyle: "italic",
                    padding: "8px",
                  }}
                >
                  No sides selected yet...
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {sideOrder.map((sideNumber, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor:
                          index === sideOrder.length - 1
                            ? "#f0f8ff"
                            : "#f8f9fa",
                        border:
                          index === sideOrder.length - 1
                            ? "1px solid #007bff"
                            : "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontWeight: "500",
                        minWidth: "70px",
                      }}
                    >
                      <span style={{ color: "#333" }}>
                        {sideNames[sideNumber]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delete Last Button */}
            {sideOrder.length > 0 && (
              <button
                onClick={handleDeleteLast}
                style={{
                  marginTop: "8px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "500",
                  backgroundColor: "#fff3cd",
                  color: "#856404",
                  border: "1px solid #ffeaa7",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete Last ({sideNames[sideOrder[sideOrder.length - 1]]})
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: "#f8f9fa",
              color: "#666",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Clear All
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: "white",
                color: "#666",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={sideOrder.length !== 20}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: sideOrder.length === 20 ? "#007bff" : "#ccc",
                color: "white",
                border: `1px solid ${
                  sideOrder.length === 20 ? "#007bff" : "#ccc"
                }`,
                borderRadius: "4px",
                cursor: sideOrder.length === 20 ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              Save Order{" "}
              {sideOrder.length === 20 ? "✓" : `(${sideOrder.length}/20)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SideOrderSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialOrder: PropTypes.arrayOf(PropTypes.number),
};

export default SideOrderSelector;
