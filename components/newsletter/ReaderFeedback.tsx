
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FourPointStar, SolidHeart } from "./decorations";

const STORAGE_KEY = "clutch_survey_2026_05_v2";
const TOTAL_STEPS = 12;

type Answers = {
  q1: string[]; q1other: string;
  q2a: string; q2b: string[];
  q3: string[]; q3other: string;
  q4: string[]; q4other: string;
  q5: string[]; q5other: string;
  q6: string;
  q7: string;
  q8: string;
  q9text: string; q9apps: string[]; q9other: string;
  q10: string;
  q11: string[];
  q12: string;
};

const BLANK: Answers = {
  q1: [], q1other: "",
  q2a: "", q2b: [],
  q3: [], q3other: "",
  q4: [], q4other: "",
  q5: [], q5other: "",
  q6: "",
  q7: "",
  q8: "",
  q9text: "", q9apps: [], q9other: "",
  q10: "",
  q11: [],
  q12: "",
};

type ArrayKeys = "q1" | "q2b" | "q3" | "q4" | "q5" | "q9apps" | "q11";

// ---- Subcomponents ----

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
              animate={{ x: h.x, y: h.y, opacity: 0, scale: 1.1, rotate: h.rotate + 60 }}
              transition={{ duration: 0.6, delay: h.delay, ease: "easeOut" }}
              className="absolute"
            >
              <SolidHeart size={h.size} color={Math.random() > 0.5 ? "#EB6E9E" : "#D6336C"} />
            </motion.div>
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "border px-3 py-1.5 font-body text-[13px] tracking-wide transition-all active:translate-y-px select-none",
        selected
          ? "bg-clutch-hot text-white border-clutch-hot"
          : "bg-clutch-paper text-clutch-ink border-clutch-ink/60 hover:bg-clutch-softpink/55",
      ].join(" ")}
      style={{ borderRadius: "2px" }}
    >
      {label}
    </button>
  );
}

function WriteInField({
  value,
  onChange,
  placeholder = "type here...",
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="pt-2.5">
        {label && (
          <p className="mb-1 font-body text-[10px] uppercase tracking-[0.26em] text-clutch-chocolate/65">
            {label}
          </p>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border-0 border-b border-dashed border-clutch-ink/70 bg-transparent pb-1 font-display italic text-clutch-hot placeholder:text-clutch-chocolate/40 focus:border-solid focus:border-clutch-hot focus:outline-none"
          style={{ fontSize: 14 }}
        />
      </div>
    </motion.div>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-dashed border-clutch-ink/60 bg-transparent p-3 font-display italic text-clutch-hot placeholder:text-clutch-chocolate/40 focus:border-solid focus:border-clutch-hot focus:outline-none resize-none"
      style={{ fontSize: 14, borderRadius: "2px", lineHeight: 1.65 }}
    />
  );
}

function QLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <span className="font-pixel text-[13px] tracking-widest text-clutch-hot">{num}</span>
      <p className="mt-1 font-display italic leading-snug text-clutch-ink" style={{ fontSize: "clamp(16px, 2.2vw, 19px)" }}>
        {children}
      </p>
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-body text-[12px] italic text-clutch-chocolate/65">{children}</p>
  );
}

function SubLabel({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <p className={`mb-2 font-body text-[10px] uppercase tracking-[0.26em] text-clutch-chocolate/65${first ? "" : " mt-4"}`}>
      {children}
    </p>
  );
}

// ---- Main component ----

export default function ReaderFeedback() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>(BLANK);
  const [submitted, setSubmitted] = useState(false);
  const [burst, setBurst] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.answers) setAnswers({ ...BLANK, ...parsed.answers });
        if (typeof parsed?.step === "number") setStep(parsed.step);
        if (parsed?.submitted) setSubmitted(true);
      }
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step, submitted }));
    } catch {}
  }, [answers, step, submitted]);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const toggle = (key: ArrayKeys, value: string) =>
    setAnswers((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });

  const setSingle = (key: "q2a" | "q6", value: string) =>
    setAnswers((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setBurst(true);
    setSubmitted(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "reader-survey", answers, submittedAt: new Date().toISOString() }),
      });
    } catch (e) {
      console.warn("feedback post failed", e);
    }
    window.setTimeout(() => setBurst(false), 800);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
  };

  function renderStep() {
    switch (step) {
      // Q1 — cycle/wellness apps
      case 0:
        return (
          <>
            <QLabel num="01">which cycle or wellness app is on your phone right now?</QLabel>
            <Hint>select all that apply</Hint>
            <div className="flex flex-wrap gap-2">
              {["flo", "stardust", "clue", "natural cycles", "apple health", "none"].map((opt) => (
                <Chip key={opt} label={opt} selected={answers.q1.includes(opt)} onClick={() => toggle("q1", opt)} />
              ))}
              <Chip label="other" selected={answers.q1.includes("other")} onClick={() => toggle("q1", "other")} />
            </div>
            <AnimatePresence>
              {answers.q1.includes("other") && (
                <WriteInField
                  value={answers.q1other}
                  onChange={(v) => set("q1other", v)}
                  placeholder="which one?"
                />
              )}
            </AnimatePresence>
          </>
        );

      // Q2 — last opened + what did
      case 1:
        return (
          <>
            <QLabel num="02">when did you last open it, and what did you do once you were in?</QLabel>
            <SubLabel first>when did you last open it?</SubLabel>
            <div className="flex flex-wrap gap-2">
              {["today", "this week", "this month", "longer than that", "i deleted it"].map((opt) => (
                <Chip key={opt} label={opt} selected={answers.q2a === opt} onClick={() => setSingle("q2a", opt)} />
              ))}
            </div>
            <AnimatePresence>
              {answers.q2a && answers.q2a !== "i deleted it" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <SubLabel>what did you actually do once you were in?</SubLabel>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "logged my period",
                      "checked my phase",
                      "scrolled the content",
                      "just glanced and closed",
                      "opened it by accident",
                      "honestly i forget",
                    ].map((opt) => (
                      <Chip key={opt} label={opt} selected={answers.q2b.includes(opt)} onClick={() => toggle("q2b", opt)} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );

      // Q3 — recipes
      case 2:
        return (
          <>
            <QLabel num="03">where do you usually look for recipes?</QLabel>
            <Hint>select all that apply</Hint>
            <div className="flex flex-wrap gap-2">
              {["tiktok", "instagram saves", "pinterest", "youtube", "google search", "friends / family", "i don't really cook", "other"].map((opt) => (
                <Chip key={opt} label={opt} selected={answers.q3.includes(opt)} onClick={() => toggle("q3", opt)} />
              ))}
              <Chip label="a specific app" selected={answers.q3.includes("a specific app")} onClick={() => toggle("q3", "a specific app")} />
            </div>
            <AnimatePresence>
              {answers.q3.includes("a specific app") && (
                <WriteInField
                  value={answers.q3other}
                  onChange={(v) => set("q3other", v)}
                  placeholder="which app?"
                />
              )}
            </AnimatePresence>
          </>
        );

      // Q4 — workouts
      case 3:
        return (
          <>
            <QLabel num="04">where do you usually look for workouts or fitness content?</QLabel>
            <Hint>select all that apply</Hint>
            <div className="flex flex-wrap gap-2">
              {["tiktok", "instagram saves", "youtube", "pinterest", "a trainer or class", "i don't really work out", "other"].map((opt) => (
                <Chip key={opt} label={opt} selected={answers.q4.includes(opt)} onClick={() => toggle("q4", opt)} />
              ))}
              <Chip label="a specific fitness app" selected={answers.q4.includes("a specific fitness app")} onClick={() => toggle("q4", "a specific fitness app")} />
            </div>
            <AnimatePresence>
              {answers.q4.includes("a specific fitness app") && (
                <WriteInField
                  value={answers.q4other}
                  onChange={(v) => set("q4other", v)}
                  placeholder="which app?"
                />
              )}
            </AnimatePresence>
          </>
        );

      // Q5 — outfit inspo
      case 4:
        return (
          <>
            <QLabel num="05">where do you usually look for outfit inspo?</QLabel>
            <Hint>select all that apply</Hint>
            <div className="flex flex-wrap gap-2">
              {["tiktok", "instagram saves", "pinterest", "in stores / while shopping", "friends", "i wear the same stuff every day", "other"].map((opt) => (
                <Chip key={opt} label={opt} selected={answers.q5.includes(opt)} onClick={() => toggle("q5", opt)} />
              ))}
              <Chip label="specific creators" selected={answers.q5.includes("specific creators")} onClick={() => toggle("q5", "specific creators")} />
            </div>
            <AnimatePresence>
              {answers.q5.includes("specific creators") && (
                <WriteInField
                  value={answers.q5other}
                  onChange={(v) => set("q5other", v)}
                  placeholder="who do you follow?"
                />
              )}
            </AnimatePresence>
          </>
        );

      // Q6 — cycle-based changes
      case 5:
        return (
          <>
            <QLabel num="06">have you ever changed what you eat or how you work out based on where you are in your cycle?</QLabel>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {[
                "yes, i do this regularly",
                "yes, sometimes",
                "no, but i've thought about it",
                "no, never crossed my mind",
              ].map((opt) => (
                <Chip key={opt} label={opt} selected={answers.q6 === opt} onClick={() => setSingle("q6", opt)} />
              ))}
            </div>
          </>
        );

      // Q7 — paid apps
      case 6:
        return (
          <>
            <QLabel num="07">what apps or subscriptions do you actually pay for monthly?</QLabel>
            <Hint>just names, no judgement.</Hint>
            <TextArea
              value={answers.q7}
              onChange={(v) => set("q7", v)}
              placeholder="spotify, hinge, tiktok shop credits..."
              rows={3}
            />
          </>
        );

      // Q8 — period product story
      case 7:
        return (
          <>
            <QLabel num="08">last time you needed a period product and didn't have one, walk us through what happened.</QLabel>
            <TextArea
              value={answers.q8}
              onChange={(v) => set("q8", v)}
              placeholder="be as specific or vague as you want..."
              rows={5}
            />
          </>
        );

      // Q9 — wellness app ghost
      case 8:
        return (
          <>
            <QLabel num="09">have you ever downloaded a wellness or health app, told yourself you'd actually use it, and then stopped opening it? walk us through what happened.</QLabel>
            <TextArea
              value={answers.q9text}
              onChange={(v) => set("q9text", v)}
              placeholder="what happened..."
              rows={4}
            />
            <SubLabel>which app? (optional)</SubLabel>
            <div className="flex flex-wrap gap-2">
              {["flo", "stardust", "clue", "headspace", "calm", "noom"].map((opt) => (
                <Chip key={opt} label={opt} selected={answers.q9apps.includes(opt)} onClick={() => toggle("q9apps", opt)} />
              ))}
              <Chip label="other" selected={answers.q9apps.includes("other")} onClick={() => toggle("q9apps", "other")} />
            </div>
            <AnimatePresence>
              {answers.q9apps.includes("other") && (
                <WriteInField
                  value={answers.q9other}
                  onChange={(v) => set("q9other", v)}
                  placeholder="which one?"
                />
              )}
            </AnimatePresence>
          </>
        );

      // Q10 — app stuck with
      case 9:
        return (
          <>
            <QLabel num="10">which wellness, health, or lifestyle app have you actually stuck with for 6+ months? what about it kept you opening it?</QLabel>
            <Hint>write "none" if nothing applies.</Hint>
            <TextArea
              value={answers.q10}
              onChange={(v) => set("q10", v)}
              placeholder="the app, and why you keep going back..."
              rows={4}
            />
          </>
        );

      // Q11 — saved content format
      case 10:
        return (
          <>
            <QLabel num="11">when you save wellness, fitness, or lifestyle content, what format is it usually in?</QLabel>
            <Hint>select all that apply</Hint>
            <div className="flex flex-wrap gap-2">
              {[
                "short videos (tiktok / reels)",
                "pinterest pins / image boards",
                "written articles or blog posts",
                "podcasts / audio",
                "instagram carousels or posts",
                "newsletters",
                "i screenshot it from wherever",
                "i don't really save this stuff",
                "other",
              ].map((opt) => (
                <Chip key={opt} label={opt} selected={answers.q11.includes(opt)} onClick={() => toggle("q11", opt)} />
              ))}
            </div>
          </>
        );

      // Q12 — phone number
      case 11:
        return (
          <>
            <QLabel num="12">drop your number to claim one of 50 alpha access spots when the new clutch ships.</QLabel>
            <Hint>us numbers only. no spam, promise.</Hint>
            <input
              type="tel"
              value={answers.q12}
              onChange={(e) => set("q12", e.target.value)}
              placeholder="(555) 555-5555"
              className="w-full border border-dashed border-clutch-ink/60 bg-transparent px-3 py-2.5 font-display italic text-clutch-hot placeholder:text-clutch-chocolate/40 focus:border-solid focus:border-clutch-hot focus:outline-none"
              style={{ fontSize: 18, borderRadius: "2px" }}
            />
          </>
        );

      default:
        return null;
    }
  }

  return (
    <section className="relative mt-12 px-2 sm:px-4">
      {/* Section header */}
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
              className="mx-auto max-w-[680px]"
            >
              {/* Progress bar */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-pixel text-[12px] tracking-wide text-clutch-chocolate/65">
                    {String(step + 1).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
                  </p>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={goPrev}
                      className="font-body text-[12px] italic text-clutch-chocolate/60 transition hover:text-clutch-ink"
                    >
                      ← back
                    </button>
                  )}
                </div>
                <div className="h-[2px] w-full overflow-hidden bg-clutch-ink/12" style={{ borderRadius: 1 }}>
                  <motion.div
                    className="h-full bg-clutch-hot"
                    animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div
                className="overflow-hidden border-[1.5px] border-clutch-ink bg-clutch-paper paper-card shadow-paper"
                style={{ minHeight: 280 }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="p-5 sm:p-6"
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="mt-4 flex justify-end">
                {step < TOTAL_STEPS - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="group inline-flex items-center gap-2 border-[1.5px] border-dashed border-clutch-hot bg-clutch-paper px-5 py-2.5 font-display italic text-clutch-ink shadow-paper transition hover:bg-clutch-hot hover:text-white"
                    style={{ borderRadius: "2px", fontSize: 17 }}
                  >
                    <FourPointStar size={11} color="currentColor" />
                    next
                    <span aria-hidden>→</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="group inline-flex items-center gap-2 border-[1.5px] border-dashed border-clutch-hot bg-clutch-paper px-5 py-2.5 font-display italic text-clutch-ink shadow-paper transition hover:bg-clutch-hot hover:text-white"
                    style={{ borderRadius: "2px", fontSize: 17 }}
                  >
                    <FourPointStar size={11} color="currentColor" />
                    mail it
                    <span aria-hidden>→</span>
                  </button>
                )}
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
                    style={{ fontSize: "clamp(34px, 6.4vw, 52px)", lineHeight: 0.95 }}
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
