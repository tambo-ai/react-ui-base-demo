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
import { useState, useEffect, useRef, PropsWithChildren } from "react";

export default function PicoDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);

  const threadsOverlayRef = useRef<HTMLDivElement>(null);
  const threadsButtonRef = useRef<HTMLButtonElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);
  const { ref: scrollRef } = useScrollToBottom();

  // Auto-switch to the most recent thread on initial load
  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  // Click outside to close threads overlay
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        threadsOpen &&
        threadsOverlayRef.current &&
        !threadsOverlayRef.current.contains(e.target as Node) &&
        threadsButtonRef.current &&
        !threadsButtonRef.current.contains(e.target as Node)
      ) {
        setThreadsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [threadsOpen]);

  return (
    <>
      {/* ── Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 10 }}>
        <nav>
          <ul>
            <li>
              <Link href="/">
                <strong>Tambo</strong>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#overview">Overview</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
            <li>
              <button
                ref={threadsButtonRef}
                className="outline"
                style={{ marginBottom: 0 }}
                onClick={() => setThreadsOpen((v) => !v)}
              >
                Threads
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* ── Threads Overlay ── */}
      {threadsOpen && (
        <div
          ref={threadsOverlayRef}
          style={{
            position: "fixed",
            top: 64,
            right: 24,
            width: 320,
            maxHeight: "70vh",
            overflowY: "auto",
            zIndex: 100,
            borderRadius: 8,
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          }}
        >
          <article style={{ marginBottom: 0 }}>
            <header>
              <hgroup>
                <h4 style={{ marginBottom: 0 }}>Threads</h4>
                <p>Switch between conversations</p>
              </hgroup>
            </header>
            <ThreadHistory.Root>
              <ThreadHistory.NewThreadButton
                render={
                  <button
                    className="outline"
                    style={{ marginBottom: 12, width: "100%" }}
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
                        render={({ children, ...itemProps }, { isActive }) => (
                          <button
                            className={isActive ? undefined : "outline"}
                            style={{
                              textAlign: "left",
                              marginBottom: 0,
                              width: "100%",
                            }}
                            {...itemProps}
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
          </article>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="container">
        <article id="overview">
          <hgroup>
            <h1>Tambo</h1>
            <p>Build AI-powered conversational interfaces with ease</p>
          </hgroup>

          <p>
            Tambo is a framework for building conversational AI experiences in
            React. It provides headless, composable UI primitives that integrate
            with any design system&mdash;including classless frameworks like Pico
            CSS.
          </p>

          <p>
            This page itself is a demo: the entire layout uses{" "}
            <mark>semantic HTML</mark> styled automatically by Pico CSS. Try the
            chat bubble in the bottom-right corner to interact with the AI
            assistant.
          </p>
        </article>

        <section id="features">
          <h2>Features</h2>
          <div className="grid">
            <article>
              <header>
                <strong>Headless Components</strong>
              </header>
              <p>
                Fully unstyled, composable primitives for messages, threads,
                inputs, and more. Bring your own design system.
              </p>
            </article>
            <article>
              <header>
                <strong>Thread Management</strong>
              </header>
              <p>
                Built-in support for multiple conversation threads with history,
                switching, and persistence.
              </p>
            </article>
            <article>
              <header>
                <strong>Tool Calls &amp; Reasoning</strong>
              </header>
              <p>
                Display AI reasoning steps and tool call results with dedicated
                info components.
              </p>
            </article>
          </div>

          <h3>Getting Started</h3>
          <pre>
            <code>{`npm install @tambo-ai/react @tambo-ai/react-ui-base`}</code>
          </pre>
          <p>
            Wrap your app in a <code>&lt;TamboProvider&gt;</code> and start
            building with the headless components:
          </p>
          <pre>
            <code>{`import { ThreadContent, MessageInput, Message } from "@tambo-ai/react-ui-base";
import { useTambo } from "@tambo-ai/react";

function Chat() {
  return (
    <>
      <ThreadContent.Root>
        <ThreadContent.Messages />
      </ThreadContent.Root>
      <MessageInput.Root>
        <MessageInput.Textarea />
        <MessageInput.SubmitButton />
      </MessageInput.Root>
    </>
  );
}`}</code>
          </pre>
        </section>

        <section id="faq">
          <h2>Frequently Asked Questions</h2>

          <details>
            <summary>What CSS frameworks does Tambo work with?</summary>
            <p>
              Tambo is headless&mdash;it works with any CSS framework or custom
              styles. This demo uses Pico CSS, but you can use Tailwind,
              Bootstrap, plain CSS, or anything else.
            </p>
          </details>

          <details>
            <summary>Can I customize the message rendering?</summary>
            <p>
              Yes! Every component accepts a <code>render</code> prop that gives
              you full control over the output. You can wrap, replace, or
              augment the default rendering.
            </p>
          </details>

          <details>
            <summary>How does thread management work?</summary>
            <p>
              Tambo provides <code>useTambo</code> and{" "}
              <code>useTamboThreadList</code> hooks for managing threads. The{" "}
              <code>ThreadHistory</code> component renders a thread picker with
              switch and create capabilities.
            </p>
          </details>

          <details>
            <summary>Is streaming supported?</summary>
            <p>
              Yes. Messages stream in real-time, and the{" "}
              <code>Message.LoadingIndicator</code> component shows progress
              while the assistant is responding.
            </p>
          </details>

          <details>
            <summary>Can I display tool calls and reasoning?</summary>
            <p>
              Absolutely. The <code>ReasoningInfo</code> and{" "}
              <code>ToolcallInfo</code> components let you render AI reasoning
              steps and tool invocations with full detail.
            </p>
          </details>
        </section>

        <aside>
          <p>
            <strong>Tip:</strong> Click the chat button in the bottom-right
            corner to start a conversation, or use the{" "}
            <em>Threads</em> button in the navigation to manage your
            conversations.
          </p>
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer className="container">
        <hr />
        <nav>
          <ul>
            <li>
              <small>
                Built with <Link href="/">Tambo</Link> &amp; Pico CSS
              </small>
            </li>
          </ul>
          <ul>
            <li>
              <small>
                <a href="#overview">Overview</a>
              </small>
            </li>
            <li>
              <small>
                <a href="#features">Features</a>
              </small>
            </li>
            <li>
              <small>
                <a href="#faq">FAQ</a>
              </small>
            </li>
          </ul>
        </nav>
      </footer>

      {/* ── Floating Chat Bubble ── */}
      {!chatOpen && (
        <button
          data-testid="chat-bubble"
          ref={chatButtonRef}
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            zIndex: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            padding: 0,
            marginBottom: 0,
            cursor: "pointer",
          }}
        >
          &#128172;
        </button>
      )}

      {/* ── Chat Window ── */}
      {chatOpen && (
        <div
          ref={chatRef}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 440,
            maxWidth: "calc(100vw - 48px)",
            height: 580,
            maxHeight: "calc(100vh - 96px)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            borderRadius: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          <article
            style={{
              marginBottom: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
              borderRadius: 8,
            }}
          >
            {/* Chat Header */}
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Chat</strong>
              <button
                className="outline secondary"
                style={{
                  marginBottom: 0,
                  padding: "4px 12px",
                  fontSize: "0.85rem",
                }}
                onClick={() => setChatOpen(false)}
              >
                Close
              </button>
            </header>

            {/* Chat Messages */}
            <div
              ref={scrollRef}
              style={{
                flex: "1 1 auto",
                overflowY: "auto",
                padding: "0 16px",
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
                          <ReasoningInfo.Root>
                            <ReasoningInfo.Trigger
                              render={(props, _state) => (
                                <article
                                  {...props}
                                  style={{
                                    marginBottom: 4,
                                    padding: "8px 12px",
                                  }}
                                >
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
                            <article
                              style={{
                                marginBottom: 4,
                                padding: "8px 12px",
                              }}
                            >
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
                                  />{" "}
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
            </div>

            {/* Chat Input */}
            <footer style={{ padding: "8px 12px" }}>
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
                        <button className="outline" type="button" style={{ marginBottom: 0 }}>
                          File
                        </button>
                      }
                    />
                    <MessageInput.SubmitButton
                      render={<button type="submit" style={{ marginBottom: 0 }}>Send</button>}
                    />
                    <MessageInput.StopButton
                      render={
                        <button className="secondary" type="button" style={{ marginBottom: 0 }}>
                          Stop
                        </button>
                      }
                    />
                  </div>
                </MessageInput.Content>
              </MessageInput.Root>
            </footer>
          </article>
        </div>
      )}
    </>
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
        maxWidth: "85%",
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
        padding: "8px 14px",
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
  children,
  ...props
}: PropsWithChildren) {
  return <summary {...props}>{children}</summary>;
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
