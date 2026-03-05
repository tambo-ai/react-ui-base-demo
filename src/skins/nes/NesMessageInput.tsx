"use client";
import { useTamboThreadInput } from "@tambo-ai/react";

export function NesMessageInput() {
  const { value, setValue, submit, isDisabled } = useTamboThreadInput();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!isDisabled) submit();
    }
  };

  return (
    <div
      style={{
        flexShrink: 0,
        padding: 12,
        borderTop: "4px solid #fff",
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      <textarea
        className="nes-textarea"
        rows={2}
        placeholder="Type a message... (Ctrl+Enter to send)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        style={{ flex: 1 }}
      />
      <button
        className="nes-btn is-success"
        disabled={isDisabled}
        onClick={() => submit()}
      >
        Send
      </button>
    </div>
  );
}
