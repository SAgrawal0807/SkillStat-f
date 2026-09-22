import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { animate, stagger } from "animejs";
import {
  createParticles,
  createCompetencyNodes,
  renderAnimeCanvas,
  type Particle,
  type CompetencyNode,
  type SignalPulse,
  type Shockwave,
} from "../lib/particles";
import { HERO_LOCKUP } from "../lib/logoSizes";

type Stage = "assembling" | "revealed" | "docking";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface LoadingOverlayProps {
  /** Target element in the navbar where the logo will dock */
  navSlotRef: RefObject<HTMLSpanElement | null>;
  /** Fired when flight begins so navbar background and hero reveal */
  onDockingStart: () => void;
  /** Fired once flight lands — turns on navbar brand logo and unmounts overlay */
  onFinished: () => void;
}

const COMPANY_LETTERS = "SkillStat".split("");

export default function LoadingOverlay({
  navSlotRef,
  onDockingStart,
  onFinished,
}: LoadingOverlayProps) {
  const [stage, setStage] = useState<Stage>("assembling");
  const [cloneRect, setCloneRect] = useState<Rect | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);

  // Animation frame and scene data
  const sceneState = useRef<{
    particles: Particle[];
    nodes: CompetencyNode[];
    pulses: SignalPulse[];
    assembleRatio: number;
    shockwave: Shockwave;
  }>({
    particles: [],
    nodes: [],
    pulses: [],
    assembleRatio: 0,
    shockwave: { radius: 0, maxRadius: 260, alpha: 0, active: false },
  });

  // 1. Fullscreen Canvas animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const updateCanvasSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const particles = createParticles(HERO_LOCKUP.icon, cx, cy);
    const nodes = createCompetencyNodes(window.innerWidth, window.innerHeight);

    const pulses: SignalPulse[] = [
      { fromNode: 0, toNode: 1, progress: 0.1, speed: 0.015 },
      { fromNode: 1, toNode: 2, progress: 0.5, speed: 0.018 },
      { fromNode: 2, toNode: 3, progress: 0.3, speed: 0.014 },
      { fromNode: 3, toNode: 4, progress: 0.7, speed: 0.016 },
      { fromNode: 4, toNode: 5, progress: 0.2, speed: 0.017 },
      { fromNode: 5, toNode: 6, progress: 0.6, speed: 0.015 },
    ];

    sceneState.current.particles = particles;
    sceneState.current.nodes = nodes;
    sceneState.current.pulses = pulses;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const startTime = performance.now();

    const renderLoop = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      // Update pulses
      for (const pulse of sceneState.current.pulses) {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) {
          pulse.progress = 0;
          pulse.fromNode = Math.floor(Math.random() * nodes.length);
          pulse.toNode =
            (pulse.fromNode +
              1 +
              Math.floor(Math.random() * (nodes.length - 1))) %
            nodes.length;
        }
      }

      // Update shockwave if active
      const sw = sceneState.current.shockwave;
      if (sw.active && sw.alpha > 0.005) {
        sw.radius += 5.5;
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);
      }

      renderAnimeCanvas({
        ctx,
        width: window.innerWidth,
        height: window.innerHeight,
        particles: sceneState.current.particles,
        nodes: sceneState.current.nodes,
        pulses: sceneState.current.pulses,
        time: elapsed,
        assembleRatio: sceneState.current.assembleRatio,
        shockwave: sceneState.current.shockwave,
      });

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  // 2. Anime.js choreographed timeline:
  // Phase A: 0 - 900ms: Particles converge to logo form + counter 0 -> 100%
  // Phase B: 900ms: Shockwave expands + logo mark scales in
  // Phase C: 1000ms: Company name "SkillStat" letters stagger in with Anime.js
  // Phase D: 2200ms: Measure rect and trigger flight to navbar
  useEffect(() => {
    const particles = sceneState.current.particles;
    if (!particles.length) return;

    // Progress counter animation (0 to 100%)
    const counterObj = { val: 0 };
    const counterAnim = animate(counterObj, {
      val: 100,
      duration: 1000,
      ease: "outExpo",
      onUpdate: () => setProgressPercent(Math.round(counterObj.val)),
    });

    // Particle convergence animation
    const ratioObj = { ratio: 0 };
    const ratioAnim = animate(ratioObj, {
      ratio: 1,
      duration: 900,
      ease: "outExpo",
      onUpdate: () => {
        sceneState.current.assembleRatio = ratioObj.ratio;
      },
    });

    const particlesAnim = animate(particles, {
      x: (p: unknown) => (p as Particle).tx,
      y: (p: unknown) => (p as Particle).ty,
      delay: () => Math.random() * 280,
      duration: 850,
      ease: "outExpo",
    });

    // At 900ms: Trigger shockwave + reveal crisp logo mark
    const logoTimer = window.setTimeout(() => {
      sceneState.current.shockwave = {
        radius: 20,
        maxRadius: 280,
        alpha: 1,
        active: true,
      };

      if (logoImageRef.current) {
        animate(logoImageRef.current, {
          scale: [0.65, 1],
          opacity: [0, 1],
          duration: 600,
          ease: "outBack(1.7)",
        });
      }
    }, 900);

    // At 1000ms: "company name comes after a sec"
    // Stagger in each letter of "SkillStat" with iconic Anime.js bounce
    const nameTimer = window.setTimeout(() => {
      setStage("revealed");

      animate(".anime-letter", {
        translateY: [28, 0],
        opacity: [0, 1],
        scale: [0.6, 1],
        rotateZ: [-6, 0],
        delay: stagger(55),
        duration: 650,
        ease: "outBack(1.5)",
      });

      animate(".anime-badge", {
        translateY: [14, 0],
        opacity: [0, 1],
        duration: 500,
        delay: 450,
        ease: "outExpo",
      });
    }, 1000);

    // At 2300ms: Measure lockup position and start flight to navbar
    const flightTimer = window.setTimeout(() => {
      const lockupEl = lockupRef.current;
      if (lockupEl) {
        const r = lockupEl.getBoundingClientRect();
        setCloneRect({
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        });
      }
      onDockingStart();
      setStage("docking");
    }, 2300);

    return () => {
      counterAnim.pause();
      ratioAnim.pause();
      particlesAnim.pause();
      window.clearTimeout(logoTimer);
      window.clearTimeout(nameTimer);
      window.clearTimeout(flightTimer);
    };
  }, [onDockingStart]);

  // 3. FLIP Flight animation to the navbar
  useLayoutEffect(() => {
    if (stage !== "docking" || !cloneRect) return;

    const clone = cloneRef.current;
    const target = navSlotRef.current;

    if (!clone || !target) {
      onFinished();
      return;
    }

    const endRect = target.getBoundingClientRect();
    const dx = endRect.left - cloneRect.left;
    const dy = endRect.top - cloneRect.top;
    const scale = endRect.width / cloneRect.width;

    const flightAnim = animate(clone, {
      translateX: [0, dx],
      translateY: [0, dy],
      scale: [1, scale],
      duration: 950,
      ease: "inOutQuint",
      onComplete: onFinished,
    });

    return () => {
      flightAnim.pause();
    };
  }, [stage, cloneRect, navSlotRef, onFinished]);

  return (
    <>
      {/* Fullscreen Backdrop & Anime.js Canvas */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper transition-opacity duration-700 ${
          stage === "docking" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-label="Loading SkillStat"
      >
        {/* Fullscreen Canvas with geometric grid and neural competency filaments */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 h-full w-full pointer-events-none"
        />

        {/* Ambient radial glow aura */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-brand-100/60 via-cyan-50/40 to-transparent blur-3xl" />
        </div>

        {/* Central Brand Lockup: Logo + Company Name */}
        {stage !== "docking" && (
          <div className="relative z-10 flex flex-col items-center">
            <div
              ref={lockupRef}
              className="inline-flex items-center select-none"
              style={{ gap: `${HERO_LOCKUP.gap}px` }}
            >
              {/* Logo Mark container */}
              <div
                className="relative"
                style={{
                  width: `${HERO_LOCKUP.icon}px`,
                  height: `${HERO_LOCKUP.icon}px`,
                }}
              >
                {/* Crisp brand logo image */}
                <img
                  ref={logoImageRef}
                  src="/logo-mark-indigo.png"
                  alt="SkillStat Logo"
                  width={HERO_LOCKUP.icon}
                  height={HERO_LOCKUP.icon}
                  style={{
                    width: `${HERO_LOCKUP.icon}px`,
                    height: `${HERO_LOCKUP.icon}px`,
                  }}
                  className="opacity-0 select-none object-contain drop-shadow-[0_10px_30px_rgba(48,55,230,0.3)]"
                  draggable={false}
                />
              </div>

              {/* Company Name "SkillStat" with split-letter animation */}
              <div className="flex flex-col">
                <div
                  className="flex font-display font-bold tracking-tight text-ink overflow-hidden"
                  style={{
                    fontSize: `${HERO_LOCKUP.text}px`,
                    lineHeight: 1.05,
                  }}
                >
                  {COMPANY_LETTERS.map((letter, i) => (
                    <span
                      key={i}
                      className="anime-letter inline-block opacity-0"
                      style={{
                        transformOrigin: "bottom center",
                        willChange: "transform, opacity",
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>

                {/* AI Competency Subtitle badge */}
                <div className="anime-badge opacity-0 mt-1 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-brand-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
                  <span>AI Competency Intelligence</span>
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-200/90 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-accent-cyan transition-all duration-200 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-[11px] font-medium text-ink-faint">
                {progressPercent < 100
                  ? `Synthesizing Competency Vectors · ${progressPercent}%`
                  : "Graph Fully Aligned"}
              </span>
            </div>
          </div>
        )}

        {/* Quick Skip button */}
        <button
          onClick={() => {
            onDockingStart();
            onFinished();
          }}
          className="absolute bottom-8 text-xs font-medium text-ink-faint transition-colors hover:text-ink hover:underline cursor-pointer"
        >
          Skip intro
        </button>
      </div>

      {/* The FLIP Flying Clone:
          Translates and scales precisely from center to navbar slot with zero opacity drop during flight */}
      {stage === "docking" && cloneRect && (
        <div
          ref={cloneRef}
          className="fixed z-[110] inline-flex items-center select-none"
          style={{
            left: `${cloneRect.left}px`,
            top: `${cloneRect.top}px`,
            width: `${cloneRect.width}px`,
            height: `${cloneRect.height}px`,
            gap: `${HERO_LOCKUP.gap}px`,
            transformOrigin: "top left",
          }}
          aria-hidden="true"
        >
          <img
            src="/logo-mark-indigo.png"
            alt=""
            width={HERO_LOCKUP.icon}
            height={HERO_LOCKUP.icon}
            style={{
              width: `${HERO_LOCKUP.icon}px`,
              height: `${HERO_LOCKUP.icon}px`,
            }}
            className="select-none object-contain drop-shadow-[0_4px_16px_rgba(48,55,230,0.2)]"
            draggable={false}
          />
          <div className="flex flex-col">
            <span
              className="font-display font-bold tracking-tight text-ink"
              style={{ fontSize: `${HERO_LOCKUP.text}px`, lineHeight: 1.05 }}
            >
              SkillStat
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export { LoadingOverlay };
