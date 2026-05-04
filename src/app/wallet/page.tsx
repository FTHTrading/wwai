"use client";
import { useState } from "react";

interface UserProfile {
  id: string;
  address: string;
  chain: string;
  displayName: string | null;
  atpBalance: number | null;
}

export default function WalletPage() {
  const [address, setAddress] = useState("");
  const [chain, setChain]     = useState("apo");
  const [displayName, setDisplayName] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    if (!address.trim()) { setError("Enter a wallet address / agent UUID"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim(), chain, displayName: displayName.trim() || undefined }),
      });
      if (!res.ok) throw new Error(await res.text());
      const user = await res.json();
      // Fetch with live ATP balance
      const full = await fetch(`/api/users?address=${encodeURIComponent(address.trim())}`);
      setProfile(await full.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-yellow-400">Wallet Connect</h1>

      {!profile ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <p className="text-gray-400 text-sm">
            Connect your Apostle Chain agent UUID or EVM/Solana wallet address to start trading.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Agent UUID or wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
            />
            <div className="flex gap-3">
              <select
                aria-label="Blockchain network"
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="apo">Apostle (ATP)</option>
                <option value="evm">EVM</option>
                <option value="sol">Solana</option>
              </select>
              <input
                type="text"
                placeholder="Display name (optional)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full bg-yellow-400 text-gray-950 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {loading ? "Connecting…" : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold text-white">{profile.displayName ?? "Anonymous"}</p>
                <p className="text-xs text-gray-400 font-mono break-all">{profile.address}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase">{profile.chain} chain</p>
              </div>
              <button onClick={() => setProfile(null)} className="text-xs text-gray-500 hover:text-gray-300">
                Disconnect
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-3xl font-extrabold text-yellow-400">
                {profile.atpBalance !== null ? `${profile.atpBalance.toLocaleString()} ATP` : "— ATP"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Apostle Chain Balance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a href="/market"  className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-yellow-400/50 transition-colors">
              <p className="font-bold text-white">My Listings</p>
              <p className="text-xs text-gray-500 mt-1">View & manage</p>
            </a>
            <a href="/options" className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-yellow-400/50 transition-colors">
              <p className="font-bold text-white">My Options</p>
              <p className="text-xs text-gray-500 mt-1">Open contracts</p>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
