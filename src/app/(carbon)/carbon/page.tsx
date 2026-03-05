"use client";
import { CarbonSidebar } from "@/skins/carbon/CarbonSidebar";
import { CarbonMessageHistory } from "@/skins/carbon/CarbonMessageHistory";
import { CarbonMessageInput } from "@/skins/carbon/CarbonMessageInput";

export default function CarbonPage() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CarbonSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <CarbonMessageHistory />
        <CarbonMessageInput />
      </div>
    </div>
  );
}
