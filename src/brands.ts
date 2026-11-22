/**
 * Curated local brand catalog shipped with the server.
 *
 * The counts published in tool descriptions are derived from this object so a
 * catalogue edit cannot leave the advertised numbers stale.
 */
export const BRAND_CATALOG: Record<string, string[]> = {
  "productivity-saas": [
    "notion",
    "airtable",
    "cal",
    "superhuman",
    "miro",
    "intercom",
    "zapier",
    "linear.app",
  ],
  "developer-tools": [
    "vercel",
    "supabase",
    "cursor",
    "raycast",
    "warp",
    "posthog",
    "sentry",
    "hashicorp",
    "expo",
    "sanity",
    "mintlify",
    "framer",
    "figma",
    "webflow",
    "clickhouse",
    "mongodb",
    "ibm",
    "opencode.ai",
  ],
  "ai-ml": [
    "claude",
    "cohere",
    "mistral.ai",
    "x.ai",
    "minimax",
    "replicate",
    "runwayml",
    "elevenlabs",
    "together.ai",
    "ollama",
    "composio",
  ],
  fintech: [
    "stripe",
    "coinbase",
    "binance",
    "kraken",
    "revolut",
    "wise",
    "mastercard",
  ],
  "design-creative": [
    "figma",
    "framer",
    "clay",
    "lovable",
    "webflow",
    "linear.app",
  ],
  ecommerce: ["shopify", "nike", "starbucks"],
  "media-consumer": [
    "spotify",
    "discord",
    "slack",
    "pinterest",
    "theverge",
    "wired",
  ],
  "automotive-luxury": [
    "tesla",
    "spacex",
    "ferrari",
    "bugatti",
    "lamborghini",
    "bmw",
    "bmw-m",
    "renault",
    "vodafone",
  ],
  "legacy-archival": ["apple", "dell-1996", "hp", "nintendo-2001"],
};

export const BRAND_CATEGORY_NAMES = Object.keys(BRAND_CATALOG);

export interface BrandCatalogSummary {
  categories: number;
  listings: number;
  unique: number;
}

export function summarizeBrandCatalog(
  catalog: Record<string, string[]> = BRAND_CATALOG,
): BrandCatalogSummary {
  const brands = Object.values(catalog).flat();
  return {
    categories: Object.keys(catalog).length,
    listings: brands.length,
    unique: new Set(brands).size,
  };
}
