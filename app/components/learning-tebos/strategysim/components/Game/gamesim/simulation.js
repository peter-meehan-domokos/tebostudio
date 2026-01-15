import * as d3 from "d3";
import generateEvents from "./eventGeneration";
import { DURATIONS, MAX_SIMULATION_TIME, MIN_DURATIONS } from "./Constants";
import {
  //why not used?
  //getAdjustedPassDuration,
  getPassErrorRate,
  getTurnErrorRate,
  getMoveErrorRate,
  getAdjustedTurnDuration,
  getAdjustedMoveDuration,
} from "./helpers";

// Simulation component following Mike Bostock's D3 component pattern
export function simulation() {
  let rectWidth = 100;
  let rectHeight = 160;
  let easeType = d3.easeBounceOut; // Realistic wall bounce
  let speedMultiplier = 1; // Speed multiplier for visual animation
  let fixedSideOrder = null; // Optional fixed side order instead of random
  let player = null; // Player object with skills

  // Helper function to get error message text
  function getErrorMessage(actionType) {
    const messages = {
      pass: "pass",
      turn: "touch",
      move: "dribble",
    };
    return messages[actionType] || "error";
  }

  // Track ball position (A, B, C) - starts at B (center)
  let currentBallPosition = "B";

  // Callbacks for events
  let onEventComplete = null;
  let onSimulationComplete = null;
  let onProgress = null;

  // Side mapping based on pitch labels
  const sideMapping = {
    1: "Top-Right",
    2: "Bottom-Right",
    3: "Bottom",
    4: "Bottom-Left",
    5: "Top-Left",
    6: "Top",
  };

  // Position requirements for each side
  const positionRequirements = {
    1: "A",
    5: "A",
    6: "A", // Sides 1,5,6 need position A
    2: "C",
    3: "C",
    4: "C", // Sides 2,3,4 need position C
  };

  // Get A/B/C position coordinates
  function getABCPosition(position) {
    switch (position) {
      case "A":
        return { x: 0, y: -rectHeight / 4 }; // A is halfway between center and top
      case "B":
        return { x: 0, y: 0 }; // B is center
      case "C":
        return { x: 0, y: rectHeight / 4 }; // C is halfway between center and bottom
      default:
        return { x: 0, y: 0 };
    }
  }

  // Calculate duration for A/B/C movement
  function getPositionMovementDuration(fromPos, toPos) {
    if (fromPos === toPos) return 0;
    if (
      (fromPos === "A" && toPos === "B") ||
      (fromPos === "B" && toPos === "A") ||
      (fromPos === "B" && toPos === "C") ||
      (fromPos === "C" && toPos === "B")
    ) {
      return player
        ? getAdjustedMoveDuration(
            player.dribbling,
            DURATIONS.ACTIONS.MOVE.ADJACENT,
            MIN_DURATIONS.ACTIONS.MOVE.ADJACENT
          )
        : DURATIONS.ACTIONS.MOVE.ADJACENT;
    }
    if (
      (fromPos === "A" && toPos === "C") ||
      (fromPos === "C" && toPos === "A")
    ) {
      return player
        ? getAdjustedMoveDuration(
            player.dribbling,
            DURATIONS.ACTIONS.MOVE.ACROSS_COURT,
            MIN_DURATIONS.ACTIONS.MOVE.ACROSS_COURT
          )
        : DURATIONS.ACTIONS.MOVE.ACROSS_COURT;
    }
    return 0;
  }

  // Calculate target coordinates for each side (move perpendicular to specific line segment)
  function getTargetPosition(side) {
    switch (side) {
      case "Top": // Side 6
        return { x: 0, y: -rectHeight / 2 }; // Move vertically to top line center
      case "Bottom": // Side 3
        return { x: 0, y: rectHeight / 2 }; // Move vertically to bottom line center
      case "Top-Left": // Side 5
        return { x: -rectWidth / 2, y: -rectHeight / 4 }; // Move to top-left line center
      case "Top-Right": // Side 1
        return { x: rectWidth / 2, y: -rectHeight / 4 }; // Move to top-right line center
      case "Bottom-Left": // Side 4
        return { x: -rectWidth / 2, y: rectHeight / 4 }; // Move to bottom-left line center
      case "Bottom-Right": // Side 2
        return { x: rectWidth / 2, y: rectHeight / 4 }; // Move to bottom-right line center
      default:
        return { x: 0, y: 0 };
    }
  }

  // Calculate required player position for move action (opposite to movement direction)
  function getRequiredPositionForMove(fromPos, toPos) {
    if (fromPos === toPos) return null; // Identity move, no positioning needed

    // Vertical movements
    if (fromPos === "C" && toPos === "A") return "below"; // Moving up, player below
    if (fromPos === "A" && toPos === "C") return "above"; // Moving down, player above
    if (
      (fromPos === "B" && toPos === "A") ||
      (fromPos === "C" && toPos === "B")
    )
      return "below"; // Moving up
    if (
      (fromPos === "B" && toPos === "C") ||
      (fromPos === "A" && toPos === "B")
    )
      return "above"; // Moving down

    return null; // Horizontal or identity moves
  }

  // Calculate required player position for pass action (opposite to pass direction)
  function getRequiredPositionForPass(sideNumber) {
    //console.log(
    // 'getRequiredPositionForPass called with sideNumber---------------------:',
    // sideNumber
    //);
    switch (sideNumber) {
      case 1: // Top-Right
      case 2: // Bottom-Right
        return "left"; // Passing right, player on left
      case 4: // Bottom-Left
      case 5: // Top-Left
        return "right"; // Passing left, player on right
      case 6: // Top
        return "below"; // Passing up, player below
      case 3: // Bottom
        return "above"; // Passing down, player above
      default:
        return "left"; // Default fallback
    }
  }

  // Calculate turn duration based on angular distance
  function getTurnDuration(fromPosition, toPosition) {
    if (!fromPosition || !toPosition || fromPosition === toPosition) {
      return 0; // Identity turn
    }

    // Define position angles (in degrees, clockwise from top)
    const positionAngles = {
      above: 0, // Top
      right: 90, // Right
      below: 180, // Bottom
      left: 270, // Left
    };

    const fromAngle = positionAngles[fromPosition];
    const toAngle = positionAngles[toPosition];

    if (fromAngle === undefined || toAngle === undefined) {
      // This should never happen with our 4-position system, but fallback to quarter turn
      return DURATIONS.ACTIONS.TURN.QUARTER;
    }

    // Calculate shortest angular distance
    let angleDiff = Math.abs(toAngle - fromAngle);
    if (angleDiff > 180) {
      angleDiff = 360 - angleDiff; // Take shorter path
    }

    // Duration based on angle
    if (angleDiff === 90) {
      return player
        ? getAdjustedTurnDuration(
            player.control,
            DURATIONS.ACTIONS.TURN.QUARTER,
            MIN_DURATIONS.ACTIONS.TURN.QUARTER
          )
        : DURATIONS.ACTIONS.TURN.QUARTER;
    } else if (angleDiff === 180) {
      return player
        ? getAdjustedTurnDuration(
            player.control,
            DURATIONS.ACTIONS.TURN.HALF,
            MIN_DURATIONS.ACTIONS.TURN.HALF
          )
        : DURATIONS.ACTIONS.TURN.HALF;
    } else {
      // This should never happen with our 4-position system, but fallback to quarter turn
      return player
        ? getAdjustedTurnDuration(
            player.control,
            DURATIONS.ACTIONS.TURN.QUARTER,
            MIN_DURATIONS.ACTIONS.TURN.QUARTER
          )
        : DURATIONS.ACTIONS.TURN.QUARTER;
    }
  }

  function run(selection) {
    selection.each(function (data) {
      const ballGroup = d3.select(this); // Outer group - stays centered
      const events =
        data ||
        generateEvents(
          fixedSideOrder,
          positionRequirements,
          sideMapping,
          player
        );

      console.log(
        "Simulation run started--------------------------------------------------------------------------"
      );
      console.log(`Events:`, events);

      // Reset ball position to center (B)
      currentBallPosition = "B";

      // Timing tracking
      let totalDuration = 0;
      let progressInterval = null;
      let currentEventIndex = 0;
      let currentPlayerPosition = "left"; // Track current player position around ball

      // Move player to follow the ball's starting position (B.left)
      if (pitchComponent && pitchComponent.movePlayerToBallPosition) {
        pitchComponent.movePlayerToBallPosition("B", 0); // No animation for initial position
      }

      // Create or select the inner movement group
      let movementGroup = ballGroup.select(".movement-group");
      if (movementGroup.empty()) {
        movementGroup = ballGroup.append("g").attr("class", "movement-group");
        // Move the existing circle to the inner group
        const existingCircle = ballGroup.select("circle");
        if (!existingCircle.empty()) {
          const circleNode = existingCircle.node();
          movementGroup.node().appendChild(circleNode);
        }
      }

      // Start continuous progress tracking
      let currentDisplayTime = 0;
      function startProgressTracking() {
        if (onProgress) {
          progressInterval = setInterval(() => {
            // Increment display time by a fixed amount scaled by speed multiplier
            // 50ms interval * speedMultiplier = smooth constant increment
            currentDisplayTime += 50 * speedMultiplier;
            onProgress(currentDisplayTime);
          }, DURATIONS.INTERVALS.PROGRESS_UPDATE); // Update every 50ms for smooth progress
        }
      }

      function stopProgressTracking() {
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
      }

      // Expose stopProgressTracking to external calls
      run._stopProgressTracking = stopProgressTracking;

      function runNextEvent() {
        console.log(
          "RUN NEXT EVENT.....................",
          currentEventIndex,
          events[currentEventIndex]
        );
        if (currentEventIndex >= events.length) {
          //console.log('Simulation completed');
          stopProgressTracking();
          if (onSimulationComplete) onSimulationComplete();
          return;
        }

        const event = events[currentEventIndex];
        const startPosition = currentBallPosition;

        // Get pass action for logging (second action)
        const passAction = event.actions.find((a) => a.actionType === "pass");
        console.log({ passAction });

        //console.log(`event ${event.id}: Side ${passAction.sideNumber} (${passAction.targetLine})`);
        console.log(
          `Current ball pos: ${currentBallPosition}, Req: ${passAction.requiredPosition}`
        );
        console.log({ currentPlayerPosition });

        let currentActionIndex = 0;

        function runNextAction() {
          console.log(
            "RUN NEXT ACTION",
            currentActionIndex,
            event.actions[currentActionIndex]
          );
          if (currentActionIndex >= event.actions.length) {
            // All actions completed, handle event completion
            handleEventCompletion();
            return;
          }

          const action = event.actions[currentActionIndex];

          if (action.actionType === "turn") {
            runTurnAction(action);
          } else if (action.actionType === "move") {
            runMoveAction(action);
          } else if (action.actionType === "pass") {
            runPassAction(action);
          }
        }

        function runMoveAction(action) {
          console.log("RUN MOVE ACTION", action);
          const targetPos = action.targetPosition;
          const moveDuration = getPositionMovementDuration(
            currentBallPosition,
            targetPos
          );

          if (moveDuration === 0) {
            // Identity move - no animation needed
            //console.log(`Already at position ${targetPos}, skipping move`);
            currentActionIndex++;
            runNextAction();
            return;
          }

          //console.log(`Moving from ${currentBallPosition} to ${targetPos} (${moveDuration}ms)`);

          const targetCoords = getABCPosition(targetPos);

          // Move player alongside the ball with same timing and easing
          if (pitchComponent && pitchComponent.movePlayerToPosition) {
            pitchComponent.movePlayerToPosition(
              targetPos,
              currentPlayerPosition,
              moveDuration / speedMultiplier
            );
          }

          movementGroup
            .transition()
            .duration(moveDuration / speedMultiplier)
            .ease(d3.easeCubicOut)
            .attr(
              "transform",
              `translate(${targetCoords.x}, ${targetCoords.y})`
            )
            .on("end", () => {
              currentBallPosition = targetPos;

              // Check for error after move action using player dribbling skill
              action.hasError =
                Math.random() < getMoveErrorRate(player.dribbling);

              if (action.hasError) {
                // Handle error display
                const ballCircle = movementGroup.select("circle");
                if (!ballCircle.empty()) {
                  const originalFill = ballCircle.attr("fill") || "black";
                  const originalRadius = ballCircle.attr("r") || "2";

                  // Add error message text
                  const errorText = movementGroup
                    .append("text")
                    .attr("x", 0)
                    .attr("y", 54)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "16px")
                    .attr("fill", "#212529")
                    .style("opacity", 0);

                  errorText
                    .append("tspan")
                    .attr("fill", "#ff0000")
                    .attr("font-weight", "bold")
                    .text("Error: ");

                  errorText
                    .append("tspan")
                    .attr("fill", "#212529")
                    .text(getErrorMessage(action.actionType));

                  ballCircle
                    .transition()
                    .duration(100 / speedMultiplier)
                    .attr("fill", "red")
                    .attr("r", DURATIONS.ANIMATION.ERROR_BALL_RADIUS);

                  errorText
                    .transition()
                    .duration(100 / speedMultiplier)
                    .style("opacity", 1)
                    .on("end", () => {
                      setTimeout(() => {
                        ballCircle
                          .transition()
                          .duration(100 / speedMultiplier)
                          .attr("fill", originalFill)
                          .attr("r", originalRadius);

                        errorText
                          .transition()
                          .duration(100 / speedMultiplier)
                          .style("opacity", 0)
                          .on("end", () => {
                            errorText.remove();
                            currentActionIndex++;
                            runNextAction();
                          });
                      }, DURATIONS.ERRORS.TIMEOUT / speedMultiplier);
                    });
                } else {
                  setTimeout(() => {
                    currentActionIndex++;
                    runNextAction();
                  }, DURATIONS.ERRORS.TIMEOUT / speedMultiplier);
                }
              } else {
                currentActionIndex++;
                runNextAction();
              }
            });
        }

        function runPassAction(action) {
          console.log("RUN PASS ACTION", action);
          const targetLine = getTargetPosition(action.targetLine);

          //console.log(`Moving to ${action.targetLine} from position ${currentBallPosition}`);

          // Step 1: Move to target side
          movementGroup
            .transition()
            .duration(action.duration / 2 / speedMultiplier)
            .ease(d3.easeCubicOut)
            .attr("transform", `translate(${targetLine.x}, ${targetLine.y})`)
            .on("end", () => {
              // Step 2: Move back to the position we came from
              const returnPos = getABCPosition(currentBallPosition);
              movementGroup
                .transition()
                .duration(action.duration / 2 / speedMultiplier)
                .ease(d3.easeCubicOut)
                .attr("transform", `translate(${returnPos.x}, ${returnPos.y})`)
                .on("end", () => {
                  // Check for error after pass action using player skill
                  action.hasError =
                    Math.random() < getPassErrorRate(player.passing);

                  if (action.hasError) {
                    // Handle error display
                    const ballCircle = movementGroup.select("circle");
                    if (!ballCircle.empty()) {
                      const originalFill = ballCircle.attr("fill") || "black";
                      const originalRadius = ballCircle.attr("r") || "2";

                      // Add error message text
                      const errorText = movementGroup
                        .append("text")
                        .attr("x", 0)
                        .attr("y", 54)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "16px")
                        .attr("fill", "#212529")
                        .style("opacity", 0);

                      errorText
                        .append("tspan")
                        .attr("fill", "#ff0000")
                        .attr("font-weight", "bold")
                        .text("Error: ");

                      errorText
                        .append("tspan")
                        .attr("fill", "#212529")
                        .text(getErrorMessage(action.actionType));

                      ballCircle
                        .transition()
                        .duration(100 / speedMultiplier)
                        .attr("fill", "red")
                        .attr("r", DURATIONS.ANIMATION.ERROR_BALL_RADIUS);

                      errorText
                        .transition()
                        .duration(100 / speedMultiplier)
                        .style("opacity", 1)
                        .on("end", () => {
                          setTimeout(() => {
                            ballCircle
                              .transition()
                              .duration(100 / speedMultiplier)
                              .attr("fill", originalFill)
                              .attr("r", originalRadius);

                            errorText
                              .transition()
                              .duration(100 / speedMultiplier)
                              .style("opacity", 0)
                              .on("end", () => {
                                errorText.remove();
                                currentActionIndex++;
                                runNextAction();
                              });
                          }, DURATIONS.ERRORS.TIMEOUT / speedMultiplier);
                        });
                    } else {
                      setTimeout(() => {
                        currentActionIndex++;
                        runNextAction();
                      }, DURATIONS.ERRORS.TIMEOUT / speedMultiplier);
                    }
                  } else {
                    currentActionIndex++;
                    runNextAction();
                  }
                });
            });
        }

        function runTurnAction(action) {
          console.log("RUN TURN ACTION", action);
          // Calculate starting and finishing positions dynamically
          const startingPosition = currentPlayerPosition || "left";
          let finishingPosition = startingPosition;
          console.log({ startingPosition });

          // Find the next non-turn action to determine required position
          const nextActionIndex = currentActionIndex + 1;
          if (nextActionIndex < event.actions.length) {
            const nextAction = event.actions[nextActionIndex];
            console.log({ nextAction });

            if (nextAction.actionType === "move") {
              const requiredPos = getRequiredPositionForMove(
                currentBallPosition,
                nextAction.targetPosition
              );
              console.log("next action is move", { requiredPos });
              if (requiredPos) {
                finishingPosition = requiredPos;
              }
            } else if (nextAction.actionType === "pass") {
              console.log("next action is pass");
              finishingPosition = getRequiredPositionForPass(
                nextAction.sideNumber
              );
            }
          }
          console.log({ finishingPosition });

          const turnDuration = getTurnDuration(
            startingPosition,
            finishingPosition
          );

          // Update action with calculated values
          action.startingPosition = startingPosition;
          action.finishingPosition = finishingPosition;
          action.duration = turnDuration;

          // Determine turn type based on duration
          if (turnDuration === DURATIONS.ACTIONS.TURN.QUARTER) {
            action.turnType = "quarter";
          } else if (turnDuration === DURATIONS.ACTIONS.TURN.HALF) {
            action.turnType = "half";
          } else {
            action.turnType = "identity"; // 0ms or unknown
          }

          if (turnDuration === 0) {
            console.log(
              `Already in position ${startingPosition}, skipping turn`
            );
            currentActionIndex++;
            runNextAction();
            return;
          }

          console.log(
            `Turning from ${startingPosition} to ${finishingPosition} (${turnDuration}ms)`
          );

          // Update player position with animation
          if (pitchComponent && pitchComponent.movePlayerToPosition) {
            pitchComponent.movePlayerToPosition(
              currentBallPosition,
              finishingPosition,
              turnDuration / speedMultiplier
            );
          }

          // Update current player position
          currentPlayerPosition = finishingPosition;

          // Check for error after turn action using player control skill
          action.hasError = Math.random() < getTurnErrorRate(player.control);

          // Continue after turn duration (with potential error)
          setTimeout(() => {
            if (action.hasError) {
              // Handle error display
              const ballCircle = movementGroup.select("circle");
              if (!ballCircle.empty()) {
                const originalFill = ballCircle.attr("fill") || "black";
                const originalRadius = ballCircle.attr("r") || "2";

                // Add error message text
                const errorText = movementGroup
                  .append("text")
                  .attr("x", 0)
                  .attr("y", 54)
                  .attr("text-anchor", "middle")
                  .attr("font-size", "16px")
                  .attr("fill", "#212529")
                  .style("opacity", 0);

                errorText
                  .append("tspan")
                  .attr("fill", "#ff0000")
                  .attr("font-weight", "bold")
                  .text("Error: ");

                errorText
                  .append("tspan")
                  .attr("fill", "#212529")
                  .text(getErrorMessage(action.actionType));

                ballCircle
                  .transition()
                  .duration(100 / speedMultiplier)
                  .attr("fill", "red")
                  .attr("r", DURATIONS.ANIMATION.ERROR_BALL_RADIUS);

                errorText
                  .transition()
                  .duration(100 / speedMultiplier)
                  .style("opacity", 1)
                  .on("end", () => {
                    setTimeout(() => {
                      ballCircle
                        .transition()
                        .duration(100 / speedMultiplier)
                        .attr("fill", originalFill)
                        .attr("r", originalRadius);

                      errorText
                        .transition()
                        .duration(100 / speedMultiplier)
                        .style("opacity", 0)
                        .on("end", () => {
                          errorText.remove();
                          currentActionIndex++;
                          runNextAction();
                        });
                    }, DURATIONS.ERRORS.TIMEOUT / speedMultiplier);
                  });
              } else {
                setTimeout(() => {
                  currentActionIndex++;
                  runNextAction();
                }, DURATIONS.ERRORS.TIMEOUT / speedMultiplier);
              }
            } else {
              currentActionIndex++;
              runNextAction();
            }
          }, turnDuration / speedMultiplier);
        }

        function handleEventCompletion() {
          console.log("EVENT COMPLETION:::::::::::;", currentPlayerPosition);
          // Calculate total event time by summing all actual action durations
          let actualEventDuration = 0;
          let currentPos = startPosition;

          // Determine starting player position for this event
          let currentPlayerPos = "left";
          if (currentEventIndex > 0) {
            const prevEvent = events[currentEventIndex - 1];
            if (prevEvent && prevEvent.actions.length > 0) {
              // Find the last turn action, or use the last action's finishing position if available
              const lastTurn = prevEvent.actions
                .filter((a) => a.actionType === "turn")
                .pop();
              if (lastTurn && lastTurn.finishingPosition) {
                currentPlayerPos = lastTurn.finishingPosition;
              } else if (
                prevEvent.actions[prevEvent.actions.length - 1]
                  .finishingPosition
              ) {
                currentPlayerPos =
                  prevEvent.actions[prevEvent.actions.length - 1]
                    .finishingPosition;
              }
            }
          }
          console.log({ currentPlayerPos });

          // Calculate duration for each action that was executed
          event.actions.forEach((action, index) => {
            console.log("Calculating duration for action:", index, action, {
              actualEventDuration,
            });
            if (action.actionType === "turn") {
              console.log("duration for TURN ACTION", action);
              // Calculate turn duration based on player position requirements
              let requiredPlayerPos = currentPlayerPos;

              // Look ahead to next action to determine required position
              const nextActionIndex = index + 1;
              console.log({ nextActionIndex });
              if (nextActionIndex < event.actions.length) {
                const nextAction = event.actions[nextActionIndex];
                console.log({ nextAction });
                if (nextAction.actionType === "move") {
                  console.log("next action is move");
                  const moveRequiredPos = getRequiredPositionForMove(
                    currentPos,
                    nextAction.targetPosition
                  );
                  if (moveRequiredPos) {
                    requiredPlayerPos = moveRequiredPos;
                  }
                } else if (nextAction.actionType === "pass") {
                  console.log("next action is pass");
                  requiredPlayerPos = getRequiredPositionForPass(
                    nextAction.sideNumber
                  );
                  console.log({ requiredPlayerPos });
                }
              }

              console.log({ currentPlayerPosition });
              //this is the error - the turn should be from the player pos after prev action not currentPos which is the end of event!
              //either set currentPos in the loop above so it tracks it, or track get prevPos separately
              const turnDuration = getTurnDuration(
                currentPlayerPos,
                requiredPlayerPos
              );
              console.log(
                `    Turn: ${currentPlayerPos} → ${requiredPlayerPos} = ${turnDuration}ms`
              );
              actualEventDuration += turnDuration;
              console.log("updating currentPlayerPos to requiredPlayerPos", {
                requiredPlayerPos,
              });
              currentPlayerPos = requiredPlayerPos;
              console.log({ currentPlayerPos });
            } else if (action.actionType === "move") {
              const moveDuration = getPositionMovementDuration(
                currentPos,
                action.targetPosition
              );
              // console.log(
              //   `    Move: ${currentPos} → ${action.targetPosition} = ${moveDuration}ms`
              // );
              actualEventDuration += moveDuration;
              currentPos = action.targetPosition;
            } else if (action.actionType === "pass") {
              // console.log(`    Pass: ${action.duration}ms`);
              actualEventDuration += action.duration; // Pass duration from constants
            }
          });

          console.log(
            ` FINAL Actual event duration (actions only): ${actualEventDuration}ms`
          );

          // Count errors from actions that have been marked with hasError
          const errorCount = event.actions.filter(
            (action) => action.hasError
          ).length;
          const errorDuration = errorCount * DURATIONS.ERRORS.TIMEOUT; // Use constant for error duration
          const totalEventDuration = actualEventDuration + errorDuration;

          // Check if this specific event pushes us over the time limit
          const durationBeforeThisEvent = totalDuration;

          totalDuration += totalEventDuration;

          // Log duration breakdown for debugging
          // console.log(`Event ${currentEventIndex + 1} duration breakdown:`);
          // console.log(`  Actions duration: ${actualEventDuration}ms`);
          // console.log(`  Error count: ${errorCount}`);
          // console.log(`  Error duration: ${errorDuration}ms`);
          // console.log(`  Total event duration: ${totalEventDuration}ms`);

          // Call event completion callback first
          if (onEventComplete) {
            onEventComplete({
              eventNumber: currentEventIndex + 1,
              sideNumber: passAction.sideNumber,
              sideName: passAction.targetLine,
              startPosition: startPosition,
              requiredPosition: passAction.requiredPosition,
              eventDuration: totalEventDuration,
              totalDuration: totalDuration,
              error: errorCount > 0,
              errorCount: errorCount,
              actions: event.actions, // Include actions array with duration data
              exceedsTimeLimit:
                durationBeforeThisEvent < MAX_SIMULATION_TIME &&
                totalDuration > MAX_SIMULATION_TIME, // Only flag the first event that pushes over
            });
          }

          // Check if simulation time limit has been reached
          if (totalDuration >= MAX_SIMULATION_TIME) {
            //console.log('Time limit reached, ending simulation');
            stopProgressTracking();
            if (onSimulationComplete) onSimulationComplete();
            return;
          }

          // Continue to next event (errors are now handled per-action)
          continueToNextEvent();

          function continueToNextEvent() {
            currentEventIndex++;
            // Small delay between events
            setTimeout(runNextEvent, 300);
          }
        }

        // Start running actions for this event
        runNextAction();
      }

      // Start the simulation
      startProgressTracking();
      runNextEvent();
    });

    return run;
  }

  // Getter/setter methods following D3 component pattern
  run.rectWidth = function (value) {
    if (!arguments.length) return rectWidth;
    rectWidth = value;
    return run;
  };

  run.rectHeight = function (value) {
    if (!arguments.length) return rectHeight;
    rectHeight = value;
    return run;
  };

  run.fixedSideOrder = function (value) {
    if (!arguments.length) return fixedSideOrder;
    fixedSideOrder = value;
    return run;
  };

  run.easeType = function (value) {
    if (!arguments.length) return easeType;
    easeType = value;
    return run;
  };

  run.generateEvents = function () {
    return generateEvents(
      fixedSideOrder,
      positionRequirements,
      sideMapping,
      player
    );
  };

  run.onEventComplete = function (callback) {
    if (!arguments.length) return onEventComplete;
    onEventComplete = callback;
    return run;
  };

  run.onSimulationComplete = function (callback) {
    if (!arguments.length) return onSimulationComplete;
    onSimulationComplete = callback;
    return run;
  };

  run.onProgress = function (callback) {
    if (!arguments.length) return onProgress;
    onProgress = callback;
    return run;
  };

  run.stopProgress = function () {
    // This will be set by the simulation when it starts
    if (run._stopProgressTracking) {
      run._stopProgressTracking();
    }
    return run;
  };

  run.speedMultiplier = function (value) {
    if (!arguments.length) return speedMultiplier;
    speedMultiplier = value;
    return run;
  };

  run.player = function (value) {
    if (!arguments.length) return player;
    player = value;
    return run;
  };

  // Store reference to pitch component for player movement
  let pitchComponent = null;
  run.pitchComponent = function (value) {
    if (!arguments.length) return pitchComponent;
    pitchComponent = value;
    return run;
  };

  return run;
}
