export default function SectionMark({
  number,
  label,
  align = "left",
}: {
  number: string;
  label: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex items-baseline gap-3 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <span
        className="inline-flex h-9 w-9 -rotate-3 items-center justify-center rounded-full border-[1.5px] border-clutch-ink bg-clutch-paper font-display text-[15px] font-bold italic text-clutch-ink"
        aria-hidden
      >
        {number}
      </span>
      <span
        className="font-script text-clutch-bubblegum"
        style={{ fontSize: "clamp(34px, 5vw, 48px)", lineHeight: 1 }}
      >
        {label}
      </span>
    </div>
  );
}
