"use client";

import {
  ThreadHistory,
  ThreadContent,
  MessageInput,
  Message,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";

export default function PrimerDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <ThreadHistory.Root
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid var(--borderColor-default, #d0d7de)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid var(--borderColor-default, #d0d7de)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--fgColor-default, #1f2328)",
            }}
          >
            Threads
          </h2>
          <ThreadHistory.NewThreadButton
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              width: "100%",
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "20px",
              color: "#fff",
              backgroundColor: "var(--bgColor-accent-emphasis, #0969da)",
              border: "1px solid rgba(27,31,36,0.15)",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            + New thread
          </ThreadHistory.NewThreadButton>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
          <ThreadHistory.List
            render={(_props, state) => (
              <nav>
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
                          fontSize: 14,
                          textAlign: "left",
                          color: "var(--fgColor-default, #1f2328)",
                          backgroundColor: itemState.isActive
                            ? "var(--bgColor-muted, #f6f8fa)"
                            : "transparent",
                          border: "none",
                          borderRadius: 6,
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
              </nav>
            )}
          />
        </div>
      </ThreadHistory.Root>

      {/* Main area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid var(--borderColor-default, #d0d7de)",
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          <a
            href="/"
            style={{
              color: "var(--fgColor-accent, #0969da)",
              textDecoration: "none",
            }}
          >
            ← Home
          </a>
          <span style={{ color: "var(--fgColor-muted, #656d76)", marginLeft: 8 }}>
            / Primer
          </span>
        </div>

        {/* Messages */}
        <ThreadContent.Root style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <ThreadContent.Empty
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--fgColor-muted, #656d76)",
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
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <ReasoningInfo.Root>
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            backgroundColor: "var(--bgColor-attention-muted, #fff8c5)",
                            border: "1px solid var(--borderColor-attention-muted, #d4a72c66)",
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
                              color: "var(--fgColor-attention, #9a6700)",
                            }}
                          >
                            <ReasoningInfo.StatusText />
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              color: "var(--fgColor-muted, #656d76)",
                              lineHeight: 1.5,
                            }}
                          >
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </div>
                      </ReasoningInfo.Root>

                      <Message.Content
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          backgroundColor:
                            msg.role === "user"
                              ? "var(--bgColor-accent-emphasis, #0969da)"
                              : "var(--bgColor-muted, #f6f8fa)",
                          color:
                            msg.role === "user"
                              ? "var(--fgColor-onEmphasis, #ffffff)"
                              : "var(--fgColor-default, #1f2328)",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      />

                      <ToolcallInfo.Root>
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            backgroundColor: "var(--bgColor-muted, #f6f8fa)",
                            border: "1px solid var(--borderColor-default, #d0d7de)",
                            fontSize: 12,
                          }}
                        >
                          <ToolcallInfo.Trigger
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: 12,
                              color: "var(--fgColor-muted, #656d76)",
                            }}
                          >
                            <ToolcallInfo.StatusIcon />
                            <ToolcallInfo.ToolName />
                            <ToolcallInfo.StatusText />
                          </ToolcallInfo.Trigger>
                          <ToolcallInfo.Content
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              color: "var(--fgColor-muted, #656d76)",
                            }}
                          >
                            <ToolcallInfo.Parameters />
                            <ToolcallInfo.Result />
                          </ToolcallInfo.Content>
                        </div>
                      </ToolcallInfo.Root>

                      <Message.RenderedComponent>
                        <Message.RenderedComponentContent
                          style={{ marginTop: 4 }}
                        />
                      </Message.RenderedComponent>

                      <Message.LoadingIndicator
                        style={{
                          display: "flex",
                          gap: 4,
                          padding: "8px 12px",
                          borderRadius: 6,
                          backgroundColor: "var(--bgColor-muted, #f6f8fa)",
                        }}
                      />
                    </div>
                  </Message.Root>
                ))}
              </div>
            )}
          />
        </ThreadContent.Root>

        {/* Input */}
        <MessageInput.Root
          style={{
            flexShrink: 0,
            borderTop: "1px solid var(--borderColor-default, #d0d7de)",
          }}
        >
          <MessageInput.Error
            style={{
              margin: "8px 12px 0",
              padding: "6px 10px",
              fontSize: 12,
              color: "var(--fgColor-danger, #d1242f)",
              backgroundColor: "var(--bgColor-danger-muted, #ffebe9)",
              borderRadius: 6,
            }}
          />
          <MessageInput.StagedImages
            style={{
              display: "flex",
              gap: 8,
              padding: "8px 12px 0",
              flexWrap: "wrap",
            }}
          />
          <MessageInput.Elicitation
            style={{
              margin: "8px 12px",
              padding: 12,
              borderRadius: 6,
              backgroundColor: "var(--bgColor-muted, #f6f8fa)",
              border: "1px solid var(--borderColor-default, #d0d7de)",
            }}
          />
          <MessageInput.Content
            style={{
              display: "flex",
              gap: 8,
              padding: 12,
              alignItems: "flex-end",
            }}
          >
            <MessageInput.FileButton
              style={{
                padding: "5px 8px",
                fontSize: 14,
                backgroundColor: "var(--bgColor-muted, #f6f8fa)",
                border: "1px solid var(--borderColor-default, #d0d7de)",
                borderRadius: 6,
                cursor: "pointer",
                color: "var(--fgColor-muted, #656d76)",
              }}
            >
              📎
            </MessageInput.FileButton>
            <div style={{ flex: 1 }}>
              <MessageInput.Textarea
                placeholder="Type a message..."
                style={{
                  minHeight: 40,
                  maxHeight: 120,
                  padding: "8px 12px",
                  fontSize: 14,
                  border: "1px solid var(--borderColor-default, #d0d7de)",
                  borderRadius: 6,
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  lineHeight: 1.5,
                }}
              />
            </div>
            <MessageInput.SubmitButton
              style={{
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 500,
                color: "#fff",
                backgroundColor: "var(--bgColor-accent-emphasis, #0969da)",
                border: "1px solid rgba(27,31,36,0.15)",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Send
            </MessageInput.SubmitButton>
            <MessageInput.StopButton
              style={{
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 500,
                color: "#fff",
                backgroundColor: "var(--bgColor-danger-emphasis, #cf222e)",
                border: "1px solid rgba(27,31,36,0.15)",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Stop
            </MessageInput.StopButton>
          </MessageInput.Content>
        </MessageInput.Root>
      </div>
    </div>
  );
}
