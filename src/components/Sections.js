import React from "react";
import { Github, Instagram, Link2, ScanLine, ShieldCheck, Youtube, Zap } from "lucide-react";
import { PLATFORMS } from "../lib/detect";

const REPO = "https://github.com/Itz-Murali/Social-Downloader-Web";

const STEPS = [
  {
    icon: Link2,
    title: "Drop anything in",
    body: "One field takes a reel, a pin, a watch link, or plain words. No tabs, no platform picker.",
  },
  {
    icon: ScanLine,
    title: "The bar reads it",
    body: "The host is matched the moment you type and the whole interface shifts to that platform.",
  },
  {
    icon: Zap,
    title: "Originals come back",
    body: "Direct stream and image URLs, untouched quality, ready to save or pipe elsewhere.",
  },
];

const SOURCES = [
  {
    icon: Youtube,
    name: "YouTube",
    accent: PLATFORMS.youtube.accent,
    endpoint: "youtube-api.itz-murali.workers.dev",
    lines: ["Watch, share and short links", "Separate video and audio streams", "Keyword search, up to 8 results"],
  },
  {
    icon: Instagram,
    name: "Instagram & Facebook",
    accent: PLATFORMS.instagram.accent,
    endpoint: "anya-apis.vercel.app/insta",
    lines: ["Posts, reels, TV and stories", "Every slide of a carousel", "Original files, no watermark pass"],
  },
  {
    icon: ScanLine,
    name: "Pinterest",
    accent: PLATFORMS.pinterest.accent,
    endpoint: "anya-apis.vercel.app/pinterest",
    lines: ["Single pin to full resolution", "Idea pin video streams", "Text query returns a board of results"],
  },
];

export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="section__head">
        <span className="eyebrow">01 · Flow</span>
        <h2>Three moves, no friction</h2>
      </div>
      <div className="steps">
        {STEPS.map((step, index) => (
          <article className="step" key={step.title}>
            <span className="step__index">{String(index + 1).padStart(2, "0")}</span>
            <step.icon size={20} strokeWidth={2} />
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Sources() {
  return (
    <section className="section" id="sources">
      <div className="section__head">
        <span className="eyebrow">02 · Coverage</span>
        <h2>What the single bar understands</h2>
      </div>
      <div className="sources">
        {SOURCES.map((source) => (
          <article className="source" key={source.name} style={{ "--accent": source.accent }}>
            <header>
              <span className="source__icon">
                <source.icon size={18} strokeWidth={2.1} />
              </span>
              <h3>{source.name}</h3>
            </header>
            <ul>
              {source.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <code>{source.endpoint}</code>
          </article>
        ))}
      </div>
      <div className="pledge">
        <ShieldCheck size={18} strokeWidth={2.1} />
        <p>
          Nothing is stored on a server. Links are resolved straight from your browser and only your
          recent queries stay on this device.
        </p>
      </div>
    </section>
  );
}

const LOGO = "https://anya-file-host.vercel.app/nkzvmo9xxg";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <span className="footer__mark">
            <img src={LOGO} alt="Social Downloader logo" width="38" height="38" />
          </span>
          <strong>Social Downloader</strong>
          <p>
            One bar for YouTube, Instagram and Pinterest. Built on public, key-free APIs, free
            forever, source in the open.
          </p>
          <div className="footer__social">
            <a href={REPO} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={16} strokeWidth={2.2} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube size={16} strokeWidth={2.2} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={16} strokeWidth={2.2} />
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Product</h4>
          <a href="#top">Downloader</a>
          <a href="#how">How it works</a>
          <a href="#sources">Supported sources</a>
        </div>

        <div className="footer__col">
          <h4>Platforms</h4>
          <a href="#sources">YouTube video & audio</a>
          <a href="#sources">Instagram reels & posts</a>
          <a href="#sources">Pinterest pins & boards</a>
        </div>

        <div className="footer__col">
          <h4>Project</h4>
          <a href={REPO} target="_blank" rel="noreferrer">
            Source code
          </a>
          <a href={`${REPO}/issues`} target="_blank" rel="noreferrer">
            Report an issue
          </a>
          <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            License
          </a>
        </div>
      </div>

      <div className="footer__bar">
        <span>© {new Date().getFullYear()} Social Downloader. All rights reserved.</span>
        <span className="footer__note">
          For personal use only. Respect the rights of original creators.
        </span>
      </div>
    </footer>
  );
}
