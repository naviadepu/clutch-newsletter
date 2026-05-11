"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { PixelHeart, SolidHeart } from "./decorations";

type ScrapId =
  | "feed"
  | "cycle"
  | "mood"
  | "outfit"
  | "recipes"
  | "fitness";

type Position = {
  /** percent of board width */
  left: string;
  /** percent of board height */
  top: string;
  rotate: number;
  /** width in px */
  w: number;
};

const POSITIONS: Record<ScrapId, Position> = {
  feed: { left: "4%", top: "4%", rotate: -5, w: 200 },
  cycle: { left: "38%", top: "2%", rotate: 3, w: 180 },
  mood: { left: "70%", top: "10%", rotate: -2, w: 170 },
  outfit: { left: "2%", top: "52%", rotate: 6, w: 180 },
  recipes: { left: "36%", top: "58%", rotate: -4, w: 200 },
  fitness: { left: "70%", top: "55%", rotate: 5, w: 180 },
};

function PushPin({ color = "#D6336C" }: { color?: string }) {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 -top-2 -translate-x-1/2"
      style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14">
        <circle cx="7" cy="6" r="4" fill={color} stroke="#1B1B1B" strokeWidth="1" />
        <circle cx="5.6" cy="4.6" r="1.2" fill="#FFFFFF" opacity="0.7" />
        <line x1="7" y1="10" x2="7" y2="13" stroke="#1B1B1B" strokeWidth="1.4" />
      </svg>
    </span>
  );
}

function TapeStrip({
  className = "",
  rotation = 0,
}: {
  className?: string;
  rotation?: number;
}) {
  return (
    <span
      aria-hidden
      className={`absolute h-3 w-12 bg-clutch-softpink/85 shadow-tape ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 3px, transparent 3px 7px)",
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}

function ScrapShell({
  pin = "pin",
  pinColor,
  bg = "#FFFFFF",
  width,
  rotate,
  className = "",
  children,
}: {
  pin?: "pin" | "tape" | "tape-double";
  pinColor?: string;
  bg?: string;
  width: number;
  rotate: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      layout
      initial={{ y: -40, opacity: 0, rotate, scale: 0.9 }}
      animate={{
        y: 0,
        opacity: 1,
        rotate,
        scale: 1,
      }}
      exit={{ y: -16, opacity: 0, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 18,
        mass: 0.8,
        opacity: { duration: 0.18 },
      }}
      className={`absolute origin-top ${className}`}
      style={{
        width,
        backgroundColor: bg,
        borderRadius: "2px",
        boxShadow:
          "1px 2px 0 rgba(27,27,27,0.06), 4px 6px 14px -4px rgba(74,42,26,0.35)",
      }}
    >
      {pin === "pin" ? <PushPin color={pinColor ?? "#D6336C"} /> : null}
      {pin === "tape" ? <TapeStrip className="-top-2 left-1/2 -translate-x-1/2" rotation={-3} /> : null}
      {pin === "tape-double" ? (
        <>
          <TapeStrip className="-top-2 left-2" rotation={-8} />
          <TapeStrip className="-top-2 right-2" rotation={6} />
        </>
      ) : null}
      {children}
    </motion.div>
  );
}

/* ---------- the 6 scraps ---------- */

function FeedScrap() {
  const p = POSITIONS.feed;
  return (
    <ScrapShell
      pin="pin"
      pinColor="#EB6E9E"
      bg="#FBD3DC"
      width={p.w}
      rotate={p.rotate}
      className="border border-clutch-ink/50 p-2"
      // position handled by parent via absolute coords
    >
      <div className="flex items-start gap-1.5">
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[10px] font-display italic text-clutch-hot"
          style={{ border: "1.5px solid #1B1B1B" }}
        >
          ava
        </span>
        <div
          className="relative flex-1 border border-clutch-ink/60 bg-white/80 p-1.5"
          style={{ borderRadius: "10px 10px 10px 2px" }}
        >
          <p className="font-body text-[10px] leading-snug text-clutch-ink">
            <span className="font-bold">ava just posted:</span> haul: best mall
            girl finds this week
          </p>
        </div>
      </div>
      <p className="mt-1.5 flex items-center gap-1 font-body text-[8px] uppercase tracking-[0.18em] text-clutch-chocolate/75">
        <SolidHeart size={8} color="#D6336C" /> friend feed
      </p>
    </ScrapShell>
  );
}

function CycleScrap() {
  const p = POSITIONS.cycle;
  // Mini calendar — 7-col grid, day 14 highlighted
  return (
    <ScrapShell
      pin="pin"
      pinColor="#D6336C"
      bg="#FBE9DD"
      width={p.w}
      rotate={p.rotate}
      className="border border-clutch-ink/50 p-2"
    >
      <p className="font-body text-[8px] uppercase tracking-[0.22em] text-clutch-chocolate/80">
        may &middot; cycle
      </p>
      <div className="mt-1 grid grid-cols-7 gap-[2px] text-[8px]">
        {Array.from({ length: 21 }).map((_, i) => {
          const day = i + 1;
          const isToday = day === 14;
          return (
            <span
              key={i}
              className="grid aspect-square place-items-center font-pixel text-clutch-ink"
              style={
                isToday
                  ? {
                      borderRadius: "999px",
                      border: "1.5px solid #D6336C",
                      backgroundColor: "#D6336C",
                      color: "#FFFFFF",
                      transform: "scale(1.05)",
                    }
                  : undefined
              }
            >
              {day}
            </span>
          );
        })}
      </div>
      <p className="mt-1.5 font-display italic text-[11px] text-clutch-ink">
        day 14 &middot; ovulating
      </p>
      <p className="font-body text-[9px] text-clutch-chocolate/85">
        energy peaks today.
      </p>
    </ScrapShell>
  );
}

function MoodScrap() {
  const p = POSITIONS.mood;
  // sticky note, yellow, scrawl-style script
  return (
    <ScrapShell
      pin="tape"
      bg="#F4E2A3"
      width={p.w}
      rotate={p.rotate}
      className="p-3"
    >
      <p className="font-body text-[8px] uppercase tracking-[0.22em] text-clutch-chocolate/70">
        post-it
      </p>
      <p
        className="mt-1 font-script text-clutch-ink"
        style={{ fontSize: 22, lineHeight: 1.05, transform: "rotate(-1.5deg)" }}
      >
        today: a little anxious. need a slow morning.
      </p>
      <p className="mt-1 text-right font-script text-clutch-chocolate" style={{ fontSize: 14 }}>
        — me
      </p>
    </ScrapShell>
  );
}

function OutfitScrap() {
  const p = POSITIONS.outfit;
  return (
    <ScrapShell
      pin="tape-double"
      bg="#FFFFFF"
      width={p.w}
      rotate={p.rotate}
      className="px-2 pb-3 pt-2"
    >
      <div
        aria-hidden
        className="relative h-[120px] w-full overflow-hidden border border-clutch-ink/50"
        style={{ background: "linear-gradient(180deg, #F4C9D6 0%, #F4C9D6 55%, #C9D6E2 55%, #C9D6E2 100%)" }}
      >
        <span className="halftone absolute inset-0 opacity-30 mix-blend-multiply" />
        {/* abstract garment shapes */}
        <span
          aria-hidden
          className="absolute left-3 top-3 grid h-12 w-12 place-items-center border-[1.5px] border-clutch-ink/60 bg-white/80 text-base"
          style={{ borderRadius: "8px 8px 14px 14px", transform: "rotate(-6deg)" }}
        >
          <SolidHeart size={14} color="#EB6E9E" />
        </span>
        <span
          aria-hidden
          className="absolute right-2 bottom-2 h-10 w-12 border-[1.5px] border-clutch-ink/60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(27,27,27,0.18) 0 1px, transparent 1px 4px)",
            backgroundColor: "#7B9BB6",
          }}
        />
      </div>
      <p className="mt-2 font-display italic text-[12px] text-clutch-ink" style={{ lineHeight: 1.15 }}>
        phase pick: lace cami + cardigan + denim
      </p>
      <p className="mt-1 font-body text-[8px] uppercase tracking-[0.22em] text-clutch-chocolate/75">
        outfit
      </p>
    </ScrapShell>
  );
}

function RecipeScrap() {
  const p = POSITIONS.recipes;
  return (
    <ScrapShell
      pin="pin"
      pinColor="#7C5BA0"
      bg="#F6EFE3"
      width={p.w}
      rotate={p.rotate}
      className="border border-clutch-ink/50 p-2.5"
    >
      <div className="flex items-center justify-between border-b border-dashed border-clutch-ink/50 pb-1">
        <p className="font-body text-[8px] uppercase tracking-[0.22em] text-clutch-chocolate/80">
          ❤ recipe card
        </p>
        <p className="font-pixel text-[12px] tracking-wide text-clutch-chocolate/70">
          22 min
        </p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {/* Pixel bowl */}
        <svg aria-hidden width="34" height="28" viewBox="0 0 34 28">
          <ellipse cx="17" cy="9" rx="13" ry="4" fill="#EFE5D2" stroke="#1B1B1B" strokeWidth="1.2" />
          <path
            d="M4 9 Q 4 24 17 26 Q 30 24 30 9"
            fill="#FBD3DC"
            stroke="#1B1B1B"
            strokeWidth="1.2"
          />
          <path d="M11 6 Q 13 2 14 6" stroke="#D6336C" strokeWidth="1" fill="none" />
          <path d="M19 5 Q 21 1 22 5" stroke="#D6336C" strokeWidth="1" fill="none" />
        </svg>
        <p
          className="font-display italic text-clutch-ink"
          style={{ fontSize: 14, lineHeight: 1.1 }}
        >
          luteal craving:
          <br />
          warm bowl of miso udon.
        </p>
      </div>
    </ScrapShell>
  );
}

function FitnessScrap() {
  const p = POSITIONS.fitness;
  const week: Array<[string, string]> = [
    ["Mon", "pilates"],
    ["Tue", "long walk + matcha"],
    ["Wed", "rest day, real one"],
    ["Thu", "lift heavy"],
    ["Fri", "dance cardio"],
  ];
  return (
    <ScrapShell
      pin="pin"
      pinColor="#D6336C"
      bg="#FAE0D2"
      width={p.w}
      rotate={p.rotate}
      className="border border-clutch-ink/50 p-2.5"
    >
      <div className="flex items-center justify-between border-b border-dashed border-clutch-ink/50 pb-1">
        <p className="font-body text-[8px] uppercase tracking-[0.22em] text-clutch-chocolate/80">
          this week · workouts
        </p>
        {/* Tiny pixel dumbbell */}
        <svg aria-hidden width="22" height="10" viewBox="0 0 22 10">
          <rect x="0" y="2" width="2" height="6" fill="#1B1B1B" />
          <rect x="2" y="3" width="2" height="4" fill="#1B1B1B" />
          <rect x="4" y="4" width="14" height="2" fill="#1B1B1B" />
          <rect x="18" y="3" width="2" height="4" fill="#1B1B1B" />
          <rect x="20" y="2" width="2" height="6" fill="#1B1B1B" />
        </svg>
      </div>
      <ul className="mt-1.5 space-y-[2px]">
        {week.map(([day, activity]) => (
          <li
            key={day}
            className="flex items-baseline gap-1.5 font-body text-[10px] leading-snug text-clutch-ink"
          >
            <span className="font-bold uppercase tracking-[0.12em] text-clutch-hot">
              {day}
            </span>
            <span className="text-clutch-chocolate/60">·</span>
            <span className="font-display italic">{activity}</span>
          </li>
        ))}
      </ul>
    </ScrapShell>
  );
}

const SCRAP_FOR: Record<ScrapId, () => JSX.Element> = {
  feed: FeedScrap,
  cycle: CycleScrap,
  mood: MoodScrap,
  outfit: OutfitScrap,
  recipes: RecipeScrap,
  fitness: FitnessScrap,
};

function ReceivedStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: -10 }}
      transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
      className="pointer-events-none absolute right-3 top-3 z-30"
    >
      <div
        className="border-[3px] border-clutch-hot bg-transparent px-3 py-1"
        style={{
          borderRadius: "4px",
          boxShadow: "inset 0 0 0 1px rgba(214,51,108,0.4)",
        }}
      >
        <p
          className="font-body font-bold uppercase tracking-[0.2em] text-clutch-hot distressed"
          style={{ fontSize: 22, lineHeight: 1, textShadow: "0.5px 0 0 rgba(214,51,108,0.4)" }}
        >
          Received
        </p>
        <p
          className="text-center font-pixel text-[11px] tracking-wide text-clutch-hot/85"
        >
          {new Date().toISOString().slice(0, 10)}
        </p>
      </div>
    </motion.div>
  );
}

export default function Moodboard({
  picked,
  submitted,
}: {
  picked: ScrapId[];
  submitted: boolean;
}) {
  const visibleSet = new Set(picked);

  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      {/* Push-pin holder + label strip */}
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.28em] text-clutch-chocolate/80">
          <PixelHeart size={9} className="heart-pulse" />
          your moodboard
        </p>
        <p className="font-pixel text-[12px] tracking-wide text-clutch-chocolate/70">
          {picked.length}/6 pinned
        </p>
      </div>

      {/* The board itself */}
      <div
        className="relative overflow-hidden border-[2px] border-clutch-chocolate/80 shadow-[3px_4px_0_rgba(27,27,27,0.18)]"
        style={{
          aspectRatio: "6 / 5",
          backgroundColor: "#E8DAC2",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='c'><feTurbulence type='fractalNoise' baseFrequency='1.7' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.26  0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23c)'/></svg>\")",
          backgroundSize: "180px 180px",
          borderRadius: "3px",
        }}
      >
        {/* Inner frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-1 border border-clutch-chocolate/40"
          style={{ borderRadius: "2px" }}
        />

        {/* Scraps */}
        <AnimatePresence>
          {(Object.keys(POSITIONS) as ScrapId[]).map((id) => {
            if (!visibleSet.has(id)) return null;
            const pos = POSITIONS[id];
            const ScrapComp = SCRAP_FOR[id];
            return (
              <div
                key={id}
                className="absolute"
                style={{ left: pos.left, top: pos.top, width: pos.w }}
              >
                <ScrapComp />
              </div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {picked.length === 0 ? (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <p
                className="font-display italic text-clutch-chocolate/70"
                style={{ fontSize: "clamp(18px, 2.4vw, 22px)", lineHeight: 1.25 }}
              >
                pick a card and watch your{" "}
                <span className="font-script text-clutch-bubblegum" style={{ fontSize: "1.5em" }}>
                  moodboard
                </span>{" "}
                fill in &rarr;
              </p>
              <div className="mx-auto mt-3 flex items-center justify-center gap-2">
                <PushPin color="#EB6E9E" />
                <PushPin color="#D6336C" />
                <PushPin color="#7C5BA0" />
              </div>
            </div>
          </div>
        ) : null}

        {/* RECEIVED stamp on submit */}
        {submitted ? <ReceivedStamp /> : null}
      </div>
    </div>
  );
}

export type { ScrapId };
