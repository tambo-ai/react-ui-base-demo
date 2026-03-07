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

export default function DaisyUIDemo() {
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
      colors={{ border: "oklch(var(--bc))" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>DaisyUI</li>
            </ul>
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
                          <div className="collapse collapse-arrow bg-warning/20 mb-2">
                            <ReasoningInfo.Trigger
                              render={(props) => (
                                <CollapsibleTrigger {...props}>
                                  <ReasoningInfo.StatusText
                                    render={(_props, state) =>
                                      state.isLoading ? (
                                        <span className="loading loading-dots loading-xs" />
                                      ) : (
                                        <span>💡</span>
                                      )
                                    }
                                  />
                                  <ReasoningInfo.StatusText />
                                </CollapsibleTrigger>
                              )}
                            />
                            <ReasoningInfo.Content
                              render={
                                <div className="collapse-content text-sm" />
                              }
                            >
                              <ReasoningInfo.Steps />
                            </ReasoningInfo.Content>
                          </div>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <div className="collapse collapse-arrow bg-info/20 mb-2">
                            <ToolcallInfo.Trigger
                              render={(props, { state }) => (
                                <CollapsibleTrigger {...props}>
                                  <ToolcallInfo.StatusIcon
                                    render={(_props, state) => {
                                      switch (state.status) {
                                        case "loading":
                                          return (
                                            <span className="loading loading-dots loading-xs" />
                                          );
                                        case "success":
                                          return (
                                            <span className="badge badge-success badge-xs">
                                              ✓
                                            </span>
                                          );
                                        case "error":
                                          return (
                                            <span className="badge badge-error badge-xs">
                                              ✗
                                            </span>
                                          );
                                      }
                                    }}
                                  />
                                  <ToolcallInfo.ToolName />
                                </CollapsibleTrigger>
                              )}
                            />
                            <ToolcallInfo.Content
                              render={
                                <div className="collapse-content space-y-2" />
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
                          render={
                            <span className="loading loading-dots loading-sm" />
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
            <MessageInput.Error
              render={(props) => (
                <div className="alert alert-error mb-2" {...props} />
              )}
            />
            <MessageInput.Content
              render={
                <div className="flex items-start gap-2" />
              }
            >
              <MessageInput.Textarea
                placeholder="Type a message..."
                render={
                  <textarea className="textarea textarea-bordered w-full" rows={2} />
                }
              />
              <div className="flex items-center gap-1">
                <MessageInput.FileButton
                  render={
                    <button
                      className="btn btn-ghost btn-sm"
                      aria-label="Attach File"
                    >
                      📎
                    </button>
                  }
                />
                <MessageInput.SubmitButton
                  render={
                    <button
                      className="btn btn-primary btn-sm"
                      type="submit"
                      aria-label="Send"
                    >
                      ▶
                    </button>
                  }
                />
                <MessageInput.StopButton
                  render={
                    <button
                      className="btn btn-error btn-sm"
                      aria-label="Stop"
                    >
                      ■
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
          <h2 className="text-lg font-bold mb-2">Threads</h2>
          <ThreadHistory.NewThreadButton
            render={<button className="btn btn-primary btn-sm mb-2" />}
          >
            + New thread
          </ThreadHistory.NewThreadButton>
          <ThreadHistory.List
            render={(props, state) => (
              <ul className="menu menu-sm w-full" {...props}>
                {state.filteredThreads.map((thread) => (
                  <li key={thread.id}>
                    <ThreadHistory.Item
                      thread={thread}
                      render={({ children, ...props }, { isActive }) => (
                        <button
                          className={
                            isActive
                              ? "btn btn-primary btn-sm w-full justify-start"
                              : "btn btn-ghost btn-sm w-full justify-start"
                          }
                          {...props}
                        >
                          {children}
                        </button>
                      )}
                    />
                  </li>
                ))}
              </ul>
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
      className={`chat ${role === "user" ? "chat-end" : "chat-start"}`}
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
    <div
      className={`chat-bubble ${
        role === "user" ? "chat-bubble-primary" : "chat-bubble-neutral"
      }`}
      style={{ fontSize: 14, lineHeight: 1.5 }}
      {...props}
    >
      {children}
    </div>
  );
}

function CollapsibleTrigger({
  children,
  ...props
}: PropsWithChildren<Record<string, unknown>>) {
  return (
    <div
      className="collapse-title text-sm font-medium flex items-center gap-2"
      {...props}
    >
      {children}
    </div>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="card card-bordered bg-base-200 overflow-hidden text-xs">
      {title && (
        <div className="px-2 py-1 bg-base-300 border-b border-base-content/20 font-semibold text-base-content/60">
          {title}
        </div>
      )}
      <pre className="p-2 whitespace-pre-wrap break-words font-mono leading-relaxed">
        {children}
      </pre>
    </div>
  );
}
