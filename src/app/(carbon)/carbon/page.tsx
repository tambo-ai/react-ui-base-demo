"use client";

export default function CarbonDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar — LAYOUT-01: thread selector on the left */}
      <div
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Threads</h2>
        <p style={{ color: "#666", fontSize: 14 }}>No threads yet</p>
      </div>

      {/* Main Panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* LAYOUT-02: Message history as main area */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <p style={{ color: "#999" }}>
            Carbon skin — message history will appear here
          </p>
        </div>

        {/* LAYOUT-03: Message input fixed at bottom */}
        <div
          style={{
            flexShrink: 0,
            borderTop: "1px solid #ccc",
            padding: 16,
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            disabled
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </div>
      </div>
    </div>
  );
}
