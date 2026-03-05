"use client";

import {
  ThreadHistory,
  ThreadContent,
  MessageInput,
  Message,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";

export default function NeobrutalismDemo() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ThreadHistory.Root
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "3px solid #000",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#e8e4df",
        }}
      >
        <div
          style={{
            padding: 16,
            borderBottom: "3px solid #000",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#000", textTransform: "uppercase" as const, letterSpacing: 1 }}>
            Threads
          </h2>
          <ThreadHistory.NewThreadButton
            style={{
              width: "100%",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 700,
              color: "#000",
              backgroundColor: "#a388ee",
              border: "3px solid #000",
              boxShadow: "4px 4px 0 #000",
              cursor: "pointer",
              textTransform: "uppercase" as const,
            }}
          >
            + New thread
          </ThreadHistory.NewThreadButton>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
          <ThreadHistory.List
            render={(_props, state) => (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
                          padding: "6px 12px",
                          fontSize: 13,
                          fontWeight: 700,
                          textAlign: "left",
                          color: "#000",
                          backgroundColor: itemState.isActive ? "#ffd803" : "transparent",
                          border: itemState.isActive ? "2px solid #000" : "2px solid transparent",
                          boxShadow: itemState.isActive ? "2px 2px 0 #000" : "none",
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap" as const,
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 16px", borderBottom: "3px solid #000", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          <a href="/" style={{ color: "#000", textDecoration: "none" }}>← Home</a>
          <span style={{ marginLeft: 8 }}>/ Neobrutalism</span>
        </div>

        <ThreadContent.Root style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <ThreadContent.Empty
            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#000", fontSize: 16, fontWeight: 900 }}
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
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#ffd803",
                            border: "3px solid #000",
                            boxShadow: "3px 3px 0 #000",
                            fontSize: 12,
                          }}
                        >
                          <ReasoningInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, fontWeight: 700, color: "#000" }}
                          >
                            <ReasoningInfo.StatusText />
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content style={{ marginTop: 6, fontSize: 12, color: "#000", lineHeight: 1.5 }}>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </div>
                      </ReasoningInfo.Root>

                      <Message.Content
                        style={{
                          padding: "8px 12px",
                          backgroundColor: msg.role === "user" ? "#a388ee" : "#fff",
                          color: "#000",
                          border: "3px solid #000",
                          boxShadow: "4px 4px 0 #000",
                          fontSize: 14,
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      />

                      <ToolcallInfo.Root>
                        <div style={{ padding: "8px 12px", backgroundColor: "#e8e4df", border: "3px solid #000", boxShadow: "3px 3px 0 #000", fontSize: 12 }}>
                          <ToolcallInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, fontWeight: 700, color: "#000" }}
                          >
                            <ToolcallInfo.StatusIcon />
                            <ToolcallInfo.ToolName />
                            <ToolcallInfo.StatusText />
                          </ToolcallInfo.Trigger>
                          <ToolcallInfo.Content style={{ marginTop: 6, fontSize: 12, color: "#000" }}>
                            <ToolcallInfo.Parameters />
                            <ToolcallInfo.Result />
                          </ToolcallInfo.Content>
                        </div>
                      </ToolcallInfo.Root>

                      <Message.RenderedComponent>
                        <Message.RenderedComponentContent style={{ marginTop: 4 }} />
                      </Message.RenderedComponent>

                      <Message.LoadingIndicator
                        style={{ display: "flex", gap: 4, padding: "8px 12px", backgroundColor: "#ffd803", border: "3px solid #000" }}
                      />
                    </div>
                  </Message.Root>
                ))}
              </div>
            )}
          />
        </ThreadContent.Root>

        <MessageInput.Root style={{ flexShrink: 0, borderTop: "3px solid #000" }}>
          <MessageInput.Error
            style={{ margin: "8px 12px 0", padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#000", backgroundColor: "#ff6b6b", border: "3px solid #000" }}
          />
          <MessageInput.StagedImages style={{ display: "flex", gap: 8, padding: "8px 12px 0", flexWrap: "wrap" }} />
          <MessageInput.Elicitation
            style={{ margin: "8px 12px", padding: 12, backgroundColor: "#e8e4df", border: "3px solid #000", boxShadow: "3px 3px 0 #000" }}
          />
          <MessageInput.Content style={{ display: "flex", gap: 8, padding: 12, alignItems: "flex-end" }}>
            <MessageInput.FileButton
              style={{ padding: "6px 10px", fontSize: 14, backgroundColor: "#e8e4df", border: "3px solid #000", boxShadow: "2px 2px 0 #000", cursor: "pointer", color: "#000", fontWeight: 700 }}
            >
              📎
            </MessageInput.FileButton>
            <div style={{ flex: 1 }}>
              <MessageInput.Textarea
                placeholder="Type a message..."
                style={{ minHeight: 40, maxHeight: 120, padding: "8px 12px", fontSize: 14, border: "3px solid #000", outline: "none", width: "100%", boxSizing: "border-box", lineHeight: 1.5, fontWeight: 500 }}
              />
            </div>
            <MessageInput.SubmitButton
              style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700, color: "#000", backgroundColor: "#a388ee", border: "3px solid #000", boxShadow: "4px 4px 0 #000", cursor: "pointer", textTransform: "uppercase" as const }}
            >
              Send
            </MessageInput.SubmitButton>
            <MessageInput.StopButton
              style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700, color: "#000", backgroundColor: "#ff6b6b", border: "3px solid #000", boxShadow: "4px 4px 0 #000", cursor: "pointer", textTransform: "uppercase" as const }}
            >
              Stop
            </MessageInput.StopButton>
          </MessageInput.Content>
        </MessageInput.Root>
      </div>
    </div>
  );
}
