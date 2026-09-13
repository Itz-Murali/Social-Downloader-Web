export const PLATFORMS = {
  youtube: {
    id: "youtube",
    label: "YouTube",
    accent: "#ff5a5f",
    hint: "youtube.com/watch · youtu.be · shorts",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    accent: "#d96bd0",
    hint: "posts · reels · stories · facebook",
  },
  pinterest: {
    id: "pinterest",
    label: "Pinterest",
    accent: "#f0a35c",
    hint: "pin.it · pinterest.com/pin",
  },
  search: {
    id: "search",
    label: "Search",
    accent: "#7cf5c4",
    hint: "plain words search YouTube",
  },
};

const MATCHERS = [
  [/(youtube\.com|youtu\.be|youtube-nocookie\.com)/i, "youtube"],
  [/(instagram\.com|instagr\.am|facebook\.com|fb\.watch)/i, "instagram"],
  [/(pinterest\.[a-z.]+|pin\.it)/i, "pinterest"],
];

export function detectPlatform(raw) {
  const value = (raw || "").trim();
  if (!value) return null;
  const looksLikeUrl = /^(https?:\/\/|www\.)/i.test(value) || /\.[a-z]{2,}\//i.test(value);
  for (const [pattern, id] of MATCHERS) {
    if (pattern.test(value)) return PLATFORMS[id];
  }
  if (looksLikeUrl) return null;
  return PLATFORMS.search;
}

export function normalizeInput(raw) {
  const value = (raw || "").trim();
  if (/^www\./i.test(value)) return `https://${value}`;
  return value;
}
