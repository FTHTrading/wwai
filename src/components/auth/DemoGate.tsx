"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * DemoGate — lightweight client-side gate for sensitive demo surfaces.
 *
 * NOT a security boundary. This is a courtesy lock so a shared demo link
 * cannot accidentally land an outsider in /admin or /billing.
 *
 * Replace with NextAuth / Azure AD / Okta before any real customer data
 * is entered.
 *
 * Access code source (first match wins):
 *   1. NEXT_PUBLIC_DEMO_ACCESS_CODE
 *   2. "troptions-demo" in development only
 *   3. denies entry in production with no env var set
 */

const SESSION_KEY = "troptions:demo-access";

function expectedCode(): string | null {
  const env = process.env.NEXT_PUBLIC_DEMO_ACCESS_CODE;
  if (env && env.trim().length > 0) return env.trim();
  if (process.env.NODE_ENV !== "production") return "troptions-demo";
  return null;
}

export default function DemoGate({
  surface,
  children,
}: {
  surface: string;
  children: ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllowed(window.sessionStorage.getItem(SESSION_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready) return null;

  if (allowed) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const want = expectedCode();
    if (!want) {
      setError("Demo access is disabled in this environment.");
      return;
    }
    if (input.trim() === want) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setAllowed(true);
      setError(null);
    } else {
      setError("Invalid demo code.");
    }
  };

  const devCode = process.env.NODE_ENV !== "production";

  return (
    <div className="hud-grid-bg -mx-4 px-4 py-10 rounded-2xl">
      <div className="max-w-md mx-auto wwai-panel p-6">
        <div className="text-xs uppercase tracking-widest text-cyan-400">Restricted</div>
        <h1 className="text-2xl font-extrabold text-white mt-2">Client demo access required</h1>
        <p className="text-sm text-slate-400 mt-2">
          The <span className="text-cyan-300">{surface}</span> surface is part of TROPTIONS Operator tools.
          Enter the demo access code provided by your sales rep.
        </p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Demo access code"
            className="w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm text-white"
            autoFocus
          />
          {error && <div className="text-xs text-rose-400">{error}</div>}
          <button type="submit" className="wwai-btn-primary text-sm">Unlock</button>
        </form>
        {devCode && (
          <p className="text-[10px] text-slate-500 mt-4">
            Development fallback code: <code className="text-cyan-300">troptions-demo</code>. Set <code>NEXT_PUBLIC_DEMO_ACCESS_CODE</code> in production.
          </p>
        )}
        <p className="text-[10px] text-slate-500 mt-3">
          This gate is not a security boundary. It exists to keep shared demo links out of operator tools. Real production access uses SSO.
        </p>
      </div>
    </div>
  );
}
