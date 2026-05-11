import { HeartRow, PixelHeart } from "./decorations";

export default function TicketFooter() {
  return (
    <footer className="relative mt-10 px-2 sm:px-4">
      <div className="mx-auto max-w-[680px] px-2">
        <HeartRow count={28} size={9} color="#EB6E9E" />
      </div>

      <div className="mx-auto mt-6 max-w-[560px] text-center">
        <p
          className="flex items-center justify-center gap-2 font-display italic text-clutch-chocolate/80"
          style={{ fontSize: 14, lineHeight: 1 }}
        >
          <PixelHeart size={9} className="heart-pulse" />
          from the desk
          <PixelHeart
            size={9}
            className="heart-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </p>

        <p
          className="mt-2 font-body text-clutch-ink"
          style={{ fontSize: "clamp(18px, 2.4vw, 22px)", lineHeight: 1.25 }}
        >
          Made by girls. For girls.
        </p>
        <p className="mt-0.5 font-body italic text-[14px] text-clutch-chocolate/85">
          Not a corporation selling your data.
        </p>

        <p className="mx-auto mt-5 max-w-[480px] font-body italic text-[13px] leading-snug text-clutch-ink/85 sm:text-[14px]">
          p.s. we have a small Discord.
        </p>
        <p className="mt-2 font-body italic text-[14px] text-clutch-ink/85">
          <a
            href="https://discord.gg/clutch"
            className="text-clutch-hot underline decoration-dashed decoration-clutch-hot/60 underline-offset-4 transition hover:decoration-solid"
          >
            discord.gg/clutch
          </a>
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-[260px] items-center justify-between px-2">
        <PixelHeart size={6} color="#EB6E9E" />
        <PixelHeart size={6} color="#D6336C" />
        <PixelHeart size={6} color="#EB6E9E" />
        <PixelHeart size={6} color="#EB6E9E" />
        <PixelHeart size={6} color="#D6336C" />
        <PixelHeart size={6} color="#EB6E9E" />
        <PixelHeart size={6} color="#D6336C" />
        <PixelHeart size={6} color="#EB6E9E" />
        <PixelHeart size={6} color="#EB6E9E" />
        <PixelHeart size={6} color="#D6336C" />
        <PixelHeart size={6} color="#EB6E9E" />
      </div>

      <p className="mt-2 text-center font-body text-[10px] uppercase tracking-[0.32em] text-clutch-chocolate/55">
        © {new Date().getFullYear()} clutch &middot; vol. 01 &middot; issue 05
        &middot; printed with love
      </p>
    </footer>
  );
}
