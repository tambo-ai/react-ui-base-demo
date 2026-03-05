"use client";
import { PrimerSidebar } from "@/skins/primer/PrimerSidebar";
import { PrimerMessageHistory } from "@/skins/primer/PrimerMessageHistory";
import { PrimerMessageInput } from "@/skins/primer/PrimerMessageInput";

export default function PrimerDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <PrimerSidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #d0d7de", fontSize: 13, flexShrink: 0 }}>
          <a href="/" style={{ color: "#0969da", textDecoration: "none" }}>← Home</a>
          <span style={{ color: "#656d76", marginLeft: 8 }}>/ Primer</span>
        </div>
        <PrimerMessageHistory />
        <PrimerMessageInput />
      </div>
    </div>
  );
}
