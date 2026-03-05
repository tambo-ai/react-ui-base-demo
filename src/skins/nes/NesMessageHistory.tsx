"use client";
import { useRef, useEffect } from "react";
import { useTambo } from "@tambo-ai/react";

export function NesMessageHistory() {
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
            className={isUser ? "nes-balloon from-right" : "nes-balloon from-left"}
            style={{ marginBottom: 12, textAlign: isUser ? "right" : "left" }}
          >
            <p>{text}</p>
          </div>
        );
      })}
      {(isStreaming || isWaiting) && (
        <progress
          className="nes-progress is-primary"
          value="70"
          max="100"
          style={{ height: 20 }}
        />
      )}
      <div ref={bottomRef} />
    </div>
  );
}
