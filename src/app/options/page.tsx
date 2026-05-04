"use client";
import { useEffect, useState } from "react";

interface OptionContract {
  id: string;
  contractType: string;
  strikePrice: number;
  premium: number;
  currency: string;
  expiresAt: string;
  status: string;
  card: { name: string; rating: number; position: string; club: string };
  buyer:  { displayName: string | null; address: string };
  seller: { displayName: string | null; address: string };
}

export default function OptionsPage() {
  const [contracts, setContracts] = useState<OptionContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "call" | "put">("all");
  const [exercising, setExercising] = useState<string | null>(null);
  const [exerciseAddr, setExerciseAddr] = useState("");
  const [exerciseErr, setExerciseErr] = useState("");
  const [exerciseOk, setExerciseOk] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/options?status=open")
      .then((r) => r.json())
      .then((d) => { setContracts(Array.isArray(d) ? d : []); setLoading(false); });
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, []);

  async function exercise(contract: OptionContract) {
    if (!exerciseAddr.trim()) { setExerciseErr("Enter your buyer wallet address"); return; }
    setExerciseErr("");
    try {
      const res = await fetch(`/api/options/${contract.id}/exercise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerAddress: exerciseAddr.trim() }),
      });
      if (!res.ok) { setExerciseErr(await res.text()); return; }
      setExerciseOk(contract.card.name);
      setExercising(null);
      setExerciseAddr("");
      load();
    } catch {
      setExerciseErr("Exercise failed");
    }
  }

  const visible = filter === "all" ? contracts : contracts.filter((c) => c.contractType === filter);

  return (
    <div className="space-y-6">
      {exerciseOk && (
        <div className="bg-green-900/40 border border-green-700 rounded-xl p-3 text-green-300 text-sm">
          ✓ Option exercised for <strong>{exerciseOk}</strong>! Settlement pending on Apostle Chain.
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-yellow-400">Options Contracts</h1>
        <div className="flex gap-2">
          {(["all", "call", "put"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === f
                  ? "bg-yellow-400 text-gray-950 border-yellow-400"
                  : "border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
          <a href="/options/write" className="bg-yellow-400 text-gray-950 font-bold px-4 py-1.5 rounded-full text-sm hover:bg-yellow-300 ml-2">
            Write Option
          </a>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading contracts…</p>
      ) : visible.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-2xl mb-2">No open {filter !== "all" ? filter.toUpperCase() : ""} contracts</p>
          <p className="text-sm">Write the first options contract to start the market.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-left">
                <th className="pb-3 pr-4">Card</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Strike</th>
                <th className="pb-3 pr-4">Premium</th>
                <th className="pb-3 pr-4">Expires</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {visible.map((c) => (
                <>
                  <tr key={c.id} className="hover:bg-gray-900/50">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{c.card.name}</p>
                      <p className="text-xs text-gray-500">{c.card.position} · OVR {c.card.rating}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                        c.contractType === "call" ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"
                      }`}>
                        {c.contractType.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-yellow-400">{c.strikePrice.toLocaleString()} {c.currency}</td>
                    <td className="py-3 pr-4 font-mono text-gray-300">{c.premium.toLocaleString()} {c.currency}</td>
                    <td className="py-3 pr-4 text-gray-400">{new Date(c.expiresAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button
                        onClick={() => { setExercising(c.id); setExerciseErr(""); setExerciseAddr(""); setExerciseOk(null); }}
                        className="bg-yellow-400 text-gray-950 font-bold px-3 py-1 rounded text-xs hover:bg-yellow-300"
                      >
                        Buy Premium
                      </button>
                    </td>
                  </tr>
                  {exercising === c.id && (
                    <tr key={`${c.id}-exercise`}>
                      <td colSpan={6} className="pb-3">
                        <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                          <p className="text-xs text-gray-300">Enter your wallet to exercise this option and pay <strong className="text-yellow-400">{c.premium.toLocaleString()} {c.currency}</strong> premium:</p>
                          <input
                            type="text"
                            placeholder="Your wallet address"
                            value={exerciseAddr}
                            onChange={(e) => setExerciseAddr(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                            autoFocus
                          />
                          {exerciseErr && <p className="text-red-400 text-xs">{exerciseErr}</p>}
                          <div className="flex gap-2">
                            <button onClick={() => exercise(c)} className="flex-1 bg-yellow-400 text-gray-950 font-bold py-1.5 rounded text-xs hover:bg-yellow-300">Confirm Exercise</button>
                            <button onClick={() => { setExercising(null); setExerciseErr(""); }} className="flex-1 border border-gray-600 text-gray-400 py-1.5 rounded text-xs hover:border-gray-400">Cancel</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
