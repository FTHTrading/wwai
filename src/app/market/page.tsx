"use client";
import { useEffect, useState } from "react";

interface Listing {
  id: string;
  price: number;
  currency: string;
  quantity: number;
  status: string;
  card: { name: string; rating: number; position: string; club: string; rarity: string };
  seller: { displayName: string | null; address: string };
  bids: { amount: number }[];
}

export default function MarketPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [buyAddr, setBuyAddr] = useState("");
  const [buyErr, setBuyErr] = useState("");
  const [buyOk, setBuyOk] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/listings?status=open")
      .then((r) => r.json())
      .then((d) => { setListings(Array.isArray(d) ? d : []); setLoading(false); });
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, []);

  async function confirmBuy(listing: Listing) {
    if (!buyAddr.trim()) { setBuyErr("Enter your wallet address"); return; }
    setBuyErr("");
    try {
      // Upsert buyer
      const uRes = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: buyAddr.trim() }) });
      const buyer = await uRes.json();
      // Fill listing
      const res = await fetch(`/api/listings/${listing.id}/fill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId: buyer.id }),
      });
      if (!res.ok) {
        const t = await res.text();
        setBuyErr(t);
        return;
      }
      setBuyOk(listing.card.name);
      setBuying(null);
      setBuyAddr("");
      load();
    } catch {
      setBuyErr("Purchase failed");
    }
  }

  const activeListing = listings.find((l) => l.id === buying);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-yellow-400">Spot Market</h1>
        <a href="/market/list" className="bg-yellow-400 text-gray-950 font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 text-sm">
          + List Card
        </a>
      </div>

      {buyOk && (
        <div className="bg-green-900/40 border border-green-700 rounded-xl p-3 text-green-300 text-sm">
          ✓ Purchase confirmed for <strong>{buyOk}</strong>! ATP transfer will settle on Apostle Chain.
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading listings…</p>
      ) : listings.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-2xl mb-2">No open listings</p>
          <p className="text-sm">Seed the database and list your first card to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => (
            <div key={l.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white">{l.card.name}</p>
                  <p className="text-xs text-gray-400">{l.card.position} · {l.card.club}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  l.card.rarity === "icon" ? "bg-purple-700" :
                  l.card.rarity === "special" ? "bg-blue-700" : "bg-yellow-700"
                }`}>
                  {l.card.rating} {l.card.rarity.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-yellow-400">{l.price.toLocaleString()} {l.currency}</p>
                {l.bids.length > 0 && (
                  <p className="text-xs text-gray-400">Top bid: {Math.max(...l.bids.map((b) => b.amount)).toLocaleString()}</p>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">Seller: {l.seller.displayName ?? l.seller.address}</p>

              {buying === l.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your wallet address"
                    value={buyAddr}
                    onChange={(e) => setBuyAddr(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                    autoFocus
                  />
                  {buyErr && <p className="text-red-400 text-xs">{buyErr}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => confirmBuy(l)} className="flex-1 bg-yellow-400 text-gray-950 font-bold py-1.5 rounded text-xs hover:bg-yellow-300">Confirm Buy</button>
                    <button onClick={() => { setBuying(null); setBuyErr(""); }} className="flex-1 border border-gray-700 text-gray-400 py-1.5 rounded text-xs hover:border-gray-500">Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setBuying(l.id); setBuyOk(null); setBuyErr(""); setBuyAddr(""); }}
                  className="w-full bg-yellow-400 text-gray-950 font-bold py-2 rounded-lg hover:bg-yellow-300 text-sm transition-colors"
                >
                  Buy Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm modal backdrop */}
      {buying && activeListing && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setBuying(null)} />
      )}
    </div>
  );
}
