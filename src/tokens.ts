export interface TokenTheme {
  name: string;
  genre: "editorial" | "modern-minimal" | "atmospheric" | "playful" | "avant-garde";
  paper: { l: number; c: number; h: number };
  accent: { l: number; c: number; h: number };
  paperBand: "light" | "mid" | "dark";
  displayStyle: string;
  accentHue: string;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
}

export interface TokenSet {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  text: Record<string, string>;
  easings: Record<string, string>;
  durations: Record<string, string>;
  radii: Record<string, string>;
}

// Store paper and accent within sRGB at CSS's three-decimal chroma precision.
// Reduce chroma where needed to preserve each theme's lightness and hue.
const THEMES: TokenTheme[] = [
  {
    name: "Specimen",
    genre: "editorial",
    paper: { l: 98, c: 2, h: 85 },
    accent: { l: 45, c: 18.2, h: 25 },
    paperBand: "light",
    displayStyle: "high-contrast-serif",
    accentHue: "warm",
    fontDisplay: "'Instrument Serif', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Atelier",
    genre: "editorial",
    paper: { l: 96, c: 2.9, h: 70 },
    accent: { l: 50, c: 11.3, h: 160 },
    paperBand: "light",
    displayStyle: "high-contrast-serif",
    accentHue: "chromatic-other",
    fontDisplay: "'Playfair Display', Georgia, serif",
    fontBody: "'Source Sans Pro', system-ui, sans-serif",
    fontMono: "'Fira Code', monospace",
  },
  {
    name: "Newsprint",
    genre: "editorial",
    paper: { l: 94, c: 3.7, h: 60 },
    accent: { l: 55, c: 9.5, h: 210 },
    paperBand: "light",
    displayStyle: "roman-serif",
    accentHue: "cool",
    fontDisplay: "'PT Serif', Georgia, serif",
    fontBody: "'IBM Plex Serif', serif",
    fontMono: "'IBM Plex Mono', monospace",
  },
  {
    name: "Studio",
    genre: "editorial",
    paper: { l: 97, c: 2, h: 90 },
    accent: { l: 48, c: 15, h: 145 },
    paperBand: "light",
    displayStyle: "high-contrast-serif",
    accentHue: "chromatic-other",
    fontDisplay: "'Fraunces', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Manifesto",
    genre: "editorial",
    paper: { l: 96, c: 1, h: 0 },
    accent: { l: 42, c: 16.8, h: 30 },
    paperBand: "light",
    displayStyle: "geometric-sans",
    accentHue: "warm",
    fontDisplay: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Brutal",
    genre: "editorial",
    paper: { l: 95, c: 1, h: 0 },
    accent: { l: 35, c: 13.9, h: 15 },
    paperBand: "light",
    displayStyle: "display-heavy",
    accentHue: "warm",
    fontDisplay: "'Arial Black', 'Impact', sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'IBM Plex Mono', monospace",
  },
  {
    name: "Terminal",
    genre: "atmospheric",
    paper: { l: 8, c: 1.8, h: 240 },
    accent: { l: 65, c: 20.9, h: 140 },
    paperBand: "dark",
    displayStyle: "mono",
    accentHue: "chromatic-other",
    fontDisplay: "'JetBrains Mono', monospace",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Midnight",
    genre: "atmospheric",
    paper: { l: 6, c: 2.4, h: 260 },
    accent: { l: 55, c: 10.9, h: 230 },
    paperBand: "dark",
    displayStyle: "grotesk-sans",
    accentHue: "cool",
    fontDisplay: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Bloom",
    genre: "atmospheric",
    paper: { l: 12, c: 5, h: 320 },
    accent: { l: 60, c: 29.6, h: 310 },
    paperBand: "dark",
    displayStyle: "geometric-sans",
    accentHue: "chromatic-other",
    fontDisplay: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Aurora",
    genre: "atmospheric",
    paper: { l: 10, c: 2.2, h: 240 },
    accent: { l: 58, c: 10.5, h: 180 },
    paperBand: "dark",
    displayStyle: "grotesk-sans",
    accentHue: "cool",
    fontDisplay: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Cobalt",
    genre: "modern-minimal",
    paper: { l: 97, c: 1, h: 220 },
    accent: { l: 50, c: 11.4, h: 240 },
    paperBand: "light",
    displayStyle: "grotesk-sans",
    accentHue: "cool",
    fontDisplay: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Coral",
    genre: "modern-minimal",
    paper: { l: 98, c: 0.9, h: 30 },
    accent: { l: 52, c: 20.8, h: 20 },
    paperBand: "light",
    displayStyle: "geometric-sans",
    accentHue: "warm",
    fontDisplay: "'Inter', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Hum",
    genre: "playful",
    paper: { l: 97, c: 1.8, h: 60 },
    accent: { l: 55, c: 15.7, h: 45 },
    paperBand: "light",
    displayStyle: "rounded-sans",
    accentHue: "warm",
    fontDisplay: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontBody: "'Nunito', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Garden",
    genre: "editorial",
    paper: { l: 95, c: 4, h: 90 },
    accent: { l: 50, c: 13.4, h: 130 },
    paperBand: "light",
    displayStyle: "roman-serif",
    accentHue: "chromatic-other",
    fontDisplay: "'Lora', Georgia, serif",
    fontBody: "'Source Sans Pro', system-ui, sans-serif",
    fontMono: "'Fira Code', monospace",
  },
  {
    name: "Sport",
    genre: "editorial",
    paper: { l: 96, c: 1.9, h: 20 },
    accent: { l: 48, c: 19.1, h: 10 },
    paperBand: "light",
    displayStyle: "display-condensed",
    accentHue: "warm",
    fontDisplay: "'Bebas Neue', 'Anton', sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Carnival",
    genre: "playful",
    paper: { l: 96, c: 2.6, h: 340 },
    accent: { l: 50, c: 20.8, h: 350 },
    paperBand: "light",
    displayStyle: "display-heavy",
    accentHue: "warm",
    fontDisplay: "'Fredoka One', system-ui, sans-serif",
    fontBody: "'Nunito', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Obsidian Kinetic",
    genre: "avant-garde",
    paper: { l: 10, c: 2, h: 260 },
    accent: { l: 75, c: 23.5, h: 145 },
    paperBand: "dark",
    displayStyle: "display-serif",
    accentHue: "chromatic-other",
    fontDisplay: "'Syne', 'Clash Display', system-ui, sans-serif",
    fontBody: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Tokyo Neo-Brutal",
    genre: "avant-garde",
    paper: { l: 8, c: 1, h: 0 },
    accent: { l: 70, c: 31.3, h: 330 },
    paperBand: "dark",
    displayStyle: "display-heavy",
    accentHue: "warm",
    fontDisplay: "'Clash Display', 'Space Grotesk', system-ui, sans-serif",
    fontBody: "'JetBrains Mono', monospace",
    fontMono: "'JetBrains Mono', monospace",
  },
  {
    name: "Atelier Craft",
    genre: "avant-garde",
    paper: { l: 95, c: 3, h: 75 },
    accent: { l: 45, c: 15.7, h: 35 },
    paperBand: "light",
    displayStyle: "high-contrast-serif",
    accentHue: "warm",
    fontDisplay: "'Editorial New', 'Instrument Serif', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'Fira Code', monospace",
  },
];

/** Ottosson's OKLCH to linear sRGB conversion. */
function oklchToLinearSrgb(l: number, c: number, h: number): [number, number, number] {
  const L = l / 100;
  const C = c / 100;
  const H = (h * Math.PI) / 180;
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;
  return [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ];
}

function inSrgbGamut(rgb: [number, number, number]): boolean {
  const epsilon = 1e-9;
  return rgb.every((channel) => channel >= -epsilon && channel <= 1 + epsilon);
}

/** Search in 0.001 CSS chroma steps so formatting cannot push a colour out of gamut. */
function clampChromaToGamut(l: number, c: number, h: number): number {
  const requested = Number((Math.max(0, c) / 100).toFixed(3));
  let high = Math.round(requested * 1000);
  if (inSrgbGamut(oklchToLinearSrgb(l, high / 10, h))) return high / 10;

  let low = 0;
  for (let i = 0; i < 24 && high - low > 1; i++) {
    const mid = Math.floor((low + high) / 2);
    if (inSrgbGamut(oklchToLinearSrgb(l, mid / 10, h))) low = mid;
    else high = mid;
  }
  return low / 10;
}

function oklchStr(l: number, c: number, h: number): string {
  return `oklch(${l}% ${(c / 100).toFixed(3)} ${h})`;
}

function derivedOklch(l: number, c: number, h: number): string {
  // Derived offsets can exceed the CSS OKLCH lightness range for custom themes.
  const lightness = Math.min(100, Math.max(0, l));
  return oklchStr(lightness, clampChromaToGamut(lightness, c, h), h);
}

function computePaperBand(l: number): "light" | "mid" | "dark" {
  if (l > 85) return "light";
  if (l > 30) return "mid";
  return "dark";
}

function computeAccentHue(h: number): string {
  if (h >= 10 && h < 60) return "warm";
  if (h >= 200 && h < 300) return "cool";
  if ((h >= 60 && h < 200) || (h >= 300 && h < 340)) return "chromatic-other";
  return "warm";
}

export function getTheme(name: string): TokenTheme | undefined {
  return THEMES.find((t) => t.name.toLowerCase() === name.toLowerCase());
}

export function listThemes(genre?: string): TokenTheme[] {
  if (genre) return THEMES.filter((t) => t.genre === genre);
  return THEMES;
}

export function listGenres(): string[] {
  return ["editorial", "modern-minimal", "atmospheric", "playful", "avant-garde"];
}

export function detectGenre(brief: string): string {
  const lower = brief.toLowerCase();
  if (/awwwards|award|sota|avant-garde|hyper.?craft|creative agency|interactive experience|luxury editorial|portfolio/.test(lower)) return "avant-garde";
  if (
    /ai tool|generative|music|video|voice|late.?night|dark mode|atmospheric|immersive/.test(
      lower,
    )
  )
    return "atmospheric";
  if (/saas|enterprise|api|platform|developer tool|infra|b2b/.test(lower))
    return "modern-minimal";
  if (
    /fun|consumer|casual|friendly|onboarding|family|community|playful/.test(
      lower,
    )
  )
    return "playful";
  return "editorial";
}

export function pickTheme(
  genre: string,
  lastTheme?: string,
  lastAccent?: string,
): TokenTheme {
  const candidates = THEMES.filter((t) => t.genre === genre);
  if (candidates.length === 0) return THEMES[0];

  if (lastTheme) {
    const filtered = candidates.filter((t) => {
      if (t.name === lastTheme) return false;
      if (lastAccent && t.accentHue === lastAccent) return false;
      return true;
    });
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function generateThemeTokens(theme: TokenTheme): TokenSet {
  const scale = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
  const textScale = {
    display: "clamp(2.5rem, 6vw, 4.5rem)",
    "display-s": "clamp(2rem, 4vw, 3rem)",
    "2xl": "1.75rem",
    xl: "1.25rem",
    lg: "1.125rem",
    base: "1rem",
    sm: "0.875rem",
    xs: "0.75rem",
  };

  const paperLight =
    theme.paper.l > 50
      ? Math.max(theme.paper.l - 55, 5)
      : Math.min(theme.paper.l + 55, 95);
  const paperLighter =
    theme.paper.l > 50
      ? Math.max(theme.paper.l - 25, 10)
      : Math.min(theme.paper.l + 25, 90);
  const paperDarker =
    theme.paper.l > 50
      ? Math.max(theme.paper.l - 10, 30)
      : Math.min(theme.paper.l + 10, 70);

  return {
    colors: {
      "--color-paper": oklchStr(theme.paper.l, theme.paper.c, theme.paper.h),
      "--color-paper-2": derivedOklch(
        paperLighter,
        theme.paper.c + 2,
        theme.paper.h,
      ),
      "--color-paper-3": derivedOklch(
        paperDarker,
        theme.paper.c + 1,
        theme.paper.h,
      ),
      "--color-text": derivedOklch(paperLight, theme.paper.c + 3, theme.paper.h),
      "--color-text-2": derivedOklch(
        paperLight + 20,
        theme.paper.c + 5,
        theme.paper.h,
      ),
      "--color-accent": oklchStr(
        theme.accent.l,
        theme.accent.c,
        theme.accent.h,
      ),
      "--color-accent-2": derivedOklch(
        theme.accent.l + 10,
        theme.accent.c - 5,
        theme.accent.h,
      ),
      "--color-border": derivedOklch(paperDarker, theme.paper.c, theme.paper.h),
      "--color-focus": derivedOklch(theme.accent.l, theme.accent.c + 10, theme.accent.h),
    },
    fonts: {
      "--font-display": theme.fontDisplay,
      "--font-body": theme.fontBody,
      "--font-mono": theme.fontMono,
    },
    spacing: Object.fromEntries(
      scale.map((s, i) => [
        `--space-${["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"][i] ?? i}`,
        `${s}px`,
      ]),
    ),
    text: textScale,
    easings: {
      "--ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      "--ease-in": "cubic-bezier(0.4, 0, 0.68, 0.06)",
      "--ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
    },
    durations: {
      "--dur-fast": "150ms",
      "--dur-base": "250ms",
      "--dur-slow": "400ms",
    },
    radii: {
      "--radius-sm": "4px",
      "--radius-md": "8px",
      "--radius-lg": "16px",
    },
  };
}

function tokensToCSS(tokens: TokenSet, theme: TokenTheme): string {
  const lines: string[] = [];
  lines.push(`/* the-designer · theme: ${theme.name} · genre: ${theme.genre}`);
  lines.push(
    ` * paper-band: ${theme.paperBand} · display-style: ${theme.displayStyle} · accent-hue: ${theme.accentHue}`,
  );
  lines.push(
    ` * paper: ${oklchStr(theme.paper.l, theme.paper.c, theme.paper.h)} · accent: ${oklchStr(theme.accent.l, theme.accent.c, theme.accent.h)}`,
  );
  lines.push(` */\n`);
  lines.push(":root {");

  for (const [key, val] of Object.entries(tokens.colors)) {
    lines.push(`  ${key}: ${val};`);
  }
  lines.push("");
  for (const [key, val] of Object.entries(tokens.fonts)) {
    lines.push(`  ${key}: ${val};`);
  }
  lines.push("");
  for (const [key, val] of Object.entries(tokens.spacing)) {
    lines.push(`  ${key}: ${val};`);
  }
  lines.push("");
  for (const [key, val] of Object.entries(tokens.text)) {
    lines.push(`  --text-${key}: ${val};`);
  }
  lines.push("");
  for (const [key, val] of Object.entries(tokens.easings)) {
    lines.push(`  ${key}: ${val};`);
  }
  lines.push("");
  for (const [key, val] of Object.entries(tokens.durations)) {
    lines.push(`  ${key}: ${val};`);
  }
  lines.push("");
  for (const [key, val] of Object.entries(tokens.radii)) {
    lines.push(`  ${key}: ${val};`);
  }

  lines.push("}\n");
  return lines.join("\n");
}

/** Derive a dark-mode (or light-mode) counterpart token set from a given theme.
 *  Only color tokens are modified; fonts, spacing, text sizes, easings,
 *  durations, and radii are copied as-is from the light token set. */
export function deriveDarkTokens(theme: TokenTheme): TokenSet {
  return deriveCounterpartTokens(theme, generateThemeTokens(theme));
}

function deriveCounterpartTokens(theme: TokenTheme, base: TokenSet): TokenSet {
  const { paper, accent } = theme;
  let darkColors: Record<string, string>;

  if (theme.paperBand !== "dark") {
    // Light → derive dark
    const darkPaperL = 8;
    const darkPaperC = Math.max(paper.c - 1, 0);
    const darkPaperH = paper.h;
    const darkAccentL = Math.min(accent.l + 10, 95);
    const darkTextL = 95;
    const darkTextL2 = 80;
    const darkPaper2L = 12;
    const darkPaper3L = 18;
    const darkBorderL = 25;

    darkColors = {
      "--color-paper": derivedOklch(darkPaperL, darkPaperC, darkPaperH),
      "--color-paper-2": derivedOklch(darkPaper2L, darkPaperC + 2, darkPaperH),
      "--color-paper-3": derivedOklch(darkPaper3L, darkPaperC + 1, darkPaperH),
      "--color-text": derivedOklch(darkTextL, darkPaperC + 3, darkPaperH),
      "--color-text-2": derivedOklch(darkTextL2, darkPaperC + 5, darkPaperH),
      "--color-accent": derivedOklch(darkAccentL, accent.c, accent.h),
      "--color-accent-2": derivedOklch(
        Math.min(darkAccentL + 10, 99),
        Math.max(accent.c - 5, 0),
        accent.h,
      ),
      "--color-border": derivedOklch(darkBorderL, darkPaperC, darkPaperH),
      "--color-focus": derivedOklch(darkAccentL, accent.c + 10, accent.h),
    };
  } else {
    // Dark → derive light
    const lightPaperL = 97;
    const lightPaperC = paper.c;
    const lightPaperH = paper.h;
    const lightTextL = 15;
    const lightTextL2 = 35;
    const lightPaper2L = Math.min(lightPaperL - 6, 97);
    const lightPaper3L = Math.min(lightPaperL - 12, 97);
    const lightBorderL = 85;

    darkColors = {
      "--color-paper": derivedOklch(lightPaperL, lightPaperC, lightPaperH),
      "--color-paper-2": derivedOklch(lightPaper2L, lightPaperC + 2, lightPaperH),
      "--color-paper-3": derivedOklch(lightPaper3L, lightPaperC + 1, lightPaperH),
      "--color-text": derivedOklch(lightTextL, lightPaperC + 3, lightPaperH),
      "--color-text-2": derivedOklch(lightTextL2, lightPaperC + 5, lightPaperH),
      "--color-accent": base.colors["--color-accent"],
      "--color-accent-2": derivedOklch(
        Math.min(accent.l + 10, 99),
        Math.max(accent.c - 5, 0),
        accent.h,
      ),
      "--color-border": derivedOklch(lightBorderL, lightPaperC, lightPaperH),
      "--color-focus": base.colors["--color-focus"],
    };
  }

  return {
    colors: darkColors,
    fonts: { ...base.fonts },
    spacing: { ...base.spacing },
    text: { ...base.text },
    easings: { ...base.easings },
    durations: { ...base.durations },
    radii: { ...base.radii },
  };
}

/** Returns just the color override lines (no selector wrapper). */
function colorOverrideLines(darkTokens: TokenSet): string[] {
  return Object.entries(darkTokens.colors).map(
    ([key, val]) => `    ${key}: ${val};`,
  );
}

/** Returns the @media prefers-color-scheme block + [data-theme="dark"] block.
 *  Standalone helper — callers can use this independently of the full CSS. */
export function darkTokensToCSS(
  darkTokens: TokenSet,
  theme: TokenTheme,
): string {
  const overrides = colorOverrideLines(darkTokens).join("\n");
  const label = theme.paperBand !== "dark" ? "dark" : "light";
  const mediaQuery =
    theme.paperBand !== "dark"
      ? "(prefers-color-scheme: dark)"
      : "(prefers-color-scheme: light)";
  const lines: string[] = [];
  lines.push(`@media ${mediaQuery} {`);
  lines.push(`  :root {`);
  lines.push(overrides);
  lines.push(`  }`);
  lines.push(`}\n`);
  lines.push(`[data-theme="${label}"] {`);
  lines.push(overrides);
  lines.push(`}\n`);
  return lines.join("\n");
}

/** Full CSS: light :root block + dark @media + [data-theme] override. */
export function tokensToFullCSS(
  tokens: TokenSet,
  darkTokens: TokenSet,
  theme: TokenTheme,
): string {
  const light = tokensToCSS(tokens, theme);
  const dark = darkTokensToCSS(darkTokens, theme);
  return light + dark;
}

export interface GenerateTokensResult {
  theme: TokenTheme;
  tokens: TokenSet;
  css: string; // light :root block only (backwards compat)
  full_css: string; // light :root + dark @media + [data-theme] block
  dark_css: string; // just the @media + [data-theme] block
  dark_tokens: TokenSet; // derived dark-mode token values
  tailwindV4Theme: string;
}

export function generateTokens(
  themeName?: string,
  genre?: string,
  lastTheme?: string,
  lastAccent?: string,
): GenerateTokensResult {
  let theme: TokenTheme;

  if (themeName) {
    theme = getTheme(themeName) ?? THEMES[0];
  } else if (genre) {
    theme = pickTheme(genre, lastTheme, lastAccent);
  } else {
    theme = THEMES[0];
  }

  const tokens = generateThemeTokens(theme);
  const css = tokensToCSS(tokens, theme);

  // Generate Tailwind v4 @theme block
  const twLines: string[] = [];
  twLines.push(`@theme {`);
  for (const [key, val] of Object.entries(tokens.colors)) {
    const twName = key.replace("--color-", "--color-");
    twLines.push(`  ${twName}: ${val};`);
  }
  twLines.push("");
  for (const [key, val] of Object.entries(tokens.fonts)) {
    twLines.push(`  ${key}: ${val};`);
  }
  twLines.push("");
  for (const [key, val] of Object.entries(tokens.radii)) {
    twLines.push(`  ${key}: ${val};`);
  }
  twLines.push("");
  for (const [key, val] of Object.entries(tokens.easings)) {
    twLines.push(`  ${key}: ${val};`);
  }
  twLines.push("}");

  const dark_tokens = deriveCounterpartTokens(theme, tokens);
  const dark_css = darkTokensToCSS(dark_tokens, theme);
  const full_css = css + dark_css;

  return {
    theme,
    tokens,
    css,
    full_css,
    dark_css,
    dark_tokens,
    tailwindV4Theme: twLines.join("\n"),
  };
}

export function buildCustomTokens(
  paper: { l: number; c: number; h: number },
  accent: { l: number; c: number; h: number },
  fontDisplay: string,
  fontBody: string,
  fontMono = "'JetBrains Mono', monospace",
): GenerateTokensResult {
  const theme: TokenTheme = {
    name: "Custom",
    genre: "editorial",
    paper,
    accent,
    paperBand: computePaperBand(paper.l),
    displayStyle: "geometric-sans",
    accentHue: computeAccentHue(accent.h),
    fontDisplay,
    fontBody,
    fontMono,
  };

  const tokens = generateThemeTokens(theme);
  const css = tokensToCSS(tokens, theme);

  const twLines: string[] = [];
  twLines.push(`@theme {`);
  for (const [key, val] of Object.entries(tokens.colors)) {
    twLines.push(`  ${key}: ${val};`);
  }
  for (const [key, val] of Object.entries(tokens.fonts)) {
    twLines.push(`  ${key}: ${val};`);
  }
  twLines.push("}");

  const dark_tokens = deriveCounterpartTokens(theme, tokens);
  const dark_css = darkTokensToCSS(dark_tokens, theme);
  const full_css = css + dark_css;

  return {
    theme,
    tokens,
    css,
    full_css,
    dark_css,
    dark_tokens,
    tailwindV4Theme: twLines.join("\n"),
  };
}
