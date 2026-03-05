"use client";
import { NeoSidebar } from "@/skins/neobrutalism/NeoSidebar";
import { NeoMessageHistory } from "@/skins/neobrutalism/NeoMessageHistory";
import { NeoMessageInput } from "@/skins/neobrutalism/NeoMessageInput";

export default function NeobrutalismDemo() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <NeoSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 16px", borderBottom: "3px solid #000", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          <a href="/" style={{ color: "#000", textDecoration: "none" }}>← Home</a>
          <span style={{ marginLeft: 8 }}>/ Neobrutalism</span>
        </div>
        <NeoMessageHistory />
        <NeoMessageInput />
      </div>
    </div>
  );
}
