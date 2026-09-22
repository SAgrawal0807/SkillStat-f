// LoadingOverlay.tsx
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { RefObject } from "react";
import { animate, stagger } from "animejs";
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

  const lockupRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);

  // Always call the latest onDockingStart/onFinished without needing
  // them in effect dependency arrays — the parent may (and here,
  // does) pass a fresh function identity on every render.
  const callbacksRef = useRef({ onDockingStart, onFinished });
  useEffect(() => {
    callbacksRef.current = { onDockingStart, onFinished };
  });

  /*
   * Main loading animation — runs exactly once per real mount.
   *
   * Empty deps on purpose: this must NOT restart just because a
   * parent re-render changed a prop's identity. In dev, React 18
   * StrictMode will mount -> cleanup -> mount this once to check
   * it's safe; the cleanup below cancels that first throwaway run's
   * timers/animation before they ever fire, so the real run is the
   * only one that's ever visible. Don't add a "has run" guard here —
   * it blocks the real run after the throwaway cleanup and leaves
   * the overlay stuck instead.
   */
  useEffect(() => {
    const counterTarget = { val: 0 };

    const counterAnim = animate(counterTarget, {
      val: 100,
      duration: 1200,
      ease: "outExpo",
      onUpdate: () => {
        setProgressPercent(Math.round(counterTarget.val));
      },
    });

    const logoTimer = window.setTimeout(() => {
      if (logoImageRef.current) {
        animate(logoImageRef.current, {
          scale: [0.65, 1],
          opacity: [0, 1],
          duration: 600,
          ease: "outBack(1.7)",
        });
      }
    }, 300);

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
    }, 700);

    const flightTimer = window.setTimeout(() => {
      const lockupEl = lockupRef.current;

      if (lockupEl) {
        const rect = lockupEl.getBoundingClientRect();
        setCloneRect({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }

      callbacksRef.current.onDockingStart();
      setStage("docking");
    }, 2000);

    return () => {
      counterAnim.pause();
      window.clearTimeout(logoTimer);
      window.clearTimeout(nameTimer);
      window.clearTimeout(flightTimer);
    };
  }, []);

  /*
   * FLIP flight animation. Depends only on stage/cloneRect so a
   * parent re-render (new onFinished identity, etc.) can never
   * restart an animation that's already mid-flight.
   */
  useLayoutEffect(() => {
    if (stage !== "docking" || !cloneRect) return;

    const clone = cloneRef.current;
    const target = navSlotRef.current;

    if (!clone || !target) {
      callbacksRef.current.onFinished();
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
      onComplete: () => callbacksRef.current.onFinished(),
    });

    return () => {
      flightAnim.pause();
    };
  }, [stage, cloneRect, navSlotRef]);

  const handleSkip = useCallback(() => {
    callbacksRef.current.onDockingStart();
    callbacksRef.current.onFinished();
  }, []);

  return (
    <>
      {/* Fullscreen loading overlay */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper transition-opacity duration-700 ${
          stage === "docking" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-label="Loading SkillStat"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-brand-100/60 via-cyan-50/40 to-transparent blur-3xl" />
        </div>

        {stage !== "docking" && (
          <div className="relative z-10 flex flex-col items-center">
            <div
              ref={lockupRef}
              className="inline-flex items-center select-none"
              style={{ gap: `${HERO_LOCKUP.gap}px` }}
            >
              <div
                className="relative"
                style={{
                  width: `${HERO_LOCKUP.icon}px`,
                  height: `${HERO_LOCKUP.icon}px`,
                }}
              >
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

              <div className="flex flex-col">
                <div
                  className="flex overflow-hidden font-display font-bold tracking-tight text-ink"
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

                <div className="anime-badge mt-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 opacity-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
                  <span>AI Competency Intelligence</span>
                </div>
              </div>
            </div>

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

        <button
          onClick={handleSkip}
          className="absolute bottom-8 cursor-pointer text-xs font-medium text-ink-faint transition-colors hover:text-ink hover:underline"
        >
          Skip intro
        </button>
      </div>

      {stage === "docking" && cloneRect && (
        <div
          ref={cloneRef}
          className="fixed z-[110] inline-flex select-none items-center"
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
