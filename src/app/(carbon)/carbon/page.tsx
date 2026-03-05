"use client";

import {
  ThreadHistory,
  ThreadContent,
  MessageInput,
  Message,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";

export default function CarbonPage() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <ThreadHistory.Root
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#f4f4f4",
        }}
      >
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#161616" }}>
            Threads
          </h2>
          <ThreadHistory.NewThreadButton
            style={{
              width: "100%",
              padding: "11px 16px",
              fontSize: 14,
              fontWeight: 400,
              color: "#fff",
              backgroundColor: "#0f62fe",
              border: "none",
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
                          padding: "8px 16px",
                          fontSize: 14,
                          textAlign: "left",
                          color: "#161616",
                          backgroundColor: itemState.isActive ? "#e0e0e0" : "transparent",
                          border: "none",
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
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #e0e0e0", fontSize: 13, flexShrink: 0 }}>
          <a href="/" style={{ color: "#0f62fe", textDecoration: "none" }}>← Home</a>
          <span style={{ color: "#525252", marginLeft: 8 }}>/ Carbon</span>
        </div>

        <ThreadContent.Root style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <ThreadContent.Empty
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#525252",
              fontSize: 14,
            }}
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
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 8 }}>
                      <ReasoningInfo.Root>
                        <div
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#fff1d6",
                            borderLeft: "3px solid #f1c21b",
                            fontSize: 12,
                          }}
                        >
                          <ReasoningInfo.Trigger
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: 12,
                              color: "#161616",
                            }}
                          >
                            <ReasoningInfo.StatusText />
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content style={{ marginTop: 6, fontSize: 12, color: "#525252", lineHeight: 1.5 }}>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </div>
                      </ReasoningInfo.Root>

                      <Message.Content
                        style={{
                          padding: "8px 16px",
                          backgroundColor: msg.role === "user" ? "#0f62fe" : "#f4f4f4",
                          color: msg.role === "user" ? "#fff" : "#161616",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      />

                      <ToolcallInfo.Root>
                        <div style={{ padding: "8px 16px", backgroundColor: "#f4f4f4", borderLeft: "3px solid #0f62fe", fontSize: 12 }}>
                          <ToolcallInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, color: "#525252" }}
                          >
                            <ToolcallInfo.StatusIcon />
                            <ToolcallInfo.ToolName />
                            <ToolcallInfo.StatusText />
                          </ToolcallInfo.Trigger>
                          <ToolcallInfo.Content style={{ marginTop: 6, fontSize: 12, color: "#525252" }}>
                            <ToolcallInfo.Parameters />
                            <ToolcallInfo.Result />
                          </ToolcallInfo.Content>
                        </div>
                      </ToolcallInfo.Root>

                      <Message.RenderedComponent>
                        <Message.RenderedComponentContent style={{ marginTop: 4 }} />
                      </Message.RenderedComponent>

                      <Message.LoadingIndicator
                        style={{ display: "flex", gap: 4, padding: "8px 16px", backgroundColor: "#f4f4f4" }}
                      />
                    </div>
                  </Message.Root>
                ))}
              </div>
            )}
          />
        </ThreadContent.Root>

        <MessageInput.Root style={{ flexShrink: 0, borderTop: "1px solid #e0e0e0" }}>
          <MessageInput.Error
            style={{ margin: "8px 16px 0", padding: "8px 16px", fontSize: 12, color: "#da1e28", backgroundColor: "#fff1f1" }}
          />
          <MessageInput.StagedImages style={{ display: "flex", gap: 8, padding: "8px 16px 0", flexWrap: "wrap" }} />
          <MessageInput.Elicitation
            style={{ margin: "8px 16px", padding: 16, backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0" }}
          />
          <MessageInput.Content style={{ display: "flex", gap: 8, padding: 16, alignItems: "flex-end" }}>
            <MessageInput.FileButton
              style={{ padding: "8px 12px", fontSize: 14, backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0", cursor: "pointer", color: "#525252" }}
            >
              📎
            </MessageInput.FileButton>
            <div style={{ flex: 1 }}>
              <MessageInput.Textarea
                placeholder="Type a message..."
                style={{ minHeight: 40, maxHeight: 120, padding: "11px 16px", fontSize: 14, border: "1px solid #e0e0e0", borderBottom: "2px solid #161616", outline: "none", width: "100%", boxSizing: "border-box", lineHeight: 1.5, backgroundColor: "#f4f4f4" }}
              />
            </div>
            <MessageInput.SubmitButton
              style={{ padding: "11px 16px", fontSize: 14, color: "#fff", backgroundColor: "#0f62fe", border: "none", cursor: "pointer" }}
            >
              Send
            </MessageInput.SubmitButton>
            <MessageInput.StopButton
              style={{ padding: "11px 16px", fontSize: 14, color: "#fff", backgroundColor: "#da1e28", border: "none", cursor: "pointer" }}
            >
              Stop
            </MessageInput.StopButton>
          </MessageInput.Content>
        </MessageInput.Root>
      </div>
    </div>
  );
}
