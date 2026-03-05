"use client";
import { RetroSidebar } from "@/skins/retro/RetroSidebar";
import { RetroMessageHistory } from "@/skins/retro/RetroMessageHistory";
import { RetroMessageInput } from "@/skins/retro/RetroMessageInput";

export default function RetroDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#050505" }}>
      <RetroSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <RetroMessageHistory />
        <RetroMessageInput />
      </div>
    </div>
  );
}
