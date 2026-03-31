import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const ControlSlider = ({ value, onChange, min = 1, max = 10 }) => {
  const svgRef = useRef(null);
  const isDragging = useRef(false);
  const handleElem = useRef(null);
  const barElem = useRef(null);
  const draggedVal = useRef(value);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const trackWidth = 300;
    const handleRadius = 10;
    const padding = handleRadius;
    const totalWidth = trackWidth + padding * 2;
    const height = 30;
    const scale = d3
      .scaleLinear()
      .domain([min, max])
      .range([padding, trackWidth + padding]);

    const g = svg.append("g");

    g.append("rect")
      .attr("x", padding)
      .attr("y", 11)
      .attr("width", trackWidth)
      .attr("height", 8)
      .attr("fill", "#e9ecef")
      .attr("rx", 4);

    const bar = g
      .append("rect")
      .attr("x", padding)
      .attr("y", 11)
      .attr("width", scale(value) - padding)
      .attr("height", 8)
      .attr("fill", "#007bff")
      .attr("rx", 4);

    barElem.current = bar;

    const handle = g
      .append("circle")
      .attr("cx", scale(value))
      .attr("cy", 15)
      .attr("r", handleRadius)
      .attr("fill", "#007bff")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("cursor", "grab")
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

    handleElem.current = handle;

    const drag = d3
      .drag()
      .on("start", function () {
        isDragging.current = true;
        draggedVal.current = value;
        d3.select(this).attr("cursor", "grabbing");
      })
      .on("drag", function (event) {
        const trackWidth = 300;
        const handleRadius = 10;
        const padding = handleRadius;
        const newX = Math.max(padding, Math.min(trackWidth + padding, event.x));
        const newValue = Math.round(scale.invert(newX));
        if (newValue >= min && newValue <= max) {
          draggedVal.current = newValue;
          handleElem.current.attr("cx", scale(newValue));
          barElem.current.attr("width", scale(newValue) - padding);
        }
      })
      .on("end", function () {
        d3.select(this).attr("cursor", "grab");
        isDragging.current = false;
        onChange(draggedVal.current);
      });

    handle.call(drag);
  }, [min, max]);

  useEffect(() => {
    if (!handleElem.current || !barElem.current || isDragging.current) return;
    const trackWidth = 300;
    const handleRadius = 10;
    const padding = handleRadius;
    const scale = d3
      .scaleLinear()
      .domain([min, max])
      .range([padding, trackWidth + padding]);
    handleElem.current.attr("cx", scale(value));
    barElem.current.attr("width", scale(value) - padding);
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
        <label style={{ fontSize: "12px", fontWeight: "bold", color: "#666" }}>
          Control
        </label>
        <span
          style={{ fontSize: "12px", fontWeight: "bold", color: "#007bff" }}
        >
          {value}
        </span>
      </div>
      <svg ref={svgRef} width={320} height={30} style={{ display: "block" }} />
    </div>
  );
};

ControlSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default ControlSlider;
