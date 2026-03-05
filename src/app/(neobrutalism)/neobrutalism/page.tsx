"use client";
import { NeoSidebar } from "@/skins/neobrutalism/NeoSidebar";
import { NeoMessageHistory } from "@/skins/neobrutalism/NeoMessageHistory";
import { NeoMessageInput } from "@/skins/neobrutalism/NeoMessageInput";

export default function NeobrutalismDemo() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <NeoSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NeoMessageHistory />
        <NeoMessageInput />
      </div>
    </div>
  );
}
