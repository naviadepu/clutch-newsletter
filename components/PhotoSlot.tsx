import type { CSSProperties, ReactNode } from "react";

type PhotoSlotProps = {
  src?: string;
  alt?: string;
  className?: string;
  rounded?: string;
  aspectRatio?: string;
  /** Optional content to render on top of (or instead of) the placeholder. */
  children?: ReactNode;
  /** Subtle hint shown when no src is provided. */
  hint?: string;
  style?: CSSProperties;
};

/**
 * A drop-in placeholder for product, avatar, and feed photos in the poster.
 * Pass `src` later to render the real image; otherwise it renders a soft
 * pink scrapbook-style placeholder so the layout stays intact.
 */
export default function PhotoSlot({
  src,
  alt = "",
  className = "",
  rounded = "rounded-lg",
  aspectRatio,
  children,
  hint,
  style,
}: PhotoSlotProps) {
  const baseClasses = `relative overflow-hidden ${rounded} ${className}`;
  const mergedStyle: CSSProperties = {
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  if (src) {
    return (
      <div className={baseClasses} style={mergedStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} flex items-center justify-center bg-gradient-to-br from-clutch-blush to-clutch-pink/70 ring-1 ring-inset ring-clutch-pink/40`}
      style={mergedStyle}
      aria-label={alt || hint || "photo placeholder"}
      role="img"
    >
      <div className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.45) 0 6px, transparent 6px 12px)",
        }}
      />
      {hint ? (
        <span className="relative text-[9px] font-medium uppercase tracking-[0.18em] text-clutch-hot/70">
          {hint}
        </span>
      ) : null}
      {children}
    </div>
  );
}
