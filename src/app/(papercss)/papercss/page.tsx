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

export default function PaperCSSDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();
  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const threadsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { ref: scrollRef } = useScrollToBottom();

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  // Click-outside-to-close for threads overlay
  useEffect(() => {
    if (!threadsOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        threadsRef.current &&
        !threadsRef.current.contains(e.target as Node)
      ) {
        setThreadsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [threadsOpen]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f0e1",
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, #e0d9c8 28px)",
        fontFamily: "'Neucha', cursive, sans-serif",
        position: "relative",
      }}
    >
      {/* ── Header ── */}
      <header
        className="paper border"
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          marginBottom: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/"
            className="btn btn-secondary"
            style={{ fontSize: 14 }}
          >
            &#8592; Home
          </Link>
          <h2 style={{ margin: 0, fontSize: 28 }}>
            &#9997;&#65039; Tambo Sketchbook
          </h2>
        </div>
        <div style={{ position: "relative" }}>
          <button
            className="btn btn-primary"
            onClick={() => setThreadsOpen((o) => !o)}
          >
            &#128220; Threads
          </button>

          {/* ── Threads Overlay ── */}
          {threadsOpen && (
            <div
              ref={threadsRef}
              className="card border"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                width: 300,
                maxHeight: 420,
                overflowY: "auto",
                zIndex: 1000,
                backgroundColor: "#fff",
              }}
            >
              <div className="card-header" style={{ fontWeight: 600 }}>
                Thread History
              </div>
              <div className="card-body">
                <ThreadHistory.Root>
                  <ThreadHistory.NewThreadButton
                    render={
                      <button
                        className="btn btn-secondary"
                        style={{ marginBottom: 8, width: "100%" }}
                      >
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
                        }}
                      >
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
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Nav Row ── */}
      <nav
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 24px",
          flexWrap: "wrap",
        }}
      >
        <button className="btn btn-primary">&#127912; Doodles</button>
        <button className="btn btn-secondary">&#128221; Notes</button>
        <button className="btn btn-success">&#10003; Tasks</button>
        <button className="btn btn-danger">&#128161; Ideas</button>
      </nav>

      {/* ── Main Content ── */}
      <main
        style={{
          padding: "0 24px 100px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {/* Today's Doodles Card */}
        <div className="card border">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>&#127912; Today&apos;s Doodles</h3>
          </div>
          <div className="card-body">
            <p>Quick sketches and visual ideas captured throughout the day.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="badge">watercolor</span>
              <span className="badge">pencil</span>
              <span className="badge">ink</span>
            </div>
            <div
              className="paper"
              style={{
                marginTop: 12,
                padding: 16,
                textAlign: "center",
                color: "#999",
                fontSize: 14,
              }}
            >
              &#127764; &#127796; &#127752;
              <br />
              <em>a dreamy landscape sketch</em>
            </div>
          </div>
        </div>

        {/* Notes Card */}
        <div className="card border">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>&#128221; Notes</h3>
          </div>
          <div className="card-body">
            <div className="alert alert-primary" style={{ marginBottom: 8 }}>
              Remember: the best ideas come from messy notebooks.
            </div>
            <ul style={{ paddingLeft: 20 }}>
              <li>Explore hand-drawn UI patterns</li>
              <li>Try different paper textures</li>
              <li>Sketch component states</li>
              <li>Ink brush lettering practice</li>
            </ul>
          </div>
        </div>

        {/* Sketch Ideas Card */}
        <div className="card border">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>&#128161; Sketch Ideas</h3>
          </div>
          <div className="card-body">
            <p>Inspiration board for upcoming projects.</p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div className="paper" style={{ padding: "8px 12px" }}>
                &#127793; Botanical illustration series
              </div>
              <div className="paper" style={{ padding: "8px 12px" }}>
                &#128506; Hand-drawn map of the neighborhood
              </div>
              <div className="paper" style={{ padding: "8px 12px" }}>
                &#128060; Animal portrait postcards
              </div>
            </div>
          </div>
        </div>

        {/* To-Do List Card */}
        <div className="card border">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>&#10003; To-Do List</h3>
          </div>
          <div className="card-body">
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <label
                className="paper-check"
                style={{ display: "block", marginBottom: 6 }}
              >
                <input type="checkbox" defaultChecked readOnly />
                <span>Set up sketchbook layout</span>
              </label>
              <label
                className="paper-check"
                style={{ display: "block", marginBottom: 6 }}
              >
                <input type="checkbox" defaultChecked readOnly />
                <span>Pick color palette</span>
              </label>
              <label
                className="paper-check"
                style={{ display: "block", marginBottom: 6 }}
              >
                <input type="checkbox" readOnly />
                <span>Finish botanical sketches</span>
              </label>
              <label
                className="paper-check"
                style={{ display: "block", marginBottom: 6 }}
              >
                <input type="checkbox" readOnly />
                <span>Scan and upload drawings</span>
              </label>
              <label
                className="paper-check"
                style={{ display: "block", marginBottom: 6 }}
              >
                <input type="checkbox" readOnly />
                <span>Share with the community</span>
              </label>
            </fieldset>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="paper border"
        style={{
          padding: "12px 24px",
          textAlign: "center",
          backgroundColor: "#fff",
          fontSize: 14,
          color: "#666",
        }}
      >
        &#9997;&#65039; Tambo Sketchbook &mdash; drawn with Paper CSS &amp;
        Tambo AI
      </footer>

      {/* ── Floating Chat Bubble ── */}
      {!chatOpen && (
        <button
          data-testid="chat-bubble"
          className="btn btn-primary paper"
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: "50%",
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 900,
            boxShadow: "2px 4px 12px rgba(0,0,0,0.15)",
            padding: 0,
          }}
          title="Open chat"
        >
          &#128172;
        </button>
      )}

      {/* ── Floating Chat Window ── */}
      {chatOpen && (
        <div
          ref={chatRef}
          className="card border"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 440,
            maxWidth: "calc(100vw - 48px)",
            height: 580,
            maxHeight: "calc(100vh - 48px)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            boxShadow: "2px 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Chat Header */}
          <div
            className="card-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <strong>&#128172; Sketch Chat</strong>
            <button
              className="btn btn-danger"
              onClick={() => setChatOpen(false)}
              style={{ padding: "2px 10px", fontSize: 14 }}
            >
              &#10005;
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              padding: 12,
            }}
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
                                      <span
                                        className="badge"
                                        style={{
                                          backgroundColor: "#4caf50",
                                          color: "#fff",
                                        }}
                                      >
                                        &#10003;
                                      </span>
                                    );
                                  case "error":
                                    return (
                                      <span
                                        className="badge"
                                        style={{
                                          backgroundColor: "#f44336",
                                          color: "#fff",
                                        }}
                                      >
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
          </div>

          {/* Chat Input */}
          <div
            style={{
              borderTop: "2px solid #ddd",
              padding: 8,
              flexShrink: 0,
            }}
          >
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
      style={{
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
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
          fontFamily:
            "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace",
          lineHeight: 1.5,
        }}
      >
        {children}
      </pre>
    </div>
  );
}
