import type { CSSProperties } from "react";

export function PixelHeart({
  size = 12,
  color = "#D6336C",
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  // 7x6 pixel heart
  const cells = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  return (
    <svg
      aria-hidden
      width={size}
      height={(size * 6) / 7}
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      className={className}
      style={style}
    >
      {cells.map((row, y) =>
        row.map((c, x) =>
          c ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
          ) : null
        )
      )}
    </svg>
  );
}

export function SolidHeart({
  size = 14,
  color = "#D6336C",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M12 21s-7.5-4.7-9.7-9.2C.6 7.4 4 3 8.1 3c2 0 3.4 1 3.9 2.4C12.5 4 13.9 3 15.9 3 20 3 23.4 7.4 21.7 11.8 19.5 16.3 12 21 12 21z"
        fill={color}
      />
    </svg>
  );
}

export function FourPointStar({
  size = 14,
  color = "#EB6E9E",
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <path
        d="M12 1 L13.4 10.6 L23 12 L13.4 13.4 L12 23 L10.6 13.4 L1 12 L10.6 10.6 Z"
        fill={color}
      />
    </svg>
  );
}

export function EightPointStar({
  size = 14,
  color = "#D6336C",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M12 0 L13.5 9 L22 6 L15.5 12 L24 12 L15.5 12 L22 18 L13.5 15 L12 24 L10.5 15 L2 18 L8.5 12 L0 12 L8.5 12 L2 6 L10.5 9 Z"
        fill={color}
      />
    </svg>
  );
}

export function HeartRow({
  count = 24,
  color = "#EB6E9E",
  size = 10,
  className = "",
}: {
  count?: number;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex w-full items-center justify-between overflow-hidden ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SolidHeart key={i} size={size} color={color} />
      ))}
    </div>
  );
}

export function Scissors({
  size = 18,
  color = "#1B1B1B",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.6" y2="15.4" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <line x1="8.6" y1="8.6" x2="14" y2="10.5" />
    </svg>
  );
}

export function CutLine({
  className = "",
  withScissors = true,
}: {
  className?: string;
  withScissors?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center gap-2 text-clutch-chocolate/70 ${className}`}
    >
      {withScissors ? <Scissors size={16} /> : null}
      <div
        aria-hidden
        className="h-[1px] flex-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, #4A2A1A 0 6px, transparent 6px 14px)",
        }}
      />
    </div>
  );
}

export function PaintCursor({
  size = 14,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size * 1.4}
      viewBox="0 0 12 17"
      shapeRendering="crispEdges"
      className={`pixel-cursor ${className}`}
      style={style}
    >
      {/* classic Windows arrow cursor — pixel-art */}
      <path
        d="M1 1 L1 12 L4 9 L6 13 L8 12 L6 8 L10 8 Z"
        fill="white"
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Small mock-sketched icon strokes for "newspaper section" headers. */
export function SketchIcon({
  variant,
  size = 28,
  className = "",
}: {
  variant: "home" | "share" | "discover";
  size?: number;
  className?: string;
}) {
  const stroke = "#1B1B1B";
  if (variant === "home") {
    return (
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M5 15 L16 5 L27 15 L27 27 L5 27 Z" />
        <path d="M13 27 L13 19 L19 19 L19 27" />
        <path d="M3 16 L16 4 L29 16" strokeDasharray="2 3" opacity="0.5" />
      </svg>
    );
  }
  if (variant === "share") {
    return (
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="9" cy="16" r="3" />
        <circle cx="23" cy="8" r="3" />
        <circle cx="23" cy="24" r="3" />
        <path d="M11.5 14.5 L20.5 9.5" />
        <path d="M11.5 17.5 L20.5 22.5" />
        <path d="M6 22 Q 16 28 26 22" strokeDasharray="2 3" opacity="0.4" />
      </svg>
    );
  }
  // discover — magnifier with sparkle
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="14" cy="14" r="7" />
      <line x1="19" y1="19" x2="26" y2="26" />
      <path d="M10 14 L18 14 M14 10 L14 18" opacity="0.8" />
      <path d="M24 6 L25 9 L28 10 L25 11 L24 14 L23 11 L20 10 L23 9 Z" fill={stroke} stroke="none" />
    </svg>
  );
}
