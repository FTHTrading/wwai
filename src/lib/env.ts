/**
 * src/lib/env.ts
 * TROPTIONS Sales OS — server-side environment validation
 *
 * RULES:
 * - This file is server-only (no "use client"). Never import it in client components.
 * - All checks are read-only. No secrets are returned — only boolean readiness flags and safe display names.
 * - Presence of a non-empty string is the only check; we never validate key format here.
 */

// ─────────────────────────────────────────────
// Raw helpers
// ─────────────────────────────────────────────

function has(key: string): boolean {
  const v = process.env[key];
  return typeof v === "string" && v.trim().length > 0;
}

// ─────────────────────────────────────────────
// Core
// ─────────────────────────────────────────────

export const env = {
  // Database
  databaseUrl:     process.env.DATABASE_URL    ?? "file:./prisma/dev.db",
  isDatabaseLocal: !(process.env.DATABASE_URL ?? "").startsWith("libsql://"),

  // Auth
  nextAuthUrl:    process.env.NEXTAUTH_URL    ?? "",
  hasNextAuthSecret: has("NEXTAUTH_SECRET"),
  hasNextAuthUrl:    has("NEXTAUTH_URL"),

  // Node
  nodeEnv: (process.env.NODE_ENV ?? "development") as "development" | "production" | "test",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// ─────────────────────────────────────────────
// Provider readiness
// ─────────────────────────────────────────────

export type ProviderStatus = "configured" | "unconfigured" | "partial";

export interface ProviderReadiness {
  name:       string;
  status:     ProviderStatus;
  configured: boolean;
  envKeys:    string[];          // env key names shown in UI (never values)
  missing:    string[];          // which keys are missing
  docNote:    string;
}

// Payment providers
export function squareReadiness(): ProviderReadiness {
  const keys = ["SQUARE_ACCESS_TOKEN"];
  const missing = keys.filter(k => !has(k));
  return {
    name:       "Square",
    status:     missing.length === 0 ? "configured" : "unconfigured",
    configured: missing.length === 0,
    envKeys:    keys,
    missing,
    docNote:    "Square Developer Dashboard → Sandbox / Production Access Token",
  };
}

export function stripeReadiness(): ProviderReadiness {
  const required = ["STRIPE_SECRET_KEY"];
  const optional = ["STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"];
  const missingRequired = required.filter(k => !has(k));
  const missingOptional = optional.filter(k => !has(k));
  const allKeys = [...required, ...optional];
  const status: ProviderStatus =
    missingRequired.length === 0 && missingOptional.length === 0 ? "configured"
    : missingRequired.length === 0 ? "partial"
    : "unconfigured";
  return {
    name:       "Stripe",
    status,
    configured: missingRequired.length === 0,
    envKeys:    allKeys,
    missing:    [...missingRequired, ...missingOptional],
    docNote:    "Stripe Dashboard → Developers → API Keys",
  };
}

// Map provider
export function mapReadiness(): ProviderReadiness {
  // OpenFreeMap works with no key. Optional: custom tile URL.
  const keys = ["MAP_TILE_URL"];
  const missing = keys.filter(k => !has(k));
  return {
    name:       "Map Tiles",
    status:     "configured",           // OpenFreeMap always works
    configured: true,
    envKeys:    keys,
    missing,
    docNote:    "Optional. Set MAP_TILE_URL to override the default OpenFreeMap tile source.",
  };
}

// CRM providers
export function zohoCRMReadiness(): ProviderReadiness {
  const keys = ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"];
  const missing = keys.filter(k => !has(k));
  return {
    name:       "Zoho CRM",
    status:     missing.length === 0 ? "configured" : "unconfigured",
    configured: missing.length === 0,
    envKeys:    keys,
    missing,
    docNote:    "Zoho API Console → Server-based Apps → OAuth2 credentials",
  };
}

export function hubspotReadiness(): ProviderReadiness {
  const keys = ["HUBSPOT_ACCESS_TOKEN"];
  const missing = keys.filter(k => !has(k));
  return {
    name:       "HubSpot",
    status:     missing.length === 0 ? "configured" : "unconfigured",
    configured: missing.length === 0,
    envKeys:    keys,
    missing,
    docNote:    "HubSpot → Settings → Integrations → Private Apps → Access Token",
  };
}

export function airtableReadiness(): ProviderReadiness {
  const keys = ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"];
  const missing = keys.filter(k => !has(k));
  return {
    name:       "Airtable",
    status:     missing.length === 0 ? "configured" : "unconfigured",
    configured: missing.length === 0,
    envKeys:    keys,
    missing,
    docNote:    "Airtable → Account → API → Personal Access Token + Base ID from the base URL",
  };
}

// Email
export function emailReadiness(): ProviderReadiness {
  const keys = ["SENDGRID_API_KEY"];
  const missing = keys.filter(k => !has(k));
  return {
    name:       "SendGrid Email",
    status:     missing.length === 0 ? "configured" : "unconfigured",
    configured: missing.length === 0,
    envKeys:    keys,
    missing,
    docNote:    "SendGrid Dashboard → Settings → API Keys → Create API Key (Mail Send permission)",
  };
}

// Aggregate for the settings/integrations page
export interface SystemReadiness {
  database:    { mode: "local" | "remote"; url: string };
  auth:        { secretOk: boolean; urlOk: boolean };
  payments:    { square: ProviderReadiness; stripe: ProviderReadiness };
  map:         ProviderReadiness;
  crm:         { zoho: ProviderReadiness; hubspot: ProviderReadiness; airtable: ProviderReadiness };
  email:       ProviderReadiness;
  environment: "development" | "production" | "test";
}

export function getSystemReadiness(): SystemReadiness {
  return {
    database: {
      mode: env.isDatabaseLocal ? "local" : "remote",
      url:  env.isDatabaseLocal ? "SQLite (local file)" : "LibSQL / Turso (remote)",
    },
    auth: {
      secretOk: env.hasNextAuthSecret,
      urlOk:    env.hasNextAuthUrl,
    },
    payments: {
      square: squareReadiness(),
      stripe: stripeReadiness(),
    },
    map:   mapReadiness(),
    crm:   {
      zoho:     zohoCRMReadiness(),
      hubspot:  hubspotReadiness(),
      airtable: airtableReadiness(),
    },
    email:       emailReadiness(),
    environment: env.nodeEnv,
  };
}
