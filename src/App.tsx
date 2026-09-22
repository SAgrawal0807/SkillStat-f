// App.tsx
import { useCallback, useRef, useState } from "react";

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

  // Stable references so LoadingOverlay's effects never see a
  // "changed" prop on unrelated App re-renders.
  const handleDockingStart = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleIntroFinished = useCallback(() => {
    setDocked(true);
    setIntroFinished(true);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-brand-100 selection:text-brand-900">
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
