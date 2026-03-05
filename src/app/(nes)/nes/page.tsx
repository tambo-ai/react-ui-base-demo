import { NesSidebar } from "@/skins/nes/NesSidebar";
import { NesMessageHistory } from "@/skins/nes/NesMessageHistory";
import { NesMessageInput } from "@/skins/nes/NesMessageInput";

export default function NesDemo() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <NesSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 16px", borderBottom: "4px solid #212529", fontSize: 12, flexShrink: 0 }}>
          <a href="/" style={{ color: "#212529", textDecoration: "none", fontFamily: "'Press Start 2P', cursive", fontSize: 10 }}>← Home</a>
          <span style={{ marginLeft: 8, fontFamily: "'Press Start 2P', cursive", fontSize: 10 }}>/ NES</span>
        </div>
        <NesMessageHistory />
        <NesMessageInput />
      </div>
    </div>
  );
}
