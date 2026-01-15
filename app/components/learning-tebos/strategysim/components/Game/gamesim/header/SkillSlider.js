import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const SkillSlider = ({ label, value, onChange, min = 1, max = 10 }) => {
  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const handleRef = useRef(null);
  const filledBarRef = useRef(null);
  const draggedValueRef = useRef(value);
  const sliderIdRef = useRef(
    `slider-${Math.random().toString(36).substr(2, 9)}`
  );
  const width = 300;
  const height = 30;
  const margin = { left: 0, right: 0 };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const scale = d3.scaleLinear().domain([min, max]).range([0, innerWidth]);

    const g = svg.append("g").attr("transform", `translate(${margin.left}, 0)`);
    const id = sliderIdRef.current;

    // Click area (behind everything)
    const clickRect = g
      .append("rect")
      .attr("class", `click-area-${id}`)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", innerWidth)
      .attr("height", height)
      .attr("fill", "transparent")
      .attr("cursor", "pointer");

    // Background track
    g.append("rect")
      .attr("class", `background-track-${id}`)
      .attr("x", 0)
      .attr("y", height / 2 - 4)
      .attr("width", innerWidth)
      .attr("height", 8)
      .attr("fill", "#e9ecef")
      .attr("rx", 4);

    // Filled track (value bar)
    const filledBar = g
      .append("rect")
      .attr("class", `filled-bar-${id}`)
      .attr("x", 0)
      .attr("y", height / 2 - 4)
      .attr("width", scale(value))
      .attr("height", 8)
      .attr("fill", "#007bff")
      .attr("rx", 4);

    filledBarRef.current = filledBar;

    // Draggable handle
    const handle = g
      .append("circle")
      .attr("class", `drag-handle-${id}`)
      .attr("cx", scale(value))
      .attr("cy", height / 2)
      .attr("r", 10)
      .attr("fill", "#007bff")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("cursor", "grab")
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

    handleRef.current = handle;

    // Drag behavior
    const drag = d3
      .drag()
      .on("start", function () {
        isDraggingRef.current = true;
        draggedValueRef.current = value;
        d3.select(this).attr("cursor", "grabbing");
      })
      .on("drag", function (event) {
        const newX = Math.max(0, Math.min(innerWidth, event.x));
        const newValue = Math.round(scale.invert(newX));

        if (newValue >= min && newValue <= max) {
          draggedValueRef.current = newValue;
          handleRef.current.attr("cx", scale(newValue));
          filledBarRef.current.attr("width", scale(newValue));
        }
      })
      .on("end", function () {
        d3.select(this).attr("cursor", "grab");
        isDraggingRef.current = false;
        onChange(draggedValueRef.current);
      });

    handle.call(drag);

    // Click on track to jump to position
    clickRect.on("click", function (event) {
      const [x] = d3.pointer(event);
      const newValue = Math.round(scale.invert(x));

      if (newValue >= min && newValue <= max) {
        handleRef.current.attr("cx", scale(newValue));
        filledBarRef.current.attr("width", scale(newValue));
        onChange(newValue);
      }
    });
  }, [min, max]);

  // Update visuals when value changes externally (not from dragging)
  useEffect(() => {
    if (!handleRef.current || !filledBarRef.current) return;
    if (isDraggingRef.current) return;

    const innerWidth = width - margin.left - margin.right;
    const scale = d3.scaleLinear().domain([min, max]).range([0, innerWidth]);

    handleRef.current.attr("cx", scale(value));
    filledBarRef.current.attr("width", scale(value));
  }, [value, min, max]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <label
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#666",
          }}
        >
          {label}
        </label>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#007bff",
          }}
        >
          {value}
        </span>
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ display: "block" }}
      />
    </div>
  );
};

SkillSlider.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default SkillSlider;
