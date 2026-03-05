"use client";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function NeoSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        borderRight: "3px solid #000",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#FFF8DC",
        padding: 16,
      }}
    >
      <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 12, fontFamily: "system-ui, sans-serif", marginTop: 0 }}>
        Threads
      </h2>
      <button
        className="neo-btn neo-btn-primary"
        style={{ width: "100%", marginBottom: 16 }}
        onClick={() => startNewThread()}
      >
        + New Thread
      </button>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", flex: 1 }}>
        {isLoading ? null : threads.map((thread) => (
          <div
            key={thread.id}
            className={"neo-thread-item" + (thread.id === currentThreadId ? " active" : "")}
            onClick={() => switchThread(thread.id)}
          >
            {thread.name ?? thread.id.slice(0, 8)}
          </div>
        ))}
      </div>
    </div>
  );
}
