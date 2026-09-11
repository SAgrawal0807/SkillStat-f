import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Small reusable hooks                                              */
/* ------------------------------------------------------------------ */

/** Fades + slides an element in the first time it scrolls into view. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

/** Animates a number from 0 to `target` once its element scrolls into view. */
function useCountUp(target: number, suffix = "") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1100;

        function tick(now: number) {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target]);

  return { ref, display: `${value}${suffix}` };
}

/* ------------------------------------------------------------------ */
/*  Static content                                                    */
/* ------------------------------------------------------------------ */

const DOMAIN_BARS = [
  { label: "Survey Design", pct: 58, color: "var(--teal)" },
  { label: "Data Classification", pct: 74, color: "var(--indigo-2)" },
  { label: "Estimation Methods", pct: 45, color: "var(--teal)" },
  { label: "GIS & Spatial Data", pct: 63, color: "var(--indigo-2)" },
];

const STEPS = [
  { num: "01", title: "Assess", body: "Understand the learner's current competency." },
  { num: "02", title: "Analyse", body: "AI analyses responses and identifies weak areas." },
  { num: "03", title: "Detect Gaps", body: "Pinpoint specific competency gaps." },
  { num: "04", title: "Recommend", body: "Suggest relevant personalized training." },
  { num: "05", title: "Practice", body: "Generate quizzes and MCQs from materials." },
  { num: "06", title: "Re-evaluate", body: "Refine the learner profile from performance." },
];

const FEATURES = [
  { title: "AI Competency Analysis", body: "Identify strengths and learning gaps." },
  { title: "Personalized Recommendations", body: "Recommend training based on individual needs." },
  { title: "AI Quiz Generator", body: "Convert uploaded learning material into MCQs." },
  { title: "Adaptive Assessment", body: "Adjust learning based on performance." },
  { title: "Learning Analytics", body: "Track competency development over time." },
  { title: "iGOT Ecosystem Alignment", body: "Connect recommendations with the iGOT Karmayogi ecosystem." },
];

const STAT_TILES = [
  { target: 68, suffix: "%", label: "Current competency" },
  { target: 32, suffix: "%", label: "Skill gap" },
  { target: 4, suffix: "", label: "Recommended courses" },
  { target: 81, suffix: "%", label: "Quiz performance" },
];

const IGOT_NODES = ["Learner", "SkillStat AI", "Competency Gap", "Personalized Training", "iGOT Karmayogi Ecosystem"];

/* ------------------------------------------------------------------ */
/*  Small icon helper (feather-style inline SVGs, no external deps)   */
/* ------------------------------------------------------------------ */

const Icon = {
  Check: (p: { color?: string }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={p.color ?? "var(--teal)"} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Arrow: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Doc: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h7M9 8h3" />
    </svg>
  ),
  Cpu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2" />
    </svg>
  ),
  Help: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--indigo)" strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2 1.8-2 3.2M12 17h.01" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.9 5.8L20 9l-5.8 1.9L12 17l-1.9-6.1L4 9l6.1-1.2z" />
    </svg>
  ),
  Users: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  Target: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" />
    </svg>
  ),
  Shield: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" />
    </svg>
  ),
  Route: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="5" cy="6" r="2.3" /><circle cx="19" cy="18" r="2.3" /><path d="M7 7.5C10 11 13 9 19 15.5" />
    </svg>
  ),
  Sliders: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M4 21V10M12 21V4M20 21v-7" />
    </svg>
  ),
  Chart: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" />
    </svg>
  ),
  Network: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="12" cy="18" r="2.4" />
      <path d="M8 7.5L11 16M16 7.5L13 16M8.4 6h7.2" />
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  Brain: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="1" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  ),
  GapCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Grad: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5" />
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Feature card (needs its own reveal + delay)                        */
/* ------------------------------------------------------------------ */

function FeatureCard({ title, body, icon, delay }: { title: string; body: string; icon: React.ReactNode; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`ss-feat-card ss-reveal ${visible ? "ss-in" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <span className="ss-feat-ic">{icon}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function StatTile({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, display } = useCountUp(target, suffix);
  return (
    <div className="ss-stat-tile">
      <div className="ss-val" ref={ref}>{display}</div>
      <div className="ss-lbl">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const [stepsFillPct, setStepsFillPct] = useState(0);
  const [activeSteps, setActiveSteps] = useState(0);

  const chartRef = useRef<HTMLDivElement | null>(null);
  const stepsRowRef = useRef<HTMLDivElement | null>(null);

  const heroReveal = useReveal<HTMLDivElement>();
  const psHeadReveal = useReveal<HTMLDivElement>();
  const psTradReveal = useReveal<HTMLDivElement>();
  const psSolReveal = useReveal<HTMLDivElement>();
  const howHeadReveal = useReveal<HTMLDivElement>();
  const quizHeadReveal = useReveal<HTMLDivElement>();
  const quizFlowReveal = useReveal<HTMLDivElement>();
  const dashPanelReveal = useReveal<HTMLDivElement>();
  const igotHeadReveal = useReveal<HTMLDivElement>();
  const igotFlowReveal = useReveal<HTMLDivElement>();
  const featHeadReveal = useReveal<HTMLDivElement>();
  const ctaReveal = useReveal<HTMLDivElement>();

  // nav blur on scroll
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // bar chart fill trigger
  useEffect(() => {
    const node = chartRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChartVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // "how it works" scroll-linked progress line + active step
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStepsFillPct(100);
      setActiveSteps(STEPS.length);
      return;
    }

    const onScroll = () => {
      const node = stepsRowRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.6;
      const passed = vh * 0.8 - rect.top;
      const pct = Math.min(100, Math.max(0, (passed / total) * 100));
      setStepsFillPct(pct);
      setActiveSteps(Math.round((pct / 100) * STEPS.length));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="ss-root">
      <style>{CSS}</style>

      {/* ============ NAV ============ */}
      <header className={`ss-nav ${navScrolled ? "ss-scrolled" : ""}`}>
        <div className="ss-wrap ss-nav-row">
          <a href="#top" className="ss-brand">
            <span className="ss-brand-mark">S</span>
            <span className="ss-brand-name">SkillStat</span>
          </a>
          <nav className="ss-nav-links">
            <a href="#top">Home</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#igot">About</a>
          </nav>
          <div className="ss-nav-right">
            <a href="#" className="ss-link-quiet">Login</a>
            <a href="#" className="ss-btn ss-btn-primary">Get Started</a>
          </div>
          <button className="ss-nav-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>
            <Icon.Menu />
          </button>
        </div>
        {menuOpen && (
          <div className="ss-mobile-menu ss-wrap">
            <a href="#top" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#igot" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#">Login</a>
            <a href="#" className="ss-btn ss-btn-primary" style={{ width: "fit-content" }}>Get Started</a>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section className="ss-hero" id="top">
        <div className="ss-wrap ss-hero-grid">
          <div>
            <span className="ss-eyebrow">AI-POWERED LEARNING &middot; OFFICIAL STATISTICS</span>
            <h1>Turn Skill Gaps Into Measurable Growth.</h1>
            <p className="ss-lede">
              SkillStat uses AI to identify competency gaps, personalize learning paths, and transform
              learning materials into targeted quizzes — helping build a stronger, more capable statistical
              workforce.
            </p>
            <div className="ss-hero-actions">
              <a href="#features" className="ss-btn ss-btn-primary">Start Your Learning Journey</a>
              <a href="#how-it-works" className="ss-btn ss-btn-outline">Explore How It Works</a>
            </div>
          </div>

          <div ref={heroReveal.ref} className={`ss-dash-stage ss-reveal ${heroReveal.visible ? "ss-in" : ""}`}>
            <div className="ss-floating-chip">
              <span className="ss-ic"><Icon.Check color="currentColor" /></span>
              AI analysis complete
            </div>

            <div className="ss-dash-card">
              <div className="ss-dash-head">
                <span className="ss-title">Competency Dashboard</span>
                <span className="ss-live"><span className="ss-dot-pulse" /> Live snapshot</span>
              </div>

              <div className="ss-dash-stats">
                <div className="ss-dash-stat"><div className="ss-val">68%</div><div className="ss-lbl">Current competency</div></div>
                <div className="ss-dash-stat"><div className="ss-val">32%</div><div className="ss-lbl">Skill gap</div></div>
                <div className="ss-dash-stat"><div className="ss-val">81%</div><div className="ss-lbl">Quiz accuracy</div></div>
              </div>

              <div className="ss-dash-chart" ref={chartRef}>
                {DOMAIN_BARS.map((bar) => (
                  <div className="ss-chart-row" key={bar.label}>
                    <span>{bar.label}</span>
                    <span className="ss-track">
                      <span
                        className="ss-fill"
                        style={{ width: chartVisible ? `${bar.pct}%` : "0%", background: bar.color }}
                      />
                    </span>
                    <span className="ss-pct">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="ss-trust-strip ss-surface ss-border-top ss-border-bottom">
        <div className="ss-wrap">
          <div className="ss-trust-item"><Icon.Sparkle />AI-Driven</div>
          <div className="ss-trust-item"><Icon.Users />Personalized Learning</div>
          <div className="ss-trust-item"><Icon.Target />Competency-Focused</div>
          <div className="ss-trust-item"><Icon.Shield />iGOT Karmayogi Ready</div>
        </div>
      </section>

      {/* ============ PROBLEM / SOLUTION ============ */}
      <section className="ss-section">
        <div className="ss-wrap">
          <div ref={psHeadReveal.ref} className={`ss-section-head ss-reveal ${psHeadReveal.visible ? "ss-in" : ""}`}>
            <h2>From Course Completion to Competency Improvement</h2>
            <p>Most training programs measure whether a course was finished. SkillStat measures whether the skill was actually built.</p>
          </div>

          <div className="ss-ps-grid">
            <div ref={psTradReveal.ref} className={`ss-ps-card ss-reveal ${psTradReveal.visible ? "ss-in" : ""}`}>
              <h3>Traditional Learning</h3>
              <ul className="ss-ps-list ss-trad">
                <li><Icon.X />Same training for everyone</li>
                <li><Icon.X />Difficult to identify individual gaps</li>
                <li><Icon.X />Manual course discovery</li>
                <li><Icon.X />Limited targeted assessment</li>
              </ul>
            </div>
            <div
              ref={psSolReveal.ref}
              className={`ss-ps-card ss-solution ss-reveal ${psSolReveal.visible ? "ss-in" : ""}`}
              style={{ transitionDelay: "0.1s" }}
            >
              <h3>SkillStat</h3>
              <ul className="ss-ps-list ss-sol">
                <li><Icon.Check />AI-powered competency analysis</li>
                <li><Icon.Check />Personalized learning recommendations</li>
                <li><Icon.Check />Targeted quizzes and MCQs</li>
                <li><Icon.Check />Continuous performance-based improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="ss-section ss-surface ss-border-top ss-border-bottom" id="how-it-works">
        <div className="ss-wrap">
          <div ref={howHeadReveal.ref} className={`ss-section-head ss-reveal ${howHeadReveal.visible ? "ss-in" : ""}`}>
            <h2>One Learning Journey. Continuously Improved.</h2>
            <p>The same six-stage loop runs for every officer, whether they're new to the role or closing one specific gap.</p>
          </div>

          <div className="ss-steps-line-wrap">
            <div className="ss-steps-line"><div className="ss-steps-line-fill" style={{ width: `${stepsFillPct}%` }} /></div>
          </div>
          <div className="ss-steps-row" ref={stepsRowRef}>
            {STEPS.map((s, i) => (
              <div className={`ss-step ${i < activeSteps ? "ss-active" : ""}`} key={s.num}>
                <span className="ss-num-dot">{s.num}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ QUIZ GENERATOR ============ */}
      <section className="ss-section">
        <div className="ss-wrap">
          <div ref={quizHeadReveal.ref} className={`ss-section-head ss-reveal ${quizHeadReveal.visible ? "ss-in" : ""}`}>
            <h2>Your Learning Material. Turned Into Practice.</h2>
            <p>Upload a training document and SkillStat generates relevant MCQs directly from its content.</p>
          </div>

          <div ref={quizFlowReveal.ref} className={`ss-quiz-flow ss-reveal ${quizFlowReveal.visible ? "ss-in" : ""}`}>
            <div className="ss-flow-card">
              <span className="ss-flow-ic ss-indigo"><Icon.Doc /></span>
              <div className="ss-flow-meta"><div className="ss-tag">Uploaded material</div><div className="ss-val">Sampling Methods.pdf</div></div>
            </div>
            <div className="ss-arrow"><Icon.Arrow /></div>
            <div className="ss-flow-card">
              <span className="ss-flow-ic ss-teal"><Icon.Cpu /></span>
              <div className="ss-flow-meta"><div className="ss-tag">Processing</div><div className="ss-val">AI generating questions</div></div>
            </div>
            <div className="ss-arrow"><Icon.Arrow /></div>

            <div className="ss-qcards">
              <div className="ss-qcard">
                <div className="ss-qcard-top"><span className="ss-topic-tag">Sampling Methods</span><span className="ss-diff-tag ss-diff-easy">Easy</span></div>
                <div className="ss-qtext"><Icon.Help />Which sampling method gives every unit an equal chance of selection?</div>
                <div className="ss-options-grid">
                  <div className="ss-opt">Simple random sampling</div>
                  <div className="ss-opt">Convenience sampling</div>
                  <div className="ss-opt">Judgment sampling</div>
                  <div className="ss-opt">Snowball sampling</div>
                </div>
              </div>
              <div className="ss-qcard">
                <div className="ss-qcard-top"><span className="ss-topic-tag">Sampling Methods</span><span className="ss-diff-tag ss-diff-medium">Medium</span></div>
                <div className="ss-qtext"><Icon.Help />A sampling frame that excludes part of the target population causes:</div>
                <div className="ss-options-grid">
                  <div className="ss-opt">Sampling bias</div>
                  <div className="ss-opt">Measurement error</div>
                  <div className="ss-opt">Non-response bias</div>
                  <div className="ss-opt">Rounding error</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PERSONALIZED LEARNING ============ */}
      <section className="ss-section ss-surface ss-border-top ss-border-bottom">
        <div className="ss-wrap">
          <div className="ss-section-head">
            <h2>The Right Skill. The Right Course. The Right Time.</h2>
            <p>Every recommendation traces back to a specific, identified gap — not a generic catalogue.</p>
          </div>

          <div ref={dashPanelReveal.ref} className={`ss-dash-panel ss-reveal ${dashPanelReveal.visible ? "ss-in" : ""}`}>
            <div className="ss-dash-panel-head">
              <h3>Competency Profile</h3>
              <span className="ss-note">Sample data</span>
            </div>
            <div className="ss-stat-grid">
              {STAT_TILES.map((s) => (
                <StatTile key={s.label} target={s.target} suffix={s.suffix} label={s.label} />
              ))}
            </div>
            <div className="ss-rec-title">Recommended for You</div>
            <div className="ss-rec-grid">
              <div className="ss-rec-card">
                <div><div className="ss-rec-name">Sampling Techniques</div><div className="ss-lvl">Intermediate</div></div>
                <a href="#">Start Learning →</a>
              </div>
              <div className="ss-rec-card">
                <div><div className="ss-rec-name">Data Interpretation</div><div className="ss-lvl">Beginner</div></div>
                <a href="#">Practice Quiz →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ IGOT ============ */}
      <section className="ss-section" id="igot">
        <div className="ss-wrap" style={{ maxWidth: 820, textAlign: "center" }}>
          <div
            ref={igotHeadReveal.ref}
            className={`ss-section-head ss-reveal ${igotHeadReveal.visible ? "ss-in" : ""}`}
            style={{ margin: "0 auto 48px", textAlign: "center" }}
          >
            <h2>Learning That Connects With the iGOT Karmayogi Ecosystem</h2>
            <p style={{ margin: "0 auto" }}>
              SkillStat can align personalized learning recommendations with relevant training opportunities
              available through the iGOT Karmayogi ecosystem.
            </p>
          </div>

          <div ref={igotFlowReveal.ref} className={`ss-igot-flow ss-reveal ${igotFlowReveal.visible ? "ss-in" : ""}`}>
            {IGOT_NODES.map((label, i) => (
              <React.Fragment key={label}>
                <div className="ss-igot-node">
                  <span className="ss-ic">
                    {i === 0 && <Icon.User />}
                    {i === 1 && <Icon.Brain />}
                    {i === 2 && <Icon.GapCircle />}
                    {i === 3 && <Icon.Grad />}
                    {i === 4 && <Icon.Shield />}
                  </span>
                  <span>{label}</span>
                </div>
                {i < IGOT_NODES.length - 1 && <div className="ss-igot-arrow"><Icon.Arrow /></div>}
              </React.Fragment>
            ))}
          </div>

          <p className="ss-igot-note">
            This prototype illustrates the intended integration pathway. It does not implement live iGOT
            Karmayogi API access.
          </p>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="ss-section ss-surface ss-border-top ss-border-bottom" id="features">
        <div className="ss-wrap">
          <div ref={featHeadReveal.ref} className={`ss-section-head ss-reveal ${featHeadReveal.visible ? "ss-in" : ""}`}>
            <h2>Everything capacity-building needs, in one workflow</h2>
            <p>Six pieces that work together, not six separate tools bolted on afterward.</p>
          </div>
          <div className="ss-feat-grid">
            <FeatureCard title={FEATURES[0].title} body={FEATURES[0].body} icon={<Icon.Cpu />} delay={0} />
            <FeatureCard title={FEATURES[1].title} body={FEATURES[1].body} icon={<Icon.Route />} delay={0.05} />
            <FeatureCard title={FEATURES[2].title} body={FEATURES[2].body} icon={<Icon.Help />} delay={0.1} />
            <FeatureCard title={FEATURES[3].title} body={FEATURES[3].body} icon={<Icon.Sliders />} delay={0} />
            <FeatureCard title={FEATURES[4].title} body={FEATURES[4].body} icon={<Icon.Chart />} delay={0.05} />
            <FeatureCard title={FEATURES[5].title} body={FEATURES[5].body} icon={<Icon.Network />} delay={0.1} />
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="ss-cta">
        <div ref={ctaReveal.ref} className={`ss-wrap ss-reveal ${ctaReveal.visible ? "ss-in" : ""}`}>
          <h2>Build Skills. Measure Progress. Strengthen Capacity.</h2>
          <p>Start a smarter approach to competency development with SkillStat.</p>
          <a href="#top" className="ss-btn ss-btn-light">Get Started</a>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="ss-footer">
        <div className="ss-wrap">
          <div className="ss-footer-row">
            <div className="ss-footer-brand">
              <span className="ss-brand-name">SkillStat</span>
              <p>AI-powered competency development for India&apos;s statistical workforce.</p>
            </div>
            <ul className="ss-footer-links">
              <li><a href="#top">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#igot">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <p className="ss-footer-note">Built for smarter capacity building.</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles — scoped with an "ss-" prefix so this can't collide with    */
/*  other components in your app.                                     */
/* ------------------------------------------------------------------ */

const CSS = `
.ss-root{
  --bg:#f7f6f2; --surface:#ffffff; --ink:#12141c; --muted:#5c6270;
  --indigo:#26315c; --indigo-2:#3d4e8c; --teal:#0f766e; --teal-soft:#e6f2f0;
  --line:#e3e0d6; --amber:#a8710f; --amber-soft:#f6ecd9; --radius:10px; --maxw:1180px;
  background:var(--bg); color:var(--ink); font-family:'Inter',sans-serif; line-height:1.6;
}
.ss-root *{box-sizing:border-box;}
.ss-root h1,.ss-root h2,.ss-root h3,.ss-root h4{font-family:'Space Grotesk',sans-serif; margin:0; color:var(--ink);}
.ss-root p{margin:0;}
.ss-root a{color:inherit; text-decoration:none;}
.ss-wrap{max-width:var(--maxw); margin:0 auto; padding:0 32px;}
@media (max-width:640px){ .ss-wrap{padding:0 20px;} }
.ss-section{padding:96px 0;}
.ss-border-top{border-top:1px solid var(--line);}
.ss-border-bottom{border-bottom:1px solid var(--line);}
.ss-surface{background:var(--surface);}
.ss-eyebrow{display:inline-flex; align-items:center; gap:8px; font-size:12.5px; font-weight:600; letter-spacing:.02em; color:var(--teal); background:var(--teal-soft); padding:7px 14px; border-radius:100px;}
.ss-section-head{max-width:560px; margin-bottom:56px;}
.ss-section-head h2{font-size:clamp(1.7rem,3vw,2.3rem); font-weight:600; line-height:1.18; margin-bottom:14px;}
.ss-section-head p{color:var(--muted); font-size:1.02rem;}

.ss-nav{position:fixed; top:0; left:0; right:0; z-index:100; border-bottom:1px solid transparent; transition:background .25s ease, border-color .25s ease;}
.ss-nav.ss-scrolled{background:rgba(247,246,242,0.9); backdrop-filter:blur(10px); border-bottom-color:var(--line);}
.ss-nav-row{display:flex; align-items:center; justify-content:space-between; height:72px;}
.ss-brand{display:flex; align-items:center; gap:9px;}
.ss-brand-mark{width:30px; height:30px; border-radius:7px; background:var(--indigo); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:14px;}
.ss-brand-name{font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:1.15rem;}
.ss-nav-links{display:flex; gap:36px; list-style:none; margin:0; padding:0;}
.ss-nav-links a{font-size:.92rem; font-weight:500; color:var(--muted); transition:color .15s;}
.ss-nav-links a:hover{color:var(--ink);}
.ss-nav-right{display:flex; align-items:center; gap:20px;}
.ss-link-quiet{font-size:.92rem; font-weight:500; color:var(--muted);}
.ss-btn{display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:600; font-size:.9rem; padding:11px 20px; border-radius:7px; cursor:pointer; border:1px solid transparent; white-space:nowrap; transition:background .15s, border-color .15s, transform .15s;}
.ss-btn-primary{background:var(--indigo); color:#fff;}
.ss-btn-primary:hover{background:#1c2547;}
.ss-btn-outline{background:transparent; color:var(--ink); border-color:var(--line);}
.ss-btn-outline:hover{border-color:var(--indigo);}
.ss-btn-light{background:#fff; color:var(--indigo);}
.ss-btn-light:hover{transform:translateY(-1px);}
.ss-nav-toggle{display:none; background:none; border:none; cursor:pointer; padding:6px; color:var(--ink);}
.ss-mobile-menu{display:flex; flex-direction:column; gap:16px; padding:20px 0 24px; border-top:1px solid var(--line); background:var(--bg);}
.ss-mobile-menu a{font-size:.95rem; font-weight:500; color:var(--ink);}
@media (max-width:860px){ .ss-nav-links,.ss-nav-right{display:none;} .ss-nav-toggle{display:block;} }
@media (min-width:861px){ .ss-mobile-menu{display:none;} }

.ss-hero{padding:168px 0 96px; background-image:radial-gradient(circle, #ddd8c9 1.2px, transparent 1.2px); background-size:26px 26px;}
.ss-hero-grid{display:grid; grid-template-columns:1.05fr .95fr; gap:64px; align-items:center;}
@media (max-width:960px){ .ss-hero-grid{grid-template-columns:1fr; gap:56px;} }
.ss-hero h1{font-size:clamp(2.3rem,4.4vw,3.4rem); font-weight:600; line-height:1.1; max-width:15ch; margin:22px 0;}
.ss-lede{font-size:1.1rem; color:var(--muted); max-width:46ch; margin-bottom:34px;}
.ss-hero-actions{display:flex; gap:14px; flex-wrap:wrap;}

.ss-dash-stage{position:relative; min-height:420px;}
.ss-dash-card{position:relative; background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:26px; box-shadow:0 20px 44px -20px rgba(18,20,28,.16);}
.ss-dash-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:22px;}
.ss-dash-head .ss-title{font-weight:600; font-size:.95rem;}
.ss-live{display:flex; align-items:center; gap:6px; font-size:.76rem; color:var(--muted);}
.ss-dot-pulse{width:7px; height:7px; border-radius:50%; background:var(--teal); animation:ss-pulse 1.8s ease-in-out infinite;}
@keyframes ss-pulse{0%,100%{opacity:1;} 50%{opacity:.35;}}
.ss-dash-stats{display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:22px;}
.ss-dash-stat{background:var(--bg); border:1px solid var(--line); border-radius:8px; padding:14px;}
.ss-dash-stat .ss-val{font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:1.35rem; color:var(--indigo);}
.ss-dash-stat .ss-lbl{font-size:.72rem; color:var(--muted); margin-top:2px;}
.ss-dash-chart{border:1px solid var(--line); border-radius:8px; padding:16px 16px 6px;}
.ss-chart-row{display:grid; grid-template-columns:118px 1fr 34px; align-items:center; gap:10px; font-size:.8rem; padding:8px 0;}
.ss-track{height:7px; background:#ece8dc; border-radius:4px; overflow:hidden; display:block;}
.ss-fill{height:100%; border-radius:4px; display:block; transition:width 1s cubic-bezier(.22,1,.36,1);}
.ss-pct{text-align:right; color:var(--muted); font-variant-numeric:tabular-nums;}
.ss-floating-chip{position:absolute; top:-18px; right:18px; background:#fff; border:1px solid var(--line); border-radius:100px; padding:8px 14px 8px 10px; display:flex; align-items:center; gap:8px; font-size:.78rem; font-weight:600; box-shadow:0 10px 24px -12px rgba(18,20,28,.25); z-index:2;}
.ss-floating-chip .ss-ic{width:20px; height:20px; border-radius:50%; background:var(--teal-soft); color:var(--teal); display:flex; align-items:center; justify-content:center;}

.ss-trust-strip .ss-wrap{display:grid; grid-template-columns:repeat(4,1fr); gap:28px; padding:30px 32px;}
@media (max-width:760px){ .ss-trust-strip .ss-wrap{grid-template-columns:1fr 1fr;} }
.ss-trust-item{display:flex; align-items:center; gap:10px; font-size:.88rem; font-weight:500; color:var(--muted);}
.ss-trust-item svg{color:var(--teal); flex-shrink:0;}

.ss-ps-grid{display:grid; grid-template-columns:1fr 1fr; gap:24px;}
@media (max-width:820px){ .ss-ps-grid{grid-template-columns:1fr;} }
.ss-ps-card{border:1px solid var(--line); border-radius:var(--radius); padding:32px; background:var(--surface);}
.ss-ps-card.ss-solution{position:relative; border-color:rgba(38,49,92,.18); overflow:hidden;}
.ss-ps-card.ss-solution::before{content:''; position:absolute; left:0; top:0; bottom:0; width:4px; background:var(--teal);}
.ss-ps-card h3{font-size:1.05rem; font-weight:600; margin-bottom:20px; color:var(--muted);}
.ss-ps-card.ss-solution h3{color:var(--indigo);}
.ss-ps-list{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:14px;}
.ss-ps-list li{display:flex; align-items:flex-start; gap:10px; font-size:.93rem;}
.ss-ps-list.ss-trad li{color:var(--muted);}
.ss-ps-list.ss-sol li{color:var(--ink);}
.ss-ps-list li svg{margin-top:2px; flex-shrink:0;}

.ss-steps-line-wrap{position:relative; margin-bottom:8px;}
.ss-steps-line{position:relative; height:2px; background:var(--line);}
.ss-steps-line-fill{position:absolute; top:0; left:0; height:100%; background:var(--teal); transition:width .2s linear;}
.ss-steps-row{display:grid; grid-template-columns:repeat(6,1fr); gap:16px;}
@media (max-width:900px){ .ss-steps-row{grid-template-columns:repeat(3,1fr);} }
@media (max-width:560px){ .ss-steps-row{grid-template-columns:repeat(2,1fr);} .ss-steps-line-wrap{display:none;} }
.ss-step{display:flex; flex-direction:column; gap:12px;}
.ss-num-dot{width:40px; height:40px; border-radius:50%; background:#fff; border:2px solid var(--line); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:.85rem; color:var(--muted); transition:border-color .2s, color .2s, background .2s;}
.ss-step.ss-active .ss-num-dot{border-color:var(--teal); color:#fff; background:var(--teal);}
.ss-step h4{font-size:.98rem; font-weight:600; margin-bottom:4px;}
.ss-step p{font-size:.85rem; color:var(--muted);}

.ss-quiz-flow{display:grid; grid-template-columns:1fr auto 1fr auto 1.3fr; gap:18px; align-items:flex-start;}
@media (max-width:960px){ .ss-quiz-flow{grid-template-columns:1fr;} .ss-quiz-flow .ss-arrow{display:none;} }
.ss-flow-card{border:1px solid var(--line); border-radius:var(--radius); background:var(--surface); padding:18px; display:flex; align-items:center; gap:12px;}
.ss-flow-ic{width:38px; height:38px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
.ss-flow-ic.ss-indigo{background:rgba(38,49,92,.08); color:var(--indigo);}
.ss-flow-ic.ss-teal{background:var(--teal-soft); color:var(--teal);}
.ss-flow-meta .ss-tag{font-size:.72rem; color:var(--muted); margin-bottom:2px;}
.ss-flow-meta .ss-val{font-size:.9rem; font-weight:600;}
.ss-arrow{display:flex; align-items:center; justify-content:center; height:100%; padding-top:28px; color:var(--muted);}
.ss-qcards{display:flex; flex-direction:column; gap:14px;}
.ss-qcard{border:1px solid var(--line); border-radius:var(--radius); background:var(--surface); padding:18px;}
.ss-qcard-top{display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;}
.ss-topic-tag{font-size:.7rem; font-weight:600; letter-spacing:.02em; color:var(--muted); text-transform:uppercase;}
.ss-diff-tag{font-size:.72rem; font-weight:600; padding:4px 10px; border-radius:100px;}
.ss-diff-easy{background:var(--teal-soft); color:var(--teal);}
.ss-diff-medium{background:var(--amber-soft); color:var(--amber);}
.ss-qtext{display:flex; align-items:flex-start; gap:8px; font-size:.9rem; font-weight:500; margin-bottom:12px;}
.ss-options-grid{display:grid; grid-template-columns:1fr 1fr; gap:8px;}
.ss-opt{font-size:.8rem; color:var(--muted); border:1px solid var(--line); border-radius:6px; padding:9px 11px;}

.ss-dash-panel{border:1px solid var(--line); border-radius:var(--radius); background:var(--surface); padding:36px;}
.ss-dash-panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:26px;}
.ss-dash-panel-head h3{font-size:1.05rem; font-weight:600;}
.ss-dash-panel-head .ss-note{font-size:.78rem; color:var(--muted);}
.ss-stat-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px;}
@media (max-width:760px){ .ss-stat-grid{grid-template-columns:1fr 1fr;} }
.ss-stat-tile{border:1px solid var(--line); border-radius:8px; padding:18px; background:var(--bg);}
.ss-stat-tile .ss-val{font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:1.6rem; color:var(--indigo);}
.ss-stat-tile .ss-lbl{font-size:.78rem; color:var(--muted); margin-top:4px;}
.ss-rec-title{font-size:.92rem; font-weight:600; margin-bottom:16px;}
.ss-rec-grid{display:grid; grid-template-columns:1fr 1fr; gap:14px;}
@media (max-width:640px){ .ss-rec-grid{grid-template-columns:1fr;} }
.ss-rec-card{border:1px solid var(--line); border-radius:8px; padding:16px; display:flex; align-items:center; justify-content:space-between; gap:12px;}
.ss-rec-name{font-weight:600; font-size:.92rem;}
.ss-rec-card .ss-lvl{font-size:.78rem; color:var(--muted); margin-top:3px;}
.ss-rec-card a{font-size:.85rem; font-weight:600; color:var(--teal);}

.ss-igot-flow{display:flex; align-items:stretch; justify-content:center; gap:10px; flex-wrap:wrap;}
.ss-igot-node{display:flex; flex-direction:column; align-items:center; gap:8px; border:1px solid var(--line); border-radius:10px; background:var(--surface); padding:20px 14px; width:150px;}
.ss-igot-node .ss-ic{width:34px; height:34px; border-radius:8px; background:rgba(38,49,92,.08); color:var(--indigo); display:flex; align-items:center; justify-content:center;}
.ss-igot-node span{font-size:.78rem; font-weight:600; text-align:center;}
.ss-igot-arrow{display:flex; align-items:center; color:var(--muted); padding:0 2px;}
@media (max-width:760px){ .ss-igot-flow{flex-direction:column; align-items:center;} .ss-igot-arrow{transform:rotate(90deg);} }
.ss-igot-note{font-size:.8rem; color:var(--muted); max-width:520px; margin:22px auto 0; text-align:center;}

.ss-feat-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:22px;}
@media (max-width:900px){ .ss-feat-grid{grid-template-columns:1fr 1fr;} }
@media (max-width:600px){ .ss-feat-grid{grid-template-columns:1fr;} }
.ss-feat-card{position:relative; border:1px solid var(--line); border-radius:var(--radius); background:var(--surface); padding:26px; overflow:hidden; transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;}
.ss-feat-card::before{content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--teal); transform:scaleX(0); transform-origin:left; transition:transform .25s ease;}
.ss-feat-card:hover{transform:translateY(-4px); box-shadow:0 18px 34px -22px rgba(18,20,28,.28); border-color:rgba(38,49,92,.2);}
.ss-feat-card:hover::before{transform:scaleX(1);}
.ss-feat-ic{width:42px; height:42px; border-radius:9px; background:rgba(38,49,92,.08); color:var(--indigo); display:flex; align-items:center; justify-content:center; margin-bottom:16px;}
.ss-feat-card h3{font-size:1.02rem; font-weight:600; margin-bottom:8px;}
.ss-feat-card p{font-size:.88rem; color:var(--muted);}

.ss-cta{background:var(--indigo); color:#fff; text-align:center; background-image:radial-gradient(circle, rgba(255,255,255,.09) 1.2px, transparent 1.2px); background-size:26px 26px; padding:96px 0;}
.ss-cta h2{color:#fff; font-size:clamp(1.8rem,3vw,2.4rem); font-weight:600; margin-bottom:14px;}
.ss-cta p{color:rgba(255,255,255,.72); margin-bottom:30px; font-size:1.02rem;}

.ss-footer{padding:56px 0 34px;}
.ss-footer-row{display:flex; justify-content:space-between; gap:40px; flex-wrap:wrap; margin-bottom:40px;}
.ss-footer-brand p{color:var(--muted); font-size:.88rem; max-width:280px; margin-top:8px;}
.ss-footer-links{list-style:none; display:flex; gap:28px; flex-wrap:wrap; padding:0; margin:0;}
.ss-footer-links a{font-size:.88rem; color:var(--muted);}
.ss-footer-links a:hover{color:var(--ink);}
.ss-footer-note{font-size:.78rem; color:var(--muted); text-align:center; border-top:1px solid var(--line); padding-top:24px;}

.ss-reveal{opacity:0; transform:translateY(16px); transition:opacity .6s ease, transform .6s ease;}
.ss-reveal.ss-in{opacity:1; transform:translateY(0);}

@media (prefers-reduced-motion: reduce){
  .ss-root *{transition-duration:.01ms !important; animation-duration:.01ms !important;}
  .ss-reveal{opacity:1; transform:none;}
}
`;