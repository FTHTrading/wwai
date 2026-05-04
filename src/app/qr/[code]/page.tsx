"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";

interface QrData {
  id:          string;
  code:        string;
  label:       string | null;
  offerText:   string | null;
  rewardValue: number | null;
  rewardType:  string;
  scans:       number;
  redemptions: number;
  active:      boolean;
  expiresAt:   string | null;
  campaign:    { name: string; sponsor: { name: string } | null } | null;
}

const REWARD_LABELS: Record<string, string> = {
  discount:  "Discount",
  points:    "Reward Points",
  free_item: "Free Item",
  cashback:  "Cashback",
};

export default function QrRedemptionPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [data,     setData]     = useState<QrData | null>(null);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [redeemed, setRedeemed] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    fetch(`/api/qr/${code}`)
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e.error)))
      .then(d  => setData(d))
      .catch(e => setError(typeof e === "string" ? e : "QR code not found or expired"))
      .finally(() => setLoading(false));
  }, [code]);

  async function redeem() {
    if (!data) return;
    setRedeeming(true);
    try {
      const res = await fetch(`/api/qr/${code}`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).error);
      setRedeemed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Redemption failed");
    } finally {
      setRedeeming(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-400">Loading offer…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-4xl">⊗</div>
          <h2 className="text-xl font-bold text-white">Offer Unavailable</h2>
          <p className="text-slate-400 text-sm">{error || "This QR code is no longer valid."}</p>
          <Link href="/" className="btn-troptions inline-flex mx-auto">Return Home</Link>
        </div>
      </div>
    );
  }

  if (redeemed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-5 max-w-sm">
          <div className="troptions-hex mx-auto">T</div>
          <h2 className="text-2xl font-bold text-white">Offer Redeemed</h2>
          {data.offerText && <p className="text-[#00d4ff] text-lg font-semibold">{data.offerText}</p>}
          {data.rewardValue && (
            <p className="text-[#d4a017] text-3xl font-bold">
              {data.rewardType === "discount" || data.rewardType === "cashback"
                ? `$${data.rewardValue}`
                : `${data.rewardValue} ${REWARD_LABELS[data.rewardType] ?? "Reward"}`}
            </p>
          )}
          <p className="text-slate-400 text-sm">Show this screen to the attendant to claim your reward.</p>
          <p className="text-slate-600 text-xs">Powered by TROPTIONS™ Rewards Engine</p>
        </div>
      </div>
    );
  }

  const expired = data.expiresAt ? new Date(data.expiresAt) < new Date() : false;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="troptions-hex mx-auto">T</div>
          {data.campaign?.sponsor?.name && (
            <p className="text-[#d4a017] text-sm font-semibold uppercase tracking-widest">{data.campaign.sponsor.name}</p>
          )}
          <h2 className="text-2xl font-bold text-white">{data.label ?? "Exclusive Offer"}</h2>
          {data.campaign?.name && <p className="text-slate-500 text-xs">{data.campaign.name}</p>}
        </div>

        <div className="card-dark p-6 text-center space-y-4">
          {data.offerText && (
            <p className="text-[#00d4ff] text-lg font-semibold leading-snug">{data.offerText}</p>
          )}
          {data.rewardValue && (
            <p className="text-[#d4a017] text-4xl font-bold">
              {data.rewardType === "discount" || data.rewardType === "cashback"
                ? `$${data.rewardValue} Off`
                : `${data.rewardValue} ${REWARD_LABELS[data.rewardType] ?? "Points"}`}
            </p>
          )}
          <div className="flex justify-center gap-6 text-xs text-slate-500 border-t border-[#162035] pt-3">
            <span>{data.scans} scans</span>
            <span>{data.redemptions} redeemed</span>
            {data.expiresAt && <span>Expires {new Date(data.expiresAt).toLocaleDateString()}</span>}
          </div>
        </div>

        {expired ? (
          <div className="text-center">
            <p className="text-red-400 text-sm font-semibold">This offer has expired.</p>
          </div>
        ) : (
          <button onClick={redeem} disabled={redeeming} className="btn-troptions w-full justify-center text-base py-3">
            {redeeming ? "Redeeming…" : "Redeem Offer →"}
          </button>
        )}

        <p className="text-center text-slate-600 text-xs">
          Powered by TROPTIONS™ · One System. One Brand.
        </p>
      </div>
    </div>
  );
}
