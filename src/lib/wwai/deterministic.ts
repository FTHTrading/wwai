/**
 * src/lib/wwai/deterministic.ts
 * WWAI deterministic answer builder — produces useful answers from demo data
 * without any LLM. This is the always-available fallback.
 */

import {
  RESTAURANTS,
  BARS,
  HOTELS,
  TRANSPORT,
  SAFETY_NODES,
  SPONSOR_PACKAGES,
  MERCHANT_PACKAGES,
  HOTEL_PACKAGES,
  DRIVER_PACKAGES,
  CAMPAIGNS,
} from "@/data/demoData";
import type { Place } from "@/lib/types";
import type { WWAIIntent } from "./intent";
import type { RetrievedRecord } from "./retrieval";
import { appendNightlifeNotice } from "./guardrails";

function placeRow(p: Place): string {
  const dist = p.distanceMiles != null ? `${p.distanceMiles} mi` : "";
  const walk = p.walkMinutes ? `${p.walkMinutes} min walk` : p.driveMinutes ? `${p.driveMinutes} min drive` : "";
  const offer = p.offer ? ` — *${p.offer}*` : "";
  return `• **${p.name}** (${p.zone}) — ${[dist, walk].filter(Boolean).join(", ")}${offer}`;
}

export function buildDeterministicAnswer(
  intent: WWAIIntent,
  records: RetrievedRecord[],
  context?: { currentHotel?: string; currentZone?: string }
): string {
  const zone = context?.currentZone ?? "Downtown";
  const hotel = context?.currentHotel ?? "your hotel";

  switch (intent) {
    case "food": {
      const restaurants = records.length
        ? records.filter((r) => r.kind === "place" && ((r.data as unknown) as Place).category === "restaurant").slice(0, 3)
        : RESTAURANTS.filter((r) => r.zone === zone || r.zone === "Downtown").slice(0, 3).map((r) => ({
            kind: "place" as const, id: r.id, name: r.name, score: 0, data: (r as unknown) as Record<string, unknown>,
          }));

      if (restaurants.length === 0) {
        return `Here are some nearby restaurants (demo data):\n${RESTAURANTS.slice(0, 3).map((r) => placeRow(r)).join("\n")}\n\nTap any listing to get a route.`;
      }
      const lines = restaurants.map((r) => placeRow((r.data as unknown) as Place));
      const hasCampaign = CAMPAIGNS.filter((c) => c.status === "live" && c.type.toLowerCase().includes("qr")).slice(0, 1);
      const offerLine = hasCampaign.length ? `\n\n🎁 Active offer: **${hasCampaign[0].name}** — scan QR at the restaurant.` : "";
      return `Here are restaurants near ${zone} (demo data):\n\n${lines.join("\n")}${offerLine}\n\nTap any listing to see route options.`;
    }

    case "bars_nightlife": {
      const bars = records.length
        ? records.filter((r) => r.kind === "place" && ((r.data as unknown) as Place).category === "bar").slice(0, 3)
        : BARS.slice(0, 3).map((r) => ({ kind: "place" as const, id: r.id, name: r.name, score: 0, data: (r as unknown) as Record<string, unknown> }));

      const lines = bars.map((r) => placeRow((r.data as unknown) as Place));
      const base = `Bars near the event zone (demo data — age restrictions apply):\n\n${lines.join("\n")}`;
      return appendNightlifeNotice(base);
    }

    case "hotel": {
      const hotels = records.length
        ? records.filter((r) => r.kind === "place" && ((r.data as unknown) as Place).category === "hotel").slice(0, 3)
        : HOTELS.slice(0, 3).map((r) => ({ kind: "place" as const, id: r.id, name: r.name, score: 0, data: (r as unknown) as Record<string, unknown> }));

      const lines = hotels.map((r) => placeRow((r.data as unknown) as Place));
      return `Hotels in our demo network:\n\n${lines.join("\n")}\n\nVisit /hotels for the full list and amenities.`;
    }

    case "pickup": {
      const zones = TRANSPORT.filter((t) => t.type?.includes("Pickup") || t.type?.includes("Shuttle")).slice(0, 3);
      const lines = zones.map((z) => `• **${z.name}** (${z.zone}) — ${z.walkMinutes ?? 0} min walk${z.safetyNote ? ` — ${z.safetyNote}` : ""}`);
      return `Driver and shuttle pickup zones (demo data):\n\n${lines.join("\n")}\n\nVisit /drivers for live zone availability.`;
    }

    case "route": {
      const shuttle = TRANSPORT.find((t) => t.type?.includes("Shuttle"));
      const node = SAFETY_NODES[0];
      return `**Demo route: ${hotel} → Venue**\n\n` +
        `1. Exit hotel via the recommended public corridor\n` +
        `2. Walk to ${shuttle?.name ?? "Hotel Shuttle Zone A"} (${shuttle?.walkMinutes ?? 2} min)\n` +
        `3. Follow operator-reviewed route to venue entrance\n` +
        `4. Check in at ${node?.name ?? "Guest Support Node"} if you need assistance\n\n` +
        `_This is a demo route. Safety-informed routing requires live operator data._\n\nVisit /safety-routes to generate a QR route pass.`;
    }

    case "return_route": {
      const pickupB = TRANSPORT.find((t) => t.id === "t2");
      const shuttleA = TRANSPORT.find((t) => t.id === "t1");
      return `**Demo return route: Venue → ${hotel}**\n\n` +
        `Option A — Driver pickup: Walk to **${pickupB?.name ?? "Driver Pickup Zone B"}** (${pickupB?.walkMinutes ?? 8} min, ${pickupB?.safetyNote ?? "lit and monitored"})\n` +
        `Option B — Hotel shuttle: Walk to **${shuttleA?.name ?? "Hotel Shuttle Zone A"}** (${shuttleA?.walkMinutes ?? 2} min)\n\n` +
        `Estimated return: 12–18 min depending on traffic.\n\n` +
        `_Demo data. Live routing requires operator integration._`;
    }

    case "sponsor_offer": {
      const liveOffers = CAMPAIGNS.filter((c) => c.status === "live").slice(0, 3);
      const restaurantOffers = RESTAURANTS.filter((r) => r.offer).slice(0, 3);
      const lines = [
        ...liveOffers.map((c) => `• **${c.name}** — ${c.scans.toLocaleString()} scans`),
        ...restaurantOffers.map((r) => `• **${r.name}**: ${r.offer}`),
      ].slice(0, 5);
      return `Active sponsor offers in this zone (demo data):\n\n${lines.join("\n")}\n\nVisit /sponsors to browse all active offers.`;
    }

    case "restaurant_registration": {
      const pkgs = MERCHANT_PACKAGES.slice(0, 3);
      const lines = pkgs.map((p) => `• **${p.name}** — $${p.price?.toLocaleString()}/yr — ${p.bestFor}`);
      return `To register your restaurant on WWAI/TROPTIONS:\n\n${lines.join("\n")}\n\n→ Visit **/register/restaurant** to apply. Approval is operator-reviewed.`;
    }

    case "hotel_registration": {
      const pkgs = HOTEL_PACKAGES.slice(0, 3);
      const lines = pkgs.map((p) => `• **${p.name}** — $${p.price?.toLocaleString()} — ${p.bestFor}`);
      return `To register your hotel with WWAI:\n\n${lines.join("\n")}\n\n→ Visit **/register/hotel** to set up routes from your property to the venue.`;
    }

    case "driver_registration": {
      const pkgs = DRIVER_PACKAGES.slice(0, 3);
      const lines = pkgs.map((p) => `• **${p.name}** — $${p.price?.toLocaleString()} — ${p.bestFor}`);
      return `To register as a driver or transport operator:\n\n${lines.join("\n")}\n\nWWAI is an independent platform — not affiliated with any rideshare brand.\n\n→ Visit **/register/driver** to apply.`;
    }

    case "sponsor_package": {
      const pkgs = SPONSOR_PACKAGES.slice(0, 3);
      const lines = pkgs.map((p) => `• **${p.name}** — $${p.price?.toLocaleString()} — ${p.bestFor}`);
      return `WWAI/TROPTIONS sponsor packages:\n\n${lines.join("\n")}\n\n→ Visit **/packages** to view all tiers and features.`;
    }

    case "business_registration":
      return `WWAI supports several business types:\n\n• **Restaurant** → /register/restaurant\n• **Bar/Venue** → /register/venue\n• **Hotel** → /register/hotel\n• **Driver/Transport** → /register/driver\n• **Sponsor/Brand** → /packages\n\nAll listings are operator-reviewed before going live.`;

    case "safety_support": {
      const nodes = SAFETY_NODES.slice(0, 3);
      const lines = nodes.map((n) => `• **${n.name}** (${n.zone}) — ${n.walkMinutes ?? 0} min walk${n.safetyNote ? ` — ${n.safetyNote}` : ""}`);
      return `Support and safety nodes (demo data):\n\n${lines.join("\n")}\n\n⚠️ For emergencies, contact local emergency services immediately.\n\nWWAI support booths are operator-staffed in production.`;
    }

    case "accessibility_support":
      return `Accessibility support is available at designated nodes (demo data).\n\nPlease visit the Guest Support Node in the Downtown zone or ask an event staff member for ADA route assistance.\n\nFor emergencies, contact local emergency services immediately.`;

    case "what_is_wwai":
      return `**WWAI — WhichWay AI** is the guest-facing AI concierge powered by TROPTIONS.\n\n_"Not sure where to go? WhichWay AI knows."_\n\nI help guests:\n• Find restaurants, bars, and hotels near the venue\n• Navigate pickup zones and safety-informed routes\n• Discover sponsor offers and QR deals\n• Register businesses and transportation services\n\nI run on TROPTIONS GuestOps — a real-time venue intelligence platform.`;

    case "what_is_troptions":
      return `**TROPTIONS** is the backend SalesOS + GuestOps platform that powers WWAI.\n\nTROPTIONS manages sponsor campaigns, merchant onboarding, hotel routing, driver coordination, and the AI concierge layer that guests interact with.\n\nVisit **/about** to learn more.`;

    default:
      return `I'm WWAI — your event concierge. I can help with:\n\n• 🍽 Restaurants near the venue\n• 🍺 Bars & nightlife (age-restricted listings)\n• 🏨 Hotels & lodging\n• 🚗 Driver pickup zones & shuttles\n• 🗺 Safety-informed routes\n• 🎁 Sponsor offers & QR deals\n• 📋 Business registration\n\nWhat would you like to find?`;
  }
}
