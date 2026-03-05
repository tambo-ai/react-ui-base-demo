"use client";
import { Button, Heading } from "@carbon/react";
import { Add } from "@carbon/icons-react";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function CarbonSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Heading>Threads</Heading>
        <Button
          kind="primary"
          size="sm"
          renderIcon={Add}
          onClick={() => startNewThread()}
          style={{ width: "100%" }}
        >
          New thread
        </Button>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
        {isLoading ? null : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {threads.map((thread) => (
              <li key={thread.id} style={{ marginBottom: 4 }}>
                <Button
                  kind={thread.id === currentThreadId ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => switchThread(thread.id)}
                  style={{ width: "100%", justifyContent: "flex-start" }}
                >
                  {thread.name ?? thread.id.slice(0, 8)}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
