"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { PixelHeart, FourPointStar, PaintCursor } from "./decorations";

export type PickerItem = {
  id: string;
  caption: string;
  /** absolute path under /public, e.g. /newsletter/ootd/01.jpg */
  imageSrc: string;
  /** background color shown behind the image (and as placeholder fill) */
  bg: string;
  /** baseline simulated vote share so totals look like real reader data */
  base: number;
};

type Props = {
  eyebrow: string;
  /** two italic display lines, used for the big script header */
  headerLines: [string, string];
  items: PickerItem[];
  /** pick exactly 1, or up to N */
  maxPicks?: number;
  storageKey: string;
  /** copy below the canvas explaining the picked state */
  emptyHint?: string;
  /** compact mode: smaller paint window + simpler single-line header */
  compact?: boolean;
  /** hide the "see what other girls picked" toggle */
  hideStatsToggle?: boolean;
  /** notified whenever the picks change (so parents can mirror state) */
  onPickChange?: (picks: string[]) => void;
};

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
      <ToolbarIcon>
        <FourPointStar size={11} color="#D6336C" />
      </ToolbarIcon>
      <ToolbarIcon>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          stroke="#1B1B1B"
          strokeWidth="1"
          strokeDasharray="2 2"
          fill="none"
        >
          <rect x="2" y="2" width="10" height="10" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="#1B1B1B">
          <rect x="3" y="6" width="8" height="3" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          stroke="#1B1B1B"
          strokeWidth="1.2"
          fill="none"
        >
          <path d="M2 12 L8 6 L11 9 L13 7" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          stroke="#1B1B1B"
          strokeWidth="1.2"
          fill="none"
        >
          <circle cx="7" cy="6" r="3" />
          <line x1="9" y1="9" x2="13" y2="13" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="#1B1B1B">
          <circle cx="7" cy="7" r="3" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          stroke="#1B1B1B"
          strokeWidth="1.2"
          fill="none"
        >
          <line x1="3" y1="3" x2="11" y2="11" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          stroke="#1B1B1B"
          strokeWidth="1.2"
          fill="none"
        >
          <path d="M3 11 Q 7 2 11 11" />
        </svg>
      </ToolbarIcon>
      <ToolbarIcon>
        <span className="font-pixel text-[12px] leading-none text-clutch-ink">
          A
        </span>
      </ToolbarIcon>
      <ToolbarIcon>
        <PixelHeart size={10} />
      </ToolbarIcon>
    </div>
  );
}

function ColorPalette() {
  const swatches = [
    "#F6EFE3",
    "#FFFFFF",
    "#4A2A1A",
    "#EB6E9E",
    "#D6336C",
    "#F4C9D6",
    "#C9D6E2",
    "#1B1B1B",
    "#EFE5D2",
  ];
  return (
    <div className="flex items-center gap-2 border-t border-clutch-ink/40 px-2 py-1.5">
      <div
        className="h-6 w-6 border border-clutch-ink/60"
        style={{
          background: "linear-gradient(135deg, #1B1B1B 50%, #FFFFFF 50%)",
        }}
        aria-hidden
      />
      <div className="flex flex-wrap gap-[3px]">
        {swatches.map((s) => (
          <span
            key={s}
            className="h-3.5 w-3.5 border border-clutch-ink/40"
            style={{ backgroundColor: s }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

function OutfitTile({
  item,
  selected,
  showPercentages,
  percent,
  onSelect,
  shaking,
}: {
  item: PickerItem;
  selected: boolean;
  showPercentages: boolean;
  percent: number;
  onSelect: () => void;
  shaking: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Pick: ${item.caption}`}
      className={[
        "group relative aspect-[4/5] overflow-hidden border-[1.5px] text-left transition focus:outline-none",
        selected
          ? "border-clutch-hot ring-2 ring-clutch-hot/60"
          : "border-clutch-ink/50 hover:border-clutch-ink",
        shaking ? "tile-shake" : "",
      ].join(" ")}
      style={{ backgroundColor: item.bg }}
    >
      {/* image — or styled fallback */}
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
          <span
            className="halftone h-[60%] w-[60%] rounded border-[1.5px] border-clutch-ink/40 bg-white/40"
            style={{ opacity: 0.75 }}
          />
          <span className="font-script text-clutch-hot" style={{ fontSize: 22, lineHeight: 1 }}>
            more soon &hearts;
          </span>
        </span>
      )}

      {/* halftone print scrim */}
      <span
        aria-hidden
        className="halftone absolute inset-0 opacity-25 mix-blend-multiply"
      />

      {/* caption strip */}
      <span className="absolute bottom-1 right-1 z-10 bg-clutch-paper/90 px-1.5 py-[1px] font-pixel text-[12px] tracking-wide text-clutch-ink">
        {item.caption}
      </span>

      {/* selected sticker */}
      {selected ? (
        <span
          aria-hidden
          className="absolute -right-2 -top-2 z-20 grid h-9 w-9 place-items-center rounded-full bg-clutch-hot text-white shadow-paper"
          style={{
            transform: "rotate(8deg)",
          }}
        >
          <PixelHeart size={14} color="#FFFFFF" />
        </span>
      ) : null}

      {/* percentage overlay */}
      {showPercentages ? (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-clutch-paper/85 px-1.5 py-1 backdrop-blur-[2px]">
          <div className="flex items-center justify-between font-pixel text-[12px] text-clutch-ink">
            <span>{percent.toFixed(0)}%</span>
            <span className="text-clutch-hot">girls</span>
          </div>
          <div className="mt-1 h-1.5 w-full border border-clutch-ink/40 bg-white">
            <div
              className="h-full bg-clutch-hot"
              style={{ width: `${Math.max(2, percent)}%` }}
            />
          </div>
        </div>
      ) : null}
    </button>
  );
}

export default function PaintWindowPicker({
  eyebrow,
  headerLines,
  items,
  maxPicks = 1,
  storageKey,
  emptyHint = "pick one. (it just lives in your browser.)",
  compact = false,
  hideStatsToggle = false,
  onPickChange,
}: Props) {
  const [picks, setPicks] = useState<string[]>([]);
  const [showPercentages, setShowPercentages] = useState(false);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const canvasRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const hydrated = useRef(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPicks(parsed.filter((id) => items.some((i) => i.id === id)));
        }
      }
    } catch {}
    hydrated.current = true;
  }, [storageKey, items]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      if (picks.length) {
        window.localStorage.setItem(storageKey, JSON.stringify(picks));
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch {}
    onPickChange?.(picks);
  }, [picks, storageKey, onPickChange]);

  // Cursor lerp animation over the canvas
  useEffect(() => {
    const tick = () => {
      setCursor((prev) => {
        const dx = targetRef.current.x - prev.x;
        const dy = targetRef.current.y - prev.y;
        if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) return prev;
        return {
          ...prev,
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleCanvasMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setCursor((prev) => ({ ...prev, visible: true }));
  };

  const handleCanvasLeave = () =>
    setCursor((prev) => ({ ...prev, visible: false }));

  const handleSelect = (id: string) => {
    setShakingId(id);
    window.setTimeout(() => setShakingId(null), 160);

    setPicks((prev) => {
      if (maxPicks === 1) {
        return prev.includes(id) ? [] : [id];
      }
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= maxPicks) return prev;
      return [...prev, id];
    });
  };

  // tallies: each item's base + 1 if user picked it
  const totals = useMemo(
    () => items.map((it) => it.base + (picks.includes(it.id) ? 1 : 0)),
    [items, picks]
  );
  const totalAll = totals.reduce((a, b) => a + b, 0) || 1;

  const pickedItems = picks
    .map((id) => items.find((i) => i.id === id))
    .filter(Boolean) as PickerItem[];

  return (
    <section
      className={
        compact
          ? "relative px-0"
          : "relative mt-10 px-2 sm:px-4"
      }
    >
      <div className={compact ? "text-center" : "text-center"}>
        <p className="font-body text-[10px] uppercase tracking-[0.28em] text-clutch-hot sm:text-[11px]">
          {eyebrow}
        </p>
        {compact ? (
          <h3
            className="font-display italic mt-0.5 leading-[1.05] text-clutch-ink"
            style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
          >
            {headerLines[0]} {headerLines[1]}
          </h3>
        ) : (
          <>
            <h2
              className="font-display italic leading-[0.85] text-clutch-bubblegum"
              style={{ fontSize: "clamp(40px, 7vw, 72px)" }}
            >
              {headerLines[0]}
            </h2>
            <h3
              className="font-display italic -mt-1 leading-[0.95] text-clutch-ink"
              style={{ fontSize: "clamp(28px, 4.6vw, 48px)" }}
            >
              {headerLines[1]}
            </h3>
          </>
        )}
      </div>

      <div
        className={
          compact
            ? "relative mx-auto mt-2 max-w-[460px]"
            : "relative mx-auto mt-4 max-w-[680px]"
        }
      >
        <div
          aria-hidden
          className="absolute -inset-3 -z-10 rounded-[8px] halftone opacity-50 sm:-inset-5"
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
          <div className="flex items-center justify-between border-b-2 border-clutch-ink bg-clutch-bubblegum px-2 py-1">
            <div className="flex items-center gap-1.5">
              <PixelHeart size={9} color="#FFF" />
              <span className="font-pixel text-[14px] tracking-wide text-white">
                untitled - Paint
              </span>
            </div>
            <div className="flex gap-1">
              <span className="grid h-3.5 w-4 place-items-center border border-white/80 bg-clutch-softpink font-pixel text-[12px] leading-none text-clutch-ink">
                _
              </span>
              <span className="grid h-3.5 w-4 place-items-center border border-white/80 bg-clutch-softpink font-pixel text-[12px] leading-none text-clutch-ink">
                □
              </span>
              <span className="grid h-3.5 w-4 place-items-center border border-white/80 bg-clutch-softpink font-pixel text-[12px] leading-none text-clutch-ink">
                ×
              </span>
            </div>
          </div>

          <div className="flex gap-3 border-b border-clutch-ink/50 bg-clutch-paper/90 px-3 py-1 font-pixel text-[12px] tracking-wide text-clutch-ink">
            <span>
              <u>F</u>ile
            </span>
            <span>
              <u>E</u>dit
            </span>
            <span>
              <u>V</u>iew
            </span>
            <span>
              <u>I</u>mage
            </span>
            <span className="ml-auto">
              <u>H</u>elp
            </span>
          </div>

          <div className="flex">
            <PaintToolbar />
            <div
              ref={canvasRef}
              onMouseMove={handleCanvasMove}
              onMouseLeave={handleCanvasLeave}
              className="relative flex-1 cursor-none bg-white p-2.5 sm:p-3"
            >
              <div
                className={
                  compact
                    ? "grid grid-cols-2 gap-2"
                    : "grid grid-cols-2 gap-2 sm:grid-cols-3"
                }
              >
                {items.map((item, i) => {
                  const percent = (totals[i] / totalAll) * 100;
                  return (
                    <OutfitTile
                      key={item.id}
                      item={item}
                      selected={picks.includes(item.id)}
                      showPercentages={showPercentages}
                      percent={percent}
                      onSelect={() => handleSelect(item.id)}
                      shaking={shakingId === item.id}
                    />
                  );
                })}
              </div>

              {cursor.visible ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute z-30"
                  style={{
                    left: cursor.x,
                    top: cursor.y,
                    transform: "translate(-2px, -2px)",
                  }}
                >
                  <PaintCursor size={16} />
                </span>
              ) : null}

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-clutch-ink/40 pt-2">
                <div className="font-pixel text-[12px] text-clutch-ink">
                  {pickedItems.length ? (
                    maxPicks === 1 ? (
                      <span>
                        you picked&nbsp;
                        <span className="text-clutch-hot">
                          {pickedItems[0].caption}
                        </span>{" "}
                        <PixelHeart
                          size={9}
                          className="inline-block heart-pulse align-middle"
                        />
                      </span>
                    ) : (
                      <span>
                        you&rsquo;d open these{" "}
                        {pickedItems.length === maxPicks
                          ? "three"
                          : pickedItems.length === 2
                          ? "two"
                          : "one"}
                        :{" "}
                        <span className="text-clutch-hot">
                          {pickedItems.map((i) => i.caption).join(", ")}
                        </span>
                      </span>
                    )
                  ) : (
                    <span className="text-clutch-chocolate/80">
                      {emptyHint}
                    </span>
                  )}
                </div>

                {hideStatsToggle ? null : (
                  <button
                    type="button"
                    onClick={() => setShowPercentages((v) => !v)}
                    className="border border-clutch-ink bg-clutch-paper px-3 py-[3px] font-pixel text-[12px] tracking-wide text-clutch-ink hover:bg-clutch-softpink/60"
                    style={{ borderRadius: "2px" }}
                  >
                    {showPercentages
                      ? "hide vote bars"
                      : "see what other girls picked"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <ColorPalette />
        </div>
      </div>
    </section>
  );
}
