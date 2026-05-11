export default function ExtraBanner({
  text = "EXTRA EXTRA",
  separator = "✦",
}: {
  text?: string;
  separator?: string;
}) {
  // Build a long string we can duplicate and slide; pad with separators
  const single = ` ${text} ${separator} `;
  const phrase = single.repeat(10);

  return (
    <div className="my-3 border-y-2 border-clutch-ink bg-clutch-paper/70 py-1.5 overflow-hidden sm:my-4">
      <div className="flex w-max marquee-track font-body text-[12px] font-bold uppercase tracking-[0.32em] text-clutch-ink whitespace-nowrap">
        <span className="pr-6">{phrase}</span>
        <span className="pr-6" aria-hidden>
          {phrase}
        </span>
      </div>
    </div>
  );
}
