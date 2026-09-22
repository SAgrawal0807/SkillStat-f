import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame: number;

    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createNodes = () => {
      nodes.length = 0;

      const count = Math.min(70, Math.max(25, Math.floor(width / 20)));

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 2 + 1.5, // was 1.5 + 0.5 → now 1.5–3.5px
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x <= 0 || node.x >= width) node.vx *= -1;
        if (node.y <= 0 || node.y >= height) node.vy *= -1;
      });

      // Connecting lines — stronger alpha
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            const opacity = (1 - distance / 140) * 0.35; // was 0.13

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(99,102,241,${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Nodes — bigger, brighter, with a soft glow
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        ctx.shadowColor = "rgba(99,102,241,0.9)";
        ctx.shadowBlur = 6;
        ctx.fillStyle = "rgba(99,102,241,0.9)"; // was 0.35
        ctx.fill();
        ctx.shadowBlur = 0; // reset so it doesn't bleed into lines next frame
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    createNodes();
    draw();

    const handleResize = () => {
      resize();
      createNodes();
    };

    window.addEventListener("resize", handleResize);

    // Anime.js v4
    const pulse = {
      opacity: 0.35,
    };

    const animation = animate(pulse, {
      opacity: [0.5, 0.85], // was [0.2, 0.6]
      duration: 2800,
      ease: "inOutSine",
      alternate: true,
      loop: true,
      onUpdate: () => {
        canvas.style.opacity = `${pulse.opacity}`;
      },
    });

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", handleResize);

      animation.pause();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
        pointer-events-none
        fixed
        inset-0
        -z-10
        h-full
        w-full
        opacity-40
      "
    />
  );
}
