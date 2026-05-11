"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PixelHeart,
  SolidHeart,
  FourPointStar,
} from "./decorations";
import Moodboard, { type ScrapId } from "./Moodboard";

const STORAGE_KEY = "clutch_deck_2026_05";

type Illust = "sparkle" | "moon" | "stars" | "bow" | "cherry" | "dumbbell";

type Card = {
  id: ScrapId;
  label: string;
  tag: string;
  illust: Illust;
  bg: string;
  rest: number; // resting rotation in deg
  preview: { title: string; body: string };
};

const CARDS: Card[] = [
  {
    id: "feed",
    label: "friend feed",
    tag: "supporting your real ones",
    illust: "sparkle",
    bg: "#F4C9D6",
    rest: -2.4,
    preview: {
      title: "friend feed",
      body: "ava just posted: haul: best mall girl finds this week",
    },
  },
  {
    id: "cycle",
    label: "cycle tracker",
    tag: "supporting your daily check-in",
    illust: "moon",
    bg: "#FBE9DD",
    rest: 1.6,
    preview: {
      title: "cycle · day 14",
      body: "you're ovulating. energy peaks today.",
    },
  },
  {
    id: "mood",
    label: "mood check-in",
    tag: "supporting your nervous system",
    illust: "stars",
    bg: "#C9D6E2",
    rest: -1.2,
    preview: {
      title: "today's vibe",
      body: "a little anxious. pick a prompt below.",
    },
  },
  {
    id: "outfit",
    label: "outfit picks",
    tag: "supporting your morning chaos",
    illust: "bow",
    bg: "#FBD3DC",
    rest: 2.2,
    preview: {
      title: "outfit pick",
      body: "phase + weather: lace cami + cardigan + denim.",
    },
  },
  {
    id: "recipes",
    label: "recipes",
    tag: "supporting what you eat all day",
    illust: "cherry",
    bg: "#F6EFE3",
    rest: -1.8,
    preview: {
      title: "luteal craving",
      body: "warm bowl of miso udon.",
    },
  },
  {
    id: "fitness",
    label: "fitness",
    tag: "supporting your strong era",
    illust: "dumbbell",
    bg: "#FAE0D2",
    rest: 1.2,
    preview: {
      title: "today's workout",
      body: "20 min pilates.",
    },
  },
];

function CardIllust({ variant, size = 38 }: { variant: Illust; size?: number }) {
  const stroke = "#1B1B1B";
  if (variant === "sparkle") return <FourPointStar size={size} color="#D6336C" />;
  if (variant === "moon")
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={stroke} strokeWidth="1.5">
        <path d="M22 6 a 11 11 0 1 0 4 14 a 9 9 0 0 1 -4 -14 z" fill="#F4C9D6" />
      </svg>
    );
  if (variant === "stars")
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M10 4 L 11.4 9 L 16 10 L 11.4 11 L 10 16 L 8.6 11 L 4 10 L 8.6 9 Z" fill="#D6336C" />
        <path d="M22 14 L 23 17 L 26 18 L 23 19 L 22 22 L 21 19 L 18 18 L 21 17 Z" fill="#EB6E9E" />
        <path d="M14 22 L 15 24.5 L 17.5 25 L 15 25.5 L 14 28 L 13 25.5 L 10.5 25 L 13 24.5 Z" fill="#EB6E9E" />
      </svg>
    );
  if (variant === "bow")
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={stroke} strokeWidth="1.5">
        <path d="M16 16 L 6 9 L 6 23 Z" fill="#EB6E9E" />
        <path d="M16 16 L 26 9 L 26 23 Z" fill="#EB6E9E" />
        <circle cx="16" cy="16" r="2.4" fill="#D6336C" stroke="#1B1B1B" />
      </svg>
    );
  if (variant === "cherry")
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={stroke} strokeWidth="1.5">
        <circle cx="11" cy="22" r="5" fill="#D6336C" />
        <circle cx="21" cy="24" r="5" fill="#EB6E9E" />
        <path d="M11 17 Q 14 8 22 6" />
        <path d="M21 19 Q 22 11 22 6" />
      </svg>
    );
  // dumbbell
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* left weight stack */}
      <rect x="3" y="11" width="3" height="10" fill="#1B1B1B" />
      <rect x="6" y="13" width="3" height="6" fill="#EB6E9E" stroke="#1B1B1B" />
      {/* bar */}
      <rect x="9" y="15" width="14" height="2" fill="#1B1B1B" />
      {/* right weight stack */}
      <rect x="23" y="13" width="3" height="6" fill="#EB6E9E" stroke="#1B1B1B" />
      <rect x="26" y="11" width="3" height="10" fill="#1B1B1B" />
      {/* sparkle accent */}
      <path d="M14 6 L 14.6 8 L 16.6 8.6 L 14.6 9.2 L 14 11.2 L 13.4 9.2 L 11.4 8.6 L 13.4 8 Z" fill="#D6336C" stroke="none" />
    </svg>
  );
}

function PlayingCard({
  card,
  selected,
  pulsing,
}: {
  card: Card;
  selected: boolean;
  pulsing: boolean;
}) {
  return (
    <div
      className="relative paper-card flex flex-col overflow-hidden border-[1.5px] border-clutch-ink shadow-paper"
      style={{
        width: "100%",
        aspectRatio: "3 / 4.2",
        backgroundColor: card.bg,
        borderRadius: "6px",
      }}
    >
      <span
        aria-hidden
        className="halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
      />

      {/* Ace-of-hearts corner */}
      <span
        aria-hidden
        className="absolute left-1.5 top-1 flex flex-col items-center font-body leading-none text-clutch-ink"
        style={{ fontSize: 11 }}
      >
        <span className="font-display italic font-bold">A</span>
        <SolidHeart size={10} color="#1B1B1B" />
      </span>
      <span
        aria-hidden
        className="absolute bottom-1 right-1.5 flex rotate-180 flex-col items-center font-body leading-none text-clutch-ink"
        style={{ fontSize: 11 }}
      >
        <span className="font-display italic font-bold">A</span>
        <SolidHeart size={10} color="#1B1B1B" />
      </span>

      {/* Center illustration + label */}
      <div className="flex flex-1 flex-col items-center justify-center gap-1 px-1 text-center">
        <CardIllust variant={card.illust} size={42} />
        <p
          className="font-script text-clutch-ink"
          style={{ fontSize: 30, lineHeight: 0.95 }}
        >
          {card.label}
        </p>
      </div>

      {/* Tag-style bottom label */}
      <div
        className="mx-auto mb-2 max-w-[88%] -rotate-[1.5deg] border border-clutch-ink/70 bg-clutch-softpink/90 px-1.5 py-[2px] text-center"
        style={{ borderRadius: "1px" }}
      >
        <p
          className="font-body font-bold uppercase tracking-[0.08em] text-clutch-ink"
          style={{ fontSize: 8, lineHeight: 1.1 }}
        >
          {card.tag}
        </p>
      </div>

      {/* Selected stamp */}
      {selected ? (
        <span
          aria-hidden
          className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-clutch-hot text-white shadow-paper"
          style={{ transform: "rotate(8deg)" }}
        >
          <PixelHeart size={14} color="#FFFFFF" />
        </span>
      ) : null}

      {/* Pulse overlay (animation only — non-visual) */}
      {pulsing ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-2 ring-clutch-hot/60"
          style={{ borderRadius: "6px" }}
        />
      ) : null}
    </div>
  );
}

function HeartBurst({ visible }: { visible: boolean }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 90 + Math.random() * 60;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          rotate: -30 + Math.random() * 60,
          size: 14 + Math.random() * 14,
          delay: Math.random() * 0.08,
        };
      }),
    []
  );

  return (
    <AnimatePresence>
      {visible ? (
        <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: h.rotate }}
              animate={{
                x: h.x,
                y: h.y,
                opacity: 0,
                scale: 1.1,
                rotate: h.rotate + 60,
              }}
              transition={{ duration: 0.6, delay: h.delay, ease: "easeOut" }}
              className="absolute"
            >
              <SolidHeart
                size={h.size}
                color={Math.random() > 0.5 ? "#EB6E9E" : "#D6336C"}
              />
            </motion.div>
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export default function BuildYourClutch() {
  const [picked, setPicked] = useState<ScrapId[]>([]);
  const [top1, setTop1] = useState<ScrapId | null>(null);
  const [dealbreaker, setDealbreaker] = useState("");
  const [pulsingId, setPulsingId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [burst, setBurst] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed?.picked)) {
          setPicked(
            parsed.picked.filter((id: string): id is ScrapId =>
              CARDS.some((c) => c.id === id)
            )
          );
        }
        if (
          typeof parsed?.top1 === "string" &&
          CARDS.some((c) => c.id === parsed.top1)
        ) {
          setTop1(parsed.top1 as ScrapId);
        }
        if (typeof parsed?.dealbreaker === "string") {
          setDealbreaker(parsed.dealbreaker);
        }
      }
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ picked, top1, dealbreaker })
      );
    } catch {}
  }, [picked, top1, dealbreaker]);

  // If user removes the card they marked as Your #1, clear top1
  useEffect(() => {
    if (top1 && !picked.includes(top1)) setTop1(null);
  }, [picked, top1]);

  const togglePick = (id: ScrapId) => {
    if (submitted) return;
    setPulsingId(id);
    window.setTimeout(() => setPulsingId(null), 160);
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const pickedCards = picked
    .map((id) => CARDS.find((c) => c.id === id))
    .filter(Boolean) as Card[];

  // If only one card is picked, that one is implicitly Your #1
  const effectiveTop1: ScrapId | null =
    pickedCards.length === 1 ? pickedCards[0].id : top1;

  const handleSubmit = async () => {
    if (submitted) return;
    if (picked.length === 0) return;
    setBurst(true);
    setSubmitted(true);
    const top1Card = CARDS.find((c) => c.id === effectiveTop1);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "deck",
          picked: pickedCards.map((c) => c.label),
          top1: top1Card?.label ?? null,
          dealbreaker: dealbreaker.trim() || null,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.warn("deck post failed", e);
    }
    window.setTimeout(() => setBurst(false), 800);
  };

  return (
    <section className="relative mt-12 px-2 sm:px-4">
      <div className="text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.32em] text-clutch-hot">
          ❤ &nbsp;your deck&nbsp; ❤
        </p>
        <h2
          className="font-display italic mt-1 leading-[0.95] text-clutch-ink"
          style={{ fontSize: "clamp(40px, 7vw, 76px)" }}
        >
          Build your{" "}
          <span
            className="font-script text-clutch-bubblegum"
            style={{ fontSize: "1.2em", lineHeight: 0.6 }}
          >
            Clutch.
          </span>
        </h2>
        <p className="mx-auto mt-1 max-w-[560px] font-body text-[14px] text-clutch-ink/85 sm:text-[15px]">
          Pick the cards you&rsquo;d actually want.{" "}
          <span className="font-display italic text-clutch-hot">
            We&rsquo;re sending the deck to the team.
          </span>
        </p>
      </div>

      <div className="relative mt-6">
        <HeartBurst visible={burst} />

        <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-12 md:items-start">
          {/* DECK GRID — col-span-5 on desktop so the moodboard gets room to breathe */}
          <div className="md:col-span-5">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {CARDS.map((card) => {
                const selected = picked.includes(card.id);
                const pulsing = pulsingId === card.id;
                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    onClick={() => togglePick(card.id)}
                    disabled={submitted}
                    animate={
                      pulsing
                        ? { scale: [1, 1.05, 1] }
                        : { scale: 1, rotate: selected ? 0 : card.rest }
                    }
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    whileHover={
                      submitted ? undefined : { y: -4, rotate: 0, scale: 1.02 }
                    }
                    aria-pressed={selected}
                    aria-label={`${selected ? "Remove" : "Add"} ${card.label}`}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-clutch-hot/60 disabled:cursor-not-allowed"
                    style={{
                      rotate: selected ? "0deg" : `${card.rest}deg`,
                      transformOrigin: "50% 100%",
                    }}
                  >
                    <PlayingCard
                      card={card}
                      selected={selected}
                      pulsing={pulsing}
                    />
                  </motion.button>
                );
              })}
            </div>

            <p className="mt-4 font-pixel text-[14px] tracking-wide text-clutch-chocolate/70">
              {submitted
                ? `deck sent · ${picked.length} card${picked.length === 1 ? "" : "s"}`
                : picked.length === 0
                  ? "tap a card to add it · tap again to remove"
                  : `${picked.length} card${picked.length === 1 ? "" : "s"} picked`}
            </p>
          </div>

          {/* MOODBOARD — col-span-7 */}
          <div className="md:col-span-7">
            <div className="relative">
              <FourPointStar
                size={16}
                color="#EB6E9E"
                className="sparkle-spin absolute -left-3 -top-4"
              />
              <FourPointStar
                size={12}
                color="#D6336C"
                className="sparkle-spin absolute -right-2 top-10"
                style={{ animationDelay: "0.6s" }}
              />
              <Moodboard picked={picked} submitted={submitted} />
            </div>
          </div>
        </div>

        {/* VALIDATION QUESTIONS — visible only after at least one card is picked, hidden after submit */}
        <AnimatePresence initial={false}>
          {!submitted && pickedCards.length >= 1 ? (
            <motion.div
              key="validation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mx-auto mt-8 grid max-w-[1100px] gap-5 md:grid-cols-12 md:items-stretch"
            >
              {/* Question A — Your #1 */}
              {pickedCards.length >= 2 ? (
                <div
                  className="md:col-span-7 relative border-[1.5px] border-dashed border-clutch-ink bg-clutch-paper paper-card p-4 shadow-paper sm:p-5"
                  style={{ transform: "rotate(-1deg)", borderRadius: "3px" }}
                >
                  <FourPointStar
                    size={12}
                    color="#D6336C"
                    className="sparkle-spin absolute -left-2 -top-2"
                  />
                  <PixelHeart
                    size={11}
                    className="heart-pulse absolute -right-2 -top-2"
                  />
                  <div className="text-center">
                    <p className="font-body text-[10px] uppercase tracking-[0.32em] text-clutch-hot">
                      ❤ today&rsquo;s pick ❤
                    </p>
                    <p
                      className="mt-1 font-display italic text-clutch-ink"
                      style={{
                        fontSize: "clamp(18px, 2.4vw, 22px)",
                        lineHeight: 1.2,
                      }}
                    >
                      If you could only open one of these every day, which?
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    {pickedCards.map((card) => {
                      const isTop = top1 === card.id;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() =>
                            setTop1((prev) => (prev === card.id ? null : card.id))
                          }
                          aria-pressed={isTop}
                          className={[
                            "relative flex w-[120px] flex-col items-center gap-1 border bg-white px-2 py-2.5 text-center transition active:translate-y-px",
                            isTop
                              ? "border-clutch-hot ring-2 ring-clutch-hot/50"
                              : "border-clutch-ink/60 hover:border-clutch-ink",
                          ].join(" ")}
                          style={{ borderRadius: "3px" }}
                        >
                          {/* Ace-of-hearts mini corner */}
                          <span
                            aria-hidden
                            className="absolute left-1.5 top-1 flex flex-col items-center font-body leading-none text-clutch-ink"
                            style={{ fontSize: 9 }}
                          >
                            <span className="font-display italic font-bold">A</span>
                            <SolidHeart size={7} color="#1B1B1B" />
                          </span>

                          <span
                            aria-hidden
                            className="halftone pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
                          />

                          <p
                            className="relative font-script text-clutch-ink"
                            style={{ fontSize: 22, lineHeight: 0.95 }}
                          >
                            {card.label}
                          </p>

                          {isTop ? (
                            <span
                              aria-hidden
                              className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-clutch-hot text-white shadow-paper"
                              style={{ transform: "rotate(8deg)" }}
                            >
                              <PixelHeart size={11} color="#FFFFFF" />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-center font-display italic text-[12px] text-clutch-chocolate/80">
                    picking 6 is easy. picking 1 is the real answer.
                  </p>
                </div>
              ) : null}

              {/* Question B — The Dealbreaker (classified ad style) */}
              <div
                className={[
                  "relative bg-clutch-paper paper-card shadow-paper",
                  pickedCards.length >= 2 ? "md:col-span-5" : "md:col-span-12",
                ].join(" ")}
                style={{
                  border: "1.5px solid #1B1B1B",
                  outline: "1.5px solid #1B1B1B",
                  outlineOffset: "3px",
                }}
              >
                <div className="border-b-[1.5px] border-clutch-ink px-4 py-1 text-center sm:px-5">
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.36em] text-clutch-ink">
                    ❤ &nbsp;wanted&nbsp; ❤
                  </p>
                </div>
                <div className="px-4 py-4 sm:px-5">
                  <p
                    className="font-display italic text-clutch-ink"
                    style={{ fontSize: 16, lineHeight: 1.3 }}
                  >
                    things that would make you delete this app within a week.
                  </p>
                  <input
                    type="text"
                    value={dealbreaker}
                    onChange={(e) => setDealbreaker(e.target.value)}
                    placeholder="be brutal. specifics help us most."
                    className="mt-3 w-full border-0 border-b border-dashed border-clutch-ink/70 bg-transparent px-0 pb-1 font-display italic text-clutch-hot placeholder:text-clutch-chocolate/45 focus:border-solid focus:border-clutch-hot focus:outline-none"
                    style={{ fontSize: 16 }}
                  />
                  <p className="mt-2 font-body text-[11px] italic text-clutch-chocolate/70">
                    one sentence is fine. one word is fine.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* SUBMIT or THANKS */}
        <AnimatePresence mode="wait" initial={false}>
          {!submitted ? (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mx-auto mt-8 flex max-w-[860px] flex-col items-center gap-2 text-center"
            >
              <button
                type="button"
                onClick={handleSubmit}
                disabled={picked.length === 0}
                className="group relative inline-flex items-center gap-2 border-[1.5px] border-dashed border-clutch-hot bg-clutch-paper px-6 py-2.5 font-display italic text-clutch-ink shadow-paper transition hover:bg-clutch-hot hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-clutch-paper disabled:hover:text-clutch-ink"
                style={{ borderRadius: "2px", fontSize: 20 }}
              >
                <FourPointStar size={12} color="currentColor" />
                send the deck in
                <span aria-hidden>→</span>
              </button>
              {picked.length === 0 ? (
                <p className="font-body text-[12px] italic text-clutch-chocolate/70">
                  pick at least one to send
                </p>
              ) : (
                <p className="flex items-center gap-1.5 font-body text-[12px] text-clutch-chocolate/80">
                  <PixelHeart size={9} className="heart-pulse" />
                  we read every deck. promise.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 12, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -1.4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative mx-auto mt-8 max-w-[440px]"
            >
              <div
                className="relative bg-white px-4 py-3 paper-card"
                style={{
                  boxShadow:
                    "3px 4px 0 rgba(27,27,27,0.16), 0 1px 0 rgba(27,27,27,0.05)",
                  border: "1px solid rgba(27,27,27,0.18)",
                }}
              >
                <span
                  aria-hidden
                  className="halftone-pink pointer-events-none absolute inset-0 opacity-15"
                />
                <div className="relative flex items-baseline justify-between gap-3">
                  <p className="font-body text-[10px] uppercase tracking-[0.28em] text-clutch-hot">
                    ❤ filed under: noted
                  </p>
                  <p className="font-pixel text-[11px] tracking-wide text-clutch-chocolate/65">
                    {new Date().toISOString().slice(0, 10)}
                  </p>
                </div>
                <h3
                  className="relative font-script text-clutch-ink"
                  style={{
                    fontSize: "clamp(28px, 4.8vw, 38px)",
                    lineHeight: 0.95,
                  }}
                >
                  thanks. we got your deck.
                </h3>
                <p className="relative mt-0.5 font-display italic text-[14px] text-clutch-ink">
                  building from this.
                </p>
                {pickedCards.length ? (
                  <p className="relative mt-2 font-body text-[12px] leading-snug text-clutch-ink">
                    you sent us:{" "}
                    <span className="font-bold text-clutch-hot">
                      {pickedCards.map((c) => c.label).join(", ")}
                    </span>
                    .
                  </p>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
