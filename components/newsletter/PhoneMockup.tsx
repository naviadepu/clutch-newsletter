import type { ReactNode } from "react";
import { PixelHeart } from "./decorations";

export default function PhoneMockup({
  children,
  rotate = 0,
  className = "",
  caption,
}: {
  children?: ReactNode;
  rotate?: number;
  className?: string;
  caption?: string;
}) {
  return (
    <figure
      className={`relative inline-block ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* Tape strip */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 z-20 h-4 w-16 -translate-x-1/2 -rotate-3 bg-clutch-softpink/80 shadow-tape"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 3px, transparent 3px 7px)",
        }}
      />
      <div
        className="relative rounded-[28px] border-[2px] border-clutch-ink bg-clutch-paper p-2 shadow-[3px_4px_0_rgba(27,27,27,0.18)]"
        style={{ width: "clamp(150px, 18vw, 200px)" }}
      >
        {/* side button + volume rocker */}
        <span
          aria-hidden
          className="absolute -left-[3px] top-[34%] h-8 w-[3px] rounded-l-sm bg-clutch-ink/85"
        />
        <span
          aria-hidden
          className="absolute -right-[3px] top-[28%] h-12 w-[3px] rounded-r-sm bg-clutch-ink/85"
        />
        {/* Notch */}
        <div
          className="mx-auto mb-1 h-3 w-14 rounded-b-xl border-x border-b border-clutch-ink bg-clutch-ink/85"
          aria-hidden
        />
        <div className="aspect-[9/18] overflow-hidden rounded-[18px] border border-clutch-ink/60 bg-clutch-softpink/25">
          {children ?? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
              <PixelHeart size={28} />
              <p className="font-pinyon text-clutch-hot" style={{ fontSize: 26, lineHeight: 1 }}>
                clutch.
              </p>
              <p className="font-body italic text-[10px] text-clutch-chocolate/70">
                give. request. repeat.
              </p>
            </div>
          )}
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center font-display text-[11px] italic text-clutch-chocolate/70">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
