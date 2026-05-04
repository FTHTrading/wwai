/**
 * src/lib/crm.ts
 * TROPTIONS Sales OS — CRM integration abstraction
 *
 * RULES:
 * - Server-only. Never import in client components.
 * - No real CRM requests are sent unless provider keys are configured.
 * - All providers fall back to manual/CSV mode when unconfigured.
 * - Never logs or returns secret values.
 */

import { zohoCRMReadiness, hubspotReadiness, airtableReadiness, type ProviderReadiness } from "./env";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CRMProvider = "zoho" | "hubspot" | "airtable" | "manual";

export interface CRMContact {
  id?:          string;
  name:         string;
  email?:       string;
  phone?:       string;
  company?:     string;
  leadType?:    string;
  leadStatus?:  string;
  leadSource?:  string;
  estimatedValue?: number;
  notes?:       string;
  createdAt?:   string;
}

export interface CRMPushResult {
  ok:        boolean;
  provider:  CRMProvider;
  externalId: string | null;
  error:     string | null;
  mode:      "live" | "manual" | "dry-run";
}

// ─────────────────────────────────────────────
// Status helpers
// ─────────────────────────────────────────────

export function getCRMProviderStatus(): {
  zoho:     ProviderReadiness;
  hubspot:  ProviderReadiness;
  airtable: ProviderReadiness;
  manual:   { name: string; status: "configured"; configured: true };
} {
  return {
    zoho:     zohoCRMReadiness(),
    hubspot:  hubspotReadiness(),
    airtable: airtableReadiness(),
    manual:   { name: "Manual CSV Export", status: "configured", configured: true },
  };
}

export function getActiveCRMProvider(): CRMProvider {
  if (zohoCRMReadiness().configured)    return "zoho";
  if (hubspotReadiness().configured)    return "hubspot";
  if (airtableReadiness().configured)   return "airtable";
  return "manual";
}

// ─────────────────────────────────────────────
// Push a contact/lead to the active CRM
// ─────────────────────────────────────────────

export async function pushLeadToCRM(contact: CRMContact): Promise<CRMPushResult> {
  const provider = getActiveCRMProvider();

  switch (provider) {
    case "zoho":     return pushToZoho(contact);
    case "hubspot":  return pushToHubSpot(contact);
    case "airtable": return pushToAirtable(contact);
    default:
      return {
        ok:         true,
        provider:   "manual",
        externalId: null,
        error:      null,
        mode:       "manual",
      };
  }
}

// ─────────────────────────────────────────────
// Zoho CRM
// ─────────────────────────────────────────────

async function pushToZoho(contact: CRMContact): Promise<CRMPushResult> {
  const r = zohoCRMReadiness();
  if (!r.configured) {
    return notConfiguredResult("zoho", r.missing);
  }

  // Real Zoho integration:
  // POST https://www.zohoapis.com/crm/v6/Leads
  // Refresh token via: POST https://accounts.zoho.com/oauth/v2/token
  // Implement when ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN are set.
  void contact; // use contact fields in the implementation above
  return {
    ok:         false,
    provider:   "zoho",
    externalId: null,
    error:      "Zoho keys found. Implement pushToZoho() in src/lib/crm.ts to send real leads.",
    mode:       "dry-run",
  };
}

// ─────────────────────────────────────────────
// HubSpot
// ─────────────────────────────────────────────

async function pushToHubSpot(contact: CRMContact): Promise<CRMPushResult> {
  const r = hubspotReadiness();
  if (!r.configured) {
    return notConfiguredResult("hubspot", r.missing);
  }

  // Real HubSpot integration:
  // POST https://api.hubapi.com/crm/v3/objects/contacts
  // Bearer: HUBSPOT_ACCESS_TOKEN
  // Implement when HUBSPOT_ACCESS_TOKEN is set.
  void contact; // use contact fields in the implementation above
  return {
    ok:         false,
    provider:   "hubspot",
    externalId: null,
    error:      "HubSpot key found. Implement pushToHubSpot() in src/lib/crm.ts to send real contacts.",
    mode:       "dry-run",
  };
}

// ─────────────────────────────────────────────
// Airtable
// ─────────────────────────────────────────────

async function pushToAirtable(contact: CRMContact): Promise<CRMPushResult> {
  const r = airtableReadiness();
  if (!r.configured) {
    return notConfiguredResult("airtable", r.missing);
  }

  // Real Airtable integration:
  // POST https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/Leads
  // Bearer: AIRTABLE_API_KEY
  // Implement when AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set.
  void contact; // use contact fields in the implementation above
  return {
    ok:         false,
    provider:   "airtable",
    externalId: null,
    error:      "Airtable keys found. Implement pushToAirtable() in src/lib/crm.ts to send real records.",
    mode:       "dry-run",
  };
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function notConfiguredResult(provider: CRMProvider, missing: string[]): CRMPushResult {
  return {
    ok:         false,
    provider,
    externalId: null,
    error:      `${provider} not configured. Missing env vars: ${missing.join(", ")}`,
    mode:       "manual",
  };
}

// ─────────────────────────────────────────────
// CSV export (manual CRM fallback)
// ─────────────────────────────────────────────

export interface LeadCSVRow {
  id:             string;
  name:           string;
  email:          string;
  company:        string;
  phone:          string;
  type:           string;
  status:         string;
  source:         string;
  estimatedValue: string;
  createdAt:      string;
}

export function buildLeadCSVRow(lead: {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  type: string;
  status: string;
  source: string;
  estimatedValue: number | null;
  createdAt: Date | string;
}): LeadCSVRow {
  return {
    id:             lead.id,
    name:           lead.name,
    email:          lead.email          ?? "",
    company:        lead.company        ?? "",
    phone:          lead.phone          ?? "",
    type:           lead.type,
    status:         lead.status,
    source:         lead.source,
    estimatedValue: lead.estimatedValue != null ? lead.estimatedValue.toString() : "",
    createdAt:      new Date(lead.createdAt).toISOString(),
  };
}

export function leadsToCSV(leads: LeadCSVRow[]): string {
  const headers: (keyof LeadCSVRow)[] = [
    "id", "name", "email", "company", "phone",
    "type", "status", "source", "estimatedValue", "createdAt",
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = [
    headers.join(","),
    ...leads.map(l => headers.map(h => escape(l[h])).join(",")),
  ];
  return rows.join("\n");
}
