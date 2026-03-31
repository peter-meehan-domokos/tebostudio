export interface IntroSlide {
  key: string;
  title: string;
  paragraphs: string[];
  visual?: {
    key: string;
    src: string;
  };
  footer?: {
    key: string;
    image?: {
      key: string;
      src: string;
    };
    items: Array<{
      key: string;
      label: string;
      url?: string;
    }>;
  };
}

export interface ProjectConfig {
  githubUrl: string;
  introSlides: IntroSlide[];
  mobileWarning?: string;
  docsUrl?: string;
}

export const PROJECT_CONFIG: Record<string, ProjectConfig> = {
  perfectsquare: {
    githubUrl: "https://github.com/peter-meehan-domokos/tebostudio/tree/main/app/components/visualisations/perfect-square",
    docsUrl: "https://github.com/peter-meehan-domokos/perfect-square/blob/main/README.md",
    introSlides: [
      {
        key: "slide-1",
        title: "What The Perfect Square is",
        paragraphs: [
          "The Perfect Square visualises multi-dimensional data fast.",
          "It works for rehab, recruitment, and vector similarity.",
          "Each square shows progress toward an ideal state.",
        ],
      },
      {
        key: "slide-2",
        title: "How to read a square",
        paragraphs: [
          "Each bar is one KPI or dimension.",
          "Bars fill toward 100% of the target.",
          "A full square means \"perfect match\".",
        ],
      },
      {
        key: "slide-3",
        title: "Explore at any scale",
        paragraphs: [
          "Zoom out to compare thousands of squares.",
          "Zoom in to reveal detailed bars and categories.",
          "Pan to scan and inspect patterns.",
        ],
      },
      {
        key: "slide-4",
        title: "Cluster and analyse",
        paragraphs: [
          "Group squares into clusters using force-based layouts.",
          "Set X-axis and Y-axis groupings, plus colour as a third variable.",
          "Compare clusters by score, variation, or time.",
        ],
      },
    ],
  },
  strategysim: {
    githubUrl: "https://github.com/peter-meehan-domokos/tebostudio/tree/main/app/components/learning-tebos/strategysim",
    mobileWarning: "Mobiles and tablets not supported",
    introSlides: [
      {
        key: "slide-1",
        title: "What this is",
        paragraphs: [
          "StrategySim helps you test sports strategies with AI.",
          "It connects \"coach's eye\" (intuition) with data.",
          "Build a strategy, then simulate it.",
        ],
      },
      {
        key: "slide-2",
        title: "Do the real-world challenge first",
        paragraphs: [
          "Start by playing the <em>10 second target game</em> in real life.",
          "Hit six targets arranged like a mini pitch as many times as you can.",
          "Try a few tactics and pick one.",
        ],
      },
      {
        key: "slide-3",
        title: "Set up your simulation",
        paragraphs: [
          "Enter your chosen strategy into the sim.",
          "Tune the player model to match your skills.",
          "Run the same strategy across many games.",
        ],
      },
      {
        key: "slide-4",
        title: "Analyse and compare",
        paragraphs: [
          "Use speed controls to run 100+ simulations quickly.",
          "Track results live in the histogram tab.",
          "Download the CSV for clustering and deeper analysis.",
        ],
      },
    ],
  },
  therace: {
    githubUrl: "https://github.com/peter-meehan-domokos/tebostudio/tree/main/app/components/visualisations/the-race",
    mobileWarning: "Mobiles and tablets not supported",
    introSlides: [
      {
        key: "slide-1",
        title: "What The Race is",
        paragraphs: [
          "The Race turns match stats into an engaging race.",
          "It makes KPIs feel emotional and memorable.",
          "Watch performance change across the match.",
        ],
      },
      {
        key: "slide-2",
        title: "Start the replay",
        paragraphs: [
          "Press Play to start the match animation.",
          "The race runs from 0 to 90 minutes.",
          "KPIs build up as time passes.",
        ],
      },
      {
        key: "slide-3",
        title: "Read the race",
        paragraphs: [
          "Each player is a dot in the swarm.",
          "Overtakes show who improves faster.",
          "Leading dots highlight top performers.",
        ],
      },
      {
        key: "slide-4",
        title: "Reflect and discuss",
        paragraphs: [
          "Pause at key moments in the match.",
          "Ask: \"Why did I drop off here?\"",
          "Use it to spark post-match reflection.",
        ],
      },
    ],
  },
};
