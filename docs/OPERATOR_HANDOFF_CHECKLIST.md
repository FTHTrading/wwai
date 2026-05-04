# Operator Handoff Checklist

Use this checklist to verify the system is fully operational before handing off to the sales or operations team.

---

## System Access

- [ ] Operator has the production URL
- [ ] Operator has created their admin account (or credentials have been shared securely)
- [ ] Operator can log in to `/dashboard`
- [ ] Operator can access `/settings/integrations` to see provider status

---

## Database

- [ ] `DATABASE_URL` points to the production database (not file://)
- [ ] Migrations are applied: `npx prisma migrate status` shows no pending migrations
- [ ] Seed data is present: at least 5 sponsor packages visible at `/pricing`
- [ ] Lead, Invoice, and Proposal tables are accessible

---

## Payments

At least one payment path must be confirmed:

- [ ] **Manual payments** — always ready. Operator can record a manual payment from `/billing`
- [ ] **Square** — if `SQUARE_ACCESS_TOKEN` is set, confirm "Configured" badge shows at `/settings/integrations`
- [ ] **Stripe** — if `STRIPE_SECRET_KEY` is set, confirm "Configured" badge shows at `/settings/integrations`

---

## CRM

At least one lead capture path must be confirmed:

- [ ] **CSV Export** — always ready. Operator can download leads from `/settings/integrations` (CRM tab → Download CSV)
- [ ] **Live CRM** — if Zoho, HubSpot, or Airtable keys are set, confirm badge shows and test a lead push

---

## Sales Engine

- [ ] Operator can capture a lead at `/sales`
- [ ] Lead appears in the leads list (check `/analytics` or `/api/leads`)
- [ ] Operator can create a proposal at `/proposals`
- [ ] Proposal can be converted to an invoice at `/billing`

---

## AI Assistant

- [ ] `/api/ai/health` returns `{ ok: true }` or a graceful fallback
- [ ] If `OPENAI_API_KEY` is not set, AI features degrade gracefully (no hard errors)

---

## Map / Live Ops

- [ ] `/map` loads the MapLibre map without errors
- [ ] Venue pins appear (if venues are seeded)

---

## Quick Reference

| Feature | URL | Who uses it |
|---------|-----|------------|
| Sales pipeline | /sales | Sales team |
| Lead list | /analytics | Sales + management |
| Invoice tracking | /billing | Finance |
| Proposal drafting | /proposals | Sales team |
| Partner (sponsor) management | /sponsors | Account management |
| Venue management | /venues | Operations |
| Campaign tracking | /campaigns | Marketing |
| Live ops map | /map | Operations |
| AI assistant | /app | All users |
| Integration status | /settings/integrations | Admin/operator |
| Deploy checklist | /launch | DevOps |

---

## Known Operator Actions After Handoff

1. **Add payment keys** when ready to accept live card payments (Square or Stripe)
2. **Add CRM keys** when ready to sync leads to Zoho, HubSpot, or Airtable
3. **Update seed data** — replace demo sponsor packages with real pricing
4. **Configure NEXTAUTH_URL** to match the production domain
5. **Review and customize AI prompts** at `src/lib/ai-prompts.ts`
