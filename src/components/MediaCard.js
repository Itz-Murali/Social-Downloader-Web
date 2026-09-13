import React, { useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Film,
  ImageIcon,
  Loader2,
  Music2,
  Play,
  Waypoints,
} from "lucide-react";
import { resolveStreams } from "../lib/api";
import { downloadToBrowser } from "../lib/download";
import { shortenUrl } from "../lib/format";

const ICONS = { video: Film, audio: Music2, image: ImageIcon };

export default function MediaCard({ item, index }) {
  const [copied, setCopied] = useState(null);
  const [preview, setPreview] = useState(false);
  const [extra, setExtra] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const [busy, setBusy] = useState(null);
  const [progress, setProgress] = useState(null);
  const [done, setDone] = useState(null);
  const [notice, setNotice] = useState(null);
  const [ratio, setRatio] = useState(null);
  const accent = item.platform.accent;
  const assets = extra ? extra.assets : item.assets;
  const tags = extra && extra.tags.length ? extra.tags : item.tags;
  const playable = assets.find((asset) => asset.kind === "video");
  const canUnlock = !assets.length && item.platform.id === "youtube" && Boolean(item.source);

  const unlock = async () => {
    setFetching(true);
    setStreamError(null);
    try {
      setExtra(await resolveStreams(item.source));
    } catch (error) {
      setStreamError(error.message || "Streams unavailable.");
    } finally {
      setFetching(false);
    }
  };

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      window.setTimeout(() => setCopied(null), 1600);
    } catch (error) {
      setCopied(null);
    }
  };

  const grab = async (asset) => {
    setBusy(asset.url);
    setProgress(null);
    setNotice(null);
    const outcome = await downloadToBrowser(asset.url, item.title, asset.kind, setProgress);
    setBusy(null);
    setProgress(null);
    if (outcome.fallback) {
      setNotice("Direct save blocked: opened the file in a new tab instead.");
      window.setTimeout(() => setNotice(null), 5000);
    } else {
      setDone(asset.url);
      window.setTimeout(() => setDone(null), 2400);
    }
  };

  const showingVideo = preview && playable;

  return (
    <article
      className="card"
      style={{ "--accent": accent, animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className={`card__frame${showingVideo ? " card__frame--auto" : ""}`}>
        {showingVideo ? (
          <video
            className="card__media card__media--video"
            src={playable.url}
            controls
            autoPlay
            playsInline
            style={ratio ? { aspectRatio: ratio } : undefined}
            onLoadedMetadata={(event) => {
              const { videoWidth, videoHeight } = event.currentTarget;
              if (videoWidth && videoHeight) setRatio(`${videoWidth} / ${videoHeight}`);
            }}
          />
        ) : item.thumbnail ? (
          <img className="card__media" src={item.thumbnail} alt={item.title} loading="lazy" />
        ) : (
          <div className="card__media card__media--empty">
            <ImageIcon size={22} strokeWidth={1.8} />
          </div>
        )}

        {playable && !preview ? (
          <button className="card__play" type="button" onClick={() => setPreview(true)}>
            <Play size={18} strokeWidth={2.4} />
          </button>
        ) : null}

        <span className="card__chip">{item.platform.label}</span>
      </div>

      <div className="card__body">
        <h3 className="card__title" title={item.title}>
          {item.title}
        </h3>
        {item.subtitle ? <p className="card__subtitle">{item.subtitle}</p> : null}

        {tags.length ? (
          <ul className="card__tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}

        {canUnlock ? (
          <button type="button" className="card__unlock" onClick={unlock} disabled={fetching}>
            {fetching ? (
              <Loader2 size={15} strokeWidth={2.3} className="spin" />
            ) : (
              <Waypoints size={15} strokeWidth={2.3} />
            )}
            {fetching ? "Pulling streams" : "Get download links"}
          </button>
        ) : null}

        {streamError ? <p className="card__warn">{streamError}</p> : null}
        {notice ? <p className="card__warn">{notice}</p> : null}

        <div className="card__assets">
          {assets.map((asset) => {
            const Icon = ICONS[asset.kind] || Download;
            return (
              <div className="asset" key={asset.url}>
                <span className="asset__icon">
                  <Icon size={15} strokeWidth={2.1} />
                </span>
                <span className="asset__meta">
                  <strong>{asset.label}</strong>
                  <small>{asset.note || shortenUrl(asset.url, 34)}</small>
                </span>
                <span className="asset__actions">
                  <button
                    type="button"
                    className="asset__ghost"
                    onClick={() => copy(asset.url)}
                    aria-label="Copy direct link"
                  >
                    {copied === asset.url ? (
                      <Check size={14} strokeWidth={2.4} />
                    ) : (
                      <Copy size={14} strokeWidth={2.2} />
                    )}
                  </button>
                  <button
                    type="button"
                    className={`asset__grab${busy === asset.url ? " is-busy" : ""}${
                      done === asset.url ? " is-done" : ""
                    }`}
                    onClick={() => grab(asset)}
                    disabled={busy === asset.url}
                  >
                    <span
                      className="asset__fill"
                      style={{
                        width:
                          busy === asset.url && typeof progress === "number"
                            ? `${progress}%`
                            : undefined,
                      }}
                    />
                    <span className="asset__grab-inner">
                      {busy === asset.url ? (
                        <Loader2 size={14} strokeWidth={2.4} className="spin" />
                      ) : done === asset.url ? (
                        <Check size={14} strokeWidth={2.6} />
                      ) : (
                        <Download size={14} strokeWidth={2.4} className="asset__bounce" />
                      )}
                      {busy === asset.url
                        ? typeof progress === "number"
                          ? `${progress}%`
                          : "Saving"
                        : done === asset.url
                          ? "Saved"
                          : "Download"}
                    </span>
                  </button>
                </span>
              </div>
            );
          })}
        </div>

        {item.source ? (
          <a className="card__source" href={item.source} target="_blank" rel="noreferrer">
            <ExternalLink size={13} strokeWidth={2.1} />
            {shortenUrl(item.source, 40)}
          </a>
        ) : null}
      </div>
    </article>
  );
}
