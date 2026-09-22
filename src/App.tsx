import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import LoadingOverlay from "./components/LoadingOverlay";
import Hero from "./components/Hero";
import CompetencyCanvas from "./components/CompetencyCanvas";
import ProcessSteps from "./components/ProcessSteps";
import Footer from "./components/Footer";

function getInitialReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const navSlotRef = useRef<HTMLSpanElement>(null);

  // "revealed" flips when the logo flight takes off — navbar background and
  // hero content reveal in graceful harmony.
  // "docked" flips only when the flight has landed — seamlessly handing off
  // to the permanent navbar brand logo with ZERO duplicate or flicker.
  // "introFinished" flips once docked to safely unmount the overlay.
  const [revealed, setRevealed] = useState(getInitialReducedMotion);
  const [docked, setDocked] = useState(getInitialReducedMotion);
  const [introFinished, setIntroFinished] = useState(getInitialReducedMotion);
  const [replayKey, setReplayKey] = useState(0);

  // Synchronize if user changes OS accessibility preferences during session
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setRevealed(true);
        setDocked(true);
        setIntroFinished(true);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setRevealed(false);
    setDocked(false);
    setIntroFinished(false);
    setReplayKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-brand-100 selection:text-brand-900">
      <Navbar
        ref={navSlotRef}
        revealed={revealed}
        docked={docked}
        onReplayIntro={handleReplayIntro}
      />

      <main>
        <Hero revealed={revealed} />
        <CompetencyCanvas />
        <ProcessSteps />
      </main>

      <Footer />

      {!introFinished && (
        <LoadingOverlay
          key={replayKey}
          navSlotRef={navSlotRef}
          onDockingStart={() => setRevealed(true)}
          onFinished={() => {
            setDocked(true);
            setIntroFinished(true);
          }}
        />
      )}
    </div>
  );
}
