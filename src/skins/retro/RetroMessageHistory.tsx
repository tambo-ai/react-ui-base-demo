"use client";
import { useRef, useEffect } from "react";
import { useTambo } from "@tambo-ai/react";

export function RetroMessageHistory() {
  const { messages, isStreaming, isWaiting } = useTambo();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: 16,
        background: "#050505",
      }}
    >
      {messages.map((msg) => {
        const text = msg.content
          ?.filter((c): c is { type: "text"; text: string } => c.type === "text")
          .map((c) => c.text)
          .join("\n");
        if (!text) return null;
        const isUser = msg.role === "user";
        return (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}
          >
            <div className={isUser ? "retro-bubble-user" : "retro-bubble-ai"}>
              {text}
            </div>
          </div>
        );
      })}
      {(isStreaming || isWaiting) && (
        <div className="retro-loading" style={{ padding: "8px 0" }}>
          Processing query...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
