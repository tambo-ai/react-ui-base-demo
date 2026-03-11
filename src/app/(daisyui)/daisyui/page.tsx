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
import { useScrollToBottom } from "@/components/chat-layout";
import { PropsWithChildren, useState, useEffect, useRef } from "react";

export default function DaisyUIDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();
  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);

  const threadsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { ref: scrollRef } = useScrollToBottom();

  // Auto-switch to most recent thread on initial load
  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  // Click-outside-to-close for threads overlay
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        threadsOpen &&
        threadsRef.current &&
        !threadsRef.current.contains(e.target as Node)
      ) {
        setThreadsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [threadsOpen]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* ── Navbar ── */}
      <div className="navbar bg-base-100 shadow-lg px-4">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl normal-case">
            CyberDash
          </Link>
        </div>
        <div className="navbar-center hidden sm:flex">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>DaisyUI</li>
            </ul>
          </div>
        </div>
        <div className="navbar-end gap-2" ref={threadsRef}>
          <div className="relative">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setThreadsOpen((prev) => !prev)}
            >
              Threads
            </button>

            {/* ── Threads dropdown overlay ── */}
            {threadsOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-72 card bg-base-100 shadow-xl border border-base-content/10">
                <div className="card-body p-4">
                  <ThreadHistory.Root>
                    <h3 className="card-title text-sm mb-2">Threads</h3>
                    <ThreadHistory.NewThreadButton
                      render={
                        <button className="btn btn-primary btn-sm mb-2 w-full" />
                      }
                    >
                      + New thread
                    </ThreadHistory.NewThreadButton>
                    <ThreadHistory.List
                      render={(props, state) => (
                        <ul className="menu menu-sm w-full max-h-64 overflow-y-auto" {...props}>
                          {state.filteredThreads.map((thread) => (
                            <li key={thread.id}>
                              <ThreadHistory.Item
                                thread={thread}
                                render={({ children, ...itemProps }, { isActive }) => (
                                  <button
                                    className={
                                      isActive
                                        ? "btn btn-primary btn-sm w-full justify-start"
                                        : "btn btn-ghost btn-sm w-full justify-start"
                                    }
                                    {...itemProps}
                                    onClick={(e) => {
                                      itemProps.onClick?.(e);
                                      setThreadsOpen(false);
                                    }}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Dashboard content ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {/* Stats row */}
        <div className="stats stats-vertical md:stats-horizontal shadow w-full bg-base-100">
          <div className="stat">
            <div className="stat-title">Users Online</div>
            <div className="stat-value text-primary">2,847</div>
            <div className="stat-desc">
              <span className="badge badge-success badge-xs mr-1" /> 12% more than last hour
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Messages Sent</div>
            <div className="stat-value text-secondary">18.6K</div>
            <div className="stat-desc">Today</div>
          </div>
          <div className="stat">
            <div className="stat-title">Uptime</div>
            <div className="stat-value">99.98%</div>
            <div className="stat-desc text-success">All systems nominal</div>
          </div>
          <div className="stat">
            <div className="stat-title">Avg Response</div>
            <div className="stat-value text-accent">42ms</div>
            <div className="stat-desc">
              <span className="badge badge-success badge-xs mr-1" /> Within SLA
            </div>
          </div>
        </div>

        {/* Hero section */}
        <div className="hero bg-base-100 rounded-box shadow">
          <div className="hero-content text-center py-12">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold">
                Welcome to <span className="text-primary">CyberDash</span>
              </h1>
              <p className="py-4 text-base-content/70">
                Your futuristic command center. Monitor network activity, manage
                agents, and interact with AI — all from one cyberpunk-themed
                dashboard powered by DaisyUI.
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  className="btn btn-primary"
                  onClick={() => setChatOpen(true)}
                >
                  Open AI Chat
                </button>
                <Link href="/" className="btn btn-ghost">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Activity feed */}
          <div className="card bg-base-100 shadow md:col-span-2">
            <div className="card-body">
              <h2 className="card-title text-sm uppercase tracking-wider text-base-content/60">
                Recent Activity
              </h2>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Event</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Node-7X</td>
                      <td>Threat scan completed</td>
                      <td>
                        <span className="badge badge-success badge-xs">OK</span>
                      </td>
                      <td>2m ago</td>
                    </tr>
                    <tr>
                      <td>Proxy-Alpha</td>
                      <td>Connection rerouted</td>
                      <td>
                        <span className="badge badge-success badge-xs">OK</span>
                      </td>
                      <td>5m ago</td>
                    </tr>
                    <tr>
                      <td>Sentinel-3</td>
                      <td>Anomaly detected</td>
                      <td>
                        <span className="badge badge-error badge-xs">ALERT</span>
                      </td>
                      <td>8m ago</td>
                    </tr>
                    <tr>
                      <td>Core-9</td>
                      <td>Firmware updated</td>
                      <td>
                        <span className="badge badge-success badge-xs">OK</span>
                      </td>
                      <td>14m ago</td>
                    </tr>
                    <tr>
                      <td>Relay-K2</td>
                      <td>Latency spike</td>
                      <td>
                        <span className="badge badge-error badge-xs">WARN</span>
                      </td>
                      <td>21m ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* System health */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title text-sm uppercase tracking-wider text-base-content/60">
                System Health
              </h2>
              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU</span>
                    <span>68%</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value="68"
                    max="100"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory</span>
                    <span>43%</span>
                  </div>
                  <progress
                    className="progress progress-secondary w-full"
                    value="43"
                    max="100"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Network</span>
                    <span>91%</span>
                  </div>
                  <progress
                    className="progress progress-accent w-full"
                    value="91"
                    max="100"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Disk</span>
                    <span>27%</span>
                  </div>
                  <progress
                    className="progress w-full"
                    value="27"
                    max="100"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="alert bg-base-200 text-sm py-2">
                  <span>All core services running</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mock code terminal */}
        <div className="mockup-code bg-base-100 shadow">
          <pre data-prefix="$">
            <code>cyberdash --status</code>
          </pre>
          <pre data-prefix=">" className="text-success">
            <code>All 12 nodes connected. Uptime: 47d 13h 22m</code>
          </pre>
          <pre data-prefix=">" className="text-success">
            <code>Threat level: LOW | Active agents: 8 | Queue: empty</code>
          </pre>
        </div>
      </div>

      {/* ── Floating chat bubble ── */}
      {!chatOpen && (
        <button
          data-testid="chat-bubble"
          className="btn btn-primary btn-circle fixed bottom-6 right-6 z-40 shadow-lg text-lg"
          onClick={() => setChatOpen(true)}
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {/* ── Floating chat window ── */}
      {chatOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] card bg-base-100 shadow-2xl border border-base-content/10 flex flex-col"
          style={{ height: 580, maxHeight: "calc(100vh - 3rem)" }}
        >
          {/* Chat header */}
          <div className="card-body p-3 pb-0 flex-none">
            <div className="flex items-center justify-between">
              <h3 className="card-title text-sm">AI Chat</h3>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-2"
          >
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
          </div>

          {/* Input area */}
          <div className="p-3 pt-0 flex-none">
            <MessageInput.Root>
              <MessageInput.StagedImages />
              <MessageInput.Error
                render={(props) => (
                  <div className="alert alert-error mb-2 text-sm" {...props} />
                )}
              />
              <MessageInput.Content
                render={<div className="flex items-start gap-2" />}
              >
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={
                    <textarea
                      className="textarea textarea-bordered w-full text-sm"
                      rows={2}
                    />
                  }
                />
                <div className="flex flex-col items-center gap-1">
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
          </div>
        </div>
      )}
    </div>
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
