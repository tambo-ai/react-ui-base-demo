"use client";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function RetroSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <div
      className="retro-panel"
      style={{
        width: 260,
        flexShrink: 0,
        borderRight: "1px solid #ffb000",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid rgba(255, 176, 0, 0.3)",
        }}
      >
        <h2
          className="retro-text"
          style={{ fontSize: 16, margin: "0 0 12px 0" }}
        >
          {"> THREADS"}
        </h2>
        <button
          className="retro-btn retro-btn-primary"
          style={{ width: "100%" }}
          onClick={() => startNewThread()}
        >
          [+] NEW THREAD
        </button>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {isLoading
          ? null
          : threads.map((thread) => (
              <div
                key={thread.id}
                className={
                  "retro-thread-item" +
                  (thread.id === currentThreadId ? " active" : "")
                }
                onClick={() => switchThread(thread.id)}
              >
                {">"} {thread.name ?? thread.id.slice(0, 8)}
              </div>
            ))}
      </div>
    </div>
  );
}
