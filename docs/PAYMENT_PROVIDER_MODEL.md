# Payment Provider Model

## Overview

TROPTIONS uses a provider abstraction in `src/lib/payments.ts`. Payment link creation is gated on the presence of provider API keys. Manual payment tracking is always available.

## Providers

| Provider | Required Env Var | Status |
|----------|-----------------|--------|
| Square   | `SQUARE_ACCESS_TOKEN` | Disabled until key is set |
| Stripe   | `STRIPE_SECRET_KEY` | Disabled until key is set (`STRIPE_PUBLISHABLE_KEY` optional) |
| Manual   | None | Always active |

## Functions

### `createSquarePaymentLink(opts)`

Returns `PaymentLinkResult`. If `SQUARE_ACCESS_TOKEN` is missing, returns `{ ok: false, error: "..." }`. When key is present, implement the Square Checkout API call in the function body.

### `createStripePaymentLink(opts)`

Returns `PaymentLinkResult`. If `STRIPE_SECRET_KEY` is missing, returns `{ ok: false, error: "..." }`. When key is present, implement the Stripe Payment Links API call.

### `buildManualPaymentRecord(opts)`

Always available. Returns a `ManualPaymentRecord` object for manual payment tracking. No API calls.

### `buildPaymentStatusResponse()`

Returns a safe JSON payload consumed by `/api/payment-status`. No secret values — only boolean `configured` flags and env key names.

## Implementing Live Payment Links

### Square

```typescript
// In src/lib/payments.ts — createSquarePaymentLink()
const res = await fetch("https://connect.squareup.com/v2/online-checkout/payment-links", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    "Square-Version": "2024-01-17",
  },
  body: JSON.stringify({
    idempotency_key: opts.invoiceId,
    order: {
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: [{ name: opts.description, quantity: "1", base_price_money: { amount: Math.round(opts.amount * 100), currency: opts.currency } }],
      },
    },
  }),
});
const data = await res.json();
return { ok: true, provider: "square", url: data.payment_link.url, error: null };
```

### Stripe

```typescript
// In src/lib/payments.ts — createStripePaymentLink()
// Requires: npm install stripe
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const link = await stripe.paymentLinks.create({
  line_items: [{ price_data: { currency: opts.currency.toLowerCase(), product_data: { name: opts.description }, unit_amount: Math.round(opts.amount * 100) }, quantity: 1 }],
  after_completion: { type: "redirect", redirect: { url: opts.successUrl ?? "https://yourdomain.com/billing" } },
});
return { ok: true, provider: "stripe", url: link.url, error: null };
```

## Billing Page Integration

The `/billing` page fetches `/api/payment-status` on load. The Square and Stripe "Create Payment Link" buttons are:
- **Disabled** (grey, `cursor-not-allowed`) when the provider is not configured
- **Enabled** (coloured, clickable) when the provider is configured

No code change is needed to the billing page when keys are added — the status is detected live.

## Manual Payments

Manual payment records track method (check, wire, ACH, cash, TROPTIONS), reference number, and notes. These are stored on the Invoice model via `paymentProvider` and `paymentRef` fields.

To record a manual payment, call `buildManualPaymentRecord()` and then PATCH the invoice via `/api/invoices/[id]`.
