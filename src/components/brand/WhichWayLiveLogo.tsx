import * as React from "react";

interface WhichWayLiveLogoProps {
  size?: number;
  variant?: "gradient" | "white" | "mono" | "outline";
  className?: string;
}

/**
 * WhichWay.live brand mark — pin with question mark and curved road exiting the bottom.
 * Recreates the brand graphic from the official whichway.live launch art.
 */
export default function WhichWayLiveLogo({
  size = 200,
  variant = "gradient",
  className = "",
}: WhichWayLiveLogoProps) {
  const id = React.useId();
  const gradId = `ww-grad-${id}`;
  const arrowGradId = `ww-arrow-${id}`;

  // Color resolution per variant
  const stroke =
    variant === "white"
      ? "#0b1220"
      : variant === "mono"
        ? "#ffffff"
        : variant === "outline"
          ? `url(#${gradId})`
          : `url(#${gradId})`;

  const fillBg = variant === "white" ? "#ffffff" : "transparent";
  const qmColor = variant === "white" ? "#0b1220" : "#ffffff";
  const arrowColor =
    variant === "white" ? "#0b1220" : variant === "mono" ? "#ffffff" : `url(#${arrowGradId})`;

  return (
    <svg
      viewBox="0 0 240 320"
      width={size}
      height={(size * 320) / 240}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="whichway.live"
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f8efb" />
          <stop offset="55%" stopColor="#2bd0e5" />
          <stop offset="100%" stopColor="#7ee36a" />
        </linearGradient>
        <linearGradient id={arrowGradId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1f8efb" />
          <stop offset="100%" stopColor="#7ee36a" />
        </linearGradient>
      </defs>

      {/* Background fill (only used in white variant for square card style) */}
      <rect width="240" height="320" fill={fillBg} />

      {/* Pin head — thick rounded ring (teardrop) */}
      <path
        d="M120 18
           C 60 18, 24 60, 24 115
           C 24 152, 56 178, 90 210
           Q 105 224, 120 226
           Q 135 224, 150 210
           C 184 178, 216 152, 216 115
           C 216 60, 180 18, 120 18 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="22"
        strokeLinejoin="round"
      />

      {/* Question mark inside the pin */}
      <text
        x="120"
        y="148"
        textAnchor="middle"
        fontSize="120"
        fontWeight="900"
        fill={qmColor}
        fontFamily="'Inter', system-ui, -apple-system, sans-serif"
      >
        ?
      </text>

      {/* Curved road exiting the bottom of the pin (left fork) */}
      <path
        d="M 100 215
           C 80 245, 50 250, 30 295"
        stroke={arrowColor}
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right fork with arrow tip */}
      <path
        d="M 140 215
           C 160 245, 180 255, 205 280"
        stroke={arrowColor}
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
      />

      {/* Arrowhead at right fork end pointing up-right */}
      <path
        d="M 205 280 L 218 268 M 205 280 L 200 263"
        stroke={arrowColor}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
