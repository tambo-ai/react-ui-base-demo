"use client";
import { useTamboThreadInput } from "@tambo-ai/react";

export function NeoMessageInput() {
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
        borderTop: "3px solid #000",
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        background: "#FAFAF9",
      }}
    >
      <div style={{ flex: 1 }}>
        <textarea
          className="neo-textarea"
          rows={2}
          placeholder="Type a message... (Ctrl+Enter to send)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
      </div>
      <button className="neo-btn neo-btn-success" disabled={isDisabled} onClick={() => submit()}>
        Send
      </button>
    </div>
  );
}
