"use client";
import { RetroSidebar } from "@/skins/retro/RetroSidebar";
import { RetroMessageHistory } from "@/skins/retro/RetroMessageHistory";
import { RetroMessageInput } from "@/skins/retro/RetroMessageInput";

export default function RetroDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#050505" }}>
      <RetroSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #ffb000", fontSize: 13, flexShrink: 0, fontFamily: "'Courier New', monospace" }}>
          <a href="/" style={{ color: "#ffb000", textDecoration: "none", textShadow: "0 0 5px #ffb000" }}>← Home</a>
          <span style={{ color: "rgba(255,176,0,0.6)", marginLeft: 8 }}>/ Retro</span>
        </div>
        <RetroMessageHistory />
        <RetroMessageInput />
      </div>
    </div>
  );
}
