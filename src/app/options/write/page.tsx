"use client";
import { useEffect, useState } from "react";

interface Card { id: string; name: string; club: string; position: string; rating: number; rarity: string; }

export default function WriteOptionPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardId, setCardId]         = useState("");
  const [sellerAddr, setSellerAddr] = useState("");
  const [buyerAddr, setBuyerAddr]   = useState("");
  const [contractType, setType]     = useState<"call" | "put">("call");
  const [strikePrice, setStrike]    = useState("");
  const [premium, setPremium]       = useState("");
  const [expiresAt, setExpires]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState(false);

  useEffect(() => {
    fetch("/api/cards/search?q=a")
      .then((r) => r.json())
      .then((d) => setCards(Array.isArray(d) ? d : []));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (!cardId || !sellerAddr || !buyerAddr || !strikePrice || !premium || !expiresAt) {
      setError("All fields are required."); return;
    }
    setLoading(true);
    try {
      const [sellerRes, buyerRes] = await Promise.all([
        fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: sellerAddr }) }),
        fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: buyerAddr }) }),
      ]);
      const [seller, buyer] = await Promise.all([sellerRes.json(), buyerRes.json()]);

      const res = await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          sellerId: seller.id,
          buyerId: buyer.id,
          contractType,
          strikePrice: Number(strikePrice),
          premium: Number(premium),
          expiresAt,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      setCardId(""); setSellerAddr(""); setBuyerAddr(""); setStrike(""); setPremium(""); setExpires("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 16);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <a href="/options" className="text-gray-500 hover:text-yellow-400 text-sm">← Options</a>
        <h1 className="text-3xl font-bold text-yellow-400">Write Option</h1>
      </div>

      {success && (
        <div className="bg-green-900/40 border border-green-700 rounded-xl p-4 text-green-300">
          ✓ Contract written! <a href="/options" className="underline font-bold">View Options →</a>
        </div>
      )}

      <form onSubmit={submit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        {/* Contract type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Contract Type</label>
          <div className="flex gap-3">
            {(["call", "put"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                  contractType === t
                    ? t === "call"
                      ? "bg-green-700 border-green-600 text-white"
                      : "bg-red-700 border-red-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {contractType === "call"
              ? "CALL — buyer has right to purchase the card at strike price."
              : "PUT — buyer has right to sell the card at strike price."}
          </p>
        </div>

        {/* Card selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Underlying Player Card</label>
          <select
            aria-label="Underlying player card"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
          >
            <option value="">— Select a card —</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.rating}) · {c.position} · {c.club}
              </option>
            ))}
          </select>
        </div>

        {/* Seller / Buyer */}
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Seller Address (writer)</label>
            <input
              type="text"
              placeholder="Apostle UUID or wallet address"
              value={sellerAddr}
              onChange={(e) => setSellerAddr(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Buyer Address</label>
            <input
              type="text"
              placeholder="Apostle UUID or wallet address"
              value={buyerAddr}
              onChange={(e) => setBuyerAddr(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
            />
          </div>
        </div>

        {/* Strike + Premium */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Strike Price (ATP)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 900000"
              value={strikePrice}
              onChange={(e) => setStrike(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Premium (ATP)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 25000"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
            />
          </div>
        </div>

        {/* Expiry */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Expiration Date & Time</label>
          <input
            type="datetime-local"
            min={minDate}
            aria-label="Expiration date and time"
            title="Expiration date and time"
            value={expiresAt}
            onChange={(e) => setExpires(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-gray-950 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? "Writing…" : `Write ${contractType.toUpperCase()} Option`}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center">
        Options are settled on Apostle Chain. Premium is paid at exercise time.
      </p>
    </div>
  );
}
