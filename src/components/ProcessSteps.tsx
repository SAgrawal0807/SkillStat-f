import { Database, Target, Rocket } from "lucide-react";

interface Step {
  number: string;
  icon: typeof Database;
  title: string;
  body: string;
  metric: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: Database,
    title: "Continuous Signal Ingestion",
    body: "SkillStat silently ingests pull requests, code reviews, Jira tickets, and architectural RFCs. Zero time wasted filling out manual employee surveys.",
    metric: "100% Automated Data Pipeline",
  },
  {
    number: "02",
    icon: Target,
    title: "Predictive Competency Benchmark",
    body: "Map team proficiencies against customized role rubrics and frontier tech standards. Detect upcoming skill bottlenecks quarters before they stall sprints.",
    metric: "94% Predictive Accuracy",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Autonomous Gap Closure",
    body: "Synthesize personalized micro-mentorships, project assignments, and AI-curated upskilling modules directly into the engineer's workflow.",
    metric: "3.4x Faster Time-to-Competency",
  },
];

export default function ProcessSteps() {
  return (
    <section
      id="how-it-works"
      className="border-t border-line/80 bg-paper py-24 md:py-28"
    >
      <div className="container-content">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Methodology
            </span>
            <h2 className="mt-3 font-display text-[32px] font-bold tracking-tight text-ink md:text-[40px]">
              How SkillStat works
            </h2>
          </div>
          <p className="max-w-[44ch] text-[15.5px] leading-relaxed text-ink-soft">
            From passive telemetry to predictive competency development in three
            automated stages.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-white p-7 shadow-xs transition-all hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-brand-600">
                      {step.number}
                    </span>
                    <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-6 font-display text-[20px] font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>

                <div className="mt-6 border-t border-line/60 pt-4 text-xs font-semibold text-brand-600">
                  {step.metric}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
