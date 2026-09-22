interface LogoMarkProps {
  iconPx: number;
  textPx: number;
  gapPx: number;
  /** "ink" reads on light backgrounds; "white" reads on dark footers */
  tone?: "ink" | "white";
  className?: string;
}

/**
 * Standard SkillStat brand lockup (icon + wordmark).
 * Rendered in the navbar slot once docked, and in the footer.
 */
export default function LogoMark({
  iconPx,
  textPx,
  gapPx,
  tone = "ink",
  className = "",
}: LogoMarkProps) {
  return (
    <span
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap: `${gapPx}px` }}
    >
      <img
        src="/logo-mark-indigo.png"
        alt="SkillStat"
        aria-hidden="true"
        width={iconPx}
        height={iconPx}
        style={{ width: `${iconPx}px`, height: `${iconPx}px` }}
        className="object-contain drop-shadow-sm"
        draggable={false}
      />
      <span
        className={`font-display font-bold tracking-tight ${
          tone === "white" ? "text-white" : "text-ink"
        }`}
        style={{ fontSize: `${textPx}px`, lineHeight: 1.05 }}
      >
        SkillStat
      </span>
    </span>
  );
}
