import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import LoadingOverlay from "./components/LoadingOverlay";
import Hero from "./components/Hero";
import CompetencyCanvas from "./components/CompetencyCanvas";
import ProcessSteps from "./components/ProcessSteps";
import Footer from "./components/Footer";

export default function App() {
  const navSlotRef = useRef<HTMLSpanElement>(null);

  const [revealed, setRevealed] = useState(false);
  const [docked, setDocked] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  // Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    let animationFrame: number;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      const element = document.querySelector(href);
      if (!element) return;

      event.preventDefault();

      lenis.scrollTo(element as HTMLElement, {
        duration: 1.5,
        offset: 0,
      });
    };

    const anchors =
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    anchors.forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick);
    });

    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick);
      });

      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  const handleDockingStart = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleIntroFinished = useCallback(() => {
    setDocked(true);
    setIntroFinished(true);
  }, []);

  return (
    <div
      className="
        min-h-screen
        bg-paper
        text-ink
        selection:bg-brand-100
        selection:text-brand-900
      "
    >
      <Navbar ref={navSlotRef} revealed={revealed} docked={docked} />

      <main>
        <Hero revealed={revealed} />

        <CompetencyCanvas />

        <ProcessSteps />
      </main>

      <Footer />

      {!introFinished && (
        <LoadingOverlay
          navSlotRef={navSlotRef}
          onDockingStart={handleDockingStart}
          onFinished={handleIntroFinished}
        />
      )}
    </div>
  );
}
