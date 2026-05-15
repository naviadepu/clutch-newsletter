"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import { PixelHeart, FourPointStar, PaintCursor } from "./decorations";

// ─── Data ────────────────────────────────────────────────────────────────────

type OutfitItem = {
  id: string;
  caption: string;
  imageSrc: string;
  bg: string;
};

const OUTFITS: OutfitItem[] = [
  { id: "pink-lace",  caption: "pink lace + raw denim", imageSrc: "/newsletter/ootd/01.jpg", bg: "#F4C9D6" },
  { id: "stripes",    caption: "stripes & strings",      imageSrc: "/newsletter/ootd/03.jpg", bg: "#FBE9DD" },
  { id: "ballet",     caption: "ballet flats fit",       imageSrc: "/newsletter/ootd/04.jpg", bg: "#F6EFE3" },
  { id: "lace-cami",  caption: "lace cami + dark wash",  imageSrc: "/newsletter/ootd/06.jpg", bg: "#EFE5D2" },
];

export const OOTD_ITEMS = OUTFITS;

type Reading = { hook: string; body: string };

const READINGS: Record<string, Reading> = {
  "pink-lace":  { hook: "soft launch szn.",           body: "you're easing into something new this week. take it slow" },
  "stripes":    { hook: "main character energy.",      body: "say yes to the thing you've been overthinking" },
  "ballet":     { hook: "quiet luxury week.",          body: "you're moving through the world unbothered" },
  "lace-cami":  { hook: "feminine rage, contained.",   body: "you've got a soft surface and a sharp interior right now" },
};

// ─── Paint chrome ────────────────────────────────────────────────────────────

function ToolbarIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="grid h-6 w-6 place-items-center border border-clutch-ink/40 bg-white/70 text-clutch-ink"
    >
      {children}
    </span>
  );
}

function PaintToolbar() {
  return (
    <div className="grid grid-cols-2 gap-1 border-r border-clutch-ink/40 p-1.5">
      <ToolbarIcon><FourPointStar size={11} color="#D6336C" /></ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" stroke="#1B1B1B" strokeWidth="1" strokeDasharray="2 2" fill="none">
          <rect x="2" y="2" width="10" height="10" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="#1B1B1B">
          <rect x="3" y="6" width="8" height="3" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" stroke="#1B1B1B" strokeWidth="1.2" fill="none">
          <path d="M2 12 L8 6 L11 9 L13 7" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" stroke="#1B1B1B" strokeWidth="1.2" fill="none">
          <circle cx="7" cy="6" r="3" /><line x1="9" y1="9" x2="13" y2="13" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="#1B1B1B">
          <circle cx="7" cy="7" r="3" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" stroke="#1B1B1B" strokeWidth="1.2" fill="none">
          <line x1="3" y1="3" x2="11" y2="11" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" stroke="#1B1B1B" strokeWidth="1.2" fill="none">
          <path d="M3 11 Q 7 2 11 11" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <span className="font-pixel text-[12px] leading-none text-clutch-ink">A</span>
      </ToolbarIcon>
      <ToolbarIcon><PixelHeart size={10} /></ToolbarIcon>
    </div>
  );
}

function ColorPalette() {
  const swatches = ["#F6EFE3","#FFFFFF","#4A2A1A","#EB6E9E","#D6336C","#F4C9D6","#C9D6E2","#1B1B1B","#EFE5D2"];
  return (
    <div className="flex items-center gap-2 border-t border-clutch-ink/40 px-2 py-1.5">
      <div className="h-6 w-6 border border-clutch-ink/60" style={{ background: "linear-gradient(135deg, #1B1B1B 50%, #FFFFFF 50%)" }} aria-hidden />
      <div className="flex flex-wrap gap-[3px]">
        {swatches.map((s) => (
          <span key={s} className="h-3.5 w-3.5 border border-clutch-ink/40" style={{ backgroundColor: s }} aria-hidden />
        ))}
      </div>
    </div>
  );
}

// ─── Outfit tile ─────────────────────────────────────────────────────────────

function OutfitTile({
  item,
  selected,
  onSelect,
}: {
  item: OutfitItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Pick: ${item.caption}`}
      className={[
        "group relative aspect-[4/5] overflow-hidden border-[1.5px] text-left focus:outline-none",
        selected
          ? "border-clutch-hot ring-2 ring-clutch-hot/60"
          : "border-clutch-ink/50 hover:border-clutch-ink",
      ].join(" ")}
      style={{ backgroundColor: item.bg }}
    >
      {!imgFailed ? (
        <span className="absolute inset-0">
          <Image
            src={item.imageSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover"
            onError={() => setImgFailed(true)}
            unoptimized
          />
        </span>
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        >
          <span className="halftone h-[60%] w-[60%] rounded border-[1.5px] border-clutch-ink/40 bg-white/40" style={{ opacity: 0.75 }} />
          <span className="font-script text-clutch-hot" style={{ fontSize: 22, lineHeight: 1 }}>more soon &hearts;</span>
        </span>
      )}

      <span aria-hidden className="halftone absolute inset-0 opacity-25 mix-blend-multiply" />

      <span className="absolute bottom-1 right-1 z-10 bg-clutch-paper/90 px-1.5 py-[1px] font-pixel text-[12px] tracking-wide text-clutch-ink">
        {item.caption}
      </span>

      {selected && (
        <span
          aria-hidden
          className="absolute -right-2 -top-2 z-20 grid h-9 w-9 place-items-center rounded-full bg-clutch-hot text-white shadow-paper"
          style={{ transform: "rotate(8deg)" }}
        >
          <PixelHeart size={14} color="#FFFFFF" />
        </span>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OutfitOfTheDay({
  onPickChange,
}: {
  onPickChange?: (picks: string[]) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const tick = () => {
      setCursor((prev) => {
        const dx = targetRef.current.x - prev.x;
        const dy = targetRef.current.y - prev.y;
        if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) return prev;
        return { ...prev, x: prev.x + dx * 0.18, y: prev.y + dy * 0.18 };
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleCanvasMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCursor((prev) => ({ ...prev, visible: true }));
  };

  const handleSelect = (id: string) => {
    const next = id === selectedId ? null : id;
    setSelectedId(next);
    onPickChange?.(next ? [next] : []);
  };

  const handleReset = () => {
    setSelectedId(null);
    onPickChange?.([]);
  };

  const reading = selectedId ? READINGS[selectedId] : null;

  return (
    <section className="relative px-0">
      <div className="text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.28em] text-clutch-hot sm:text-[11px]">
          ❤&nbsp;&nbsp;today&rsquo;s puzzle&nbsp;&nbsp;❤
        </p>
        <h3
          className="font-display italic mt-0.5 leading-[1.05] text-clutch-ink"
          style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
        >
          What fit are you today?
        </h3>
      </div>

      <div className="relative mx-auto mt-2 max-w-[460px]">
        <div
          aria-hidden
          className="absolute -inset-3 -z-10 rounded-[8px] halftone opacity-50"
        />
        <FourPointStar
          size={18}
          color="#EB6E9E"
          className="sparkle-spin absolute -left-3 -top-4"
          style={{ animationDelay: "0.1s" } as CSSProperties}
        />
        <FourPointStar
          size={12}
          color="#D6336C"
          className="sparkle-spin absolute -right-2 top-6"
          style={{ animationDelay: "0.6s" } as CSSProperties}
        />

        <div className="border-[2px] border-clutch-ink bg-clutch-paper shadow-[4px_5px_0_rgba(27,27,27,0.18)]">
          {/* Title bar */}
          <div className="flex items-center justify-between border-b-2 border-clutch-ink bg-clutch-bubblegum px-2 py-1">
            <div className="flex items-center gap-1.5">
              <PixelHeart size={9} color="#FFF" />
              <span className="font-pixel text-[14px] tracking-wide text-white">untitled - Paint</span>
            </div>
            <div className="flex gap-1">
              <span className="grid h-3.5 w-4 place-items-center border border-white/80 bg-clutch-softpink font-pixel text-[12px] leading-none text-clutch-ink">_</span>
              <span className="grid h-3.5 w-4 place-items-center border border-white/80 bg-clutch-softpink font-pixel text-[12px] leading-none text-clutch-ink">□</span>
              <span className="grid h-3.5 w-4 place-items-center border border-white/80 bg-clutch-softpink font-pixel text-[12px] leading-none text-clutch-ink">×</span>
            </div>
          </div>

          {/* Menu bar */}
          <div className="flex gap-3 border-b border-clutch-ink/50 bg-clutch-paper/90 px-3 py-1 font-pixel text-[12px] tracking-wide text-clutch-ink">
            <span><u>F</u>ile</span>
            <span><u>E</u>dit</span>
            <span><u>V</u>iew</span>
            <span><u>I</u>mage</span>
            <span className="ml-auto"><u>H</u>elp</span>
          </div>

          {/* Toolbar + canvas */}
          <div className="flex">
            <PaintToolbar />

            <div
              ref={canvasRef}
              onMouseMove={handleCanvasMove}
              onMouseLeave={() => setCursor((p) => ({ ...p, visible: false }))}
              className="relative flex-1 cursor-none bg-white p-2.5 sm:p-3"
            >
              <div className="grid grid-cols-2 gap-2">
                {OUTFITS.map((outfit) => (
                  <OutfitTile
                    key={outfit.id}
                    item={outfit}
                    selected={selectedId === outfit.id}
                    onSelect={() => handleSelect(outfit.id)}
                  />
                ))}
              </div>

              {/* Caption / reading */}
              <div className="mt-2.5 border-t border-clutch-ink/40 pt-2 font-pixel text-[12px] text-clutch-ink">
                {reading ? (
                  <span>
                    <span className="font-display italic text-clutch-hot">{reading.hook}</span>
                    {" "}{reading.body}{" "}
                    <PixelHeart size={9} className="inline-block heart-pulse align-middle" />
                    <button
                      type="button"
                      onClick={handleReset}
                      className="ml-2 font-pixel text-[11px] text-clutch-chocolate/55 underline underline-offset-2 hover:text-clutch-hot"
                    >
                      try another
                    </button>
                  </span>
                ) : (
                  <span className="text-clutch-chocolate/80">
                    click an outfit for your reading ♥
                  </span>
                )}
              </div>

              {cursor.visible && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute z-30"
                  style={{ left: cursor.x, top: cursor.y, transform: "translate(-2px, -2px)" }}
                >
                  <PaintCursor size={16} />
                </span>
              )}
            </div>
          </div>

          <ColorPalette />
        </div>
      </div>
    </section>
  );
}
