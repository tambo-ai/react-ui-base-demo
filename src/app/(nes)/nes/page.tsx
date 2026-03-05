import { NesSidebar } from "@/skins/nes/NesSidebar";
import { NesMessageHistory } from "@/skins/nes/NesMessageHistory";
import { NesMessageInput } from "@/skins/nes/NesMessageInput";

export default function NesDemo() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <NesSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NesMessageHistory />
        <NesMessageInput />
      </div>
    </div>
  );
}
