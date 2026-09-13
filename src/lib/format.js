export function formatDuration(value) {
  if (value === undefined || value === null || value === "") return null;
  const text = String(value);
  if (text.includes(":")) return text;
  const total = Number(text);
  if (!Number.isFinite(total) || total <= 0) return null;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = Math.floor(total % 60);
  const pad = (n) => String(n).padStart(2, "0");
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

export function shortenUrl(url, max = 46) {
  if (!url) return "";
  const clean = url.replace(/^https?:\/\//, "");
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

export function fileNameFor(title, kind) {
  const base = (title || "social-downloader")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const ext = kind === "audio" ? "mp3" : kind === "image" ? "jpg" : "mp4";
  return `${base || "media"}.${ext}`;
}
