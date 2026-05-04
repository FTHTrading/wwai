"use client";

import { readProviderConfig } from "@/lib/maps/provider";

interface Props {
  venueName?: string;
  /** Highlight info — section/seat/gate to focus once a real provider is wired. */
  focus?: { section?: string; seat?: string; gate?: string };
}

/**
 * VenueMap — indoor wayfinding placeholder.
 * When NEXT_PUBLIC_INDOOR_PROVIDER is set, this will mount the Mappedin SDK or
 * an IMDF renderer. Today it shows a clear "needs provider" panel and the
 * relevant integration steps, so the page is sales-ready without keys.
 */
export default function VenueMap({ venueName = "Primary venue", focus }: Props) {
  const cfg = readProviderConfig();
  const provider = cfg.indoor;

  return (
    <div className="wwai-panel p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold">Indoor venue map</div>
          <div className="text-xl font-extrabold text-white mt-1">{venueName}</div>
        </div>
        <span className="wwai-chip wwai-chip-amber">
          {provider === "demo" ? "Indoor provider not configured" : `Provider: ${provider}`}
        </span>
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
        <Cell label="Gate"     value={focus?.gate    || "—"} />
        <Cell label="Section"  value={focus?.section || "—"} />
        <Cell label="Seat"     value={focus?.seat    || "—"} />
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-cyan-400/30 bg-cyan-400/5 p-4 text-sm text-slate-300">
        <div className="text-cyan-300 font-bold">What lights this up</div>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li><b>Mappedin</b> — set NEXT_PUBLIC_INDOOR_PROVIDER=mappedin + venue/client creds, install <code>@mappedin/mappedin-js</code>, replace <code>lib/maps/mappedin.ts</code> stub.</li>
          <li><b>IMDF (open standard)</b> — host an IMDF archive from the venue, render via MapLibre. Same stadiums, no per-venue license.</li>
          <li><b>ArcGIS Indoors</b> — enterprise alternative with IPS (indoor positioning), BIM/CAD ingest, operator dashboards.</li>
          <li><b>Apple MapKit Indoor</b> — free if the venue publishes IMDF to Apple. Great phone-side complement.</li>
        </ul>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        WWAI&apos;s end-to-end concierge route is composed by the outdoor adapter (hotel → gate)
        and the indoor adapter (gate → section → row → seat). Both speak the same provider
        interface so flipping providers requires no UI changes.
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#0a1220] border border-[#162035] p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-base font-bold text-white mt-0.5">{value}</div>
    </div>
  );
}
