"use client";
import { useRef, useEffect } from "react";
import { Spinner, Text } from "@primer/react";
import { useTambo } from "@tambo-ai/react";

export function PrimerMessageHistory() {
  const { messages, isStreaming, isWaiting } = useTambo();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const text = msg.content
          .filter((c) => c.type === "text")
          .map((c) => ("text" in c ? c.text : ""))
          .join("");
        return (
          <div
            key={msg.id}
            style={{
              marginBottom: 12,
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: isUser
                  ? "var(--bgColor-accent-emphasis, #0969da)"
                  : "var(--bgColor-muted, #f6f8fa)",
                color: isUser
                  ? "var(--fgColor-onEmphasis, #ffffff)"
                  : "var(--fgColor-default, #1f2328)",
              }}
            >
              <Text size="medium">{text}</Text>
            </div>
          </div>
        );
      })}
      {(isStreaming || isWaiting) && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 12,
          }}
        >
          <Spinner size="small" srText="AI is responding..." />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
