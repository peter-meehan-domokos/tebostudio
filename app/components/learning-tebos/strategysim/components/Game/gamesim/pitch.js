import * as d3 from "d3";
import { DURATIONS } from "./Constants";

// Color constants - soft, eye-friendly colors
const GREEN_COLOR = "#8fc26f"; // Brighter sage green (hit state)
const GREY_COLOR = "#9b8aa0"; // Soft lavender grey (default state)

// Player SVG path data
const PLAYER_PATH =
  "M7.5 4.5a1.75 1.75 0 1 0 .001-3.499A1.75 1.75 0 0 0 7.5 4.5Zm3.5 2v3c0 .551-.448 1-1 1V14a1 1 0 0 1-2 0v-3a.5.5 0 0 0-1 0v3a1 1 0 0 1-2 0v-3.5c-.552 0-1-.449-1-1v-3c0-.916.623-1.682 1.464-1.918A2.735 2.735 0 0 0 7.5 5.5c.81 0 1.532-.359 2.036-.918A1.997 1.997 0 0 1 11 6.5Z";

// Player position configurations
const PLAYER_POSITIONS = {
  // Starting position adjusted more to the left for better centering (scaled by 2.66)
  startingPosition: "translate(-16, -26) scale(2.128)",

  A: {
    left: "translate(-32, -133) scale(2.128)", // 16 units left from adjusted center of A marker (scaled by 2x)
    right: "translate(0, -133) scale(2.128)", // 16 units right from adjusted center of A marker (scaled by 2x)
    above: "translate(-16, -149) scale(2.128)", // 16 units above A marker (scaled by 2x)
    below: "translate(-16, -101) scale(2.128)", // 32 units below A marker (scaled by 2x)
  },
  B: {
    left: "translate(-32, -26) scale(2.128)", // 16 units left from adjusted center of B marker (scaled by 2x)
    right: "translate(0, -26) scale(2.128)", // 16 units right from adjusted center of B marker (scaled by 2x)
    above: "translate(-16, -42) scale(2.128)", // 16 units above B marker (scaled by 2x)
    below: "translate(-16, 5) scale(2.128)", // 32 units below B marker (scaled by 2x)
  },
  C: {
    left: "translate(-32, 80) scale(2.128)", // 16 units left from adjusted center of C marker (scaled by 2x)
    right: "translate(0, 80) scale(2.128)", // 16 units right from adjusted center of C marker (scaled by 2x)
    above: "translate(-16, 64) scale(2.128)", // 16 units above C marker (scaled by 2x)
    below: "translate(-16, 112) scale(2.128)", // 32 units below C marker (scaled by 2x)
  },
};

// Pitch component following Mike Bostock's D3 component pattern
export function pitch() {
  let width = 200;
  let height = 200;
  let rectWidth = 100;
  let rectHeight = 160;

  let playerGroup = null; // Store reference to player group

  function update(selection) {
    function init(svg) {
      // Clear existing content
      svg.selectAll("*").remove();

      // Calculate rectangle positioning
      const rectX = (width - rectWidth) / 2; // Center horizontally
      const rectY = (height - rectHeight) / 2; // Center vertically

      // Group for the rectangle lines
      const linesGroup = svg.append("g").attr("class", "lines-group");

      // Top horizontal line
      linesGroup
        .append("line")
        .attr("class", "wall-6") // Top wall
        .attr("x1", rectX)
        .attr("y1", rectY)
        .attr("x2", rectX + rectWidth)
        .attr("y2", rectY)
        .attr("stroke", GREY_COLOR)
        .attr("stroke-width", 2);

      // Bottom horizontal line
      linesGroup
        .append("line")
        .attr("class", "wall-3") // Bottom wall
        .attr("x1", rectX)
        .attr("y1", rectY + rectHeight)
        .attr("x2", rectX + rectWidth)
        .attr("y2", rectY + rectHeight)
        .attr("stroke", GREY_COLOR)
        .attr("stroke-width", 2);

      // Left vertical line - top half (Top-Left wall)
      linesGroup
        .append("line")
        .attr("class", "wall-5") // Top-Left wall
        .attr("x1", rectX)
        .attr("y1", rectY)
        .attr("x2", rectX)
        .attr("y2", rectY + rectHeight / 2)
        .attr("stroke", GREY_COLOR)
        .attr("stroke-width", 2);

      // Left vertical line - bottom half (Bottom-Left wall)
      linesGroup
        .append("line")
        .attr("class", "wall-4") // Bottom-Left wall
        .attr("x1", rectX)
        .attr("y1", rectY + rectHeight / 2)
        .attr("x2", rectX)
        .attr("y2", rectY + rectHeight)
        .attr("stroke", GREY_COLOR)
        .attr("stroke-width", 2);

      // Right vertical line - top half (Top-Right wall)
      linesGroup
        .append("line")
        .attr("class", "wall-1") // Top-Right wall
        .attr("x1", rectX + rectWidth)
        .attr("y1", rectY)
        .attr("x2", rectX + rectWidth)
        .attr("y2", rectY + rectHeight * 0.5)
        .attr("stroke", GREY_COLOR)
        .attr("stroke-width", 2);

      // Right vertical line - bottom half (Bottom-Right wall)
      linesGroup
        .append("line")
        .attr("class", "wall-2") // Bottom-Right wall
        .attr("x1", rectX + rectWidth)
        .attr("y1", rectY + rectHeight * 0.5)
        .attr("x2", rectX + rectWidth)
        .attr("y2", rectY + rectHeight)
        .attr("stroke", GREY_COLOR)
        .attr("stroke-width", 2);

      // 1. Top Right - create group positioned at label location
      const label1Group = svg
        .append("g")
        .attr("class", "label-1-group")
        .attr(
          "transform",
          `translate(${rectX + rectWidth + 30}, ${rectY + rectHeight * 0.25})`
        );

      label1Group
        .append("text")
        .attr("class", "label-1-text")
        .attr("x", 0)
        .attr("y", -6)
        .text("1")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      label1Group
        .append("text")
        .attr("class", "label-1-text")
        .attr("x", 0)
        .attr("y", 4)
        .text("Top")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      label1Group
        .append("text")
        .attr("class", "label-1-text")
        .attr("x", 0)
        .attr("y", 14)
        .text("Right")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      // 2. Bottom Right - create group positioned at label location
      const label2Group = svg
        .append("g")
        .attr("class", "label-2-group")
        .attr(
          "transform",
          `translate(${rectX + rectWidth + 30}, ${rectY + rectHeight * 0.75})`
        );

      label2Group
        .append("text")
        .attr("class", "label-2-text")
        .attr("x", 0)
        .attr("y", -6)
        .text("2")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      label2Group
        .append("text")
        .attr("class", "label-2-text")
        .attr("x", 0)
        .attr("y", 4)
        .text("Bottom")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      label2Group
        .append("text")
        .attr("class", "label-2-text")
        .attr("x", 0)
        .attr("y", 14)
        .text("Right")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      // 3. Bottom - create group positioned at label location
      const label3Group = svg
        .append("g")
        .attr("class", "label-3-group")
        .attr(
          "transform",
          `translate(${rectX + rectWidth / 2}, ${rectY + rectHeight + 6})`
        );

      label3Group
        .append("text")
        .attr("class", "label-3-text")
        .attr("x", 0)
        .attr("y", 0)
        .text("3. Bottom")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "hanging");

      // 4. Bottom Left - create group positioned at label location
      const label4Group = svg
        .append("g")
        .attr("class", "label-4-group")
        .attr(
          "transform",
          `translate(${rectX - 30}, ${rectY + rectHeight * 0.75})`
        );

      label4Group
        .append("text")
        .attr("class", "label-4-text")
        .attr("x", 0)
        .attr("y", -6)
        .text("4")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      label4Group
        .append("text")
        .attr("class", "label-4-text")
        .attr("x", 0)
        .attr("y", 4)
        .text("Bottom")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      label4Group
        .append("text")
        .attr("class", "label-4-text")
        .attr("x", 0)
        .attr("y", 14)
        .text("Left")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      // 5. Top Left - create group positioned at label location
      const label5Group = svg
        .append("g")
        .attr("class", "label-5-group")
        .attr(
          "transform",
          `translate(${rectX - 30}, ${rectY + rectHeight * 0.25})`
        );

      label5Group
        .append("text")
        .attr("class", "label-5-text")
        .attr("x", 0)
        .attr("y", -6)
        .text("5")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      label5Group
        .append("text")
        .attr("class", "label-5-text")
        .attr("x", 0)
        .attr("y", 4)
        .text("Top")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      label5Group
        .append("text")
        .attr("class", "label-5-text")
        .attr("x", 0)
        .attr("y", 14)
        .text("Left")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      // 6. Top - create group positioned at label location
      const label6Group = svg
        .append("g")
        .attr("class", "label-6-group")
        .attr("transform", `translate(${rectX + rectWidth / 2}, ${rectY - 5})`);

      label6Group
        .append("text")
        .attr("class", "label-6-text")
        .attr("x", 0)
        .attr("y", 0)
        .text("6. Top")
        .attr("font-size", "8px")
        .attr("fill", GREY_COLOR)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "bottom");

      // Create a group for the center point markers, positioned at rectangle center
      const centrePointG = svg
        .append("g")
        .attr(
          "transform",
          `translate(${rectX + rectWidth / 2}, ${rectY + rectHeight / 2})`
        );

      // Draw a small grey circle at the center (0,0 relative to group)
      centrePointG
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 1)
        .attr("fill", "grey");

      // Create a separate group for the blue circle
      const ballG = svg
        .append("g")
        .attr("class", "ball-g")
        .attr(
          "transform",
          `translate(${rectX + rectWidth / 2}, ${rectY + rectHeight / 2})`
        );

      // Draw a blue circle on top of the center circle
      ballG
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 2)
        .attr("fill", "blue")
        .attr("opacity", 0.5);

      // B text slightly to the right of center
      centrePointG
        .append("text")
        .attr("x", 4)
        .attr("y", 0)
        .text("B")
        .attr("font-size", "9px")
        .attr("fill", "grey")
        .attr("opacity", 0.7)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle");

      // Add A marker group halfway between center and top
      const aG = centrePointG
        .append("g")
        .attr("transform", `translate(0, ${-rectHeight / 4})`);

      // Circle at A position
      aG.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 1)
        .attr("fill", GREY_COLOR);

      // A text slightly to the right
      aG.append("text")
        .attr("x", 4)
        .attr("y", 0)
        .text("A")
        .attr("font-size", "9px")
        .attr("fill", GREY_COLOR)
        .attr("opacity", 0.7)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle");

      // Add C marker group halfway between center and bottom
      const cG = centrePointG
        .append("g")
        .attr("transform", `translate(0, ${rectHeight / 4})`);

      // Circle at C position
      cG.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 1)
        .attr("fill", GREY_COLOR);

      // C text slightly to the right
      cG.append("text")
        .attr("x", 4)
        .attr("y", 0)
        .text("C")
        .attr("font-size", "9px")
        .attr("fill", GREY_COLOR)
        .attr("opacity", 0.7)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle");

      // Add player icon next to center point - start at B.left since ball starts at B
      playerGroup = centrePointG
        .append("g")
        .attr("class", "player-group")
        .attr("transform", PLAYER_POSITIONS.B.left);

      playerGroup
        .append("path")
        .attr("d", PLAYER_PATH)
        .attr("fill", "#000000")
        .attr("opacity", 0.7);
    }

    selection.each(function () {
      const svg = d3.select(this);
      init(svg);
    });
  }

  // Method to change wall color when hit
  update.highlightWall = function (wallNumber) {
    // Change wall line color to green
    d3.select(`.wall-${wallNumber}`)
      .transition()
      .duration(DURATIONS.ANIMATION.WALL_HIGHLIGHT)
      .attr("stroke", GREEN_COLOR);

    // Change associated label text color to green
    d3.selectAll(`.label-${wallNumber}-text`)
      .transition()
      .duration(DURATIONS.ANIMATION.WALL_HIGHLIGHT)
      .attr("fill", GREEN_COLOR);

    return update;
  };

  // Method to reset all walls to grey (for new trials)
  update.resetWalls = function () {
    // Reset all wall lines to grey
    d3.selectAll('[class^="wall-"]')
      .transition()
      .duration(300)
      .attr("stroke", GREY_COLOR);

    // Reset all label texts to grey
    d3.selectAll('[class*="-text"]')
      .transition()
      .duration(300)
      .attr("fill", GREY_COLOR);

    return update;
  };

  // Method to move player to follow ball position
  update.movePlayerToBallPosition = function (ballPosition, duration = 300) {
    if (!playerGroup) return update;

    // Always move player to the left position relative to the ball position
    const targetPosition = PLAYER_POSITIONS[ballPosition]
      ? PLAYER_POSITIONS[ballPosition].left
      : PLAYER_POSITIONS.startingPosition;

    // Animate player to new position with same easing as ball
    playerGroup
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .attr("transform", targetPosition);

    //console.log(`Player moving to ${ballPosition}.left`);
    return update;
  };

  // Method to move player to specific position around ball
  update.movePlayerToPosition = function (
    ballPosition,
    direction,
    duration = 300
  ) {
    if (!playerGroup) return update;

    const targetPosition =
      PLAYER_POSITIONS[ballPosition] &&
      PLAYER_POSITIONS[ballPosition][direction]
        ? PLAYER_POSITIONS[ballPosition][direction]
        : PLAYER_POSITIONS[ballPosition].left; // Fallback to left

    // Animate player to new position with same easing as ball
    playerGroup
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .attr("transform", targetPosition);

    //console.log(`Player moving to ${ballPosition}.${direction}`);
    return update;
  };

  // Getter/setter methods following D3 component pattern
  update.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return update;
  };

  update.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return update;
  };

  update.rectWidth = function (value) {
    if (!arguments.length) return rectWidth;
    rectWidth = value;
    return update;
  };

  update.rectHeight = function (value) {
    if (!arguments.length) return rectHeight;
    rectHeight = value;
    return update;
  };

  return update;
}
