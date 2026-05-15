"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PixelHeart,
  SolidHeart,
  FourPointStar,
  Scissors,
} from "./decorations";

const STORAGE_KEY = "clutch_feedback_2026_05";

const HOT_TAKES = [
  "I'd rather have one app for all my girl stuff than five separate ones.",
  "If an app knew my cycle phase, I'd actually open it more.",
  "I'd quit a wellness app if my close friends weren't on it.",
  "I'd pay $5 a month for an app actually built for college girls.",
  "I'd share period products with friends I trust. Strangers feel weird.",
  "Most period or wellness apps only get me to open them once a month. That's the real problem.",
];

type ChipKey = "same" | "skip" | "huh";
const CHIP_LABELS: Record<ChipKey, string> = {
  same: "♥ same",
  skip: "skip",
  huh: "huh?",
};
const CHIP_STYLES: Record<ChipKey, { selected: string; idle: string }> = {
  same: {
    selected: "bg-clutch-hot text-white border-clutch-hot",
    idle: "bg-clutch-paper text-clutch-ink border-clutch-ink/60 hover:bg-clutch-softpink/55",
  },
  skip: {
    selected: "bg-clutch-chocolate/15 text-clutch-ink border-clutch-chocolate/60",
    idle: "bg-clutch-paper text-clutch-ink border-clutch-ink/60 hover:bg-clutch-chocolate/10",
  },
  huh: {
    selected: "bg-[#F4E2A3] text-clutch-ink border-[#B89B3F]",
    idle: "bg-clutch-paper text-clutch-ink border-clutch-ink/60 hover:bg-[#FCEFC7]",
  },
};

type State = {
  takes: Record<number, ChipKey | null>;
  /** per-row follow-up text — persists when user toggles between chips */
  followUps: Record<number, string>;
  blanks: { had: string; skipped: string; dealbreaker: string };
};

const INITIAL: State = {
  takes: {},
  followUps: {},
  blanks: { had: "", skipped: "", dealbreaker: "" },
};

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

function MadLibBlank({
  value,
  onChange,
  placeholder,
  width = "10ch",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  width?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border-0 border-b border-dashed border-clutch-ink/70 bg-transparent px-1 pb-0.5 font-display italic text-clutch-hot placeholder:font-display placeholder:italic placeholder:text-clutch-chocolate/40 focus:border-solid focus:border-clutch-hot focus:outline-none"
      style={{
        minWidth: width,
        width: value ? `${Math.max(value.length + 2, 10)}ch` : width,
        fontSize: "inherit",
        lineHeight: "inherit",
      }}
    />
  );
}

export default function ReaderFeedback() {
  const [state, setState] = useState<State>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [burst, setBurst] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.state) setState({ ...INITIAL, ...parsed.state });
        if (parsed?.submitted) setSubmitted(true);
      }
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state, submitted })
      );
    } catch {}
  }, [state, submitted]);

  const setTake = (i: number, value: ChipKey) => {
    setState((prev) => ({
      ...prev,
      takes: { ...prev.takes, [i]: prev.takes[i] === value ? null : value },
    }));
  };

  const setBlank = (key: keyof State["blanks"], value: string) => {
    setState((prev) => ({ ...prev, blanks: { ...prev.blanks, [key]: value } }));
  };

  const loggedCount = Object.values(state.takes).filter(Boolean).length;

  const handleSubmit = async () => {
    if (submitted) return;
    setBurst(true);
    setSubmitted(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "reader-feedback",
          takes: HOT_TAKES.map((statement, i) => {
            const answer = state.takes[i] ?? null;
            const followUp =
              answer === "skip" || answer === "huh"
                ? state.followUps[i]?.trim() || null
                : null;
            return { statement, answer, followUp };
          }),
          blanks: state.blanks,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.warn("feedback post failed", e);
    }
    window.setTimeout(() => setBurst(false), 800);
  };

  return (
    <section className="relative mt-12 px-2 sm:px-4">
      <div className="text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.32em] text-clutch-hot">
          ❤ &nbsp;reader page&nbsp; ❤
        </p>
        <h2
          className="font-display italic mt-1 leading-[0.95] text-clutch-ink"
          style={{ fontSize: "clamp(36px, 6.4vw, 64px)" }}
        >
          Tell us{" "}
          <span
            className="font-script text-clutch-bubblegum"
            style={{ fontSize: "1.25em", lineHeight: 0.6 }}
          >
            everything.
          </span>
        </h2>
        <p className="mx-auto mt-1 max-w-[520px] font-display italic text-[14px] text-clutch-ink/85 sm:text-[15px]">
          every answer goes straight to the team. takes a minute, tops.
        </p>
      </div>

      <div className="relative mt-6">
        <HeartBurst visible={burst} />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-[860px]"
            >
              {/* Top row: hot takes (left) + mad libs (right) */}
              <div className="grid gap-5 md:grid-cols-12">
                {/* BLOCK A — Hot takes */}
                <div className="md:col-span-7 border-[1.5px] border-clutch-ink bg-clutch-paper paper-card p-5 shadow-paper">
                  <div className="flex items-baseline justify-between gap-2 border-b border-dashed border-clutch-ink/50 pb-2">
                    <p className="font-body text-[10px] uppercase tracking-[0.28em] text-clutch-hot">
                      ❤ hot takes
                    </p>
                    <p className="font-pixel text-[12px] tracking-wide text-clutch-chocolate/70">
                      {loggedCount} of {HOT_TAKES.length} logged
                    </p>
                  </div>
                  <p className="mt-2 font-display italic text-[13px] text-clutch-chocolate/85">
                    no polite answers. tap what you actually feel.
                  </p>

                  <ul className="mt-3 divide-y divide-clutch-ink/15">
                    {HOT_TAKES.map((statement, i) => {
                      const chip = state.takes[i] ?? null;
                      const showFollowUp = chip === "skip" || chip === "huh";
                      const placeholder =
                        chip === "skip"
                          ? "what would make you ♥ same?"
                          : "what didn't land?";
                      return (
                        <li key={i} className="py-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <p className="font-body text-[14px] leading-snug text-clutch-ink">
                              {statement}
                            </p>
                            <div className="flex shrink-0 gap-1.5">
                              {(Object.keys(CHIP_LABELS) as ChipKey[]).map(
                                (key) => {
                                  const selected = state.takes[i] === key;
                                  const styles = CHIP_STYLES[key];
                                  return (
                                    <button
                                      key={key}
                                      type="button"
                                      onClick={() => setTake(i, key)}
                                      className={[
                                        "border px-2.5 py-1 font-body text-[12px] tracking-wide transition active:translate-y-px",
                                        selected ? styles.selected : styles.idle,
                                      ].join(" ")}
                                      style={{ borderRadius: "2px" }}
                                      aria-pressed={selected}
                                    >
                                      {CHIP_LABELS[key]}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <AnimatePresence initial={false}>
                            {showFollowUp ? (
                              <motion.div
                                key="follow"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="overflow-hidden"
                              >
                                <div className="flex items-end gap-2 pt-2">
                                  <input
                                    type="text"
                                    value={state.followUps[i] ?? ""}
                                    onChange={(e) =>
                                      setState((prev) => ({
                                        ...prev,
                                        followUps: {
                                          ...prev.followUps,
                                          [i]: e.target.value,
                                        },
                                      }))
                                    }
                                    placeholder={placeholder}
                                    className="flex-1 border-0 border-b border-dashed border-clutch-ink/70 bg-transparent px-0 pb-1 font-display italic text-clutch-hot placeholder:text-clutch-chocolate/45 focus:border-solid focus:border-clutch-hot focus:outline-none"
                                    style={{ fontSize: 14 }}
                                  />
                                  <span className="shrink-0 pb-1 font-body text-[10px] italic text-clutch-chocolate/55">
                                    skip if you want.
                                  </span>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* RIGHT COLUMN — Mad libs (top) + Outfit of the Day (bottom) */}
                <div className="md:col-span-5 flex flex-col gap-5">
                  {/* BLOCK B — Mad libs */}
                  <div
                    className="relative border-[1.5px] border-dashed border-clutch-ink bg-clutch-paper paper-card p-5 shadow-paper"
                    style={{ transform: "rotate(1deg)" }}
                  >
                    <FourPointStar
                      size={14}
                      color="#EB6E9E"
                      className="sparkle-spin absolute -left-3 -top-3"
                    />
                    <FourPointStar
                      size={10}
                      color="#D6336C"
                      className="sparkle-spin absolute -right-2 -top-2"
                      style={{ animationDelay: "0.5s" }}
                    />

                    <p className="font-body text-[10px] uppercase tracking-[0.28em] text-clutch-hot">
                      ❤ mad libs
                    </p>
                    <p className="mt-1.5 font-display italic text-[13px] text-clutch-chocolate/85">
                      be specific. &ldquo;better UI&rdquo; doesn&rsquo;t help us
                      build.
                    </p>

                    <p
                      className="mt-3 font-body text-clutch-ink"
                      style={{ fontSize: 16, lineHeight: 1.7 }}
                    >
                      &ldquo;I would use this every day if it had{" "}
                      <MadLibBlank
                        value={state.blanks.had}
                        onChange={(v) => setBlank("had", v)}
                        placeholder="________"
                        width="11ch"
                      />
                      , skipped{" "}
                      <MadLibBlank
                        value={state.blanks.skipped}
                        onChange={(v) => setBlank("skipped", v)}
                        placeholder="________"
                        width="11ch"
                      />
                      , and the dealbreaker would be{" "}
                      <MadLibBlank
                        value={state.blanks.dealbreaker}
                        onChange={(v) => setBlank("dealbreaker", v)}
                        placeholder="________"
                        width="11ch"
                      />
                      .&rdquo;
                    </p>

                    <p className="mt-4 font-body text-[12px] italic text-clutch-chocolate/70">
                      fill what you can. nothing required.
                    </p>
                  </div>

                </div>
              </div>

              {/* BLOCK C — Send-it-in coupon, full width */}
              <div className="relative mt-6">
                <div
                  className="relative border-[1.5px] border-dashed border-clutch-ink bg-clutch-softpink/40 paper-card p-5 shadow-paper sm:p-6"
                  style={{ borderRadius: "3px" }}
                >
                  {/* Tape corners */}
                  <span
                    aria-hidden
                    className="absolute -top-2 left-6 h-3 w-12 -rotate-6 bg-clutch-softpink/80 shadow-tape"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 3px, transparent 3px 7px)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute -top-2 right-6 h-3 w-12 rotate-6 bg-clutch-softpink/80 shadow-tape"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 3px, transparent 3px 7px)",
                    }}
                  />

                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-3">
                      <Scissors size={20} color="#1B1B1B" />
                      <div>
                        <p
                          className="font-display italic text-clutch-ink"
                          style={{ fontSize: 28, lineHeight: 1 }}
                        >
                          send it in
                        </p>
                        <p className="mt-0.5 font-body text-[12px] italic text-clutch-chocolate/80">
                          we read every one.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="group inline-flex items-center gap-2 border-[1.5px] border-dashed border-clutch-hot bg-clutch-paper px-5 py-2.5 font-display italic text-clutch-ink shadow-paper transition hover:bg-clutch-hot hover:text-white"
                      style={{ borderRadius: "2px", fontSize: 18 }}
                    >
                      <FourPointStar size={12} color="currentColor" />
                      mail it
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 16, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 1.4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative mx-auto max-w-[480px]"
            >
              <div className="bg-white p-3 pb-10 shadow-[4px_5px_0_rgba(27,27,27,0.18)] paper-card">
                <div className="halftone-pink aspect-[5/4] w-full opacity-50" />
                <div className="px-3 pt-4">
                  <p className="font-body text-[11px] uppercase tracking-[0.28em] text-clutch-hot">
                    ❤ filed under: heard
                  </p>
                  <h3
                    className="font-script text-clutch-ink"
                    style={{
                      fontSize: "clamp(34px, 6.4vw, 52px)",
                      lineHeight: 0.95,
                    }}
                  >
                    noted.
                  </h3>
                  <p className="mt-1 font-display italic text-[18px] text-clutch-ink">
                    you&rsquo;re loud and we love it.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
