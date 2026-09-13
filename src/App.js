import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { History, Trash2 } from "lucide-react";
import Backdrop from "./components/Backdrop";
import Header from "./components/Header";
import OmniBar from "./components/OmniBar";
import MediaCard from "./components/MediaCard";
import { EmptyBlock, ErrorBlock, SkeletonGrid } from "./components/StateBlocks";
import { Footer, HowItWorks, Sources } from "./components/Sections";
import { PLATFORMS, detectPlatform } from "./lib/detect";
import { resolve } from "./lib/api";
import { clearHistory, pushHistory, readHistory } from "./lib/history";
import { applyTheme, readTheme } from "./lib/theme";

const SAMPLES = [
  { label: "Lofi radio search", value: "lofi hip hop radio" },
  { label: "A YouTube link", value: "https://youtu.be/jfKfPfyJRdk" },
  { label: "Pinterest query", value: "brutalist poster" },
];

const BASE_ACCENT = "#7cf5c4";

export default function App() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState([]);
  const [theme, setTheme] = useState("dark");
  const controllerRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    setRecent(readHistory());
    const initial = readTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const platform = useMemo(() => detectPlatform(value), [value]);
  const accent = (result ? result.platform.accent : platform && platform.accent) || BASE_ACCENT;

  const run = useCallback(
    async (raw) => {
      const query = (raw === undefined ? value : raw).trim();
      if (!query) return;
      if (raw !== undefined) setValue(query);
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const next = await resolve(query, controller.signal);
        setResult(next);
        setRecent(pushHistory({ value: query, platform: next.platform.id }));
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (caught) {
        if (caught.name === "AbortError") return;
        setResult(null);
        setError(caught.message || "Something went wrong.");
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
          setLoading(false);
        }
      }
    },
    [value]
  );

  const clear = () => {
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = null;
    setValue("");
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="shell" id="top" style={{ "--accent": accent }}>
      <Backdrop accent={accent} />
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <section className="hero">
          <span className="hero__badge">
            <span className="hero__pulse" />
            Three networks · one field
          </span>
          <h1>
            Paste the link.
            <em key={theme}>Keep the file.</em>
          </h1>
          <p className="hero__lede">
            Social Downloader reads YouTube, Instagram and Pinterest from a single bar and hands back
            the original video, audio or image. No accounts, no queues, no watermark tax.
          </p>

          <OmniBar
            value={value}
            onChange={setValue}
            onSubmit={run}
            onClear={clear}
            platform={platform}
            loading={loading}
          />

          <div className="rail">
            {Object.values(PLATFORMS).map((entry) => (
              <span
                key={entry.id}
                className={`rail__item${platform && platform.id === entry.id ? " is-active" : ""}`}
                style={{ "--accent": entry.accent }}
              >
                <b>{entry.label}</b>
                <small>{entry.hint}</small>
              </span>
            ))}
          </div>

          {recent.length ? (
            <div className="recent">
              <span className="recent__label">
                <History size={13} strokeWidth={2.2} />
                Recent
              </span>
              <div className="recent__list">
                {recent.map((entry) => (
                  <button key={entry.value} type="button" onClick={() => run(entry.value)}>
                    {entry.value.length > 34 ? `${entry.value.slice(0, 34)}…` : entry.value}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="recent__clear"
                onClick={() => setRecent(clearHistory())}
                aria-label="Clear recent"
              >
                <Trash2 size={13} strokeWidth={2.2} />
              </button>
            </div>
          ) : null}
        </section>

        <section className="results" ref={resultsRef}>
          {loading ? <SkeletonGrid /> : null}
          {!loading && error ? <ErrorBlock message={error} onRetry={() => run()} /> : null}
          {!loading && !error && !result ? (
            <EmptyBlock samples={SAMPLES} onPick={(sample) => run(sample)} />
          ) : null}
          {!loading && !error && result ? (
            <>
              <div className="results__head">
                <span className="eyebrow">
                  {result.mode === "search" ? "Search results" : "Resolved media"}
                </span>
                <span className="results__count">
                  {result.items.length} item{result.items.length === 1 ? "" : "s"} ·{" "}
                  {result.platform.label}
                </span>
              </div>
              <div className="results__grid">
                {result.items.map((item, index) => (
                  <MediaCard key={item.id} item={item} index={index} />
                ))}
              </div>
            </>
          ) : null}
        </section>

        <HowItWorks />
        <Sources />
      </main>

      <Footer />
    </div>
  );
}
