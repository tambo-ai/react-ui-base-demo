"use client";
import { PolarisSidebar } from "@/skins/polaris/PolarisSidebar";
import { PolarisMessageHistory } from "@/skins/polaris/PolarisMessageHistory";
import { PolarisMessageInput } from "@/skins/polaris/PolarisMessageInput";

export default function PolarisDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <PolarisSidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #e1e3e5", fontSize: 13, flexShrink: 0 }}>
          <a href="/" style={{ color: "#008060", textDecoration: "none" }}>← Home</a>
          <span style={{ color: "#6d7175", marginLeft: 8 }}>/ Polaris</span>
        </div>
        <PolarisMessageHistory />
        <PolarisMessageInput />
      </div>
    </div>
  );
}
