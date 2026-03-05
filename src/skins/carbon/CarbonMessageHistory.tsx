"use client";
import { useRef, useEffect } from "react";
import { InlineLoading } from "@carbon/react";
import { useTambo } from "@tambo-ai/react";

export function CarbonMessageHistory() {
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
                backgroundColor: isUser ? "#0f62fe" : "#f4f4f4",
                color: isUser ? "#ffffff" : "#161616",
              }}
            >
              {text}
            </div>
          </div>
        );
      })}
      {(isStreaming || isWaiting) && (
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
          <InlineLoading description="AI is responding..." />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
