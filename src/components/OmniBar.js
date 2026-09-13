import React, { useEffect, useRef } from "react";
import { ClipboardPaste, CornerDownLeft, Loader2, Search, X } from "lucide-react";

export default function OmniBar({ value, onChange, onSubmit, onClear, platform, loading }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text.trim());
        inputRef.current.focus();
      }
    } catch (error) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      className={`omni${loading ? " is-loading" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="omni__signal">
        <span className="omni__dot" />
        <span className="omni__signal-text">{platform ? platform.label : "Waiting"}</span>
      </div>

      <input
        ref={inputRef}
        className="omni__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste a link, or type words to search"
        spellCheck="false"
        autoComplete="off"
        aria-label="Link or search query"
      />

      <div className="omni__tools">
        {value ? (
          <button type="button" className="omni__icon" onClick={onClear} aria-label="Clear">
            <X size={16} strokeWidth={2.2} />
          </button>
        ) : (
          <button type="button" className="omni__icon" onClick={paste} aria-label="Paste">
            <ClipboardPaste size={16} strokeWidth={2.2} />
          </button>
        )}
        <button type="submit" className="omni__go" disabled={loading || !value.trim()}>
          {loading ? (
            <Loader2 size={16} strokeWidth={2.4} className="spin" />
          ) : (
            <Search size={16} strokeWidth={2.4} />
          )}
          <span>{loading ? "Downloading" : "Download"}</span>
          <CornerDownLeft size={14} strokeWidth={2.2} className="omni__enter" />
        </button>
      </div>
    </form>
  );
}
