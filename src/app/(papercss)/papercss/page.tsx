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

export default function PaperCSSDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  // On initial load, currentThreadId is "placeholder" which doesn't match any
  // real thread ID in the sidebar list. Auto-switch to the most recent thread
  // so the sidebar highlights it correctly.
  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  return (
    <ChatLayout.Root
      style={{ height: "100vh" }}
      colors={{ border: "#ddd" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <Link href="/">&#8592; Home</Link>
          <span> / </span>
          <Link href="#" aria-current="page">
            Paper CSS
          </Link>
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
                        <ReasoningInfo.Root
                          render={
                            <div
                              className="card border"
                              style={{ marginBottom: 8 }}
                            />
                          }
                        >
                          <ReasoningInfo.Trigger
                            render={
                              <div
                                className="card-header"
                                style={{
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              />
                            }
                          >
                            <ReasoningInfo.StatusText
                              render={(_props, state) =>
                                state.isLoading ? (
                                  <span className="badge">Thinking...</span>
                                ) : (
                                  <span>&#128161;</span>
                                )
                              }
                            />
                            <ReasoningInfo.StatusText />
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content
                            render={
                              <div
                                className="card-body"
                                style={{ fontSize: 13 }}
                              />
                            }
                          >
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root
                          render={
                            <div
                              className="card border"
                              style={{ marginBottom: 8 }}
                            />
                          }
                        >
                          <div className="card-body">
                            <ToolcallInfo.StatusIcon
                              render={(_props, state) => {
                                switch (state.status) {
                                  case "loading":
                                    return (
                                      <span className="badge">Running...</span>
                                    );
                                  case "success":
                                    return (
                                      <span className="badge" style={{ backgroundColor: "#4caf50", color: "#fff" }}>
                                        &#10003;
                                      </span>
                                    );
                                  case "error":
                                    return (
                                      <span className="badge" style={{ backgroundColor: "#f44336", color: "#fff" }}>
                                        &#10007;
                                      </span>
                                    );
                                }
                              }}
                            />
                            <ToolcallInfo.Trigger
                              render={(props, { state }) => (
                                <CollapsibleTrigger state={state} {...props}>
                                  <ToolcallInfo.ToolName />
                                </CollapsibleTrigger>
                              )}
                            />
                            <ToolcallInfo.Content
                              render={
                                <div
                                  style={{
                                    marginTop: 8,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                  }}
                                />
                              }
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

                        <Message.LoadingIndicator
                          render={<span className="badge">Loading...</span>}
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
            <MessageInput.StagedImages />
            <MessageInput.Content
              render={
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "start",
                  }}
                />
              }
            >
              <div style={{ flex: "1 1 auto" }}>
                <MessageInput.Error
                  render={<div className="alert alert-danger" />}
                />
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={
                    <textarea
                      className="input-block"
                      rows={2}
                      style={{ resize: "none" }}
                    />
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <MessageInput.FileButton
                  render={
                    <button className="btn btn-secondary" type="button">
                      &#128206;
                    </button>
                  }
                />
                <MessageInput.SubmitButton
                  render={
                    <button className="btn btn-primary" type="submit">
                      Send
                    </button>
                  }
                />
                <MessageInput.StopButton
                  render={
                    <button className="btn btn-danger" type="button">
                      Stop
                    </button>
                  }
                />
              </div>
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar divider>
        <ThreadHistory.Root>
          <h4>Threads</h4>
          <ThreadHistory.NewThreadButton
            render={
              <button className="btn btn-secondary" style={{ marginBottom: 8 }}>
                + New thread
              </button>
            }
          />
          <ThreadHistory.List
            render={(props, state) => (
              <div {...props} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {state.filteredThreads.map((thread) => (
                  <ThreadHistory.Item
                    key={thread.id}
                    thread={thread}
                    render={({ children, ...props }, { isActive }) => (
                      <button
                        className={`btn ${isActive ? "btn-primary" : ""}`}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        {...props}
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
    <span
      {...props}
      style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
    >
      {children}
      <span
        style={{
          display: "inline-block",
          transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      >
        &#9660;
      </span>
    </span>
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
      className="paper"
      style={{
        padding: "8px 12px",
        backgroundColor: role === "user" ? "#41403e" : "#f8f8f2",
        color: role === "user" ? "#fff" : "#1d1d1d",
        fontSize: 14,
        lineHeight: 1.5,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="card border" style={{ fontSize: 10, overflow: "hidden" }}>
      {title && (
        <div
          className="card-header"
          style={{
            fontWeight: 600,
            color: "#666",
          }}
        >
          {title}
        </div>
      )}
      <pre
        className="card-body"
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace",
          lineHeight: 1.5,
        }}
      >
        {children}
      </pre>
    </div>
  );
}
