"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneMockup from "./PhoneMockup";
import { PixelHeart, FourPointStar } from "./decorations";

const CLARITY_OPTIONS = [
  "Very clear",
  "Mostly clear",
  "A little confusing",
  "Don't get it yet",
];

type ScreenId = "empty" | "home" | "community" | "share";

const CAPTIONS: Record<ScreenId, string> = {
  empty: "hover a feature, see it move.",
  home: "01 · the home feed.",
  community: "02 · the community tab.",
  share: "03 · the share.",
};

/* -------- phone screen helpers -------- */

function ScreenWrap({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex h-full flex-col gap-1.5 p-2.5"
    >
      {children}
    </motion.div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 border border-clutch-ink/50 bg-white/80 px-1.5 py-[1px] font-body text-[7px] uppercase tracking-[0.16em] text-clutch-ink">
      {children}
    </span>
  );
}

function TamponIcon() {
  return (
    <svg width="7" height="10" viewBox="0 0 7 10" aria-hidden>
      <rect
        x="1.4"
        y="0.5"
        width="4.2"
        height="6"
        rx="0.7"
        fill="#FFFFFF"
        stroke="#1B1B1B"
        strokeWidth="0.6"
      />
      <line
        x1="3.5"
        y1="2"
        x2="3.5"
        y2="5"
        stroke="#F4C9D6"
        strokeWidth="0.5"
      />
      <line
        x1="3.5"
        y1="6.5"
        x2="3.5"
        y2="9.5"
        stroke="#1B1B1B"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PadIcon() {
  return (
    <svg width="11" height="6" viewBox="0 0 11 6" aria-hidden>
      <rect
        x="1.2"
        y="0.8"
        width="8.6"
        height="4.4"
        rx="2.2"
        fill="#FFFFFF"
        stroke="#1B1B1B"
        strokeWidth="0.6"
      />
      <rect
        x="3"
        y="2.5"
        width="5"
        height="1"
        rx="0.5"
        fill="#F4C9D6"
      />
    </svg>
  );
}

function AdvilIcon() {
  return (
    <svg width="11" height="6" viewBox="0 0 11 6" aria-hidden>
      <defs>
        <clipPath id="clutch-advil-pill">
          <rect x="1" y="1" width="9" height="4" rx="2" />
        </clipPath>
      </defs>
      <g clipPath="url(#clutch-advil-pill)">
        <rect x="1" y="1" width="4.5" height="4" fill="#D6336C" />
        <rect x="5.5" y="1" width="5" height="4" fill="#FFFFFF" />
      </g>
      <rect
        x="1"
        y="1"
        width="9"
        height="4"
        rx="2"
        fill="none"
        stroke="#1B1B1B"
        strokeWidth="0.6"
      />
    </svg>
  );
}

function AvatarBubble({ name, bg }: { name: string; bg: string }) {
  return (
    <span
      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-clutch-ink/60 font-display text-[9px] italic text-clutch-ink"
      style={{ backgroundColor: bg }}
    >
      {name}
    </span>
  );
}

function EmptyScreen() {
  return (
    <ScreenWrap>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-3 text-center">
        <span aria-hidden className="text-clutch-hot">
          <PixelHeart size={18} className="heart-pulse" />
        </span>
        <p
          className="font-pinyon text-clutch-hot"
          style={{ fontSize: 30, lineHeight: 0.85 }}
        >
          hover a feature
        </p>
        <p className="font-body italic text-[10px] leading-snug text-clutch-chocolate/85">
          to see how it actually looks in the app.
        </p>
        <p className="mt-1 font-body text-[8px] uppercase tracking-[0.22em] text-clutch-chocolate/65">
          &larr; try one
        </p>
      </div>
    </ScreenWrap>
  );
}

function HomeScreen() {
  return (
    <ScreenWrap>
      <div className="flex items-center justify-between font-body text-[7px] uppercase tracking-[0.18em] text-clutch-chocolate/70">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <PixelHeart size={6} className="heart-pulse" />
          you
        </span>
      </div>

      <p
        className="font-pinyon text-clutch-hot"
        style={{ fontSize: 26, lineHeight: 0.9 }}
      >
        hi, navi.
      </p>
      <p className="font-body text-[7px] uppercase tracking-[0.18em] text-clutch-chocolate/80">
        day 14 &middot; ovulating
      </p>

      {/* phase bar */}
      <div className="flex items-center gap-[1px]">
        {Array.from({ length: 28 }).map((_, i) => {
          const today = i === 13;
          const past = i < 13;
          const period = i < 4;
          const bg = period
            ? "#D6336C"
            : today
              ? "#EB6E9E"
              : past
                ? "rgba(214,51,108,0.25)"
                : "rgba(74,42,26,0.15)";
          return (
            <span
              key={i}
              className="h-[3px] flex-1 rounded-full"
              style={{
                backgroundColor: bg,
                transform: today ? "scaleY(2)" : undefined,
              }}
            />
          );
        })}
      </div>

      {/* featured fit */}
      <div className="rounded border border-clutch-ink/40 bg-white p-1.5">
        <div
          className="halftone mb-1 h-10 w-full rounded-sm border border-clutch-ink/30 opacity-70"
          style={{ backgroundColor: "#F4C9D6" }}
        />
        <p
          className="font-pinyon text-clutch-hot"
          style={{ fontSize: 16, lineHeight: 1 }}
        >
          today&rsquo;s fit
        </p>
        <p className="font-body italic text-[7px] text-clutch-chocolate/85">
          lace cami + raw denim
        </p>
      </div>

      {/* mini feed */}
      <div className="grid grid-cols-2 gap-1">
        <div className="rounded border border-clutch-ink/30 bg-clutch-paper p-1">
          <span
            aria-hidden
            className="halftone-pink mb-0.5 block h-4 w-full rounded-sm opacity-60"
          />
          <p className="font-body italic text-[7px] text-clutch-ink">
            miso udon
          </p>
        </div>
        <div className="rounded border border-clutch-ink/30 bg-clutch-dusty/50 p-1">
          <span
            aria-hidden
            className="halftone mb-0.5 block h-4 w-full rounded-sm opacity-60"
          />
          <p className="font-body italic text-[7px] text-clutch-ink">
            20 min pilates
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-clutch-ink/30 pt-1 text-[7px] uppercase tracking-[0.14em] text-clutch-ink/70">
        <span className="flex items-center gap-0.5 text-clutch-hot">
          <PixelHeart size={6} color="#D6336C" /> home
        </span>
        <span>share</span>
        <span>chat</span>
      </div>
    </ScreenWrap>
  );
}

function CommunityScreen() {
  return (
    <ScreenWrap>
      <div className="flex items-center justify-between font-body text-[7px] uppercase tracking-[0.18em] text-clutch-chocolate/70">
        <span>community</span>
        <span className="text-clutch-hot">2 new</span>
      </div>

      <p
        className="font-pinyon text-clutch-hot"
        style={{ fontSize: 24, lineHeight: 0.9 }}
      >
        your room
      </p>

      <div className="flex gap-1.5">
        <AvatarBubble name="ava" bg="#F4C9D6" />
        <AvatarBubble name="sof" bg="#FBE9DD" />
        <AvatarBubble name="em" bg="#C9D6E2" />
        <AvatarBubble name="ju" bg="#FAE0D2" />
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-softpink/45 p-1.5">
        <p className="font-body text-[8px] font-bold text-clutch-ink">
          ava &middot; 2m
        </p>
        <p
          className="font-display italic text-clutch-chocolate"
          style={{ fontSize: 8, lineHeight: 1.2 }}
        >
          &ldquo;haul today &hearts;&rdquo;
        </p>
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-paper p-1.5">
        <p className="font-body text-[8px] font-bold text-clutch-ink">
          sophie &middot; 5m
        </p>
        <p className="font-body text-[7px] text-clutch-chocolate/85">
          matcha after lab?
        </p>
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-dusty/50 p-1.5">
        <p className="font-body text-[8px] font-bold text-clutch-ink">
          em &middot; 12m
        </p>
        <p className="font-body text-[7px] text-clutch-chocolate/85">
          i made the udon!!
        </p>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-clutch-ink/30 pt-1 text-[7px] uppercase tracking-[0.14em] text-clutch-ink/70">
        <span>home</span>
        <span className="flex items-center gap-0.5 text-clutch-hot">
          <PixelHeart size={6} color="#D6336C" /> chat
        </span>
        <span>share</span>
      </div>
    </ScreenWrap>
  );
}

function ShareScreen() {
  return (
    <ScreenWrap>
      <div className="flex items-center justify-between font-body text-[7px] uppercase tracking-[0.18em] text-clutch-chocolate/70">
        <span>atlanta &middot; share</span>
        <span className="flex items-center gap-1">
          <PixelHeart size={6} className="heart-pulse" />
          you
        </span>
      </div>

      <p
        className="font-pinyon text-clutch-hot"
        style={{ fontSize: 22, lineHeight: 0.9 }}
      >
        girl, do you have...
      </p>

      <div className="flex flex-wrap gap-1">
        <Chip>
          <TamponIcon />
          tampon
        </Chip>
        <Chip>
          <PadIcon />
          pad
        </Chip>
        <Chip>
          <AdvilIcon />
          advil
        </Chip>
        <Chip>hairtie</Chip>
        <Chip>charger</Chip>
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-softpink/50 p-1.5">
        <p className="font-body text-[8px] font-bold text-clutch-ink">
          sophie has tampons.
        </p>
        <p className="font-body text-[7px] text-clutch-chocolate/85">
          2 min walk &middot; request &rarr;
        </p>
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-paper p-1.5">
        <p className="font-body text-[8px] font-bold text-clutch-ink">
          ava just helped you.
        </p>
        <p className="font-body text-[7px] text-clutch-chocolate/85">
          gave: 2 advil &check;
        </p>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-clutch-ink/30 pt-1 text-[7px] uppercase tracking-[0.14em] text-clutch-ink/70">
        <span>home</span>
        <span>chat</span>
        <span className="flex items-center gap-0.5 text-clutch-hot">
          <PixelHeart size={6} color="#D6336C" /> share
        </span>
      </div>
    </ScreenWrap>
  );
}

function PhoneSwap({ screen }: { screen: ScreenId }) {
  return (
    <PhoneMockup rotate={3.5} caption={CAPTIONS[screen]}>
      <AnimatePresence mode="wait">
        {screen === "empty" ? <EmptyScreen key="empty" /> : null}
        {screen === "home" ? <HomeScreen key="home" /> : null}
        {screen === "community" ? <CommunityScreen key="community" /> : null}
        {screen === "share" ? <ShareScreen key="share" /> : null}
      </AnimatePresence>
    </PhoneMockup>
  );
}

/* -------- main -------- */

export default function ThePivot() {
  const [clarity, setClarity] = useState<string | null>(null);
  const [screen, setScreen] = useState<ScreenId>("empty");

  return (
    <section className="relative mt-6 px-2 sm:mt-8 sm:px-4">
      <h2
        className="font-display leading-[0.95] text-clutch-ink"
        style={{ fontSize: "clamp(34px, 5.5vw, 60px)" }}
      >
        Clutch is{" "}
        <span
          className="font-script italic text-clutch-hot"
          style={{ fontSize: "1.4em", lineHeight: 0.6 }}
        >
          evolving
        </span>
        .
      </h2>

      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[11px] uppercase tracking-[0.18em] text-clutch-chocolate/80">
        <span>By Navi</span>
        <span aria-hidden>·</span>
        <span>Filed 05/10/26</span>
        <span aria-hidden>·</span>
        <span className="text-clutch-hot">2 min read</span>
      </p>

      <div className="mt-5 grid gap-6 md:grid-cols-12 md:items-start">
        <div className="md:col-span-8">
          <div className="newspaper-2col font-body text-[15px] leading-[1.6] text-clutch-ink">
            <p className="dropcap mb-3">
              hey, this is{" "}
              <span className="font-display italic text-clutch-hot">
                navi
              </span>
              , founder of clutch.
            </p>

            <p className="mb-3">
              we started as the app you opened{" "}
              <span className="font-display italic">in a crisis</span>.
            </p>

            <p className="mb-3 italic">
              a tampon passed under a stall door.
              <br />
              a{" "}
              <span className="lit not-italic font-display italic text-clutch-ink">
                &ldquo;girl do you have a pad?&rdquo;
              </span>
              <br />
              the little moments where girls just show up for each other.
            </p>

            <p className="mb-3">but we kept hearing the same thing:</p>

            <p className="mb-3 italic">
              &ldquo;cute idea, but i&rsquo;d probably only open it{" "}
              <span className="handline not-italic font-display italic text-clutch-ink">
                once a month
              </span>
              .&rdquo;
            </p>

            <p className="mb-4">
              so we started thinking{" "}
              <span className="font-display italic text-clutch-hot">
                bigger
              </span>
              . here&rsquo;s what that means:
            </p>

            <div
              className="mb-4 break-inside-avoid"
              onMouseEnter={() => setScreen("home")}
            >
              <p
                className="mb-1 font-display italic font-bold text-clutch-hot"
                style={{ fontSize: 17, lineHeight: 1 }}
              >
                01 &middot; the home feed.
              </p>
              <p>
                when you open clutch, you&rsquo;ll see{" "}
                <span className="handline font-display italic text-clutch-ink">
                  your cycle
                </span>{" "}
                phase, your mood, and a little forecast for the day. below
                that, a pinterest-style feed of recipes, outfits, workouts,
                products, and reads that actually match where you are. you pin
                what feels right. your board starts learning you, and clutch
                gets smarter the more you use it.
              </p>
            </div>

            <div
              className="mb-4 break-inside-avoid"
              onMouseEnter={() => setScreen("community")}
            >
              <p
                className="mb-1 font-display italic font-bold text-clutch-hot"
                style={{ fontSize: 17, lineHeight: 1 }}
              >
                02 &middot; the community tab.
              </p>
              <p>
                because the group chat finally deserves a home that
                isn&rsquo;t imessage chaos. friends, photos, plans, and
                check-ins, all in one place.
              </p>
            </div>

            <div
              className="mb-4 break-inside-avoid"
              onMouseEnter={() => setScreen("share")}
            >
              <p
                className="mb-1 font-display italic font-bold text-clutch-hot"
                style={{ fontSize: 17, lineHeight: 1 }}
              >
                03 &middot; the share.
              </p>
              <p>
                still the heart of it. you can still ask for a pad. you can
                still help another girl out. now there&rsquo;s just a whole
                world built around that same feeling:{" "}
                <span className="lit font-display italic text-clutch-ink">
                  girls taking care of girls
                </span>
                .
              </p>
            </div>

            <p className="mb-3">
              we want your feedback to actually shape what this becomes. tell
              us below: what would make you keep this app downloaded? what
              would make it feel like something you&rsquo;d open every day?
            </p>

            <p className="mb-3">
              we&rsquo;re building this{" "}
              <span className="handline font-display italic text-clutch-ink">
                with you
              </span>
              , not at you.
            </p>

            <p className="italic">
              xx,
              <br />
              <span
                className="text-clutch-hot"
                style={{ fontSize: 24, lineHeight: 1.1 }}
              >
                navi
              </span>
            </p>
          </div>

          <div className="relative mt-5 max-w-[520px] border border-clutch-ink/70 bg-clutch-paper/60 p-4 sm:p-5">
            <span className="absolute -top-3 left-4 bg-clutch-paper px-2 font-body text-[10px] uppercase tracking-[0.3em] text-clutch-hot">
              ❤ Quick gut-check
            </span>
            <p className="font-display text-base italic text-clutch-ink sm:text-[17px]">
              How clear does this new direction feel so far?
            </p>
            <div role="radiogroup" className="mt-3 flex flex-wrap gap-2">
              {CLARITY_OPTIONS.map((opt) => {
                const selected = clarity === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setClarity(opt)}
                    className={[
                      "border px-3 py-1.5 font-body text-[12px] tracking-wide transition",
                      selected
                        ? "border-clutch-hot bg-clutch-hot text-white"
                        : "border-clutch-ink/60 bg-clutch-paper text-clutch-ink hover:bg-clutch-softpink/55",
                    ].join(" ")}
                    style={{ borderRadius: "2px" }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {clarity ? (
              <p
                className="mt-2 font-script text-clutch-hot"
                style={{ fontSize: 28, lineHeight: 1 }}
              >
                noted, thank you ♥
              </p>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="md:sticky md:top-4">
            <div className="relative flex justify-center md:justify-end">
              <FourPointStar
                size={18}
                color="#EB6E9E"
                className="sparkle-spin absolute -left-4 top-2"
              />
              <FourPointStar
                size={12}
                color="#D6336C"
                className="sparkle-spin absolute -right-2 top-12"
                style={{ animationDelay: "0.6s" }}
              />
              <PhoneSwap screen={screen} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
