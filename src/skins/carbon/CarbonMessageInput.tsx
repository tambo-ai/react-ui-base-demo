"use client";
import { TextArea, Button } from "@carbon/react";
import { Send } from "@carbon/icons-react";
import { useTamboThreadInput } from "@tambo-ai/react";

export function CarbonMessageInput() {
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
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      <div style={{ flex: 1 }}>
        <TextArea
          labelText="Message"
          hideLabel
          rows={2}
          placeholder="Type a message... (Ctrl+Enter to send)"
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
      </div>
      <Button
        kind="primary"
        renderIcon={Send}
        disabled={isDisabled}
        onClick={() => submit()}
        iconDescription="Send message"
        hasIconOnly={false}
      >
        Send
      </Button>
    </div>
  );
}
