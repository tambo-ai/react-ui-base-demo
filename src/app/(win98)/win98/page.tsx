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

export default function Win98Demo() {
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
      colors={{ border: "#808080" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <Link href="/" style={{ color: "#0000ff" }}>
            &larr; Home
          </Link>
          <span> / </span>
          <Link href="#" aria-current="page" style={{ color: "#000" }}>
            Windows 98
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
                        <ReasoningInfo.Root>
                          <ReasoningInfo.Trigger
                            render={(props, state) => (
                              <fieldset style={{ marginBottom: 4 }}>
                                <legend>
                                  <ReasoningInfo.StatusText
                                    render={(_props, st) =>
                                      st.isLoading ? (
                                        <span>Thinking...</span>
                                      ) : (
                                        <span>Reasoning</span>
                                      )
                                    }
                                  />
                                </legend>
                                <button
                                  {...props}
                                  style={{ width: "100%", textAlign: "left" }}
                                >
                                  <ReasoningInfo.StatusText />
                                  <span
                                    style={{
                                      marginLeft: 8,
                                      display: "inline-block",
                                      transform:
                                        state.isOpen
                                          ? "rotate(-180deg)"
                                          : "rotate(0deg)",
                                    }}
                                  >
                                    &#9660;
                                  </span>
                                </button>
                              </fieldset>
                            )}
                          />
                          <ReasoningInfo.Content>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <fieldset style={{ marginBottom: 4 }}>
                            <legend>Tool Call</legend>
                            <ToolcallInfo.Trigger
                              render={(props, { state }) => (
                                <CollapsibleTrigger state={state} {...props}>
                                  <ToolcallInfo.StatusIcon
                                    render={(_p, st) => {
                                      switch (st.status) {
                                        case "loading":
                                          return <span>&#9203;</span>;
                                        case "success":
                                          return <span>&#10004;</span>;
                                        case "error":
                                          return <span>&#10008;</span>;
                                      }
                                    }}
                                  />
                                  {" "}
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
                                    gap: 4,
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
                          </fieldset>
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
                          render={<span>Loading...</span>}
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
                  render={(props) => (
                    <div style={{ color: "red", marginBottom: 4 }} {...props} />
                  )}
                />
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={<textarea rows={2} style={{ width: "100%", resize: "none" }} />}
                />
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <MessageInput.FileButton
                  render={<button type="button">&#128206;</button>}
                />
                <MessageInput.SubmitButton
                  render={<button type="submit">Send</button>}
                />
                <MessageInput.StopButton
                  render={<button type="button">Stop</button>}
                />
              </div>
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar divider>
        <ThreadHistory.Root>
          <fieldset>
            <legend>Threads</legend>
            <ThreadHistory.NewThreadButton render={<button type="button" style={{ marginBottom: 8, width: "100%" }} />}>
              + New thread
            </ThreadHistory.NewThreadButton>
            <ThreadHistory.List
              render={(props, state) => (
                <div
                  {...props}
                  className="sunken-panel"
                  style={{ overflow: "auto", flex: "1 1 auto" }}
                >
                  <ul className="tree-view" style={{ margin: 0, padding: 0 }}>
                    {state.filteredThreads.map((thread) => (
                      <ThreadHistory.Item
                        key={thread.id}
                        thread={thread}
                        render={({ children, ...itemProps }, { isActive }) => (
                          <li>
                            <button
                              {...itemProps}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                fontWeight: isActive ? "bold" : "normal",
                                background: isActive ? "#000080" : undefined,
                                color: isActive ? "#fff" : undefined,
                                border: "none",
                                padding: "2px 4px",
                                cursor: "pointer",
                              }}
                            >
                              {children}
                            </button>
                          </li>
                        )}
                      />
                    ))}
                  </ul>
                </div>
              )}
            />
          </fieldset>
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
    <button
      {...props}
      style={{ width: "100%", textAlign: "left", cursor: "pointer" }}
    >
      {children}
      <span
        style={{
          display: "inline-block",
          marginLeft: 8,
          transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
        }}
      >
        &#9660;
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
      className="sunken-panel"
      style={{
        padding: "8px 12px",
        backgroundColor: role === "user" ? "#000080" : "#c0c0c0",
        color: role === "user" ? "#fff" : "#000",
        fontSize: 12,
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
    <fieldset style={{ fontSize: 10 }}>
      {title && <legend>{title}</legend>}
      <pre
        style={{
          margin: 0,
          padding: "4px 8px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "'Fixedsys', 'Courier New', monospace",
          lineHeight: 1.5,
        }}
      >
        {children}
      </pre>
    </fieldset>
  );
}
