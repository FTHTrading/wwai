"use client";
import { useEffect, useState } from "react";

interface Card { id: string; eaId: string; name: string; club: string; position: string; rating: number; rarity: string; }

export default function ListCardPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardId, setCardId]     = useState("");
  const [sellerId, setSellerId] = useState("");
  const [price, setPrice]       = useState("");
  const [currency, setCurrency] = useState("ATP");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    // Load all cards for the selector
    fetch("/api/cards/search?q=a")
      .then((r) => r.json())
      .then((d) => setCards(Array.isArray(d) ? d : []));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (!cardId || !sellerId || !price) { setError("Card, seller address, and price are required."); return; }
    setLoading(true);
    try {
      // Upsert seller
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: sellerId }),
      });
      const user = await userRes.json();

      // Create listing
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, sellerId: user.id, price: Number(price), currency, quantity: Number(quantity) }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      setCardId(""); setSellerId(""); setPrice(""); setQuantity("1");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <a href="/market" className="text-gray-500 hover:text-yellow-400 text-sm">← Market</a>
        <h1 className="text-3xl font-bold text-yellow-400">List a Card</h1>
      </div>

      {success && (
        <div className="bg-green-900/40 border border-green-700 rounded-xl p-4 text-green-300">
          ✓ Listing created! <a href="/market" className="underline font-bold">View on Market →</a>
        </div>
      )}

      <form onSubmit={submit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Player Card</label>
          <select
            aria-label="Player card"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
          >
            <option value="">— Select a card —</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.rating} {c.rarity.toUpperCase()}) · {c.position} · {c.club}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Your Wallet Address / Agent UUID</label>
          <input
            type="text"
            placeholder="Apostle UUID or wallet address"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Price</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 50000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Currency</label>
            <select
              aria-label="Listing currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
            >
              <option value="ATP">ATP</option>
              <option value="USDF">USDF</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Quantity</label>
          <input
            type="number"
            min="1"
            max="10"
            placeholder="1"
            aria-label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-gray-950 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? "Listing…" : "Create Listing"}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center">
        Listings are recorded on-chain when filled. Price denominated in selected currency.
      </p>
    </div>
  );
}
