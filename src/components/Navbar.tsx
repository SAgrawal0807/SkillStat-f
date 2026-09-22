import { forwardRef } from "react";
import LogoMark from "./LogoMark";
import { NAV_LOCKUP } from "../lib/logoSizes";
import { RotateCcw, ArrowRight } from "lucide-react";

interface NavbarProps {
  /** True once docking begins — fades in navbar chrome, navigation links, and background */
  revealed: boolean;
  /** True once the flight has landed — displays the docked logo mark */
  docked: boolean;
  /** Callback to replay the intro animation */
  onReplayIntro?: () => void;
}

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Competency AI", href: "#competency-ai" },
  { label: "Skill Radar", href: "#skill-radar" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Enterprise", href: "#enterprise" },
];

/**
 * Navbar component.
 * The ref is forwarded to the brand logo slot so the loading
 * overlay measures its exact layout target coordinates for the FLIP flight.
 */
const Navbar = forwardRef<HTMLSpanElement, NavbarProps>(function Navbar(
  { revealed, docked, onReplayIntro },
  logoSlotRef,
) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        revealed
          ? "border-b border-line/80 bg-paper/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          : "border-b border-transparent bg-transparent pointer-events-none"
      }`}
    >
      <nav className="container-content flex h-[72px] items-center justify-between">
        {/* Brand logo destination slot.
            Must be in document layout so getBoundingClientRect() is always valid,
            but stays invisible until the flying clone lands. */}
        <a
          href="#"
          className="group inline-flex items-center pointer-events-auto"
        >
          <span
            ref={logoSlotRef}
            className="inline-flex transition-opacity duration-150"
            style={{ opacity: docked ? 1 : 0 }}
          >
            <LogoMark
              iconPx={NAV_LOCKUP.icon}
              textPx={NAV_LOCKUP.text}
              gapPx={NAV_LOCKUP.gap}
            />
          </span>
        </a>

        {/* Navigation links */}
        <div
          className={`hidden items-center gap-8 transition-all duration-500 md:flex ${
            revealed
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-2 opacity-0"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14.5px] font-medium text-ink-soft transition-colors hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right action CTAs */}
        <div
          className={`flex items-center gap-3 transition-all duration-500 ${
            revealed
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-2 opacity-0"
          }`}
        >
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              title="Replay the Anime.js flight animation"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-xs transition-all hover:border-brand-500/50 hover:bg-brand-50 hover:text-brand-600 active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Replay Intro</span>
            </button>
          )}

          <a
            href="#get-started"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4.5 py-2 text-[13.5px] font-semibold text-paper shadow-sm transition-all hover:bg-brand-600 hover:shadow-md hover:shadow-brand-600/20 active:scale-95"
          >
            <span>Get started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </nav>
    </header>
  );
});

export default Navbar;
