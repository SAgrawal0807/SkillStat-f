import { useState } from "react";
import { Sparkles, TrendingUp, Cpu } from "lucide-react";

interface SkillItem {
  name: string;
  current: number; // 0..100
  target: number; // 0..100
  category: string;
}

interface RoleConfig {
  id: string;
  roleName: string;
  department: string;
  teamSize: number;
  skills: SkillItem[];
  aiInsight: string;
}

const ROLES: RoleConfig[] = [
  {
    id: "ai-engineer",
    roleName: "AI & ML Engineer",
    department: "Applied AI Team",
    teamSize: 18,
    skills: [
      {
        name: "LLM Fine-tuning & LoRA",
        current: 45,
        target: 85,
        category: "Core AI",
      },
      {
        name: "Distributed Inference (vLLM)",
        current: 62,
        target: 80,
        category: "Infrastructure",
      },
      {
        name: "Vector Databases & RAG",
        current: 78,
        target: 85,
        category: "Data Systems",
      },
      {
        name: "AI Evaluation & Red-teaming",
        current: 32,
        target: 70,
        category: "Governance",
      },
    ],
    aiInsight:
      "Predicted 4.2x productivity lift by closing the AI Evaluation deficit with targeted micro-modules.",
  },
  {
    id: "cloud-architect",
    roleName: "Cloud Platform Architect",
    department: "Core Infrastructure",
    teamSize: 24,
    skills: [
      {
        name: "Kubernetes Multi-cluster",
        current: 82,
        target: 90,
        category: "Platform",
      },
      {
        name: "Terraform & GitOps",
        current: 70,
        target: 75,
        category: "DevOps",
      },
      {
        name: "Zero Trust Security & IAM",
        current: 40,
        target: 80,
        category: "Security",
      },
      {
        name: "FinOps Cost Optimization",
        current: 55,
        target: 85,
        category: "Operations",
      },
    ],
    aiInsight:
      "Security gap identified as high-priority risk. Automated peer pairing assigned for Zero Trust certification.",
  },
  {
    id: "fullstack-lead",
    roleName: "Fullstack Tech Lead",
    department: "Product Engineering",
    teamSize: 32,
    skills: [
      {
        name: "Next.js / React 19 Architecture",
        current: 88,
        target: 88,
        category: "Frontend",
      },
      {
        name: "Event-Driven Microservices",
        current: 65,
        target: 82,
        category: "Backend",
      },
      {
        name: "Database Sharding & Cache",
        current: 58,
        target: 75,
        category: "Data",
      },
      {
        name: "System Scalability & Chaos Eng",
        current: 42,
        target: 70,
        category: "Reliability",
      },
    ],
    aiInsight:
      "Team capability outpaces benchmark in Frontend; 28% gap in Chaos Engineering mapped to internal workshop.",
  },
];

export default function GapChart() {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [simulatedUpskilling, setSimulatedUpskilling] = useState(false);

  const activeRole = ROLES[activeRoleIndex];

  const handleSimulate = () => {
    setSimulatedUpskilling(true);
    setTimeout(() => {
      // Revert after 4 seconds
      setSimulatedUpskilling(false);
    }, 4000);
  };

  return (
    <div className="w-full max-w-[480px] rounded-2xl border border-line bg-white/95 p-6 shadow-xl shadow-indigo-900/5 backdrop-blur-sm transition-all">
      {/* Header with Live Status & Role Tabs */}
      <div className="flex flex-col gap-3 border-b border-line/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-accent-emerald animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Live Competency Map
            </span>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11.5px] font-medium text-ink-soft">
            {activeRole.department}
          </span>
        </div>

        {/* Role switch tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
          {ROLES.map((role, idx) => (
            <button
              key={role.id}
              onClick={() => {
                setActiveRoleIndex(idx);
                setSimulatedUpskilling(false);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                activeRoleIndex === idx
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-100/80 text-ink-soft hover:bg-slate-200/60"
              }`}
            >
              {role.roleName}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
        <span className="font-medium text-ink-soft">{activeRole.roleName}</span>
        <div className="flex items-center gap-3.5">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-600" />
            <span>Current</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Gap</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-[2.5px] rounded-full bg-ink" />
            <span>Target</span>
          </span>
        </div>
      </div>

      {/* Skill Rows */}
      <div className="mt-5 space-y-4">
        {activeRole.skills.map((skill) => {
          const currentVal = simulatedUpskilling
            ? Math.min(
                100,
                Math.round(
                  skill.current + (skill.target - skill.current) * 0.85,
                ),
              )
            : skill.current;
          const gap = Math.max(0, skill.target - currentVal);

          return (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="font-medium text-ink">{skill.name}</span>
                <span className="font-mono text-[11.5px] text-ink-soft">
                  {currentVal}%{" "}
                  <span className="text-ink-faint">/ {skill.target}%</span>
                  {gap > 0 ? (
                    <span className="ml-1.5 font-sans font-semibold text-amber-600">
                      (-{gap}%)
                    </span>
                  ) : (
                    <span className="ml-1.5 font-sans font-semibold text-accent-emerald">
                      ✓ Parity
                    </span>
                  )}
                </span>
              </div>

              {/* Multi-layered progress bar */}
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                {/* Target marker indicator */}
                <div
                  className="absolute top-0 bottom-0 z-20 w-[2.5px] rounded-full bg-ink shadow-xs"
                  style={{ left: `calc(${skill.target}% - 1px)` }}
                />

                {/* Gap fill bar (amber) */}
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-amber-400/50 transition-all duration-700"
                  style={{
                    left: `${currentVal}%`,
                    width: `${gap}%`,
                  }}
                />

                {/* Current level bar (brand indigo) */}
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-brand-600 to-indigo-500 transition-all duration-700 ease-out"
                  style={{ width: `${currentVal}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Automated Insight Card */}
      <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50/60 p-3.5">
        <div className="flex items-start gap-2.5">
          <div className="rounded-md bg-brand-600 p-1 text-white shadow-xs">
            <Cpu className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold text-brand-900">
              SkillStat Predictive Insight
            </p>
            <p className="mt-0.5 text-ink-soft leading-relaxed">
              {activeRole.aiInsight}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulation CTA */}
      <div className="mt-4 flex items-center justify-between pt-1">
        <span className="text-[11.5px] text-ink-faint">
          Real-time analysis updated 2m ago
        </span>
        <button
          onClick={handleSimulate}
          disabled={simulatedUpskilling}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 shadow-xs transition-all hover:bg-brand-50 hover:border-brand-400 active:scale-95 disabled:opacity-50"
        >
          {simulatedUpskilling ? (
            <>
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>Upskilling Model Applied...</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Simulate AI Upskilling</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
