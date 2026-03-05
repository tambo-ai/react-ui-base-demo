"use client";
import { TextField, Button } from "@shopify/polaris";
import { useTamboThreadInput } from "@tambo-ai/react";

export function PolarisMessageInput() {
  const { value, setValue, submit, isDisabled } = useTamboThreadInput();

  return (
    <div
      style={{
        flexShrink: 0,
        padding: 12,
        borderTop: "1px solid #e1e3e5",
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      <div
        style={{ flex: 1 }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (!isDisabled) submit();
          }
        }}
      >
        <TextField
          label=""
          labelHidden
          multiline={2}
          placeholder="Type a message... (Ctrl+Enter to send)"
          value={value}
          onChange={(val) => setValue(val)}
          disabled={isDisabled}
          autoComplete="off"
        />
      </div>
      <Button variant="primary" disabled={isDisabled} onClick={() => submit()}>
        Send
      </Button>
    </div>
  );
}
