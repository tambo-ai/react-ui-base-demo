"use client";
import { NavList, Button, Heading } from "@primer/react";
import { PlusIcon } from "@primer/octicons-react";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function PrimerSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        borderRight: "1px solid var(--borderColor-default, #d0d7de)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid var(--borderColor-default, #d0d7de)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Heading as="h2" variant="small">
          Threads
        </Heading>
        <Button
          leadingVisual={PlusIcon}
          variant="primary"
          size="small"
          block
          onClick={() => startNewThread()}
        >
          New thread
        </Button>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
        {isLoading ? null : (
          <NavList>
            {threads.map((thread) => (
              <NavList.Item
                key={thread.id}
                as="button"
                aria-current={
                  thread.id === currentThreadId ? "page" : undefined
                }
                onClick={() => switchThread(thread.id)}
              >
                {thread.name ?? thread.id.slice(0, 8)}
              </NavList.Item>
            ))}
          </NavList>
        )}
      </div>
    </div>
  );
}
