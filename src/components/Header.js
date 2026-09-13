import React from "react";
import { Github, Moon, Sun } from "lucide-react";

const REPO = "https://github.com/Itz-Murali/Social-Downloader-Web";
const LOGO = "https://anya-file-host.vercel.app/nkzvmo9xxg";

export default function Header({ theme, onToggleTheme }) {
  const isLight = theme === "light";
  return (
    <header className="header">
      <a className="brand" href="#top">
        <span className="brand__mark">
          <img src={LOGO} alt="Social Downloader logo" width="34" height="34" />
        </span>
        <span className="brand__text">
          Social<span>Downloader</span>
        </span>
      </a>
      <nav className="header__nav">
        <a href="#how">How it works</a>
        <a href="#sources">Sources</a>
        <a className="header__repo" href={REPO} target="_blank" rel="noreferrer">
          <Github size={15} strokeWidth={2.2} />
          Open source
        </a>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={isLight ? "Switch to night mode" : "Switch to day mode"}
          title={isLight ? "Night mode" : "Day mode"}
        >
          {isLight ? <Moon size={16} strokeWidth={2.2} /> : <Sun size={16} strokeWidth={2.2} />}
        </button>
      </nav>
    </header>
  );
}
