import PaintWindowPicker, { type PickerItem } from "./PaintWindowPicker";

const OUTFITS: PickerItem[] = [
  {
    id: "pink-lace",
    caption: "pink lace + raw denim",
    imageSrc: "/newsletter/ootd/01.jpg",
    bg: "#F4C9D6",
    base: 32,
  },
  {
    id: "stripes",
    caption: "stripes & strings",
    imageSrc: "/newsletter/ootd/03.jpg",
    bg: "#FBE9DD",
    base: 21,
  },
  {
    id: "ballet",
    caption: "ballet flats fit",
    imageSrc: "/newsletter/ootd/04.jpg",
    bg: "#F6EFE3",
    base: 18,
  },
  {
    id: "lace-cami",
    caption: "lace cami + dark wash",
    imageSrc: "/newsletter/ootd/06.jpg",
    bg: "#EFE5D2",
    base: 12,
  },
];

export const OOTD_ITEMS = OUTFITS;

export default function OutfitOfTheDay({
  onPickChange,
}: {
  onPickChange?: (picks: string[]) => void;
}) {
  return (
    <PaintWindowPicker
      eyebrow="❤  today's puzzle  ❤"
      headerLines={["Pick", "a fit."]}
      items={OUTFITS}
      maxPicks={1}
      storageKey="clutch_ootd_vote_2026_05"
      compact
      hideStatsToggle
      emptyHint="pick one. it just lives in your browser."
      onPickChange={onPickChange}
    />
  );
}
