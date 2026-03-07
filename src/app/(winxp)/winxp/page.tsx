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

export default function WinXPDemo() {
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
      colors={{ border: "#003c74" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <div className="title-bar" style={{ margin: 0 }}>
            <div className="title-bar-text">
              <Link href="/" style={{ color: "white", textDecoration: "none" }}>
                Home
              </Link>
              {" / "}
              <span>Windows XP</span>
            </div>
          </div>
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
                            render={({ children, ...props }, { state }) => (
                              <fieldset {...props}>
                                <legend>
                                  <CollapsibleTrigger state={state as "open" | "closed"}>
                                    <ReasoningInfo.StatusText />
                                  </CollapsibleTrigger>
                                </legend>
                                {children}
                              </fieldset>
                            )}
                          />
                          <ReasoningInfo.Content>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <fieldset>
                            <legend>
                              <ToolcallInfo.StatusIcon
                                render={(_props, state) => {
                                  switch (state.status) {
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
                              <ToolcallInfo.Trigger
                                render={(props, { state }) => (
                                  <CollapsibleTrigger state={state as "open" | "closed"} {...props}>
                                    <ToolcallInfo.ToolName />
                                  </CollapsibleTrigger>
                                )}
                              />
                            </legend>
                            <ToolcallInfo.Content>
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
                          render={() => <span>Loading...</span>}
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
              render={(props) => (
                <div
                  {...props}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                />
              )}
            >
              <MessageInput.Error
                render={(props) => (
                  <div {...props} style={{ color: "red", fontSize: 11 }} />
                )}
              />
              <MessageInput.Textarea
                placeholder="Type a message..."
                render={(props) => (
                  <textarea
                    {...props}
                    rows={2}
                    style={{ flex: "1 1 auto", resize: "none" }}
                  />
                )}
              />
              <MessageInput.SubmitButton
                render={(props) => <button {...props}>Send</button>}
              />
              <MessageInput.StopButton
                render={(props) => <button {...props}>Stop</button>}
              />
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar
        divider
        style={{ background: "#ECE9D8" }}
        padding="normal"
      >
        <ThreadHistory.Root>
          <div
            className="window"
            style={{ margin: 0, width: "100%", flex: "1 1 auto", display: "flex", flexDirection: "column" }}
          >
            <div className="title-bar">
              <div className="title-bar-text">Threads</div>
            </div>
            <div
              className="window-body"
              style={{ flex: "1 1 auto", overflow: "auto", padding: 4 }}
            >
              <ThreadHistory.NewThreadButton
                render={(props) => (
                  <button
                    {...props}
                    style={{ marginBottom: 8, width: "100%" }}
                  />
                )}
              >
                + New thread
              </ThreadHistory.NewThreadButton>
              <ThreadHistory.List
                render={(props, state) => (
                  <ul className="tree-view" {...props}>
                    {state.filteredThreads.map((thread) => (
                      <ThreadHistory.Item
                        key={thread.id}
                        thread={thread}
                        render={({ children, ...props }, { isActive }) => (
                          <li
                            {...props}
                            style={{
                              fontWeight: isActive ? "bold" : "normal",
                              cursor: "pointer",
                              padding: "2px 4px",
                              background: isActive ? "#316AC5" : "transparent",
                              color: isActive ? "white" : "inherit",
                            }}
                          >
                            {children}
                          </li>
                        )}
                      />
                    ))}
                  </ul>
                )}
              />
            </div>
          </div>
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
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {children}
      <span
        style={{
          display: "inline-block",
          marginLeft: 4,
          transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
          fontSize: 8,
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

  if (role === "user") {
    return (
      <div
        style={{
          padding: "6px 10px",
          borderRadius: 4,
          backgroundColor: "#D4E7F9",
          color: "#000",
          fontSize: 11,
          lineHeight: 1.5,
          border: "1px solid #7EB4EA",
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="sunken-panel" style={{ padding: "6px 10px", fontSize: 11, lineHeight: 1.5 }} {...props}>
      {children}
    </div>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <fieldset style={{ marginTop: 4 }}>
      {title && <legend>{title}</legend>}
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "Lucida Console, monospace",
          fontSize: 10,
          lineHeight: 1.4,
        }}
      >
        {children}
      </pre>
    </fieldset>
  );
}
