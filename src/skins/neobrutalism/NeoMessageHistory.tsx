"use client";
import { useRef, useEffect } from "react";
import { useTambo } from "@tambo-ai/react";

export function NeoMessageHistory() {
  const { messages, isStreaming, isWaiting } = useTambo();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#FAFAF9" }}>
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
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}
          >
            <div className={isUser ? "neo-bubble-user" : "neo-bubble-ai"}>
              {text}
            </div>
          </div>
        );
      })}
      {(isStreaming || isWaiting) && (
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
          <div className="neo-container" style={{ padding: "8px 16px", display: "inline-block" }}>
            <strong>Thinking...</strong>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
