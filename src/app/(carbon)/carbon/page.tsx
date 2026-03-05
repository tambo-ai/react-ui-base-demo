"use client";
import { CarbonSidebar } from "@/skins/carbon/CarbonSidebar";
import { CarbonMessageHistory } from "@/skins/carbon/CarbonMessageHistory";
import { CarbonMessageInput } from "@/skins/carbon/CarbonMessageInput";

export default function CarbonPage() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CarbonSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #e0e0e0", fontSize: 13, flexShrink: 0 }}>
          <a href="/" style={{ color: "#0f62fe", textDecoration: "none" }}>← Home</a>
          <span style={{ color: "#525252", marginLeft: 8 }}>/ Carbon</span>
        </div>
        <CarbonMessageHistory />
        <CarbonMessageInput />
      </div>
    </div>
  );
}
