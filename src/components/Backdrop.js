import React from "react";

export default function Backdrop({ accent }) {
  return (
    <div className="backdrop" style={{ "--accent": accent }} aria-hidden="true">
      <div className="backdrop__halo" />
      <div className="backdrop__grid" />
      <div className="backdrop__grain" />
    </div>
  );
}
