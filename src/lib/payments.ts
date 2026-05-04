/**
 * src/lib/payments.ts
 * TROPTIONS Sales OS — payment provider abstraction
 *
 * RULES:
 * - Server-only. Never import in client components.
 * - Never returns secret values, only status flags and safe metadata.
 * - No real payment requests are made unless provider keys are present.
 * - All payment link generation is gated on provider readiness.
 */

import { squareReadiness, stripeReadiness, type ProviderReadiness } from "./env";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type PaymentProvider = "square" | "stripe" | "manual";

export interface PaymentLinkResult {
  ok:        boolean;
  provider:  PaymentProvider;
  url:       string | null;
  error:     string | null;
}

export interface ManualPaymentRecord {
  invoiceId:     string;
  invoiceNumber: string;
  amount:        number;
  currency:      string;
  method:        "check" | "wire" | "ach" | "cash" | "troptions" | "other";
  reference:     string;
  paidAt:        string; // ISO date string
  notes:         string;
}

// ─────────────────────────────────────────────
// Status helpers (safe — no secrets)
// ─────────────────────────────────────────────

export function getPaymentProviderStatus(): {
  square:  ProviderReadiness;
  stripe:  ProviderReadiness;
  manual:  { name: string; status: "configured"; configured: true };
} {
  return {
    square: squareReadiness(),
    stripe: stripeReadiness(),
    manual: { name: "Manual", status: "configured", configured: true },
  };
}

export function isSquareConfigured(): boolean {
  return squareReadiness().configured;
}

export function isStripeConfigured(): boolean {
  return stripeReadiness().configured;
}

// ─────────────────────────────────────────────
// Payment link generation (server-side)
// ─────────────────────────────────────────────

/**
 * Generate a Square payment link for an invoice.
 * Returns an error result if SQUARE_ACCESS_TOKEN is not set.
 * Wire in real Square Checkout API call when the key is present.
 */
export async function createSquarePaymentLink(opts: {
  invoiceNumber: string;
  amount:        number;
  currency:      string;
  description:   string;
  redirectUrl?:  string;
}): Promise<PaymentLinkResult> {
  if (!isSquareConfigured()) {
    return {
      ok:       false,
      provider: "square",
      url:      null,
      error:    "SQUARE_ACCESS_TOKEN not configured. Add it to .env.local to enable Square payments.",
    };
  }

  // Real Square integration: call Square Checkout API
  // https://developer.squareup.com/reference/square/checkout-api/create-payment-link
  // When SQUARE_ACCESS_TOKEN is set, implement here.
  // For now, return a placeholder that signals readiness.
  return {
    ok:       false,
    provider: "square",
    url:      null,
    error:    `Square is configured. Implement createSquarePaymentLink() in src/lib/payments.ts to generate real payment links for invoice ${opts.invoiceNumber}.`,
  };
}

/**
 * Generate a Stripe Payment Link for an invoice.
 * Returns an error result if STRIPE_SECRET_KEY is not set.
 */
export async function createStripePaymentLink(opts: {
  invoiceNumber: string;
  amount:        number;
  currency:      string;
  description:   string;
  returnUrl?:    string;
}): Promise<PaymentLinkResult> {
  if (!isStripeConfigured()) {
    return {
      ok:       false,
      provider: "stripe",
      url:      null,
      error:    "STRIPE_SECRET_KEY not configured. Add it to .env.local to enable Stripe payments.",
    };
  }

  // Real Stripe integration: use Stripe SDK to create a Payment Link
  // https://stripe.com/docs/payment-links
  // When STRIPE_SECRET_KEY is set, implement here.
  return {
    ok:       false,
    provider: "stripe",
    url:      null,
    error:    `Stripe is configured. Implement createStripePaymentLink() in src/lib/payments.ts to generate real payment links for invoice ${opts.invoiceNumber}.`,
  };
}

/**
 * Record a manual payment. Always available.
 * In a full implementation, this would update the Invoice record.
 */
export function buildManualPaymentRecord(opts: {
  invoiceId:     string;
  invoiceNumber: string;
  amount:        number;
  currency:      string;
  method:        ManualPaymentRecord["method"];
  reference:     string;
  notes?:        string;
}): ManualPaymentRecord {
  return {
    invoiceId:     opts.invoiceId,
    invoiceNumber: opts.invoiceNumber,
    amount:        opts.amount,
    currency:      opts.currency,
    method:        opts.method,
    reference:     opts.reference,
    paidAt:        new Date().toISOString(),
    notes:         opts.notes ?? "",
  };
}

// ─────────────────────────────────────────────
// Route-level API response shape
// ─────────────────────────────────────────────

export interface PaymentStatusAPIResponse {
  square:  { configured: boolean; status: string; missingKeys: string[] };
  stripe:  { configured: boolean; status: string; missingKeys: string[] };
  manual:  { configured: boolean; status: string };
}

export function buildPaymentStatusResponse(): PaymentStatusAPIResponse {
  const sq = squareReadiness();
  const st = stripeReadiness();
  return {
    square: { configured: sq.configured, status: sq.status, missingKeys: sq.missing },
    stripe: { configured: st.configured, status: st.status, missingKeys: st.missing },
    manual: { configured: true, status: "configured" },
  };
}
