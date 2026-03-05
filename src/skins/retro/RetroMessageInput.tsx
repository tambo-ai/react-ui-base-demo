"use client";
import { useTamboThreadInput } from "@tambo-ai/react";

export function RetroMessageInput() {
  const { value, setValue, submit, isDisabled } = useTamboThreadInput();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      style={{
        flexShrink: 0,
        padding: 12,
        borderTop: "1px solid #ffb000",
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        background: "#050505",
      }}
    >
      <div style={{ flex: 1 }}>
        <textarea
          className="retro-input"
          rows={2}
          placeholder="> Enter command... (Ctrl+Enter to transmit)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
      </div>
      <button
        className="retro-btn retro-btn-primary"
        disabled={isDisabled}
        onClick={() => submit()}
      >
        TRANSMIT
      </button>
    </div>
  );
}
