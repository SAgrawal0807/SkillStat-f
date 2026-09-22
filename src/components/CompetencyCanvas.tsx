import { useEffect, useRef, useState } from "react";
import { Network, Activity, Cpu, Sparkles } from "lucide-react";

interface NodeItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  category: "ai" | "core" | "infra" | "lead";
  color: string;
  pulsePhase: number;
}

const SKILL_NODES = [
  { label: "LLM Fine-Tuning", category: "ai", color: "#4F46E5" },
  { label: "Vector Search / RAG", category: "ai", color: "#06B6D4" },
  { label: "Kubernetes & Meshes", category: "infra", color: "#3B82F6" },
  { label: "Distributed Caching", category: "core", color: "#6366F1" },
  { label: "API Gateway Governance", category: "infra", color: "#8B5CF6" },
  { label: "Prompt Engineering", category: "ai", color: "#0EA5E9" },
  { label: "System Scalability", category: "core", color: "#4338CA" },
  { label: "Cross-Functional Comms", category: "lead", color: "#10B981" },
  { label: "Real-Time Telemetry", category: "infra", color: "#F59E0B" },
  { label: "Chaos Engineering", category: "core", color: "#EC4899" },
  { label: "Talent Mobility AI", category: "lead", color: "#14B8A6" },
  { label: "Deep Learning Eval", category: "ai", color: "#6366F1" },
];

export default function CompetencyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNode, setActiveNode] = useState<string>("LLM Fine-Tuning");
  const [pulseCount, setPulseCount] = useState(1284);

  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId = 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Initialize interactive nodes
    const nodes: NodeItem[] = SKILL_NODES.map((item, idx) => {
      const padding = 60;
      return {
        x: padding + Math.random() * (width - padding * 2),
        y: padding + Math.random() * (height - padding * 2),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 4.5,
        label: item.label,
        category: item.category as NodeItem["category"],
        color: item.color,
        pulsePhase: idx * 0.5,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.02;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce from walls
        if (node.x < 40 || node.x > w - 40) node.vx *= -1;
        if (node.y < 30 || node.y > h - 30) node.vy *= -1;

        // Mouse attraction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 10) {
            node.x += (dx / dist) * 0.7;
            node.y += (dy / dist) * 0.7;
          }
        }
      }

      // Draw connection filaments
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.35;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Occasional signal pulse along edge
            const pulsePos = (time * 0.4 + i * 0.3) % 1;
            if (dist < 120) {
              const px = n1.x + (n2.x - n1.x) * pulsePos;
              const py = n1.y + (n2.y - n1.y) * pulsePos;
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fillStyle = n1.color;
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes & labels
      for (const node of nodes) {
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 1.5;
        const currentR = node.radius + pulse;

        // Halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentR * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}22`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Label
        ctx.font = "600 11px Manrope, sans-serif";
        ctx.fillStyle = "#334155";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + currentR + 13);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleCanvasClick = () => {
    setPulseCount((prev) => prev + 1);
    const randomSkill =
      SKILL_NODES[Math.floor(Math.random() * SKILL_NODES.length)];
    setActiveNode(randomSkill.label);
  };

  return (
    <section
      id="competency-ai"
      className="border-t border-line/80 bg-white py-24"
    >
      <div className="container-content">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-600">
            <Cpu className="h-3.5 w-3.5" />
            <span>Interactive Competency Graph</span>
          </div>
          <h2 className="mt-4 font-display text-[32px] font-bold tracking-tight text-ink md:text-[42px]">
            AI-Synthesized Organizational Skill Graph
          </h2>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-ink-soft">
            Move your cursor across the graph to explore dynamic skill
            clustering. SkillStat continuously correlates technical output with
            business objectives.
          </p>
        </div>

        {/* Canvas & Control Container */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-line bg-paper shadow-lg shadow-indigo-900/5">
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-line/80 bg-white/80 px-6 py-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-xs font-semibold text-ink">
                Active Node:{" "}
                <span className="text-brand-600 font-mono">{activeNode}</span>
              </span>
            </div>
            <div className="flex items-center gap-5 text-xs text-ink-faint">
              <span className="flex items-center gap-1.5 font-medium text-ink-soft">
                <Network className="h-3.5 w-3.5 text-brand-600" />
                <span>142 Skill Clusters</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-ink-soft">
                <Activity className="h-3.5 w-3.5 text-accent-emerald" />
                <span>99.4% Graph Density</span>
              </span>
              <span className="hidden sm:inline-block font-mono text-[11px] text-ink-faint">
                Pulses Synced: {pulseCount}
              </span>
            </div>
          </div>

          {/* Interactive HTML5 Canvas */}
          <div className="relative h-[420px] w-full cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleCanvasClick}
              className="h-full w-full"
            />

            {/* Micro badge overlay */}
            <div className="pointer-events-none absolute bottom-5 right-6 rounded-xl border border-line/60 bg-white/90 px-3.5 py-2 shadow-xs backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                <span>Click anywhere to dispatch competency pulses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
