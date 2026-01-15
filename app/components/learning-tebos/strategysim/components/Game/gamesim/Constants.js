// Time duration constants (all in milliseconds)
export const MIN_DURATIONS = {
  ACTIONS: {
    PASS: 250, // Minimum duration for pass action
    MOVE: {
      ADJACENT: 150, // Minimum duration for movement between adjacent positions (A↔B, B↔C)
      ACROSS_COURT: 500, // Minimum duration for movement across court (A↔C)
    },
    TURN: {
      QUARTER: 150, // Minimum duration for quarter turn (90°)
      HALF: 250, // Minimum duration for half turn (180°)
    },
  },
};
export const DURATIONS = {
  ACTIONS: {
    PASS: 1000, // Pass action always takes 750 milliseconds
    MOVE: {
      ADJACENT: 1000, // Movement between adjacent positions (A↔B, B↔C)
      ACROSS_COURT: 3000, //4000, // Movement across court (A↔C)
    },
    TURN: {
      QUARTER: 1000, // Quarter turn (90°)
      HALF: 3000, // Half turn (180°)
    },
  },
  ANIMATION: {
    WALL_HIGHLIGHT: 250, // Wall highlight animation duration
    ERROR_BALL_RADIUS: 8, // Ball radius during error state (much more prominent)
  },
  INTERVALS: {
    PROGRESS_UPDATE: 50, // Progress update interval for smooth animation
    SCROLL_DELAY: 50, // Delay for auto-scrolling UI elements
    TRIAL_START_DELAY: 100, // Delay between trials in continuous mode
  },
  ERRORS: {
    TIMEOUT: 1000, // Error timeout duration
  },
};

export const ERROR_RATES = {
  TURN: {
    QUARTER: 0.2, //LOW
    HALF: 0.5, //HIGH
  },
  MOVE: 0.4, //HIGH
  PASS: 0.2, //LOW
};

export const MAX_SIMULATION_TIME = 10000; // Maximum simulation time in ms (10 seconds)

// Convert durations to seconds for display
export const DURATION_DISPLAY_DIVISOR = 1000;

export const playerSVG = {
  width: 200,
  height: 200,
  viewBox: "0 0 16 16",
  path: {
    fill: "#000000",
    d: "M7.5 4.5a1.75 1.75 0 1 0 .001-3.499A1.75 1.75 0 0 0 7.5 4.5Zm3.5 2v3c0 .551-.448 1-1 1V14a1 1 0 0 1-2 0v-3a.5.5 0 0 0-1 0v3a1 1 0 0 1-2 0v-3.5c-.552 0-1-.449-1-1v-3c0-.916.623-1.682 1.464-1.918A2.735 2.735 0 0 0 7.5 5.5c.81 0 1.532-.359 2.036-.918A1.997 1.997 0 0 1 11 6.5Z",
  },
};
