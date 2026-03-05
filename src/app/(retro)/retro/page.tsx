"use client";

import {
  ThreadHistory,
  ThreadContent,
  MessageInput,
  Message,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";

export default function RetroDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#050505" }}>
      <ThreadHistory.Root
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid #ffb000",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#0a0a0a",
        }}
      >
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #ffb000",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 400, color: "#ffb000", textShadow: "0 0 5px #ffb000", fontFamily: "'Courier New', monospace" }}>
            &gt; THREADS
          </h2>
          <ThreadHistory.NewThreadButton
            style={{
              width: "100%",
              padding: "6px 12px",
              fontSize: 12,
              fontFamily: "'Courier New', monospace",
              color: "#050505",
              backgroundColor: "#ffb000",
              border: "1px solid #ffb000",
              cursor: "pointer",
              textShadow: "none",
            }}
          >
            + NEW THREAD
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
                          padding: "6px 8px",
                          fontSize: 12,
                          fontFamily: "'Courier New', monospace",
                          textAlign: "left",
                          color: itemState.isActive ? "#050505" : "#ffb000",
                          backgroundColor: itemState.isActive ? "#ffb000" : "transparent",
                          border: "none",
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap" as const,
                          textShadow: itemState.isActive ? "none" : "0 0 3px #ffb000",
                        }}
                      >
                        &gt; {thread.name ?? thread.id.slice(0, 8)}
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
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #ffb000", fontSize: 13, flexShrink: 0, fontFamily: "'Courier New', monospace" }}>
          <a href="/" style={{ color: "#ffb000", textDecoration: "none", textShadow: "0 0 5px #ffb000" }}>← Home</a>
          <span style={{ color: "rgba(255,176,0,0.6)", marginLeft: 8 }}>/ Retro</span>
        </div>

        <ThreadContent.Root style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <ThreadContent.Empty
            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#ffb000", fontSize: 14, fontFamily: "'Courier New', monospace", textShadow: "0 0 5px #ffb000" }}
          >
            &gt; AWAITING INPUT...
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
                            padding: "6px 10px",
                            backgroundColor: "rgba(255,176,0,0.1)",
                            border: "1px solid rgba(255,176,0,0.3)",
                            fontSize: 12,
                            fontFamily: "'Courier New', monospace",
                          }}
                        >
                          <ReasoningInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, color: "#ffb000", textShadow: "0 0 3px #ffb000", fontFamily: "'Courier New', monospace" }}
                          >
                            <ReasoningInfo.StatusText />
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content style={{ marginTop: 6, fontSize: 12, color: "rgba(255,176,0,0.7)", lineHeight: 1.5, fontFamily: "'Courier New', monospace" }}>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </div>
                      </ReasoningInfo.Root>

                      <Message.Content
                        style={{
                          padding: "8px 12px",
                          backgroundColor: msg.role === "user" ? "rgba(255,176,0,0.15)" : "rgba(255,176,0,0.05)",
                          color: "#ffb000",
                          border: "1px solid rgba(255,176,0,0.3)",
                          fontSize: 14,
                          lineHeight: 1.5,
                          fontFamily: "'Courier New', monospace",
                          textShadow: "0 0 3px rgba(255,176,0,0.5)",
                        }}
                      />

                      <ToolcallInfo.Root>
                        <div style={{ padding: "6px 10px", backgroundColor: "rgba(255,176,0,0.05)", border: "1px solid rgba(255,176,0,0.3)", fontSize: 12, fontFamily: "'Courier New', monospace" }}>
                          <ToolcallInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, color: "rgba(255,176,0,0.7)", fontFamily: "'Courier New', monospace" }}
                          >
                            <ToolcallInfo.StatusIcon />
                            <ToolcallInfo.ToolName />
                            <ToolcallInfo.StatusText />
                          </ToolcallInfo.Trigger>
                          <ToolcallInfo.Content style={{ marginTop: 6, fontSize: 12, color: "rgba(255,176,0,0.5)", fontFamily: "'Courier New', monospace" }}>
                            <ToolcallInfo.Parameters />
                            <ToolcallInfo.Result />
                          </ToolcallInfo.Content>
                        </div>
                      </ToolcallInfo.Root>

                      <Message.RenderedComponent>
                        <Message.RenderedComponentContent style={{ marginTop: 4 }} />
                      </Message.RenderedComponent>

                      <Message.LoadingIndicator
                        style={{ display: "flex", gap: 4, padding: "8px 12px", color: "#ffb000", textShadow: "0 0 5px #ffb000" }}
                      />
                    </div>
                  </Message.Root>
                ))}
              </div>
            )}
          />
        </ThreadContent.Root>

        <MessageInput.Root style={{ flexShrink: 0, borderTop: "1px solid #ffb000" }}>
          <MessageInput.Error
            style={{ margin: "8px 12px 0", padding: "6px 10px", fontSize: 12, color: "#ff4444", fontFamily: "'Courier New', monospace" }}
          />
          <MessageInput.StagedImages style={{ display: "flex", gap: 8, padding: "8px 12px 0", flexWrap: "wrap" }} />
          <MessageInput.Elicitation
            style={{ margin: "8px 12px", padding: 12, backgroundColor: "rgba(255,176,0,0.05)", border: "1px solid rgba(255,176,0,0.3)", fontFamily: "'Courier New', monospace" }}
          />
          <MessageInput.Content style={{ display: "flex", gap: 8, padding: 12, alignItems: "flex-end" }}>
            <MessageInput.FileButton
              style={{ padding: "5px 8px", fontSize: 14, backgroundColor: "transparent", border: "1px solid #ffb000", cursor: "pointer", color: "#ffb000", fontFamily: "'Courier New', monospace" }}
            >
              📎
            </MessageInput.FileButton>
            <div style={{ flex: 1 }}>
              <MessageInput.Textarea
                placeholder="> TYPE COMMAND..."
                style={{ minHeight: 40, maxHeight: 120, padding: "8px 12px", fontSize: 14, border: "1px solid #ffb000", outline: "none", width: "100%", boxSizing: "border-box", lineHeight: 1.5, backgroundColor: "#0a0a0a", color: "#ffb000", fontFamily: "'Courier New', monospace", textShadow: "0 0 3px rgba(255,176,0,0.5)" }}
              />
            </div>
            <MessageInput.SubmitButton
              style={{ padding: "5px 12px", fontSize: 12, fontFamily: "'Courier New', monospace", color: "#050505", backgroundColor: "#ffb000", border: "1px solid #ffb000", cursor: "pointer" }}
            >
              SEND
            </MessageInput.SubmitButton>
            <MessageInput.StopButton
              style={{ padding: "5px 12px", fontSize: 12, fontFamily: "'Courier New', monospace", color: "#ff4444", backgroundColor: "transparent", border: "1px solid #ff4444", cursor: "pointer" }}
            >
              ABORT
            </MessageInput.StopButton>
          </MessageInput.Content>
        </MessageInput.Root>
      </div>
    </div>
  );
}
