"use client";

import {
  ThreadHistory,
  ThreadContent,
  MessageInput,
  Message,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";
import Link from "next/link";
import { ChatLayout } from "@/components/chat-layout";
import { PropsWithChildren, useEffect } from "react";

export default function RetroDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  return (
    <ChatLayout.Root
      style={{ height: "100vh", background: "#050505" }}
      colors={{ border: "#ffb000" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb
          style={{
            borderBottom: "1px solid #ffb000",
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
          }}
        >
          <Link
            href="/"
            className="retro-text"
            style={{ textDecoration: "none" }}
          >
            ← Home
          </Link>
          <span style={{ color: "rgba(255,176,0,0.6)", marginLeft: 8 }}>
            / Retro
          </span>
        </ChatLayout.Breadcrumb>
        <ChatLayout.MessageArea padding="normal">
          <ChatLayout.Container size="medium">
            <ThreadContent.Root
              style={{ display: "flex", flexDirection: "column" }}
            >
              <ThreadContent.Messages
                render={(_props, state) => (
                  <>
                    {state.filteredMessages.map((msg) => (
                      <Message.Root
                        key={msg.id}
                        message={msg}
                        role={msg.role as "user" | "assistant"}
                        render={<MessageContent role={msg.role} />}
                      >
                        <ReasoningInfo.Root>
                          <div
                            className="retro-panel"
                            style={{ padding: "6px 10px", fontSize: 12 }}
                          >
                            <ReasoningInfo.Trigger
                              render={(props) => (
                                <button
                                  {...props}
                                  className="retro-text"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    fontSize: 12,
                                    fontFamily: "'Courier New', monospace",
                                  }}
                                >
                                  <ReasoningInfo.StatusText />
                                </button>
                              )}
                            />
                            <ReasoningInfo.Content
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                color: "rgba(255,176,0,0.7)",
                                lineHeight: 1.5,
                                fontFamily: "'Courier New', monospace",
                              }}
                            >
                              <ReasoningInfo.Steps />
                            </ReasoningInfo.Content>
                          </div>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <div
                            className="retro-panel"
                            style={{ padding: "6px 10px", fontSize: 12 }}
                          >
                            <ToolcallInfo.Trigger
                              render={(props, { state }) => (
                                <CollapsibleTrigger state={state} {...props}>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 6,
                                    }}
                                  >
                                    <ToolcallInfo.StatusIcon />
                                    <ToolcallInfo.ToolName />
                                  </span>
                                </CollapsibleTrigger>
                              )}
                            />
                            <ToolcallInfo.Content
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                color: "rgba(255,176,0,0.5)",
                                fontFamily: "'Courier New', monospace",
                              }}
                            >
                              <ToolcallInfo.Parameters
                                render={<CodeBlock title="Parameters" />}
                              />
                              <ToolcallInfo.Result
                                render={<CodeBlock title="Result" />}
                              />
                            </ToolcallInfo.Content>
                          </div>
                        </ToolcallInfo.Root>

                        <Message.RenderedComponent>
                          <Message.RenderedComponentContent />
                        </Message.RenderedComponent>

                        <Message.Content
                          render={(props, { contentAsMarkdownString }) => (
                            <MessageBubble role={msg.role} {...props}>
                              {contentAsMarkdownString}
                            </MessageBubble>
                          )}
                        />

                        <Message.LoadingIndicator>
                          <span className="retro-loading">
                            &gt; PROCESSING...
                          </span>
                        </Message.LoadingIndicator>
                      </Message.Root>
                    ))}
                  </>
                )}
              />
            </ThreadContent.Root>
          </ChatLayout.Container>
        </ChatLayout.MessageArea>
      </ChatLayout.Content>
      <ChatLayout.InputArea padding="normal">
        <ChatLayout.Container size="medium">
          <MessageInput.Root>
            <MessageInput.StagedImages
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            />
            <MessageInput.Error
              style={{
                marginBottom: 8,
                padding: "6px 10px",
                fontSize: 12,
                color: "#ff4444",
                fontFamily: "'Courier New', monospace",
              }}
            />
            <MessageInput.Content
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
              }}
            >
              <MessageInput.FileButton
                className="retro-btn"
                style={{ padding: "5px 8px" }}
              >
                📎
              </MessageInput.FileButton>
              <div style={{ flex: 1 }}>
                <MessageInput.Textarea
                  placeholder="> TYPE COMMAND..."
                  className="retro-input"
                  style={{ minHeight: 40, maxHeight: 120 }}
                />
              </div>
              <MessageInput.SubmitButton className="retro-btn retro-btn-primary">
                SEND
              </MessageInput.SubmitButton>
              <MessageInput.StopButton
                className="retro-btn"
                style={{
                  color: "#ff4444",
                  borderColor: "#ff4444",
                }}
              >
                ABORT
              </MessageInput.StopButton>
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar
        divider
        style={{ backgroundColor: "#0a0a0a" }}
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
          <h2
            className="retro-text"
            style={{ margin: 0, fontSize: 14, fontWeight: 400 }}
          >
            &gt; THREADS
          </h2>
          <ThreadHistory.Root>
            <ThreadHistory.NewThreadButton
              className="retro-btn retro-btn-primary"
              style={{
                width: "100%",
                fontSize: 12,
                color: "#050505",
                backgroundColor: "#ffb000",
                textShadow: "none",
              }}
            >
              + NEW THREAD
            </ThreadHistory.NewThreadButton>
          </ThreadHistory.Root>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
          <ThreadHistory.Root>
            <ThreadHistory.List
              render={(_props, state) => (
                <div>
                  {state.filteredThreads.map((thread) => (
                    <ThreadHistory.Item
                      key={thread.id}
                      thread={thread}
                      render={({ children, ...props }, { isActive }) => (
                        <button
                          {...props}
                          className={`retro-thread-item${isActive ? " active" : ""}`}
                          style={{
                            display: "block",
                            width: "100%",
                            fontSize: 12,
                            textAlign: "left",
                            background: "none",
                            border: "none",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          &gt; {children}
                        </button>
                      )}
                    />
                  ))}
                </div>
              )}
            />
          </ThreadHistory.Root>
        </div>
      </ChatLayout.Sidebar>
    </ChatLayout.Root>
  );
}

function MessageContent({
  role,
  children,
  ...props
}: PropsWithChildren<{ role: string }>) {
  return (
    <div
      style={{
        marginBottom: 12,
        display: "flex",
        flex: "1 1 auto",
        alignSelf: role === "user" ? "flex-end" : "flex-start",
        maxWidth: "70%",
        flexDirection: "column",
        gap: 8,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function CollapsibleTrigger({
  state,
  children,
  ...props
}: PropsWithChildren<{ state: "open" | "closed" }>) {
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: 12,
        color: "rgba(255,176,0,0.7)",
        fontFamily: "'Courier New', monospace",
      }}
      {...props}
    >
      {children}
      <span
        style={{
          display: "inline-block",
          transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      >
        ▼
      </span>
    </button>
  );
}

function MessageBubble({
  role,
  children,
  ...props
}: PropsWithChildren<{ role: string }>) {
  if (typeof children === "string" && children.trim() === "") return null;
  if (!children) return null;

  return (
    <div
      className={role === "user" ? "retro-bubble-user" : "retro-bubble-ai"}
      {...props}
    >
      {children}
    </div>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div style={{ marginTop: 4 }}>
      {title && (
        <div
          style={{
            fontSize: 10,
            color: "rgba(255,176,0,0.5)",
            fontFamily: "'Courier New', monospace",
            marginBottom: 2,
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 10,
          lineHeight: 1.5,
          color: "rgba(255,176,0,0.6)",
          fontFamily: "'Courier New', monospace",
        }}
      >
        {children}
      </pre>
    </div>
  );
}
