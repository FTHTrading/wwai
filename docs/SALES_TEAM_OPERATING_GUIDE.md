# Sales Team Operating Guide

## Role split

- **Sales rep** — runs the demo, configures proposals, files the registration submission, hands off to onboarding.
- **Operator** — reviews `/admin`, approves / requests info / rejects, monitors `/analytics`.
- **Onboarding** — works `/launch` checklist with the customer once the proposal is signed.

## Daily flow

1. Open `/client-demo` on the demo laptop. Don\u2019t free-form.
2. For every prospect call, finish with a saved proposal in `/proposals`. Print preview if they want paper.
3. Submit a registration in their name in `/register/<type>` so it shows up in `/admin`.
4. Tag the lead in your CRM (manual CSV export from `/api/leads/export` until live CRM is wired).
5. Hand the customer a 24-hour follow-up: confirmation email + the printed proposal.

## What you can promise

- A working demo today.
- A configured proposal with a saved record.
- A registration submission you can show in admin.
- A production launch path with a published checklist (`/launch`).

## What you cannot promise

- Real payment processing without configured Square or Stripe keys.
- Live CRM sync without configured Zoho / HubSpot / Airtable keys.
- "Official" or "guaranteed" anything — read `SAFETY_AND_ROUTE_LANGUAGE_GUIDE.md`.
- Brand affiliations not in writing.

## When asked "is this real?"

> "The platform is real. The data on screen is demo until we wire your data in.
> Everything you see in `/launch` is what we ship together to make it live."

## Escalations

- Brand / legal questions → marketing lead.
- Payment / accounting questions → finance lead.
- Technical / integration questions → engineering on-call.
- Safety / liability questions → operations lead and legal.

## Tools

- `/api/leads/export` — CSV of registrations.
- `/admin` — operator review.
- `/proposals` — live proposal builder (Save + Print).
- `/settings/integrations` — what is configured today.
- `/launch` — production checklist.
