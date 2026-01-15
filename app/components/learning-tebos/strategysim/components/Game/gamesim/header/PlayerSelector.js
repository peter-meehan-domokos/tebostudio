import React, { useCallback } from "react";
import PropTypes from "prop-types";
import PassingSlider from "./PassingSlider";
import ControlSlider from "./ControlSlider";
import DribblingSlider from "./DribblingSlider";

const PlayerSelector = ({ isOpen, onClose, player, onPlayerChange }) => {
  if (!isOpen) return null;

  const handleNameChange = (e) => {
    onPlayerChange({ ...player, name: e.target.value });
  };

  const handlePassingChange = useCallback(
    (value) => {
      onPlayerChange((prevPlayer) => ({ ...prevPlayer, passing: value }));
    },
    [onPlayerChange]
  );

  const handleControlChange = useCallback(
    (value) => {
      onPlayerChange((prevPlayer) => ({ ...prevPlayer, control: value }));
    },
    [onPlayerChange]
  );

  const handleDribblingChange = useCallback(
    (value) => {
      onPlayerChange((prevPlayer) => ({ ...prevPlayer, dribbling: value }));
    },
    [onPlayerChange]
  );

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
          minWidth: "400px",
          maxWidth: "600px",
          maxHeight: "80vh",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          position: "relative",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: "0 0 24px 0",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Player
        </h2>

        {/* Name Input */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#666",
              marginBottom: "6px",
            }}
          >
            Name
          </label>
          <input
            type="text"
            value={player.name}
            onChange={handleNameChange}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
              color: "#212529",
            }}
          />
        </div>

        {/* Passing Slider */}
        <PassingSlider value={player.passing} onChange={handlePassingChange} />

        {/* Control Slider */}
        <ControlSlider value={player.control} onChange={handleControlChange} />

        {/* Dribbling Slider */}
        <DribblingSlider
          value={player.dribbling}
          onChange={handleDribblingChange}
        />

        {/* Close Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              fontSize: "12px",
              fontWeight: "bold",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

PlayerSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    passing: PropTypes.number.isRequired,
    control: PropTypes.number.isRequired,
    dribbling: PropTypes.number.isRequired,
  }).isRequired,
  onPlayerChange: PropTypes.func.isRequired,
};

export default PlayerSelector;
