"use client";
import { useEffect, useState } from "react";

interface Card {
  eaId: string;
  name: string;
  club: string;
  league: string;
  nation: string;
  position: string;
  rating: number;
  rarity: string;
  imageUrl: string | null;
  price: number | null;
}

export default function CardsPage() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!query.trim()) { setCards([]); return; }
      setLoading(true);
      fetch(`/api/cards/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => { setCards(Array.isArray(d) ? d : []); setLoading(false); });
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-yellow-400">Card Explorer</h1>

      <input
        type="text"
        placeholder="Search player name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
      />

      {loading && <p className="text-gray-400">Searching…</p>}

      {!loading && query && cards.length === 0 && (
        <p className="text-gray-500">No cards found for "{query}". Make sure the database is seeded.</p>
      )}

      {!loading && !query && (
        <p className="text-gray-500 text-sm">Type a player name to search the database. Run <code className="bg-gray-800 px-1 rounded">npx tsx prisma/seed.ts</code> to seed sample cards.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.eaId} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2 hover:border-yellow-400/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white">{c.name}</p>
                <p className="text-xs text-gray-400">{c.position} · {c.club}</p>
                <p className="text-xs text-gray-500">{c.league} · {c.nation}</p>
              </div>
              <span className={`text-sm font-extrabold px-2 py-1 rounded ${
                c.rarity === "icon" ? "bg-purple-700 text-purple-100" :
                c.rarity === "special" ? "bg-blue-700 text-blue-100" :
                c.rating >= 90 ? "bg-yellow-600 text-yellow-100" :
                "bg-gray-700 text-gray-200"
              }`}>
                {c.rating}
              </span>
            </div>
            {c.price !== null && (
              <p className="text-yellow-400 font-mono text-sm">{c.price.toLocaleString()} ATP</p>
            )}
            <div className="flex gap-2 pt-1">
              <button className="flex-1 border border-yellow-400 text-yellow-400 text-xs font-bold py-1.5 rounded hover:bg-yellow-400/10 transition-colors">
                Buy / Bid
              </button>
              <button className="flex-1 border border-gray-600 text-gray-400 text-xs font-bold py-1.5 rounded hover:border-gray-400 transition-colors">
                Options
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
