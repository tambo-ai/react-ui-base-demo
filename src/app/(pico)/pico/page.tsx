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

export default function PicoDemo() {
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
      colors={{ border: "var(--pico-muted-border-color)" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <strong>Pico</strong>
              </li>
            </ul>
          </nav>
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
                          <ReasoningInfo.Trigger
                            render={(props, _state) => (
                              <article {...props}>
                                <details>
                                  <summary>
                                    <ReasoningInfo.StatusText
                                      render={(_props, state) =>
                                        state.isLoading ? (
                                          <span aria-busy="true">
                                            Thinking...
                                          </span>
                                        ) : (
                                          <span>Reasoning</span>
                                        )
                                      }
                                    />
                                  </summary>
                                </details>
                              </article>
                            )}
                          />
                          <ReasoningInfo.Content>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <article>
                            <details>
                              <summary>
                                <ToolcallInfo.StatusIcon
                                  render={(_props, state) => {
                                    switch (state.status) {
                                      case "loading":
                                        return (
                                          <span aria-busy="true">
                                            Running...
                                          </span>
                                        );
                                      case "success":
                                        return <span>Done</span>;
                                      case "error":
                                        return <span>Error</span>;
                                    }
                                  }}
                                />
                                {" "}
                                <ToolcallInfo.ToolName />
                              </summary>
                              <ToolcallInfo.Content>
                                <ToolcallInfo.Parameters
                                  render={<CodeBlock title="Parameters" />}
                                />
                                <ToolcallInfo.Result
                                  render={<CodeBlock title="Result" />}
                                />
                              </ToolcallInfo.Content>
                            </details>
                          </article>
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
                          render={
                            <span aria-busy="true">Loading...</span>
                          }
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
                  render={({ children, ...props }) => (
                    <div role="alert" {...props}>
                      {children}
                    </div>
                  )}
                />
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={
                    <textarea
                      rows={2}
                      style={{ resize: "none", marginBottom: 0 }}
                    />
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  paddingTop: 4,
                }}
              >
                <MessageInput.FileButton
                  render={
                    <button className="outline" type="button">
                      File
                    </button>
                  }
                />
                <MessageInput.SubmitButton
                  render={
                    <button type="submit">Send</button>
                  }
                />
                <MessageInput.StopButton
                  render={
                    <button className="secondary" type="button">
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
          <hgroup>
            <h4>Threads</h4>
          </hgroup>
          <ThreadHistory.NewThreadButton
            render={
              <button className="outline" style={{ marginBottom: 12 }}>
                + New thread
              </button>
            }
          />
          <ThreadHistory.List
            render={(props, state) => (
              <div
                {...props}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  overflow: "auto",
                }}
              >
                {state.filteredThreads.map((thread) => (
                  <ThreadHistory.Item
                    key={thread.id}
                    thread={thread}
                    render={({ children, ...props }, { isActive }) => (
                      <button
                        className={isActive ? undefined : "outline"}
                        style={{
                          textAlign: "left",
                          marginBottom: 0,
                          width: "100%",
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

function MessageBubble({
  role,
  children,
  ...props
}: PropsWithChildren<{ role: string }>) {
  if (typeof children === "string" && children.trim() === "") return null;
  if (!children) return null;

  return (
    <article
      style={{
        marginBottom: 0,
        backgroundColor:
          role === "user"
            ? "var(--pico-primary-background)"
            : undefined,
        color:
          role === "user"
            ? "var(--pico-primary-inverse)"
            : undefined,
      }}
      {...props}
    >
      {children}
    </article>
  );
}

function CollapsibleTrigger({
  state,
  children,
  ...props
}: PropsWithChildren<{ state: "open" | "closed" }>) {
  return (
    <summary {...props}>
      {children}
      <span
        style={{
          display: "inline-block",
          marginLeft: 8,
          transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      >
        &#9660;
      </span>
    </summary>
  );
}

function CodeBlock({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div style={{ marginTop: 8 }}>
      {title && (
        <small>
          <strong>{title}</strong>
        </small>
      )}
      <pre style={{ fontSize: "0.75rem", marginBottom: 0 }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
