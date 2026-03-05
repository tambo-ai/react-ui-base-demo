"use client";
import { Textarea, Button } from "@primer/react";
import { useTamboThreadInput } from "@tambo-ai/react";

export function PrimerMessageInput() {
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
        borderTop: "1px solid var(--borderColor-default, #d0d7de)",
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      <div style={{ flex: 1 }}>
        <Textarea
          block
          rows={2}
          resize="none"
          placeholder="Type a message... (Ctrl+Enter to send)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
      </div>
      <Button variant="primary" disabled={isDisabled} onClick={() => submit()}>
        Send
      </Button>
    </div>
  );
}
