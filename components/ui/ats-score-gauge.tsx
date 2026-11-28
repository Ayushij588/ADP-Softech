"use client";

/**
 * AtsScoreGauge — a pure-SVG radial/arc gauge for ATS scores.
 * No extra dependencies; uses Recharts only where this file imports it (none).
 *
 * Props:
 *   score     — integer 0-100
 *   size      — optional pixel diameter (default 160)
 *   showLabel — show the band label below the score (default true)
 */

type AtsScoreGaugeProps = {
  score: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
};

type Band = { label: string; min: number; color: string; track: string };

const BANDS: Band[] = [
  { label: "Strong Match",   min: 85, color: "#10b981", track: "#d1fae5" },
  { label: "Good Match",     min: 70, color: "oklch(39.8% 0.07 227.392)", track: "#dbeafe" },
  { label: "Moderate Match", min: 50, color: "#f59e0b", track: "#fef3c7" },
  { label: "Low Match",      min: 0,  color: "#f43f5e", track: "#ffe4e6" },
];

function getBand(score: number): Band {
  return BANDS.find((b) => score >= b.min) ?? BANDS[BANDS.length - 1];
}

/** Convert polar angle (degrees, 0 = top) to SVG arc end-point */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Build an SVG arc path for a gauge that spans startAngle→endAngle degrees */
function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end   = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

// Gauge spans from -135° to +135° (270° arc)
const GAP          = 45;   // degrees of open gap at the bottom
const START_ANGLE  = 180 + GAP / 2;  // 202.5°
const TOTAL_SWEEP  = 360 - GAP;      // 315°

export function AtsScoreGauge({
  score,
  size = 160,
  showLabel = true,
  className,
}: AtsScoreGaugeProps) {
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const band         = getBand(clampedScore);

  const cx    = size / 2;
  const cy    = size / 2;
  const r     = size * 0.38;
  const sw    = size * 0.085; // stroke width relative to size

  const sweepAngle = (clampedScore / 100) * TOTAL_SWEEP;
  const endAngle   = START_ANGLE + sweepAngle;

  const trackPath  = arcPath(cx, cy, r, START_ANGLE, START_ANGLE + TOTAL_SWEEP);
  const valuePath  = sweepAngle > 0 ? arcPath(cx, cy, r, START_ANGLE, endAngle) : null;

  const fontSize       = size * 0.185;
  const labelFontSize  = size * 0.085;
  const captionFontSize = size * 0.075;

  return (
    <figure
      aria-label={`ATS score: ${clampedScore} out of 100 — ${band.label}`}
      className={`inline-flex flex-col items-center gap-1 ${className ?? ""}`}
      role="img"
    >
      <svg
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Track arc */}
        <path
          d={trackPath}
          fill="none"
          stroke={band.track}
          strokeLinecap="round"
          strokeWidth={sw}
        />
        {/* Value arc */}
        {valuePath && (
          <path
            d={valuePath}
            fill="none"
            stroke={band.color}
            strokeLinecap="round"
            strokeWidth={sw}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        )}
        {/* Score number */}
        <text
          dominantBaseline="central"
          fill="currentColor"
          fontSize={fontSize}
          fontWeight="700"
          textAnchor="middle"
          x={cx}
          y={cy - size * 0.04}
        >
          {clampedScore}
        </text>
        {/* "/100" caption */}
        <text
          dominantBaseline="central"
          fill="#94a3b8"
          fontSize={captionFontSize}
          textAnchor="middle"
          x={cx}
          y={cy + fontSize * 0.65}
        >
          / 100
        </text>
      </svg>
      {showLabel && (
        <figcaption
          className="text-center font-semibold leading-tight"
          style={{ color: band.color, fontSize: labelFontSize }}
        >
          {band.label}
        </figcaption>
      )}
    </figure>
  );
}
