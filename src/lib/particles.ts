import { LOGO_POINTS } from "./logoPoints";

export interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  tx: number; // target x in screen px
  ty: number; // target y in screen px
  r: number;
  a: number;
  color: string;
}

export interface CompetencyNode {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  phase: number;
}

export interface SignalPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

export interface Shockwave {
  radius: number;
  maxRadius: number;
  alpha: number;
  active: boolean;
}

/**
 * Creates particles for the SkillStat logo assembly.
 * Positioned relative to screen center.
 */
export function createParticles(
  logoSizePx: number,
  centerX: number,
  centerY: number,
): Particle[] {
  const colors = [
    "48, 55, 230", // brand indigo
    "6, 182, 212", // electric cyan
    "79, 70, 229", // violet indigo
    "99, 102, 241", // bright indigo
  ];

  return LOGO_POINTS.map(([nx, ny, intensity], index) => {
    // Start scattered in a swirling vortex around center
    const angle = Math.random() * Math.PI * 2;
    const dist = logoSizePx * (1.6 + Math.random() * 2.2);
    const startX = centerX + Math.cos(angle) * dist;
    const startY = centerY + Math.sin(angle) * dist;

    // Target position mapped to center of screen
    const targetX = centerX - logoSizePx / 2 + nx * logoSizePx;
    const targetY = centerY - logoSizePx / 2 + ny * logoSizePx;

    const chosenColor = colors[index % colors.length];

    return {
      x: startX,
      y: startY,
      originX: startX,
      originY: startY,
      tx: targetX,
      ty: targetY,
      r: 0.9 + intensity * 1.4,
      a: 0.35 + intensity * 0.65,
      color: chosenColor,
    };
  });
}

/**
 * Creates ambient floating competency nodes.
 */
export function createCompetencyNodes(
  width: number,
  height: number,
): CompetencyNode[] {
  const nodeDefs = [
    { label: "AI & ML", color: "6, 182, 212" },
    { label: "System Design", color: "48, 55, 230" },
    { label: "Cloud Arch", color: "99, 102, 241" },
    { label: "Competency Matrix", color: "245, 158, 11" },
    { label: "Talent Mobility", color: "16, 185, 129" },
    { label: "Data Pipelines", color: "48, 55, 230" },
    { label: "Predictive Analytics", color: "139, 92, 246" },
  ];

  const cx = width / 2;
  const cy = height / 2;
  const radiusX = Math.min(width * 0.44, 420);
  const radiusY = Math.min(height * 0.38, 280);

  return nodeDefs.map((def, i) => {
    const angle = (i / nodeDefs.length) * Math.PI * 2 - Math.PI / 2;
    return {
      label: def.label,
      x: cx + Math.cos(angle) * radiusX,
      y: cy + Math.sin(angle) * radiusY,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: 4,
      color: def.color,
      phase: i * 0.8,
    };
  });
}

/**
 * Fullscreen Anime.js-style Canvas scene renderer.
 */
export function renderAnimeCanvas({
  ctx,
  width,
  height,
  particles,
  nodes,
  pulses,
  time,
  assembleRatio,
  shockwave,
}: {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  particles: Particle[];
  nodes: CompetencyNode[];
  pulses: SignalPulse[];
  time: number;
  assembleRatio: number;
  shockwave?: Shockwave;
}) {
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;

  // 1. Subtle high-tech coordinate grid crosses (+)
  const gridStep = 72;
  ctx.strokeStyle = "rgba(226, 232, 240, 0.45)";
  ctx.lineWidth = 1;
  const crossSize = 3.5;

  const startX = (cx % gridStep) - gridStep;
  const startY = (cy % gridStep) - gridStep;

  for (let x = startX; x < width + gridStep; x += gridStep) {
    for (let y = startY; y < height + gridStep; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x - crossSize, y);
      ctx.lineTo(x + crossSize, y);
      ctx.moveTo(x, y - crossSize);
      ctx.lineTo(x, y + crossSize);
      ctx.stroke();
    }
  }

  // 2. Concentric geometric orbital rings (signature Anime.js style)
  const ring1R = 120;
  const ring2R = 200;

  // Outer orbital ring with rotating dashes
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.0004);
  ctx.beginPath();
  ctx.arc(0, 0, ring2R, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(48, 55, 230, 0.07)";
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 12]);
  ctx.stroke();
  ctx.restore();

  // Inner orbital ring with ticks
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-time * 0.0006);
  ctx.beginPath();
  ctx.arc(0, 0, ring1R, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.1)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  ctx.stroke();
  ctx.restore();

  // 3. Shockwave ring when logo locks in
  if (shockwave && shockwave.active && shockwave.alpha > 0.01) {
    ctx.beginPath();
    ctx.arc(cx, cy, shockwave.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(48, 55, 230, ${shockwave.alpha * 0.6})`;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // 4. Filaments connecting competency nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i];
      const n2 = nodes[j];
      const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

      if (dist < Math.min(width, height) * 0.65) {
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = "rgba(203, 213, 225, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  // 5. Data signal pulses along filaments
  for (const pulse of pulses) {
    const n1 = nodes[pulse.fromNode];
    const n2 = nodes[pulse.toNode];
    if (!n1 || !n2) continue;

    const px = n1.x + (n2.x - n1.x) * pulse.progress;
    const py = n1.y + (n2.y - n1.y) * pulse.progress;

    ctx.beginPath();
    ctx.arc(px, py, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${n1.color}, 0.85)`;
    ctx.fill();
  }

  // 6. Competency nodes & labels
  for (const node of nodes) {
    const pulseR = node.radius + Math.sin(time * 0.003 + node.phase) * 1.5;

    // Node outer glow
    ctx.beginPath();
    ctx.arc(node.x, node.y, pulseR * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${node.color}, 0.09)`;
    ctx.fill();

    // Node solid core
    ctx.beginPath();
    ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${node.color}, 0.85)`;
    ctx.fill();

    // Label
    ctx.font = "500 11px Manrope, sans-serif";
    ctx.fillStyle = "#64748B";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y + pulseR + 13);
  }

  // 7. SkillStat Logo particles
  const particleAlphaMultiplier = assembleRatio > 0.95 ? 0.35 : 1;
  for (const p of particles) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${p.color}, ${p.a * particleAlphaMultiplier})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
}
