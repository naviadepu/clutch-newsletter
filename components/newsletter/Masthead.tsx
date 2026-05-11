import { HeartRow, PixelHeart, FourPointStar } from "./decorations";

export default function Masthead() {
  return (
    <header className="relative pt-1 text-center">
      {/* Top meta line */}
      <div className="mx-auto flex max-w-[640px] items-center justify-between gap-2 px-2 font-body text-[10px] uppercase tracking-[0.18em] text-clutch-chocolate/80 sm:text-[11px]">
        <span className="flex items-center gap-1.5">
          <PixelHeart size={10} className="heart-pulse" /> May 2026
        </span>
        <span className="hidden sm:inline">Clutch News</span>
        <span>Vol. 01 &middot; Issue 05</span>
      </div>

      <div className="my-1.5 classic-rule mx-auto max-w-[680px]" aria-hidden />

      {/* Decorative scatter — pulled in tighter */}
      <FourPointStar
        size={14}
        color="#EB6E9E"
        className="sparkle-spin absolute left-3 top-3 hidden sm:block"
      />
      <FourPointStar
        size={10}
        color="#D6336C"
        className="sparkle-spin absolute right-4 top-3 hidden sm:block"
        style={{ animationDelay: "0.7s" }}
      />

      {/* Title */}
      <h1
        className="font-masthead distressed mt-1 leading-none text-clutch-ink"
        style={{
          fontSize: "clamp(40px, 8vw, 84px)",
          letterSpacing: "0.01em",
        }}
      >
        Clutch: The Pivot
      </h1>

      {/* Heart-row divider */}
      <div className="mx-auto mt-3 max-w-[680px] px-2">
        <HeartRow count={28} size={9} color="#EB6E9E" />
      </div>
    </header>
  );
}
