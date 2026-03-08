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
import { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function WinXPDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const { ref: scrollRef } = useScrollToBottom(500);

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background:
          "linear-gradient(180deg, #245EDC 0%, #3A6DD8 20%, #4A8DE0 35%, #6BAE47 45%, #7CBA3F 55%, #8CC63F 65%, #7CBA3F 80%, #5A9E37 100%)",
      }}
    >
      {/* Desktop Icons */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <DesktopIcon
          icon="🖥️"
          label="My Computer"
          onClick={() => setExplorerOpen(true)}
        />
        <DesktopIcon icon="📁" label="My Documents" />
        <DesktopIcon icon="♻️" label="Recycle Bin" />
        <DesktopIcon icon="🌐" label="Internet Explorer" />
        <Link href="/" style={{ textDecoration: "none" }}>
          <DesktopIcon icon="🏠" label="Home" />
        </Link>
      </div>

      {/* My Computer Explorer Window */}
      {explorerOpen && (
        <div
          className="window"
          style={{
            position: "absolute",
            top: 40,
            left: 120,
            width: 520,
            height: 360,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="title-bar">
            <div className="title-bar-text">My Computer</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize" onClick={() => setExplorerOpen(false)} />
              <button aria-label="Maximize" />
              <button aria-label="Close" onClick={() => setExplorerOpen(false)} />
            </div>
          </div>
          <div className="window-body" style={{ flex: "1 1 auto", overflow: "auto" }}>
            {/* Address bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginBottom: 8,
                padding: "2px 4px",
                background: "#fff",
                border: "1px solid #7F9DB9",
              }}
            >
              <span style={{ fontSize: 10, color: "#666" }}>Address</span>
              <div
                style={{
                  flex: 1,
                  padding: "1px 4px",
                  background: "#fff",
                  border: "1px inset #7F9DB9",
                  fontSize: 11,
                }}
              >
                My Computer
              </div>
            </div>

            {/* File explorer content */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: 8 }}>
              <DriveIcon icon="💾" label="3½ Floppy (A:)" />
              <DriveIcon icon="💿" label="Local Disk (C:)" />
              <DriveIcon icon="💿" label="Local Disk (D:)" />
              <DriveIcon icon="📀" label="DVD Drive (E:)" />
              <DriveIcon icon="🔌" label="Control Panel" />
              <DriveIcon icon="🖨️" label="Printers and Faxes" />
            </div>

            {/* Status bar */}
            <div
              className="sunken-panel"
              style={{
                marginTop: 8,
                padding: "2px 8px",
                fontSize: 10,
                color: "#444",
              }}
            >
              6 objects
            </div>
          </div>
        </div>
      )}

      {/* Chat Bubble */}
      {!chatOpen && (
        <button
          data-testid="chat-bubble"
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed",
            bottom: 40,
            right: 16,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "linear-gradient(180deg, #3C7DED 0%, #245DDC 100%)",
            color: "white",
            border: "2px solid #0C49AD",
            cursor: "pointer",
            zIndex: 999,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div
          className="window"
          style={{
            position: "fixed",
            bottom: 36,
            right: 16,
            width: 380,
            height: 500,
            zIndex: 998,
            display: "flex",
            flexDirection: "column",
            boxShadow: "4px 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <div className="title-bar">
            <div
              className="title-bar-text"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <button
                onClick={() => setThreadsOpen(!threadsOpen)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 12,
                  padding: "0 2px",
                  lineHeight: 1,
                }}
              >
                ☰
              </button>
              Tambo Chat
            </div>
            <div className="title-bar-controls">
              <button
                aria-label="Minimize"
                onClick={() => {
                  setChatOpen(false);
                  setThreadsOpen(false);
                }}
              />
              <button
                aria-label="Close"
                onClick={() => {
                  setChatOpen(false);
                  setThreadsOpen(false);
                }}
              />
            </div>
          </div>

          {/* Threads Overlay */}
          {threadsOpen && (
            <ThreadsOverlay onClose={() => setThreadsOpen(false)} />
          )}

          {/* Messages */}
          <div
            ref={scrollRef}
            className="window-body"
            style={{
              flex: "1 1 auto",
              overflow: "auto",
              padding: 8,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ThreadContent.Root
              style={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}
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
                                  <CollapsibleTrigger
                                    state={state as "open" | "closed"}
                                  >
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
                                  <CollapsibleTrigger
                                    state={state as "open" | "closed"}
                                    {...props}
                                  >
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
          </div>

          {/* Input Area */}
          <div style={{ padding: 4, borderTop: "1px solid #ACA899" }}>
            <MessageInput.Root>
              <MessageInput.StagedImages />
              <MessageInput.Content
                render={(props) => (
                  <div
                    {...props}
                    style={{
                      display: "flex",
                      gap: 4,
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
                      style={{ flex: "1 1 auto", resize: "none", fontSize: 11 }}
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
          </div>
        </div>
      )}

      {/* Taskbar */}
      <Taskbar
        startMenuOpen={startMenuOpen}
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
      />

      {/* Start Menu */}
      {startMenuOpen && (
        <div
          className="window"
          style={{
            position: "fixed",
            bottom: 30,
            left: 0,
            width: 280,
            zIndex: 1001,
            boxShadow: "4px 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="title-bar"
            style={{
              background: "linear-gradient(180deg, #1F5FC7 0%, #3C7DED 100%)",
            }}
          >
            <div className="title-bar-text">tambo</div>
          </div>
          <div className="window-body" style={{ padding: 0 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#fff",
              }}
            >
              <StartMenuItem
                icon="🖥️"
                label="My Computer"
                onClick={() => {
                  setExplorerOpen(true);
                  setStartMenuOpen(false);
                }}
              />
              <StartMenuItem
                icon="📁"
                label="My Documents"
                onClick={() => setStartMenuOpen(false)}
              />
              <StartMenuItem
                icon="💬"
                label="Tambo Chat"
                onClick={() => {
                  setChatOpen(true);
                  setStartMenuOpen(false);
                }}
              />
              <div style={{ borderTop: "1px solid #ccc", margin: "2px 0" }} />
              <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                <StartMenuItem
                  icon="🏠"
                  label="Home"
                  onClick={() => setStartMenuOpen(false)}
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Desktop Icon ──────────────────────────────────────────── */

function DesktopIcon({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 75,
        cursor: "pointer",
        padding: 4,
        color: "white",
        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
        fontSize: 11,
        textAlign: "center",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>{icon}</span>
      <span style={{ marginTop: 2 }}>{label}</span>
    </div>
  );
}

/* ── Drive Icon (for Explorer) ─────────────────────────────── */

function DriveIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 80,
        padding: 8,
        cursor: "default",
        fontSize: 10,
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
      <span style={{ marginTop: 2 }}>{label}</span>
    </div>
  );
}

/* ── Start Menu Item ───────────────────────────────────────── */

function StartMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        cursor: "pointer",
        fontSize: 11,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#316AC5";
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "inherit";
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ── Taskbar ───────────────────────────────────────────────── */

function Taskbar({
  startMenuOpen,
  onStartClick,
}: {
  startMenuOpen: boolean;
  onStartClick: () => void;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        background:
          "linear-gradient(180deg, #1F5FC7 0%, #3C7DED 3%, #245DDC 6%, #245DDC 94%, #1941A5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2px",
        zIndex: 1000,
        borderTop: "2px solid #0C59B3",
      }}
    >
      <button
        onClick={onStartClick}
        style={{
          background: startMenuOpen
            ? "linear-gradient(180deg, #2D7E2D 0%, #1A6B1A 100%)"
            : "linear-gradient(180deg, #3C943C 0%, #2D8E2D 50%, #1E7A1E 100%)",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: "0 8px 8px 0",
          padding: "2px 14px 2px 8px",
          cursor: "pointer",
          fontSize: 11,
          height: 24,
          letterSpacing: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 16 }}>🪟</span>
        start
      </button>
      <div
        style={{
          color: "white",
          fontSize: 11,
          padding: "0 8px",
          background:
            "linear-gradient(180deg, #1290E9 0%, #0D6CC5 50%, #0A5BA8 100%)",
          height: "100%",
          display: "flex",
          alignItems: "center",
          borderLeft: "1px solid #0C49AD",
        }}
      >
        {time}
      </div>
    </div>
  );
}

/* ── Threads Overlay ───────────────────────────────────────── */

function ThreadsOverlay({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "absolute",
        top: 22,
        left: 0,
        right: 0,
        background: "#ECE9D8",
        border: "1px solid #ACA899",
        zIndex: 10,
        maxHeight: 220,
        overflow: "auto",
        padding: 4,
        boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <ThreadHistory.Root>
        <ThreadHistory.NewThreadButton
          render={(props) => (
            <button {...props} style={{ marginBottom: 4, width: "100%" }} />
          )}
        >
          + New thread
        </ThreadHistory.NewThreadButton>
        <ThreadHistory.List
          render={(props, state) => (
            <ul className="tree-view" {...props} style={{ margin: 0 }}>
              {state.filteredThreads.map((thread) => (
                <ThreadHistory.Item
                  key={thread.id}
                  thread={thread}
                  render={({ children, ...itemProps }, { isActive }) => (
                    <li
                      {...itemProps}
                      onClick={(e) => {
                        itemProps.onClick?.(e);
                        onClose();
                      }}
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
      </ThreadHistory.Root>
    </div>
  );
}

/* ── Message helpers (preserved) ───────────────────────────── */

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

function CollapsibleTrigger({
  state,
  children,
  ...props
}: PropsWithChildren<{ state: "open" | "closed" }>) {
  return (
    <span {...props} style={{ cursor: "pointer", userSelect: "none" }}>
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
    <div
      className="sunken-panel"
      style={{ padding: "6px 10px", fontSize: 11, lineHeight: 1.5 }}
      {...props}
    >
      {children}
    </div>
  );
}

function CodeBlock({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
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
