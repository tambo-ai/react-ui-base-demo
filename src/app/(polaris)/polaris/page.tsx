"use client";

import {
  ThreadHistory,
  ThreadContent,
  MessageInput,
  Message,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";

export default function PolarisDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <ThreadHistory.Root
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid #e1e3e5",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#f6f6f7",
        }}
      >
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #e1e3e5",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#202223" }}>
            Threads
          </h2>
          <ThreadHistory.NewThreadButton
            style={{
              width: "100%",
              padding: "6px 12px",
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "#008060",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            + New thread
          </ThreadHistory.NewThreadButton>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
          <ThreadHistory.List
            render={(_props, state) => (
              <div>
                {state.filteredThreads.map((thread) => (
                  <ThreadHistory.Item
                    key={thread.id}
                    thread={thread}
                    render={(_itemProps, itemState) => (
                      <button
                        {..._itemProps}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "8px 12px",
                          fontSize: 14,
                          textAlign: "left",
                          color: "#202223",
                          backgroundColor: itemState.isActive ? "#e1e3e5" : "transparent",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap" as const,
                          fontWeight: itemState.isActive ? 600 : 400,
                        }}
                      >
                        {thread.name ?? thread.id.slice(0, 8)}
                      </button>
                    )}
                  />
                ))}
              </div>
            )}
          />
        </div>
      </ThreadHistory.Root>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #e1e3e5", fontSize: 13, flexShrink: 0 }}>
          <a href="/" style={{ color: "#008060", textDecoration: "none" }}>← Home</a>
          <span style={{ color: "#6d7175", marginLeft: 8 }}>/ Polaris</span>
        </div>

        <ThreadContent.Root style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <ThreadContent.Empty
            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6d7175", fontSize: 14 }}
          >
            Send a message to get started
          </ThreadContent.Empty>
          <ThreadContent.Messages
            render={(_props, state) => (
              <div>
                {state.filteredMessages.map((msg) => (
                  <Message.Root
                    key={msg.id}
                    message={msg}
                    role={msg.role as "user" | "assistant"}
                    style={{ marginBottom: 12, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                  >
                    <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 8 }}>
                      <ReasoningInfo.Root>
                        <div style={{ padding: "8px 12px", borderRadius: 8, backgroundColor: "#fef8e8", border: "1px solid #f1c40f", fontSize: 12 }}>
                          <ReasoningInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, color: "#8a6b0f" }}
                          >
                            <ReasoningInfo.StatusText />
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content style={{ marginTop: 6, fontSize: 12, color: "#6d7175", lineHeight: 1.5 }}>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </div>
                      </ReasoningInfo.Root>

                      <Message.Content
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          backgroundColor: msg.role === "user" ? "#008060" : "#f6f6f7",
                          color: msg.role === "user" ? "#fff" : "#202223",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      />

                      <ToolcallInfo.Root>
                        <div style={{ padding: "8px 12px", borderRadius: 8, backgroundColor: "#f6f6f7", border: "1px solid #e1e3e5", fontSize: 12 }}>
                          <ToolcallInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, color: "#6d7175" }}
                          >
                            <ToolcallInfo.StatusIcon />
                            <ToolcallInfo.ToolName />
                            <ToolcallInfo.StatusText />
                          </ToolcallInfo.Trigger>
                          <ToolcallInfo.Content style={{ marginTop: 6, fontSize: 12, color: "#6d7175" }}>
                            <ToolcallInfo.Parameters />
                            <ToolcallInfo.Result />
                          </ToolcallInfo.Content>
                        </div>
                      </ToolcallInfo.Root>

                      <Message.RenderedComponent>
                        <Message.RenderedComponentContent style={{ marginTop: 4 }} />
                      </Message.RenderedComponent>

                      <Message.LoadingIndicator
                        style={{ display: "flex", gap: 4, padding: "8px 12px", borderRadius: 8, backgroundColor: "#f6f6f7" }}
                      />
                    </div>
                  </Message.Root>
                ))}
              </div>
            )}
          />
        </ThreadContent.Root>

        <MessageInput.Root style={{ flexShrink: 0, borderTop: "1px solid #e1e3e5" }}>
          <MessageInput.Error
            style={{ margin: "8px 12px 0", padding: "8px 12px", fontSize: 12, color: "#d72c0d", backgroundColor: "#fef6f6", borderRadius: 8 }}
          />
          <MessageInput.StagedImages style={{ display: "flex", gap: 8, padding: "8px 12px 0", flexWrap: "wrap" }} />
          <MessageInput.Elicitation
            style={{ margin: "8px 12px", padding: 12, borderRadius: 8, backgroundColor: "#f6f6f7", border: "1px solid #e1e3e5" }}
          />
          <MessageInput.Content style={{ display: "flex", gap: 8, padding: 12, alignItems: "flex-end" }}>
            <MessageInput.FileButton
              style={{ padding: "6px 10px", fontSize: 14, backgroundColor: "#f6f6f7", border: "1px solid #e1e3e5", borderRadius: 8, cursor: "pointer", color: "#6d7175" }}
            >
              📎
            </MessageInput.FileButton>
            <div style={{ flex: 1 }}>
              <MessageInput.Textarea
                placeholder="Type a message..."
                style={{ minHeight: 40, maxHeight: 120, padding: "8px 12px", fontSize: 14, border: "1px solid #e1e3e5", borderRadius: 8, outline: "none", width: "100%", boxSizing: "border-box", lineHeight: 1.5 }}
              />
            </div>
            <MessageInput.SubmitButton
              style={{ padding: "6px 12px", fontSize: 14, fontWeight: 500, color: "#fff", backgroundColor: "#008060", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              Send
            </MessageInput.SubmitButton>
            <MessageInput.StopButton
              style={{ padding: "6px 12px", fontSize: 14, fontWeight: 500, color: "#fff", backgroundColor: "#d72c0d", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              Stop
            </MessageInput.StopButton>
          </MessageInput.Content>
        </MessageInput.Root>
      </div>
    </div>
  );
}
