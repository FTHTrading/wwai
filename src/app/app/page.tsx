import BrandDisclaimer from "@/components/BrandDisclaimer";

const APP_MODULES = [
  { icon: "🗺", label: "Map",           desc: "Venue wayfinding, sponsor & POS locations, safety routes" },
  { icon: "🎁", label: "Offers",        desc: "Sponsor deals, local business offers, fan discounts" },
  { icon: "⭐", label: "Rewards",       desc: "Loyalty points, redemptions, and reward history" },
  { icon: "👜", label: "Wallet",        desc: "NFT passes, receipts, credentials, payout balance" },
  { icon: "🤖", label: "AI Help",       desc: "Clawd AI concierge for navigation, support, and offers" },
  { icon: "🏆", label: "Sponsor Deals", desc: "Active sponsor offers, promo videos, map-based discovery" },
  { icon: "🧾", label: "Receipts",      desc: "POS and sponsor receipts anchored to audit records" },
  { icon: "🛡", label: "Safety / Help", desc: "Emergency routes, help desks, staff escalation" },
];

export default function AppPage() {
  return (
    <div className="space-y-12 max-w-3xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-block bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Consumer App
        </div>
        <h1 className="text-4xl font-extrabold text-white">
          <span className="gradient-cyan">TROPTIONS</span>™ App
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          The full TROPTIONS fan experience on your phone — live ops mapping, offers, rewards, AI help, sponsor deals, receipts, and emergency routing.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a href="#install" className="bg-cyan-500 text-gray-950 font-bold px-6 py-3 rounded-xl hover:bg-cyan-400 transition-colors">📱 Install App (PWA)</a>
          <a href="/map"     className="border border-slate-700 text-slate-300 font-bold px-6 py-3 rounded-xl hover:border-cyan-500/50 transition-colors">🗺 Safety Map</a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {APP_MODULES.map((m) => (
          <div key={m.label} className="card-dark-hover rounded-2xl p-5 text-center space-y-2">
            <div className="text-3xl">{m.icon}</div>
            <p className="font-bold text-white text-sm">{m.label}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>

      <div id="install" className="bg-linear-to-b from-cyan-950 to-gray-900 border border-cyan-800/40 rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-white">Install on iOS or Android</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          TROPTIONS is a Progressive Web App (PWA). No app store required. Open the site in your mobile browser and tap <strong className="text-white">Add to Home Screen</strong>.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto text-left">
          {[
          { os: "iOS (Safari)", steps: ["Open troptions.unykorn.org in Safari", "Tap the Share icon (□↑)", "Tap 'Add to Home Screen'", "Tap 'Add'"] },
            { os: "Android (Chrome)", steps: ["Open troptions.unykorn.org in Chrome", "Tap the menu (⋮)", "Tap 'Add to Home Screen'", "Tap 'Install'"] },
          ].map(({ os, steps }) => (
            <div key={os} className="card-dark rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold text-cyan-400">{os}</p>
              <ol className="space-y-1">
                {steps.map((s, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-2"><span className="text-cyan-600 shrink-0">{i + 1}.</span>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <BrandDisclaimer />
    </div>
  );
}
