
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Demo Access — TROPTIONS · WWAI",
  description: "Enter the shared demo access code to view operator surfaces.",
};

const COOKIE_NAME = "wwai_demo_access";

async function unlock(formData: FormData) {
  "use server";
  const submitted = String(formData.get("code") ?? "").trim();
  const fromRaw = String(formData.get("from") ?? "/");
  // Only allow same-origin relative paths for the redirect target.
  const from = fromRaw.startsWith("/") && !fromRaw.startsWith("//") ? fromRaw : "/";

  const expected = process.env.DEMO_ACCESS_CODE;
  const devFallback =
    process.env.NODE_ENV !== "production" ? "troptions-demo" : null;

  const valid =
    (expected && submitted === expected) ||
    (devFallback && submitted === devFallback);

  if (!valid) {
    redirect(`/demo-access?from=${encodeURIComponent(from)}&error=1`);
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  redirect(from);
}

export default async function DemoAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const from = sp.from && sp.from.startsWith("/") ? sp.from : "/";
  const showError = sp.error === "1";
  const showDevHint = process.env.NODE_ENV !== "production";

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Client demo access required.</h1>
        <p className="mt-2 text-sm text-slate-600">
          This area is restricted to demo viewers. Enter the demo access code provided
          by your TROPTIONS sales contact.
        </p>

        <form action={unlock} className="mt-5 flex flex-col gap-3">
          <input type="hidden" name="from" value={from} />
          <label className="text-sm font-medium text-slate-700" htmlFor="code">
            Demo access code
          </label>
          <input
            id="code"
            name="code"
            type="password"
            autoComplete="off"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
            placeholder="Enter code"
          />
          {showError ? (
            <p className="text-sm text-rose-600">Incorrect code. Try again.</p>
          ) : null}
          <button
            type="submit"
            className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Unlock
          </button>
        </form>

        {showDevHint ? (
          <p className="mt-4 text-xs text-slate-500">
            Dev fallback code: <code className="rounded bg-slate-100 px-1 py-0.5">troptions-demo</code>
            {" "}(not active in production).
          </p>
        ) : null}

        <p className="mt-6 text-xs text-slate-500">
          This is demo gating, not production auth. Replace with real SSO before
          live customer data flows through these surfaces.
        </p>
      </div>
    </main>
  );
}
