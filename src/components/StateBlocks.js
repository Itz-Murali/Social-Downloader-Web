import React from "react";
import { CircleAlert, Sparkles } from "lucide-react";

export function SkeletonGrid() {
  return (
    <div className="results__grid">
      {[0, 1, 2].map((key) => (
        <div className="skeleton" key={key} style={{ animationDelay: `${key * 120}ms` }}>
          <div className="skeleton__frame" />
          <div className="skeleton__line skeleton__line--wide" />
          <div className="skeleton__line" />
          <div className="skeleton__block" />
        </div>
      ))}
    </div>
  );
}

export function ErrorBlock({ message, onRetry }) {
  return (
    <div className="notice notice--error" role="alert">
      <CircleAlert size={18} strokeWidth={2.2} />
      <div>
        <strong>Could not resolve that</strong>
        <p>{message}</p>
      </div>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function EmptyBlock({ samples, onPick }) {
  return (
    <div className="notice notice--idle">
      <Sparkles size={18} strokeWidth={2.2} />
      <div>
        <strong>Nothing loaded yet</strong>
        <p>Try one of these to see how a resolved result looks.</p>
        <ul className="notice__samples">
          {samples.map((sample) => (
            <li key={sample.value}>
              <button type="button" onClick={() => onPick(sample.value)}>
                {sample.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
