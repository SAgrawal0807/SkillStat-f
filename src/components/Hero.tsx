import GapChart from "./GapChart";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface HeroProps {
  revealed: boolean;
}

export default function Hero({ revealed }: HeroProps) {
  return (
    <section className="container-content grid items-center gap-12 pb-20 pt-36 md:grid-cols-[1.1fr,0.9fr] md:pb-28 md:pt-44">
      {/* Left Column: Headline & Value Proposition */}
      <div
        className={`transition-all duration-700 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: revealed ? "120ms" : "0ms" }}
      >
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/70 px-3.5 py-1 text-xs font-semibold text-brand-600 shadow-2xs backdrop-blur-xs">
          <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
          <span>SkillStat 2.0 • Autonomous Competency Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-5 font-display text-[40px] font-bold leading-[1.08] tracking-tight text-ink md:text-[54px]">
          Close the competency gap before it costs you.
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-ink-soft">
          SkillStat ingests GitHub commits, sprint tickets, and manager reviews
          to generate a continuous, predictive graph of team capabilities.
          Pinpoint critical skill deficits and automate learning pathways in
          real-time.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#get-started"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-paper shadow-md transition-all hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-600/25 active:scale-95"
          >
            <span>Start Free Assessment</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-5 py-3.5 text-[15px] font-semibold text-ink-soft transition-all hover:border-ink/30 hover:text-ink hover:bg-white"
          >
            <span>See How It Works</span>
          </a>
        </div>

        {/* Value Micro-Points */}
        <div className="mt-9 flex flex-wrap items-center gap-6 border-t border-line/60 pt-6 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
            <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
            <span>Zero manual surveys</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
            <Zap className="h-4 w-4 text-brand-600" />
            <span>Real-time capability tracking</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span>SOC2 Type II & GDPR compliant</span>
          </span>
        </div>
      </div>

      {/* Right Column: Interactive Competency Gap Chart */}
      <div
        className={`flex justify-center transition-all duration-700 md:justify-end ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: revealed ? "240ms" : "0ms" }}
      >
        <GapChart />
      </div>
    </section>
  );
}
