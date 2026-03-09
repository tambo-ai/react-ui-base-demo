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

// System monitor data
const SYSTEM_DATA = {
  cpu: 42,
  mem: 67,
  net: 23,
  disk: 81,
  uptime: "47:23:11",
  processes: 128,
  hostname: "TAMBO-MAINFRAME",
  os: "RetroOS v3.7.1",
};

const LOG_ENTRIES = [
  { time: "23:41:07", level: "INFO", msg: "System boot sequence complete" },
  { time: "23:41:12", level: "OK", msg: "Neural interface initialized" },
  { time: "23:41:15", level: "WARN", msg: "Quantum buffer at 67% capacity" },
  { time: "23:41:18", level: "INFO", msg: "Tambo AI core loaded" },
  { time: "23:41:22", level: "OK", msg: "Chat subsystem operational" },
  { time: "23:41:25", level: "INFO", msg: "Awaiting user input..." },
];

export default function RetroDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);

  const { ref: scrollRef } = useScrollToBottom(500);

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  return (
    <div
      className="retro-crt retro-flicker"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "#050505",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top header bar */}
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid #ff6a00",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" className="retro-text" style={{ textDecoration: "none", fontSize: 16 }}>
            ← HOME
          </Link>
          <span className="retro-text" style={{ fontSize: 16 }}>
            {SYSTEM_DATA.hostname}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="retro-btn"
            style={{ fontSize: 14, padding: "4px 12px" }}
            onClick={() => setThreadsOpen(!threadsOpen)}
          >
            THREADS
          </button>
        </div>
      </div>

      {/* Threads overlay */}
      {threadsOpen && <ThreadsOverlay onClose={() => setThreadsOpen(false)} />}

      {/* Main content */}
      <div
        style={{
          flex: "1 1 auto",
          overflow: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* Title banner */}
        <div
          className="retro-panel"
          style={{
            padding: "16px 20px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div className="retro-text" style={{ fontSize: 24 }}>
            ╔══════════════════════════════════╗
          </div>
          <div className="retro-text" style={{ fontSize: 24 }}>
            ║ &nbsp; &nbsp; TAMBO MAINFRAME &nbsp; &nbsp; ║
          </div>
          <div className="retro-text" style={{ fontSize: 24 }}>
            ╚══════════════════════════════════╝
          </div>
          <div className="retro-text-dim" style={{ fontSize: 14, marginTop: 8 }}>
            {SYSTEM_DATA.os} &nbsp;|&nbsp; UPTIME: {SYSTEM_DATA.uptime} &nbsp;|&nbsp; PROCESSES: {SYSTEM_DATA.processes}
          </div>
        </div>

        {/* System monitors */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Resource gauges */}
          <div className="retro-panel" style={{ padding: 16, position: "relative" }}>
            <div className="retro-text" style={{ fontSize: 16, marginBottom: 12 }}>
              &gt; SYSTEM RESOURCES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <ResourceBar label="CPU" value={SYSTEM_DATA.cpu} color="#ff6a00" />
              <ResourceBar label="MEM" value={SYSTEM_DATA.mem} color="#ff6a00" />
              <ResourceBar label="NET" value={SYSTEM_DATA.net} color="#00ff41" />
              <ResourceBar label="DSK" value={SYSTEM_DATA.disk} color="#ff4444" />
            </div>
          </div>

          {/* Activity log */}
          <div className="retro-panel" style={{ padding: 16, position: "relative" }}>
            <div className="retro-text" style={{ fontSize: 16, marginBottom: 12 }}>
              &gt; ACTIVITY LOG
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
              {LOG_ENTRIES.map((entry, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <span className="retro-text-dim">{entry.time}</span>
                  <span
                    style={{
                      color:
                        entry.level === "OK"
                          ? "#00ff41"
                          : entry.level === "WARN"
                          ? "#ffaa00"
                          : "#ff6a00",
                      textShadow: `0 0 5px ${
                        entry.level === "OK"
                          ? "rgba(0,255,65,0.5)"
                          : entry.level === "WARN"
                          ? "rgba(255,170,0,0.5)"
                          : "rgba(255,106,0,0.5)"
                      }`,
                      fontFamily: "'VT323', 'Courier New', monospace",
                      width: 40,
                    }}
                  >
                    [{entry.level}]
                  </span>
                  <span className="retro-text-dim">{entry.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ASCII art section */}
        <div className="retro-panel" style={{ padding: 16, position: "relative" }}>
          <pre
            className="retro-text-green"
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.2,
              textAlign: "center",
              fontFamily: "'VT323', 'Courier New', monospace",
            }}
          >
{`    _____          __  __ ____   ____        _    ___
   |_   _|   /\\   |  \\/  |  _ \\ / __ \\      / \\  |_ _|
     | |    /  \\  | \\  / | |_) | |  | |    / _ \\  | |
     | |   / /\\ \\ | |\\/| |  _ <| |  | |   / ___ \\ | |
     |_|  / ____ \\| |  | | |_) | |__| |  / /   \\ \\| |_
          \\/    \\/|_|  |_|____/ \\____/  \\/     \\/\\___|`}
          </pre>
          <div className="retro-text-dim" style={{ textAlign: "center", fontSize: 14, marginTop: 8 }}>
            NEURAL CHAT INTERFACE v2.1 &nbsp; — &nbsp; CLICK THE TERMINAL BUTTON TO CONNECT
          </div>
        </div>
      </div>

      {/* Chat Bubble */}
      {!chatOpen && (
        <div data-testid="chat-bubble" style={{ position: "fixed", bottom: 16, right: 16, zIndex: 999 }}>
          <button
            className="retro-btn retro-btn-primary"
            onClick={() => setChatOpen(true)}
            style={{ fontSize: 20, padding: "10px 14px" }}
          >
            &gt;_
          </button>
        </div>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            width: 400,
            height: 520,
            zIndex: 998,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="retro-panel"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Chat header */}
            <div
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #ff6a00",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="retro-text" style={{ fontSize: 16 }}>
                &gt; NEURAL CHAT
              </span>
              <button
                className="retro-btn retro-btn-danger"
                style={{ fontSize: 12, padding: "2px 8px" }}
                onClick={() => {
                  setChatOpen(false);
                  setThreadsOpen(false);
                }}
              >
                CLOSE
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              style={{
                flex: "1 1 auto",
                overflow: "auto",
                padding: 12,
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
                            <div style={{ padding: "6px 10px", fontSize: 14, position: "relative", border: "1px solid #00ff41", boxShadow: "0 0 8px rgba(0,255,65,0.3), inset 0 0 8px rgba(0,255,65,0.05)", background: "#050505", opacity: 0.75 }}>
                              <ReasoningInfo.Trigger
                                render={(props) => (
                                  <button
                                    {...props}
                                    className="retro-text-green"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 6,
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      padding: 0,
                                      fontSize: 14,
                                      opacity: 0.7,
                                    }}
                                  >
                                    <ReasoningInfo.StatusText />
                                  </button>
                                )}
                              />
                              <ReasoningInfo.Content
                                style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5, color: "#00cc33", fontFamily: '"VT323", "Courier New", monospace', opacity: 0.6 }}
                              >
                                <ReasoningInfo.Steps />
                              </ReasoningInfo.Content>
                            </div>
                          </ReasoningInfo.Root>

                          <ToolcallInfo.Root>
                            <div style={{ padding: "6px 10px", fontSize: 14, position: "relative", border: "1px solid #00ff41", boxShadow: "0 0 8px rgba(0,255,65,0.3), inset 0 0 8px rgba(0,255,65,0.05)", background: "#050505", opacity: 0.75 }}>
                              <ToolcallInfo.Trigger
                                render={(props, { state }) => (
                                  <CollapsibleTrigger state={state} {...props}>
                                    <span className="retro-text-green" style={{ display: "inline-flex", alignItems: "center", gap: 6, opacity: 0.7 }}>
                                      <ToolcallInfo.StatusIcon />
                                      <ToolcallInfo.ToolName />
                                    </span>
                                  </CollapsibleTrigger>
                                )}
                              />
                              <ToolcallInfo.Content style={{ marginTop: 6, fontSize: 14, color: "#00cc33", fontFamily: '"VT323", "Courier New", monospace', opacity: 0.6 }}>
                                <ToolcallInfo.Parameters render={<CodeBlock title="Parameters" />} />
                                <ToolcallInfo.Result render={<CodeBlock title="Result" />} />
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

                          <Message.LoadingIndicator>
                            <span className="retro-loading">
                              &gt; PROCESSING...<span className="retro-cursor" />
                            </span>
                          </Message.LoadingIndicator>
                        </Message.Root>
                      ))}
                    </>
                  )}
                />
              </ThreadContent.Root>
            </div>

            {/* Input */}
            <div style={{ padding: 8, borderTop: "1px solid #ff6a00" }}>
              <MessageInput.Root>
                <MessageInput.StagedImages style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }} />
                <MessageInput.Error style={{ marginBottom: 8, padding: "6px 10px", fontSize: 14, color: "#ff4444" }} />
                <MessageInput.Content style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <MessageInput.Textarea
                      placeholder="> TYPE COMMAND..."
                      className="retro-input"
                      style={{ minHeight: 36, maxHeight: 80, fontSize: 14 }}
                    />
                  </div>
                  <MessageInput.FileButton className="retro-btn" style={{ fontSize: 14 }}>
                    FILE
                  </MessageInput.FileButton>
                  <MessageInput.SubmitButton className="retro-btn retro-btn-primary" style={{ fontSize: 14 }}>
                    SEND
                  </MessageInput.SubmitButton>
                  <MessageInput.StopButton className="retro-btn retro-btn-danger" style={{ fontSize: 14 }}>
                    ABORT
                  </MessageInput.StopButton>
                </MessageInput.Content>
              </MessageInput.Root>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Resource Bar ──────────────────────────────────────────── */

function ResourceBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
      <span className="retro-text" style={{ width: 30, fontSize: 14 }}>{label}</span>
      <div
        style={{
          flex: 1,
          height: 12,
          border: `1px solid ${color}`,
          boxShadow: `0 0 4px ${color}40`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: `${color}88`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
      <span
        style={{
          width: 36,
          textAlign: "right",
          color,
          textShadow: `0 0 5px ${color}80`,
          fontFamily: "'VT323', 'Courier New', monospace",
          fontSize: 14,
        }}
      >
        {value}%
      </span>
    </div>
  );
}

/* ── Threads Overlay ───────────────────────────────────────── */

function ThreadsOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="retro-panel"
      style={{
        position: "fixed",
        top: 48,
        right: 16,
        width: 300,
        maxHeight: 400,
        overflow: "auto",
        zIndex: 1001,
        padding: 12,
      }}
    >
      <div className="retro-text" style={{ fontSize: 16, marginBottom: 8 }}>
        &gt; THREAD INDEX
      </div>
      <ThreadHistory.Root>
        <ThreadHistory.NewThreadButton
          className="retro-btn retro-btn-primary"
          style={{ width: "100%", fontSize: 14, marginBottom: 8 }}
        >
          + NEW THREAD
        </ThreadHistory.NewThreadButton>
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
                      className={`retro-thread-item${isActive ? " active" : ""}`}
                      onClick={(e) => {
                        props.onClick?.(e);
                        onClose();
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      &gt; {children}
                    </button>
                  )}
                />
              ))}
            </div>
          )}
        />
      </ThreadHistory.Root>
    </div>
  );
}

/* ── Message helpers ───────────────────────────────────────── */

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
    <button
      className="retro-text-dim"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: 14,
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
      className={role === "user" ? "retro-bubble-user" : "retro-bubble-ai"}
      {...props}
    >
      {children}
    </div>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div style={{ marginTop: 4 }}>
      {title && (
        <div className="retro-text-dim" style={{ fontSize: 12, marginBottom: 2 }}>
          {title}
        </div>
      )}
      <pre
        className="retro-text-dim"
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {children}
      </pre>
    </div>
  );
}
