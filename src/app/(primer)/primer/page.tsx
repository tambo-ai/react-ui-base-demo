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
        <PrimerMessageHistory />
        <PrimerMessageInput />
      </div>
    </div>
  );
}
