"use client";

import {
  ThreadHistory,
  ThreadContent,
  MessageInput,
  Message,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";

export default function NesDemo() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ThreadHistory.Root
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "4px solid #212529",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#212529",
        }}
      >
        <div
          style={{
            padding: 16,
            borderBottom: "4px solid #fff",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 10, fontWeight: 400, color: "#fff" }}>
            Threads
          </h2>
          <ThreadHistory.NewThreadButton
            className="nes-btn is-primary"
            style={{ width: "100%", fontSize: 10, cursor: "pointer" }}
          >
            + New
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
                        className={itemState.isActive ? "nes-btn is-warning" : "nes-btn"}
                        style={{
                          display: "block",
                          width: "100%",
                          fontSize: 8,
                          textAlign: "left",
                          cursor: "pointer",
                          marginBottom: 4,
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
        <div style={{ padding: "8px 16px", borderBottom: "4px solid #212529", fontSize: 10, flexShrink: 0 }}>
          <a href="/" style={{ color: "#fff", textDecoration: "none" }}>← Home</a>
          <span style={{ marginLeft: 8 }}>/ NES</span>
        </div>

        <ThreadContent.Root style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <ThreadContent.Empty
            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#fff", fontSize: 10 }}
          >
            <div className="nes-balloon from-left" style={{ maxWidth: 300, textAlign: "center" }}>
              <p style={{ fontSize: 10, margin: 0 }}>Send a message to start your quest!</p>
            </div>
          </ThreadContent.Empty>
          <ThreadContent.Messages
            render={(_props, state) => (
              <div>
                {state.filteredMessages.map((msg) => (
                  <Message.Root
                    key={msg.id}
                    message={msg}
                    role={msg.role as "user" | "assistant"}
                    style={{ marginBottom: 16, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                  >
                    <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 8 }}>
                      <ReasoningInfo.Root>
                        <div className="nes-container is-rounded" style={{ padding: 8, fontSize: 8, backgroundColor: "#f7dc6f" }}>
                          <ReasoningInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 8, color: "#212529" }}
                          >
                            <ReasoningInfo.StatusText />
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content style={{ marginTop: 6, fontSize: 8, color: "#212529", lineHeight: 1.8 }}>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </div>
                      </ReasoningInfo.Root>

                      <div className={msg.role === "user" ? "nes-balloon from-right" : "nes-balloon from-left"}>
                        <Message.Content
                          style={{ fontSize: 10, lineHeight: 1.8, color: "#212529" }}
                        />
                      </div>

                      <ToolcallInfo.Root>
                        <div className="nes-container is-rounded" style={{ padding: 8, fontSize: 8, backgroundColor: "#333" }}>
                          <ToolcallInfo.Trigger
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 8, color: "#fff" }}
                          >
                            <ToolcallInfo.StatusIcon />
                            <ToolcallInfo.ToolName />
                            <ToolcallInfo.StatusText />
                          </ToolcallInfo.Trigger>
                          <ToolcallInfo.Content style={{ marginTop: 6, fontSize: 8, color: "#aaa" }}>
                            <ToolcallInfo.Parameters />
                            <ToolcallInfo.Result />
                          </ToolcallInfo.Content>
                        </div>
                      </ToolcallInfo.Root>

                      <Message.RenderedComponent>
                        <Message.RenderedComponentContent style={{ marginTop: 4 }} />
                      </Message.RenderedComponent>

                      <Message.LoadingIndicator
                        style={{ display: "flex", gap: 4, padding: 8, fontSize: 10 }}
                      />
                    </div>
                  </Message.Root>
                ))}
              </div>
            )}
          />
        </ThreadContent.Root>

        <MessageInput.Root style={{ flexShrink: 0, borderTop: "4px solid #212529", padding: 12, backgroundColor: "#212529" }}>
          <MessageInput.Error
            style={{ marginBottom: 8, padding: 8, fontSize: 8, color: "#e76e55" }}
          />
          <MessageInput.StagedImages style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }} />
          <MessageInput.Elicitation
            className="nes-container is-rounded"
            style={{ marginBottom: 8, padding: 12, backgroundColor: "#333" }}
          />
          <MessageInput.Content style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <MessageInput.FileButton
              className="nes-btn"
              style={{ fontSize: 10, cursor: "pointer", padding: "4px 8px" }}
            >
              📎
            </MessageInput.FileButton>
            <div style={{ flex: 1 }}>
              <MessageInput.Textarea
                placeholder="Type..."
                style={{
                  minHeight: 40,
                  maxHeight: 80,
                  padding: 8,
                  fontSize: 10,
                  border: "4px solid #212529",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  lineHeight: 1.8,
                  backgroundColor: "#fff",
                  color: "#212529",
                  imageRendering: "pixelated" as const,
                }}
              />
            </div>
            <MessageInput.SubmitButton
              className="nes-btn is-primary"
              style={{ fontSize: 10, cursor: "pointer" }}
            >
              Send
            </MessageInput.SubmitButton>
            <MessageInput.StopButton
              className="nes-btn is-error"
              style={{ fontSize: 10, cursor: "pointer" }}
            >
              Stop
            </MessageInput.StopButton>
          </MessageInput.Content>
        </MessageInput.Root>
      </div>
    </div>
  );
}
