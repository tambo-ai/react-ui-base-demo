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

export default function NeobrutalismDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  return (
    <ChatLayout.Root
      style={{ height: "100vh" }}
      colors={{ border: "#000" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb
          style={{
            borderBottom: "3px solid #000",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          <Link href="/" style={{ color: "#000", textDecoration: "none" }}>
            ← Home
          </Link>
          <span style={{ marginLeft: 8 }}>/ Neobrutalism</span>
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
                          <div className="neo-container" style={{ backgroundColor: "#ffd803", padding: "8px 12px", fontSize: 12 }}>
                            <ReasoningInfo.Trigger
                              render={(props) => (
                                <button
                                  {...props}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "#000",
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
                                color: "#000",
                                lineHeight: 1.5,
                              }}
                            >
                              <ReasoningInfo.Steps />
                            </ReasoningInfo.Content>
                          </div>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <div className="neo-container" style={{ backgroundColor: "#e8e4df", padding: "8px 12px", fontSize: 12 }}>
                            <ToolcallInfo.Trigger
                              render={(props, { state }) => (
                                <CollapsibleTrigger state={state} {...props}>
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                    <ToolcallInfo.StatusIcon />
                                    <ToolcallInfo.ToolName />
                                  </span>
                                </CollapsibleTrigger>
                              )}
                            />
                            <ToolcallInfo.Content style={{ marginTop: 6, fontSize: 12, color: "#000" }}>
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

                        <Message.LoadingIndicator
                          style={{
                            display: "flex",
                            gap: 4,
                            padding: "8px 12px",
                            backgroundColor: "#ffd803",
                            border: "3px solid #000",
                          }}
                        />
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
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 700,
                color: "#000",
                backgroundColor: "#ff6b6b",
                border: "3px solid #000",
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
                className="neo-btn"
                style={{ backgroundColor: "#e8e4df" }}
              >
                📎
              </MessageInput.FileButton>
              <div style={{ flex: 1 }}>
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  className="neo-textarea"
                />
              </div>
              <MessageInput.SubmitButton className="neo-btn neo-btn-primary">
                SEND
              </MessageInput.SubmitButton>
              <MessageInput.StopButton
                className="neo-btn"
                style={{ backgroundColor: "#ff6b6b" }}
              >
                STOP
              </MessageInput.StopButton>
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar
        divider
        style={{ backgroundColor: "#e8e4df" }}
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
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 900,
              color: "#000",
              textTransform: "uppercase" as const,
              letterSpacing: 1,
            }}
          >
            Threads
          </h2>
          <ThreadHistory.Root>
            <ThreadHistory.NewThreadButton className="neo-btn neo-btn-primary" style={{ width: "100%", textTransform: "uppercase" as const }}>
              + New thread
            </ThreadHistory.NewThreadButton>
          </ThreadHistory.Root>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
          <ThreadHistory.Root>
            <ThreadHistory.List
              render={(_props, state) => (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {state.filteredThreads.map((thread) => (
                    <ThreadHistory.Item
                      key={thread.id}
                      thread={thread}
                      render={({ children, ...props }, { isActive }) => (
                        <button
                          {...props}
                          className={`neo-thread-item${isActive ? " active" : ""}`}
                          style={{
                            display: "block",
                            width: "100%",
                            fontSize: 13,
                            textAlign: "left",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          {children}
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
        fontWeight: 700,
        color: "#000",
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
      className={role === "user" ? "neo-bubble-user" : "neo-bubble-ai"}
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
        <div style={{ fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 2 }}>
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
          color: "#000",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        {children}
      </pre>
    </div>
  );
}
