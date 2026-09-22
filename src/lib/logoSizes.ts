/**
 * Matched proportions for the SkillStat logo lockup.
 * HERO_LOCKUP is displayed centrally during the loading sequence.
 * NAV_LOCKUP is the final docked size inside the navbar.
 * Ratio is precisely 0.4 across icon, text, and gap, guaranteeing
 * mathematically flawless FLIP scaling with zero jump or distortion.
 */
export const HERO_LOCKUP = {
  icon: 90,
  text: 45,
  gap: 15,
} as const;

export const NAV_LOCKUP = {
  icon: 36,
  text: 18,
  gap: 6,
} as const;
