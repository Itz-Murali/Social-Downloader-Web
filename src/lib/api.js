import { PLATFORMS, detectPlatform, normalizeInput } from "./detect";
import { formatDuration } from "./format";
import { cached } from "./cache";

const ANYA = "https://anya-apis.vercel.app";
const YT = "https://youtube-api.itz-murali.workers.dev";

class ResolveError extends Error {}

function getJson(url, signal) {
  return cached(url, () => fetchJson(url, signal));
}

async function fetchJson(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal, headers: { Accept: "application/json" } });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ResolveError("Network unreachable. Check your connection and retry.");
  }
  let payload = null;
  const text = await response.text();
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (error) {
    payload = null;
  }
  if (!response.ok) {
    const detail = payload && payload.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail) && detail[0]
          ? detail[0].msg
          : `Upstream responded with ${response.status}`;
    throw new ResolveError(message);
  }
  if (payload === null) throw new ResolveError("Upstream returned an unreadable response.");
  if (payload && typeof payload.detail === "string") throw new ResolveError(payload.detail);
  return payload;
}

function asset(kind, label, url, note) {
  return url ? { kind, label, url, note: note || null } : null;
}

function fromYoutubeItem(item) {
  const duration = formatDuration(item.duration);
  return {
    id: item.videoId || item.title,
    platform: PLATFORMS.youtube,
    title: item.title || "YouTube video",
    subtitle: item.channelName || null,
    thumbnail: item.thumbnail || null,
    source: item.youtubeUrl || null,
    tags: [duration, item.views].filter(Boolean),
    assets: [
      asset("video", "Video", item.videoUrl, "MP4 stream"),
      asset("audio", "Audio", item.audioUrl, "M4A stream"),
      item.videoUrl || item.audioUrl
        ? asset("image", "Thumbnail", item.thumbnail, "Cover image")
        : null,
    ].filter(Boolean),
  };
}

function fromInstagram(payload, source) {
  const container = Array.isArray(payload) ? { media: payload } : payload || {};
  const raw =
    container.media ||
    container.results ||
    container.data ||
    container.urls ||
    container.links ||
    [];
  const list = Array.isArray(raw) ? raw : [raw];
  const items = list
    .map((entry, index) => {
      if (!entry) return null;
      const url = typeof entry === "string" ? entry : entry.url || entry.download || entry.src;
      if (!url) return null;
      const declared = typeof entry === "object" ? entry.type || entry.kind : null;
      const isVideo = /video|reel|mp4/i.test(declared || "") || /\.mp4/i.test(url);
      return {
        id: `${index}-${url.slice(-16)}`,
        platform: PLATFORMS.instagram,
        title:
          (typeof entry === "object" && (entry.title || entry.caption)) ||
          container.title ||
          container.caption ||
          "Instagram media",
        subtitle:
          (typeof entry === "object" && (entry.username || entry.owner)) ||
          container.username ||
          container.owner ||
          null,
        thumbnail:
          (typeof entry === "object" &&
            (entry.thumb || entry.thumbnail || entry.display_url || entry.cover)) ||
          container.thumbnail ||
          container.thumb ||
          (isVideo ? null : url),
        source,
        tags: [isVideo ? "Video" : "Image", list.length > 1 ? `Slide ${index + 1}` : null].filter(
          Boolean
        ),
        assets: [
          asset(isVideo ? "video" : "image", isVideo ? "Video" : "Image", url),
          isVideo
            ? asset(
                "image",
                "Thumbnail",
                (typeof entry === "object" &&
                  (entry.thumb || entry.thumbnail || entry.display_url || entry.cover)) ||
                  container.thumbnail ||
                  container.thumb ||
                  null,
                "Cover image"
              )
            : null,
        ].filter(Boolean),
      };
    })
    .filter(Boolean);
  if (!items.length) throw new ResolveError("No downloadable media found on that post.");
  return items;
}

function fromPinterestPin(payload, source) {
  const video = payload.video_url || (payload.type === "video" ? payload.url : null);
  const image = payload.image_url || (payload.type !== "video" ? payload.url : null);
  const assets = [
    asset("video", "Video", video, "MP4 stream"),
    asset("image", "Image", image, "Full resolution"),
  ].filter(Boolean);
  if (!assets.length) throw new ResolveError("That pin has no resolvable media.");
  return [
    {
      id: payload.pin_id || source,
      platform: PLATFORMS.pinterest,
      title: payload.title || "Pinterest pin",
      subtitle: payload.pin_id ? `Pin ${payload.pin_id}` : null,
      thumbnail: payload.thumb || image || null,
      source,
      tags: [video ? "Video" : "Image"],
      assets,
    },
  ];
}

function fromPinterestSearch(payload, query) {
  const list = Array.isArray(payload) ? payload : payload.images || payload.results || [];
  return list
    .map((entry, index) => {
      const url = typeof entry === "string" ? entry : entry.url || entry.image_url;
      if (!url) return null;
      return {
        id: `${index}-${url.slice(-16)}`,
        platform: PLATFORMS.pinterest,
        title: `${query} · ${index + 1}`,
        subtitle: "Pinterest search",
        thumbnail: url,
        source: url,
        tags: ["Image"],
        assets: [asset("image", "Image", url, "Full resolution")],
      };
    })
    .filter(Boolean);
}

export async function resolveStreams(youtubeUrl, signal) {
  const payload = await getJson(`${YT}/Url?url=${encodeURIComponent(youtubeUrl)}`, signal);
  const entry = Array.isArray(payload) ? payload[0] : payload;
  if (!entry) throw new ResolveError("No streams available for this video.");
  const item = fromYoutubeItem(entry);
  if (!item.assets.length) {
    throw new ResolveError("This video has no downloadable stream, it may be a live broadcast.");
  }
  return item;
}

export async function resolve(rawInput, signal) {
  const input = normalizeInput(rawInput);
  const platform = detectPlatform(input);
  if (!platform) {
    throw new ResolveError("That link is not supported yet. Try YouTube, Instagram or Pinterest.");
  }

  if (platform.id === "youtube") {
    const payload = await getJson(`${YT}/Url?url=${encodeURIComponent(input)}`, signal);
    const list = Array.isArray(payload) ? payload : [payload];
    const items = list.filter(Boolean).map(fromYoutubeItem);
    if (!items.length) throw new ResolveError("Could not read that YouTube video.");
    return { mode: "link", platform, items };
  }

  if (platform.id === "search") {
    const payload = await getJson(
      `${YT}/YouTube?query=${encodeURIComponent(input)}&limit=8`,
      signal
    );
    const list = Array.isArray(payload) ? payload : [payload];
    const items = list.filter(Boolean).map(fromYoutubeItem);
    if (!items.length) throw new ResolveError("No results for that search.");
    return { mode: "search", platform: PLATFORMS.youtube, items };
  }

  if (platform.id === "instagram") {
    const payload = await getJson(`${ANYA}/insta?url=${encodeURIComponent(input)}`, signal);
    return { mode: "link", platform, items: fromInstagram(payload, input) };
  }

  const payload = await getJson(`${ANYA}/pinterest?query=${encodeURIComponent(input)}`, signal);
  const isPin = /pin\.it|pinterest\.[a-z.]+\/pin/i.test(input);
  const items = isPin ? fromPinterestPin(payload, input) : fromPinterestSearch(payload, input);
  if (!items.length) throw new ResolveError("Nothing came back for that pin.");
  return { mode: isPin ? "link" : "search", platform, items };
}
