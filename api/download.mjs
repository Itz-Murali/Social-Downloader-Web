import { Readable } from "stream";

const ALLOWED = [
  /(^|\.)pinimg\.com$/i,
  /(^|\.)pinterest\.[a-z.]+$/i,
  /(^|\.)pin\.it$/i,
  /(^|\.)googlevideo\.com$/i,
  /(^|\.)youtube\.com$/i,
  /(^|\.)ytimg\.com$/i,
  /(^|\.)cdninstagram\.com$/i,
  /(^|\.)fbcdn\.net$/i,
  /(^|\.)instagram\.com$/i,
  /(^|\.)vercel\.app$/i,
  /(^|\.)workers\.dev$/i,
];

function refererFor(host) {
  if (/pinimg|pinterest|pin\.it/i.test(host)) return "https://www.pinterest.com/";
  if (/cdninstagram|fbcdn|instagram/i.test(host)) return "https://www.instagram.com/";
  if (/googlevideo|ytimg|youtube/i.test(host)) return "https://www.youtube.com/";
  return undefined;
}

function safeName(raw, fallback) {
  const name = (raw || "").replace(/[\\/:*?"<>|\r\n]+/g, "_").slice(0, 120);
  return name || fallback;
}

export default async function handler(req, res) {
  const { url, name } = req.query || {};
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing url" });
    return;
  }

  let target;
  try {
    target = new URL(url);
  } catch (error) {
    res.status(400).json({ error: "Invalid url" });
    return;
  }
  if (!/^https?:$/.test(target.protocol) || !ALLOWED.some((rx) => rx.test(target.hostname))) {
    res.status(403).json({ error: "Host not allowed" });
    return;
  }

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    Accept: "*/*",
  };
  const referer = refererFor(target.hostname);
  if (referer) headers.Referer = referer;
  if (req.headers.range) headers.Range = req.headers.range;

  let upstream;
  try {
    upstream = await fetch(target.toString(), { headers, redirect: "follow" });
  } catch (error) {
    res.status(502).json({ error: "Upstream unreachable" });
    return;
  }

  if (!upstream.ok && upstream.status !== 206) {
    res.status(upstream.status).json({ error: `Upstream responded with ${upstream.status}` });
    return;
  }

  const type = upstream.headers.get("content-type") || "application/octet-stream";
  const length = upstream.headers.get("content-length");
  const range = upstream.headers.get("content-range");

  res.setHeader("Content-Type", type);
  if (length) res.setHeader("Content-Length", length);
  if (range) res.setHeader("Content-Range", range);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeName(name, "social-download")}"`
  );
  res.status(upstream.status === 206 ? 206 : 200);

  if (!upstream.body) {
    res.end();
    return;
  }
  Readable.fromWeb(upstream.body).pipe(res);
}
