"use client";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function NesSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        borderRight: "4px solid #fff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div className="nes-container with-title" style={{ margin: 8 }}>
        <p className="title">Threads</p>
        <button
          className="nes-btn is-primary"
          style={{ width: "100%", marginBottom: 8 }}
          onClick={() => startNewThread()}
        >
          + New Thread
        </button>
        {!isLoading && (
          <ul className="nes-list is-disc" style={{ paddingLeft: 16 }}>
            {threads.map((thread) => (
              <li
                key={thread.id}
                onClick={() => switchThread(thread.id)}
                style={{ cursor: "pointer", marginBottom: 8 }}
              >
                <span
                  className={
                    thread.id === currentThreadId ? "nes-text is-primary" : ""
                  }
                >
                  {thread.name ?? thread.id.slice(0, 8)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
