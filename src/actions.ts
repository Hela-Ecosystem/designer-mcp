/** Action/engine enums shared by tool schemas and dispatch. */
export const PALETTE_ACTIONS = ["fetch", "convert", "variants"] as const;
export type PaletteAction = (typeof PALETTE_ACTIONS)[number];

export const DESIGN_AUDIT_ACTIONS = [
  "accessibility",
  "slop",
  "critique",
  "preflight",
] as const;
export type DesignAuditAction = (typeof DESIGN_AUDIT_ACTIONS)[number];

export const MOTION_ENGINES = ["animejs", "motion.dev"] as const;
export type MotionEngine = (typeof MOTION_ENGINES)[number];
