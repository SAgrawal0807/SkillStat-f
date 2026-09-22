import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

import GapChart from "./GapChart";
import AnimatedBackground from "./AnimatedBackground";

import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface HeroProps {
  revealed: boolean;
}

export default function Hero({ revealed }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!revealed || !heroRef.current) return;

    const items = Array.from(
      heroRef.current.querySelectorAll<HTMLElement>(".hero-item")
    );

    if (items.length === 0) return;

    animate(items, {
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 800,
      delay: stagger(100),
      ease: "outExpo",
    });
  }, [revealed]);

  return (
    <section
      ref={heroRef}
      className="
        relative
        isolate
        min-h-screen
        overflow-hidden
        bg-paper
      "
    >
      <AnimatedBackground />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          -z-10
          h-[420px]
          w-[420px]
          rounded-full
          bg-indigo-300/20
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-150px]
          top-[20%]
          -z-10
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-300/20
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-200px]
          left-[40%]
          -z-10
          h-[500px]
          w-[500px]
          rounded-full
          bg-violet-300/10
          blur-[150px]
        "
      />

      <div
        className="
          container-content
          grid
          min-h-screen
          items-center
          gap-14
          pb-20
          pt-32
          md:grid-cols-[1.1fr_0.9fr]
          md:gap-10
          md:pb-28
          md:pt-36
        "
      >
        <div className="max-w-2xl">
          <div
            className="
              hero-item
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-indigo-200
              bg-indigo-50/70
              px-4
              py-1.5
              text-xs
              font-semibold
              text-indigo-600
              shadow-sm
              backdrop-blur-md
            "
          >
            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-indigo-600
              "
            />

            SkillStat 2.0

            <span className="text-indigo-400">•</span>

            Autonomous Competency Intelligence
          </div>

          <h1
            className="
              hero-item
              mt-6
              max-w-[850px]
              font-display
              text-[42px]
              font-bold
              leading-[1.05]
              tracking-[-0.03em]
              text-ink
              sm:text-[50px]
              md:text-[58px]
              lg:text-[64px]
            "
          >
            Close the{" "}
            <span className="relative inline-block text-indigo-600">
              competency gap.
              <span
                className="
                  absolute
                  -bottom-1
                  left-0
                  h-[3px]
                  w-full
                  rounded-full
                  bg-indigo-400/30
                "
              />
            </span>{" "}
            before it costs you.
          </h1>

          <p
            className="
              hero-item
              mt-6
              max-w-[600px]
              text-[16px]
              leading-7
              text-ink-soft
              md:text-[17px]
            "
          >
            SkillStat ingests GitHub commits, sprint tickets, and manager
            reviews to generate a continuous, predictive graph of team
            capabilities. Pinpoint critical skill deficits and automate
            learning pathways in real-time.
          </p>

          <div
            className="
              hero-item
              mt-9
              flex
              flex-wrap
              gap-4
            "
          >
            <a
              href="#get-started"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-ink
                px-6
                py-3.5
                text-[15px]
                font-semibold
                text-paper
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-indigo-600
                hover:shadow-xl
                hover:shadow-indigo-600/25
                active:scale-95
              "
            >
              Start Free Assessment

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </a>

            <a
              href="#how-it-works"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-line
                bg-white/70
                px-6
                py-3.5
                text-[15px]
                font-semibold
                text-ink-soft
                shadow-sm
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-300
                hover:bg-white
                hover:text-ink
              "
            >
              See How It Works
            </a>
          </div>

          <div
            className="
              hero-item
              mt-10
              flex
              flex-wrap
              gap-x-7
              gap-y-3
              border-t
              border-line/60
              pt-6
              text-xs
            "
          >
            <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Zero manual surveys
            </span>

            <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
              <Zap className="h-4 w-4 text-indigo-600" />
              Real-time capability tracking
            </span>

            <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
              <ShieldCheck className="h-4 w-4 text-violet-500" />
              SOC2 Type II & GDPR compliant
            </span>
          </div>
        </div>

        <div
          className="
            hero-item
            relative
            flex
            items-center
            justify-center
            md:justify-end
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              h-[380px]
              w-[380px]
              rounded-full
              bg-indigo-400/10
              blur-[100px]
            "
          />

          <div
            className="
              relative
              rounded-[2rem]
              border
              border-white/70
              bg-white/50
              p-4
              shadow-2xl
              shadow-indigo-900/5
              backdrop-blur-xl
              transition-transform
              duration-500
              hover:-translate-y-2
            "
          >
            <GapChart />
          </div>
        </div>
      </div>
    </section>
  );
}