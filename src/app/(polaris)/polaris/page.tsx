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
        <PolarisMessageHistory />
        <PolarisMessageInput />
      </div>
    </div>
  );
}
