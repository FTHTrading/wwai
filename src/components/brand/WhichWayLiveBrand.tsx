import WhichWayLiveLogo from "./WhichWayLiveLogo";

interface WhichWayLiveBrandProps {
  /** Show feature pills row beneath the brand mark */
  showFeatures?: boolean;
  /** Show the four logo variations row */
  showVariants?: boolean;
  /** Compact = smaller logo + tighter spacing */
  compact?: boolean;
  className?: string;
}

const FEATURES = [
  { icon: "◎", label: "Real-Time Navigation" },
  { icon: "▣", label: "Crowd Intelligence" },
  { icon: "◈", label: "Live Event Maps" },
  { icon: "✦", label: "Experiences & Rewards" },
  { icon: "▤", label: "Built-In Commerce" },
];

/**
 * Full whichway.live brand hero — pin logo, wordmark, tagline, powered-by line,
 * optional logo variant grid, and optional feature pills.
 *
 * Designed for dark backgrounds (#000–#020611). Use inside a panel or hero section.
 */
export default function WhichWayLiveBrand({
  showFeatures = true,
  showVariants = true,
  compact = false,
  className = "",
}: WhichWayLiveBrandProps) {
  const logoSize = compact ? 150 : 200;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Center column */}
      <div className="flex flex-col items-center text-center">
        {/* Main logo mark */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-br from-[#1f8efb] via-[#2bd0e5] to-[#7ee36a] rounded-full"
          />
          <WhichWayLiveLogo size={logoSize} variant="gradient" className="relative" />
        </div>

        {/* Wordmark */}
        <div className={compact ? "mt-4" : "mt-6"}>
          <h1
            className={`font-extrabold tracking-tight leading-none ${
              compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl md:text-7xl"
            }`}
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            <span className="text-white">whichway</span>
            <span className="bg-gradient-to-r from-[#2bd0e5] to-[#7ee36a] bg-clip-text text-transparent">
              .live
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="mt-4 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-[#1f8efb]" />
          <p
            className="text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold text-slate-200"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Not Sure{" "}
            <span className="text-[#7ee36a]">Where</span>{" "}
            To Go?
          </p>
          <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-[#7ee36a]" />
        </div>

        {/* Powered by TROPTIONS */}
        <div className={`flex items-center gap-3 ${compact ? "mt-6" : "mt-8"}`}>
          <span aria-hidden className="h-px w-12 bg-slate-600" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-slate-400 font-semibold">
            Powered by
          </span>
          <span aria-hidden className="h-px w-12 bg-slate-600" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span
            className="text-2xl sm:text-3xl font-extrabold tracking-[0.15em] text-white"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            TR
            <span className="inline-flex items-center justify-center align-middle">
              {/* The "O" in TROPTIONS styled as a power-button mark */}
              <span className="relative inline-block w-[0.95em] h-[0.95em] mx-[0.02em]">
                <span className="absolute inset-0 rounded-full border-[3px] border-white" />
                <span className="absolute left-1/2 top-[8%] h-[55%] w-[3px] -translate-x-1/2 bg-white" />
              </span>
            </span>
            PTIONS
          </span>
        </div>

        {/* Logo variants row */}
        {showVariants && (
          <div className={`grid grid-cols-4 gap-3 sm:gap-5 ${compact ? "mt-8" : "mt-12"} max-w-md`}>
            <VariantCard variant="gradient" />
            <VariantCard variant="white" />
            <VariantCard variant="mono" />
            <VariantCard variant="outline" />
          </div>
        )}

        {/* Feature pills */}
        {showFeatures && (
          <div className={`${compact ? "mt-8" : "mt-12"} w-full`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 rounded-xl border border-[#1a2540] bg-[#080e1a]/60 px-3 py-2.5 backdrop-blur-sm hover:border-[#2bd0e5]/40 transition-colors"
                >
                  <span
                    className="text-[#2bd0e5] text-base"
                    aria-hidden
                  >
                    {f.icon}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 leading-tight">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VariantCard({ variant }: { variant: "gradient" | "white" | "mono" | "outline" }) {
  const containerClass =
    variant === "white"
      ? "bg-white"
      : variant === "outline"
        ? "bg-transparent border-2 border-[#2bd0e5]/60 rounded-full"
        : "bg-[#0a0f1e] border border-[#1a2540]";

  const rounded = variant === "outline" ? "" : "rounded-2xl";

  return (
    <div className={`flex items-center justify-center aspect-square p-3 ${containerClass} ${rounded}`}>
      <WhichWayLiveLogo size={70} variant={variant} />
    </div>
  );
}
