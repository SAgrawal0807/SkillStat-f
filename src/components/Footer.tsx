import LogoMark from "./LogoMark";

export default function Footer() {
  return (
    <footer className="border-t border-line/80 bg-white">
      <div className="container-content py-14">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <LogoMark iconPx={30} textPx={18} gapPx={8} tone="ink" />
            <p className="text-xs text-ink-faint">
              Autonomous skill mapping and competency gap intelligence for
              modern tech orgs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] text-ink-soft">
            <a
              href="#platform"
              className="transition-colors hover:text-brand-600"
            >
              Platform
            </a>
            <a
              href="#competency-ai"
              className="transition-colors hover:text-brand-600"
            >
              Competency AI
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-brand-600"
            >
              Methodology
            </a>
            <a
              href="#privacy"
              className="transition-colors hover:text-brand-600"
            >
              Privacy & Security
            </a>
            <span className="text-ink-faint">
              © {new Date().getFullYear()} SkillStat Inc. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
