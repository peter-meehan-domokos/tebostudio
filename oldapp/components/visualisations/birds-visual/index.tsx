'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { clampPosition, clampSpeed, assignLineSlots } from './utils';
import { BirdData, Repulsor, Mode } from './simulation/types';
import { 
  createBirdSimulation, 
  updateBirdAngle, 
  defaultSimulationConfig
} from './simulation/simulation';
import { createWanderForce } from './simulation/forces';
import { SHOULD_SHOW_CTRLS } from './constants';
import './bird/bird.css';

export default function BirdsVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Mode state
  const [mode, setMode] = useState<Mode>('chaos');
  const [countdown, setCountdown] = useState(10);
  
  // Refs for D3 simulation (mutable, not triggering re-renders)
  const simRef = useRef<ReturnType<typeof createBirdSimulation> | null>(null);
  const birdsRef = useRef<BirdData[]>([]);
  const repulsorRef = useRef<Repulsor | null>(null);
  const dimensionsRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const modeRef = useRef<Mode>(mode); // Track current mode for RAF loop

  // Create birds once (using useState to avoid useMemo impurity)
  const [initialBirds] = useState(() => {
    const birdsPerColor = 300;
    const colors: Array<'blue' | 'orange' | 'purple'> = ['blue', 'orange', 'purple'];
    
    return colors.flatMap((colorGroup, groupIndex) => 
      d3.range(birdsPerColor).map((i) => {
        const angle = Math.random() * Math.PI * 2;
        return {
          id: `bird-${colorGroup}-${i}`,
          index: groupIndex * birdsPerColor + i,
          colorGroup,
          x: 0,
          y: 0,
          vx: Math.cos(angle) * (Math.random() * 0.5),
          vy: Math.sin(angle) * (Math.random() * 0.5),
          size: 0.7 + Math.random() * 0.7,
          jitter: Math.random() * 0.1,
          angle: Math.random() * Math.PI * 2
        } as BirdData;
      })
    );
  });

  // Wander force function (stored in ref)
  const wanderForceRef = useRef(createWanderForce(defaultSimulationConfig.wanderStrength));
  
  // Attractor force state (pulls birds to fill vacuum after repulsor expires)
  const attractorRef = useRef<Repulsor | null>(null);

  // Sync modeRef with mode state
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Auto-cycle through modes with varying durations (first chaos only 5 seconds)
  useEffect(() => {
    const modeSequence: Mode[] = ['chaos', 'bunch', 'circle', 'line'];
    const modeDurations: Record<Mode, number> = {
      chaos: 10000,
      bunch: 15000,
      circle: 15000,
      line: 10000
    };
    let lastChangeTime = 0;
    let isFirstTransition = true;
    let currentModeIndex = 0;
    setCountdown(5); // First mode is 5 seconds
    
    const timer = d3.timer((elapsed) => {
      const timeInCurrentMode = elapsed - lastChangeTime;
      const currentMode = modeSequence[currentModeIndex];
      const modeDuration = isFirstTransition ? 5000 : modeDurations[currentMode];
      const secondsRemaining = Math.max(0, Math.ceil((modeDuration - timeInCurrentMode) / 1000));
      setCountdown(secondsRemaining);
      
      if (timeInCurrentMode >= modeDuration) {
        currentModeIndex = (currentModeIndex + 1) % modeSequence.length;
        setMode(modeSequence[currentModeIndex]);
        lastChangeTime = elapsed;
        isFirstTransition = false;
        const nextDuration = modeDurations[modeSequence[currentModeIndex]];
        setCountdown(Math.ceil(nextDuration / 1000));
      }
    });

    return () => {
      timer.stop();
    };
  }, []);

  // Initialize and run D3 simulation (client-side only)
  useEffect(() => {
    const canvas = canvasRef.current;
    const containerEl = containerRef.current;
    if (!canvas || !containerEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get viewport dimensions
    const getViewport = () => {
      const rect = containerEl.getBoundingClientRect();
      return { 
        w: Math.max(1, rect.width), 
        h: Math.max(1, rect.height) 
      };
    };

    const { w, h } = getViewport();
    dimensionsRef.current = { w, h };

    // Handle retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Initialize birds only once
    if (birdsRef.current.length === 0) {
      birdsRef.current = initialBirds.map(b => ({
        ...b,
        x: Math.random() * w,
        y: Math.random() * h
      }));
    }

    const birds = birdsRef.current;

    // Create color scales for each group
    const blueScale = d3.scaleSequential(d3.interpolateBlues).domain([0.3, 1]);
    const orangeScale = d3.scaleSequential(d => d3.interpolateRgb('#FFB84D', '#ff8c1a')(d)).domain([0.3, 1]);
    const purpleScale = d3.scaleSequential(d => d3.interpolateRgb('#9B59B6', '#6c3483')(d)).domain([0.3, 1]);

    // Assign colors based on color group
    birds.forEach(bird => {
      const randomValue = Math.random() * 0.7 + 0.3;
      if (bird.colorGroup === 'blue') {
        bird.color = blueScale(randomValue);
      } else if (bird.colorGroup === 'orange') {
        bird.color = orangeScale(randomValue);
      } else if (bird.colorGroup === 'purple') {
        bird.color = purpleScale(randomValue);
      }
    });

    // Calculate color brightness and assign colorRank within each color group
    const getColorBrightness = (color: string | undefined) => {
      if (!color) return 0.5;
      const rgb = d3.color(color);
      if (!rgb) return 0.5;
      // Use appropriate channel based on color group
      const rgbColor = d3.rgb(rgb);
      return rgbColor.r + rgbColor.g + rgbColor.b; // Total brightness
    };

    // Group birds by color and assign colorRank within each group
    const colorGroups = d3.group(birds, d => d.colorGroup ?? 'blue');
    colorGroups.forEach((groupBirds) => {
      const sorted = [...groupBirds].sort((a, b) => 
        getColorBrightness(a.color) - getColorBrightness(b.color)
      );
      sorted.forEach((bird, idx) => {
        bird.colorRank = idx;
      });
    });

    // Create simulation with positional forces
    const simulation = createBirdSimulation(birds, defaultSimulationConfig);
    simRef.current = simulation;

    // Add positional forces for modes
    const forceX = d3.forceX<BirdData>(w / 2).strength(0);
    const forceY = d3.forceY<BirdData>(h / 2).strength(0);
    const radial = d3.forceRadial<BirdData>(Math.min(w, h) * 0.28, w / 2, h / 2).strength(0);

    simulation
      .force('x', forceX)
      .force('y', forceY)
      .force('radial', radial);

    // Tick handler with all updates
    simulation.on('tick', () => {
      const now = performance.now();
      const { w: W, h: H } = dimensionsRef.current;

      // Apply wander force with mode-dependent strength
      const wanderStrengths: Record<Mode, number> = {
        chaos: 0.24,    // Full wander
        circle: 0.24,   // Same as chaos for testing
        bunch: 0.24,    // Same as chaos for testing
        line: 0.24      // Same as chaos for testing
      };
      
      const currentWanderStrength = wanderStrengths[modeRef.current];
      
      // Apply scaled wander force
      if (currentWanderStrength > 0) {
        birdsRef.current.forEach(bird => {
          bird.vx = (bird.vx ?? 0) + (Math.random() * 2 - 1) * currentWanderStrength;
          bird.vy = (bird.vy ?? 0) + (Math.random() * 2 - 1) * currentWanderStrength;
        });
      }

      // Check if repulsor is active
      const rep = repulsorRef.current;
      const repActive = rep && now < rep.until;
      
      // Check if attractor is active
      const attr = attractorRef.current;
      const attrActive = attr && now < attr.until;

      // Update each bird
      birdsRef.current.forEach(bird => {
        // Apply position clamping (soft containment)
        clampPosition(bird, W, H, defaultSimulationConfig.positionPadding);

        // Apply speed clamping to normal movement (before repulsor/attractor)
        clampSpeed(bird, defaultSimulationConfig.maxSpeed);

        // Apply click repulsor if active (unclamped for explosive effect)
        if (repActive && rep) {
          const dx = (bird.x ?? 0) - rep.x;
          const dy = (bird.y ?? 0) - rep.y;
          const dist2 = dx * dx + dy * dy;
          const r2 = rep.radius * rep.radius;
          
          if (dist2 > 0.0001 && dist2 < r2) {
            const dist = Math.sqrt(dist2);
            const falloff = 1 - dist / rep.radius;
            const push = rep.strength * falloff;
            bird.vx = (bird.vx ?? 0) + (dx / dist) * push;
            bird.vy = (bird.vy ?? 0) + (dy / dist) * push;
          }
        }
        
        // Apply attractor if active (pulls birds to fill vacuum)
        if (attrActive && attr) {
          const dx = (bird.x ?? 0) - attr.x;
          const dy = (bird.y ?? 0) - attr.y;
          const dist2 = dx * dx + dy * dy;
          const r2 = attr.radius * attr.radius;
          
          if (dist2 > 0.0001 && dist2 < r2) {
            const dist = Math.sqrt(dist2);
            const falloff = 1 - dist / attr.radius;
            const pull = attr.strength * falloff;
            // Negative force = attraction (pull toward center)
            bird.vx = (bird.vx ?? 0) - (dx / dist) * pull;
            bird.vy = (bird.vy ?? 0) - (dy / dist) * pull;
          }
        }

        // Update angle with stability threshold
        const updated = updateBirdAngle(bird);
        bird.angle = updated.angle;
      });

      // Clear expired repulsor and create attractor
      if (rep && !repActive) {
        // Mode-dependent attractor strength
        const attractorStrengths: Record<Mode, number> = {
          chaos: 0.5,   // Gentle pull to fill vacuum in chaos
          circle: 0.4,  // Gentle pull for circle formation
          bunch: 0.05,  // Very weak (already has centering forces)
          line: 0.03    // Minimal (already has positional forces)
        };
        
        // Create attractor at same position as expired repulsor
        attractorRef.current = {
          x: rep.x,
          y: rep.y,
          radius: rep.radius * 1.2, // Slightly wider pull area
          strength: attractorStrengths[modeRef.current],
          until: now + 1200 // 1.2s duration
        };
        
        repulsorRef.current = null;
      }
      
      // Clear expired attractor
      if (attr && !attrActive) {
        attractorRef.current = null;
      }

      // Render to canvas
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.5;
      
      birdsRef.current.forEach(bird => {
        ctx.fillStyle = bird.color ?? '#39A6A3';
        ctx.beginPath();
        ctx.arc(bird.x ?? 0, bird.y ?? 0, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Click interaction
    const handlePointerDown = (ev: PointerEvent) => {
      const { w: W, h: H } = dimensionsRef.current;
      const rect = canvas.getBoundingClientRect();
      const local = {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
      };

      // Random radius and strength on each click
      const baseRadius = Math.min(W, H) * 0.18;
      const baseStrength = 2.8;
      
      // Range: 1/5 to 5x base values
      const minRadius = baseRadius * 0.2;
      const maxRadius = Math.min(baseRadius * 5, Math.min(W, H) * 0.95); // Cap at 95% of container
      const minStrength = baseStrength * 0.2; // 0.56
      const maxStrength = 30;
      
      // Use D3 random to generate values
      const randomRadius = d3.randomUniform(minRadius, maxRadius)();
      const randomStrength = d3.randomUniform(minStrength, maxStrength)();

      repulsorRef.current = {
        x: local.x,
        y: local.y,
        radius: randomRadius,
        strength: randomStrength,
        until: performance.now() + 700
      };

      // Reheat simulation to give forces energy to return birds
      // Circle mode needs more heat due to radial force complexity
      const reheatAlpha = modeRef.current === 'circle' ? 1.0 : 0.6;
      simulation.alpha(reheatAlpha);
    };

    canvas.addEventListener('pointerdown', handlePointerDown);

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      const viewport = getViewport();
      dimensionsRef.current = viewport;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = viewport.w * dpr;
      canvas.height = viewport.h * dpr;
      canvas.style.width = `${viewport.w}px`;
      canvas.style.height = `${viewport.h}px`;
      ctx.scale(dpr, dpr);
      simulation.alpha(0.4).restart();
    });
    resizeObserver.observe(containerEl);

    // Start simulation
    simulation.alpha(1).restart();

    // Pause simulation when off-screen for performance
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        
        if (isVisible) {
          // Resume simulation when scrolled back into view
          console.log('🟢 Birds visible - resuming simulation');
          simulation.restart();
        } else {
          // Pause simulation when off-screen
          console.log('🔴 Birds off-screen - pausing simulation');
          simulation.stop();
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    intersectionObserver.observe(canvas);

    // Cleanup
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      simulation.stop();
      simRef.current = null;
    };
  }, [initialBirds]); // Only run once on mount

  // Mode switching effect: updates force strengths/targets
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;

    const birds = birdsRef.current;
    const { w, h } = dimensionsRef.current;
    const cy = h / 2;
    
    // Calculate three horizontal centers (left, center, right)
    const getCenterX = (colorGroup: 'blue' | 'orange' | 'purple' | undefined) => {
      if (colorGroup === 'blue') return w / 6;
      if (colorGroup === 'orange') return w / 2;
      if (colorGroup === 'purple') return (5 * w) / 6;
      return w / 2;
    };

    const fx = sim.force('x') as d3.ForceX<BirdData>;
    const fy = sim.force('y') as d3.ForceY<BirdData>;
    const fr = sim.force('radial') as d3.ForceRadial<BirdData>;

    // Defaults: off
    fx.strength(0);
    fy.strength(0);
    fr.strength(0);

    if (mode === 'chaos') {
      // Set random target positions for smooth transition across entire space
      const margin = 40;
      birds.forEach(b => {
        b.slotX = margin + Math.random() * Math.max(0, w - margin * 2);
        b.slotY = margin + Math.random() * Math.max(0, h - margin * 2);
      });
      
      // Use very gentle forces to move birds to random positions
      fx.x((d) => d.slotX ?? w / 2).strength(0.05);
      fy.y((d) => d.slotY ?? h / 2).strength(0.05);
      
      sim.alphaTarget(0.12); // Keep simulation gently warm during transition
      sim.alpha(0.08).restart(); // Very gentle boost
      
      // Let forces naturally drift birds to their positions without sudden velocity changes
    } else {
      sim.alphaTarget(0.03); // Keep gently warm for continuous wander
      
      if (mode === 'bunch') {
        // Each color group has its own center horizontally
        fx.x((d) => getCenterX(d.colorGroup)).strength((d) => {
          const rank = d.colorRank ?? 0;
          const t = 1 - (rank / 299); // 1 (lightest) to 0 (darkest) within group of 300
          return 0.01 + t * 0.04; // Range: 0.05 (light, weak pull) to 0.01 (dark, strong pull)
        });
        fy.y(cy).strength((d) => {
          const rank = d.colorRank ?? 0;
          const t = 1 - (rank / 299);
          return 0.01 + t * 0.04;
        });
      }

      if (mode === 'circle') {
        const radius = Math.min(w, h) * 0.28;
        
        // Calculate exact positions around three separate circles based on colorRank
        birds.forEach(b => {
          const rank = b.colorRank ?? 0;
          const angle = (rank / 300) * Math.PI * 2 - Math.PI / 2; // Start at top, clockwise
          const centerX = getCenterX(b.colorGroup);
          b.slotX = centerX + radius * Math.cos(angle);
          b.slotY = cy + radius * Math.sin(angle);
        });
        
        // Pull birds to their calculated circle positions
        fx.x((d) => d.slotX ?? getCenterX(d.colorGroup)).strength(0.05);
        fy.y((d) => d.slotY ?? cy).strength(0.05);
      }

      if (mode === 'line') {
        // Use pre-calculated colorRank for vertical positioning within each color group
        const margin = 40;
        const usable = Math.max(1, h - margin * 2);
        
        birds.forEach(b => {
          const rank = b.colorRank ?? 0;
          const t = rank / 299; // 0 to 1 within group of 300
          b.slotX = getCenterX(b.colorGroup);
          b.slotY = margin + t * usable;
        });
        
        fx.x((d) => d.slotX ?? getCenterX(d.colorGroup)).strength(0.042);
        fy.y((d) => d.slotY ?? cy).strength(0.035);
      }

      // Very gentle reheat on mode change for smooth ordered transitions
      sim.alpha(0.12).restart();
    }
  }, [mode]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'visible',
        position: 'relative',
        border: 'none'
      }}
    >
      {/* Countdown timer display */}
      <div style={{
        display: 'none',
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '12px 24px',
        borderRadius: 8,
        border: '2px solid #39A6A3',
        zIndex: 10,
        fontFamily: 'var(--font-montserrat)',
        fontSize: 18,
        fontWeight: 600,
        color: '#1B2A49',
        textAlign: 'center',
        minWidth: 200
      }}>
        <div style={{ textTransform: 'capitalize', marginBottom: 4 }}>
          {mode}
        </div>
        <div style={{ fontSize: 24, color: '#39A6A3' }}>
          {countdown}s
        </div>
      </div>

      {/* Mode selection buttons */}
      <div style={{ 
        position: 'absolute', 
        top: 12, 
        left: 12, 
        display: SHOULD_SHOW_CTRLS ? 'flex' : 'none', 
        gap: 8, 
        zIndex: 10 
      }}>
        {(['chaos', 'bunch', 'circle', 'line'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #ccc',
              background: mode === m ? '#2C3E50' : '#fff',
              color: mode === m ? '#fff' : '#2C3E50',
              cursor: 'pointer',
              fontWeight: mode === m ? 600 : 400,
              transition: 'all 0.2s'
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
          cursor: 'pointer'
        }}
      />
      
      {/* Click instruction below the visual */}
      <div style={{
        position: 'absolute',
        bottom: -30,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-roboto)',
        fontSize: 13,
        color: '#999999',
        textAlign: 'center',
        opacity: 0.8,
        whiteSpace: 'nowrap'
      }}>
        click above to cause chaos
      </div>
    </div>
  );
}
