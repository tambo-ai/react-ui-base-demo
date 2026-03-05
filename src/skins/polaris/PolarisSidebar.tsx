"use client";
import { Button, Text, Spinner } from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function PolarisSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        borderRight: "1px solid #e1e3e5",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid #e1e3e5",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Text as="h2" variant="headingMd">
          Threads
        </Text>
        <Button
          icon={PlusIcon}
          variant="primary"
          size="slim"
          fullWidth
          onClick={() => startNewThread()}
        >
          New thread
        </Button>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
            <Spinner size="small" accessibilityLabel="Loading threads" />
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {threads.map((thread) => (
              <li key={thread.id} style={{ marginBottom: 4 }}>
                <Button
                  variant={thread.id === currentThreadId ? "primary" : "plain"}
                  fullWidth
                  textAlign="left"
                  onClick={() => switchThread(thread.id)}
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
