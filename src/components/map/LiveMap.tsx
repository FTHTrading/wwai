"use client";

import { useEffect, useRef, useState } from "react";
import { getOutdoorAdapter, readProviderConfig, type MapMarker, type LatLng } from "@/lib/maps/provider";

interface Props {
  center: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  /** Min height in px (the host element controls width). */
  height?: number;
}

/**
 * LiveMap — renders the active outdoor map provider (MapLibre / Mapbox / etc).
 * If no provider is configured, returns null so callers can keep their existing demo UI.
 */
export default function LiveMap({ center, zoom = 12, markers, height = 520 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error" | "demo">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cfg = readProviderConfig();
    if (cfg.outdoor === "demo") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("demo");
      return;
    }

    let teardown: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      try {
        const adapter = await getOutdoorAdapter(cfg);
        if (!adapter || !hostRef.current || cancelled) {
          setStatus("demo");
          return;
        }
        teardown = await adapter.mount(hostRef.current, { center, zoom, markers });
        if (!cancelled) setStatus("ready");
      } catch (e) {
        setError((e as Error).message);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [center, zoom, markers]);

  if (status === "demo") return null;

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#0d1626]" style={{ minHeight: height }}>
      <div ref={hostRef} className="absolute inset-0" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan-300/70 bg-[#020611]/60">
          Loading map provider…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-300 bg-[#020611]/80 p-4 text-center">
          Map provider error: {error}
        </div>
      )}
    </div>
  );
}
