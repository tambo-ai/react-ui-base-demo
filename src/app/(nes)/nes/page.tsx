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

export default function NesDemo() {
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
      colors={{ border: "#212529" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb
          style={{
            borderBottom: "4px solid #212529",
            fontSize: 10,
          }}
        >
          <Link
            href="/"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            ← Home
          </Link>
          <span style={{ marginLeft: 8 }}>/ NES</span>
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
                            className="nes-container is-rounded"
                            style={{
                              padding: 8,
                              fontSize: 8,
                              backgroundColor: "#f7dc6f",
                            }}
                          >
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
                                    fontSize: 8,
                                    color: "#212529",
                                  }}
                                >
                                  <ReasoningInfo.StatusText />
                                </button>
                              )}
                            />
                            <ReasoningInfo.Content
                              style={{
                                marginTop: 6,
                                fontSize: 8,
                                color: "#212529",
                                lineHeight: 1.8,
                              }}
                            >
                              <ReasoningInfo.Steps />
                            </ReasoningInfo.Content>
                          </div>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <div
                            className="nes-container is-rounded is-dark"
                            style={{ padding: 8, fontSize: 8 }}
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
                                fontSize: 8,
                                color: "#aaa",
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

                        <Message.LoadingIndicator
                          style={{
                            display: "flex",
                            gap: 4,
                            padding: 8,
                            fontSize: 10,
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
      <ChatLayout.InputArea
        padding="normal"
        style={{ backgroundColor: "#212529" }}
      >
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
                padding: 8,
                fontSize: 8,
                color: "#e76e55",
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
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar
        divider
        style={{ backgroundColor: "#212529" }}
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
          <h2
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 400,
              color: "#fff",
            }}
          >
            Threads
          </h2>
          <ThreadHistory.Root>
            <ThreadHistory.NewThreadButton
              className="nes-btn is-primary"
              style={{ width: "100%", fontSize: 10, cursor: "pointer" }}
            >
              + New
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
                          className={
                            isActive ? "nes-btn is-warning" : "nes-btn"
                          }
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
        marginBottom: 16,
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
        fontSize: 8,
        color: "#fff",
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
      className={
        role === "user" ? "nes-balloon from-right" : "nes-balloon from-left"
      }
      {...props}
    >
      <p style={{ fontSize: 10, lineHeight: 1.8, color: "#212529", margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div style={{ marginTop: 4 }}>
      {title && (
        <div style={{ fontSize: 8, fontWeight: 600, color: "#aaa", marginBottom: 2 }}>
          {title}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 8,
          lineHeight: 1.5,
          color: "#ccc",
        }}
      >
        {children}
      </pre>
    </div>
  );
}
