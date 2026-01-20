import React, { useState } from "react";
import PropTypes from "prop-types";
import SideOrderSelector from "./SideOrderSelector";
import PlayerSelector from "./PlayerSelector";

const Header = ({
  simulationName = "Simulation",
  orderType = "random",
  fixedSideOrder = [1, 2, 3, 4, 5, 6],
  onOrderTypeChange = () => {},
  onSimulationNameChange = () => {},
  trialsCount = 0,
  scoreStats = null,
  onDownloadCSV = () => {},
  player = { name: "No name", passing: 5, control: 5, dribbling: 5 },
  onPlayerChange = () => {},
}) => {
  const [showSideOrderSelector, setShowSideOrderSelector] = useState(false);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(simulationName);

  const handleOrderToggle = (newOrderType) => {
    if (newOrderType === "specified") {
      setShowSideOrderSelector(true);
    } else {
      onOrderTypeChange(newOrderType);
    }
  };

  const handleSideOrderSave = (newOrder) => {
    onOrderTypeChange("specified", newOrder);
    setShowSideOrderSelector(false);
  };

  const handleSideOrderClose = () => {
    setShowSideOrderSelector(false);
  };

  const handleNameClick = () => {
    setIsEditingName(true);
    setTempName(simulationName);
  };

  const handleNameSave = () => {
    onSimulationNameChange(tempName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(simulationName);
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      handleNameCancel();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "14px 20px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderBottom: "1px solid rgba(128, 128, 128, 0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(5px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left side: Simulation info and Side Order */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flex: "1",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "200px",
          }}
        >
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyPress}
              autoFocus
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#333",
                border: "none",
                borderRadius: "3px",
                padding: "0px",
                background: "transparent",
                outline: "none",
                margin: 0,
              }}
            />
          ) : (
            <div
              onClick={handleNameClick}
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#333",
                cursor: "pointer",
                padding: "0px",
                borderRadius: "3px",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(0, 123, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
              title="Click to edit simulation name"
            >
              {simulationName}
            </div>
          )}
          {trialsCount > 0 && scoreStats && (
            <div
              style={{
                fontSize: "10px",
                color: "#666",
                marginTop: "2px",
              }}
            >
              Trials: {trialsCount} | Avg Score: {scoreStats.average} | High:{" "}
              {scoreStats.highest} | Low: {scoreStats.lowest}{" "}
            </div>
          )}
        </div>

        {/* Side Order Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "12px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            Side Order:
          </span>
          <div
            style={{
              display: "flex",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              padding: "2px",
              border: "1px solid #ddd",
            }}
          >
            <button
              onClick={() => handleOrderToggle("random")}
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: "500",
                backgroundColor:
                  orderType === "random" ? "#007bff" : "transparent",
                color: orderType === "random" ? "white" : "#666",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Random
            </button>
            <button
              onClick={() => handleOrderToggle("specified")}
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: "500",
                backgroundColor:
                  orderType === "specified" ? "#007bff" : "transparent",
                color: orderType === "specified" ? "white" : "#666",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Specified
            </button>
          </div>
        </div>

        {/* Side Order Display */}
        {orderType === "specified" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#f8f9fa",
              padding: "4px 6px",
              borderRadius: "4px",
              border: "1px solid #e9ecef",
              fontSize: "9px",
            }}
          >
            <span style={{ color: "#666", fontWeight: "500" }}>Order:</span>
            <div style={{ display: "flex", gap: "2px" }}>
              {fixedSideOrder.slice(0, 10).map((sideNumber, index) => (
                <span
                  key={`${index}-${sideNumber}`}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "2px 4px",
                    borderRadius: "2px",
                    fontSize: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {sideNumber}
                </span>
              ))}
              {fixedSideOrder.length > 10 && (
                <span
                  style={{
                    color: "#666",
                    padding: "2px 4px",
                    fontSize: "8px",
                    fontWeight: "bold",
                  }}
                >
                  ...
                </span>
              )}
            </div>
            <button
              onClick={() => setShowSideOrderSelector(true)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#007bff",
                fontSize: "8px",
                cursor: "pointer",
                textDecoration: "underline",
                padding: "0",
              }}
            >
              Edit
            </button>
          </div>
        )}

        {/* Player Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "12px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "#666",
              fontWeight: "500",
            }}
          >
            Player:
          </span>
          <div
            onClick={() => setShowPlayerSelector(true)}
            style={{
              fontSize: "10px",
              fontWeight: "500",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {player.name}
          </div>
        </div>
      </div>

      {/* Right side: Download button */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={onDownloadCSV}
          disabled={trialsCount === 0}
          style={{
            padding: "6px 12px",
            fontSize: "11px",
            fontWeight: "bold",
            backgroundColor: trialsCount > 0 ? "#28a745" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: trialsCount > 0 ? "pointer" : "not-allowed",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            opacity: trialsCount > 0 ? 1 : 0.6,
            transition: "all 0.2s ease",
          }}
          title={
            trialsCount > 0
              ? `Download ${trialsCount} trials as CSV`
              : "No trials to download"
          }
        >
          Download CSV
        </button>
      </div>

      {/* Side Order Selector Dialog */}
      <SideOrderSelector
        isOpen={showSideOrderSelector}
        onClose={handleSideOrderClose}
        onSave={handleSideOrderSave}
        initialOrder={fixedSideOrder}
      />

      {/* Player Selector Dialog */}
      <PlayerSelector
        isOpen={showPlayerSelector}
        onClose={() => setShowPlayerSelector(false)}
        player={player}
        onPlayerChange={onPlayerChange}
      />
    </div>
  );
};

Header.propTypes = {
  simulationName: PropTypes.string,
  orderType: PropTypes.string,
  fixedSideOrder: PropTypes.array,
  onOrderTypeChange: PropTypes.func,
  onSimulationNameChange: PropTypes.func,
  trialsCount: PropTypes.number,
  scoreStats: PropTypes.shape({
    average: PropTypes.number,
    highest: PropTypes.number,
    lowest: PropTypes.number,
  }),
  onDownloadCSV: PropTypes.func,
};

export default Header;
