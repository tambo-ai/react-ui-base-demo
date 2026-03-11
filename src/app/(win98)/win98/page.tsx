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

export default function Win98Demo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [notepadOpen, setNotepadOpen] = useState(false);

  const { ref: scrollRef } = useScrollToBottom();

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
        background: "#008080",
      }}
    >
      {/* Desktop Icons */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <DesktopIcon icon="🖥️" label="My Computer" onClick={() => setExplorerOpen(true)} />
        <DesktopIcon icon="📁" label="My Documents" />
        <DesktopIcon icon="♻️" label="Recycle Bin" />
        <DesktopIcon icon="🌐" label="Internet Explorer" />
        <DesktopIcon icon="📝" label="Notepad" onClick={() => setNotepadOpen(true)} />
        <Link href="/" style={{ textDecoration: "none" }}>
          <DesktopIcon icon="🏠" label="Home" />
        </Link>
      </div>

      {/* My Computer Window */}
      {explorerOpen && (
        <div
          className="window"
          style={{
            position: "absolute",
            top: 30,
            left: 110,
            width: 480,
            height: 320,
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 8 }}>
              <DriveIcon icon="💾" label="3½ Floppy (A:)" />
              <DriveIcon icon="💿" label="(C:)" />
              <DriveIcon icon="💿" label="(D:)" />
              <DriveIcon icon="📀" label="CD-ROM (E:)" />
              <DriveIcon icon="🖨️" label="Printers" />
              <DriveIcon icon="🔌" label="Control Panel" />
              <DriveIcon icon="📡" label="Dial-Up Networking" />
            </div>
            <div className="sunken-panel" style={{ margin: "4px 8px", padding: "2px 8px", fontSize: 10 }}>
              7 object(s)
            </div>
          </div>
        </div>
      )}

      {/* Notepad Window */}
      {notepadOpen && (
        <div
          className="window"
          style={{
            position: "absolute",
            top: 60,
            left: 200,
            width: 400,
            height: 280,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="title-bar">
            <div className="title-bar-text">Untitled - Notepad</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize" onClick={() => setNotepadOpen(false)} />
              <button aria-label="Maximize" />
              <button aria-label="Close" onClick={() => setNotepadOpen(false)} />
            </div>
          </div>
          <div style={{ fontSize: 11, padding: "2px 0", borderBottom: "1px solid #808080" }}>
            <span style={{ padding: "1px 8px", cursor: "default" }}>File</span>
            <span style={{ padding: "1px 8px", cursor: "default" }}>Edit</span>
            <span style={{ padding: "1px 8px", cursor: "default" }}>Search</span>
            <span style={{ padding: "1px 8px", cursor: "default" }}>Help</span>
          </div>
          <textarea
            defaultValue={"Welcome to Windows 98!\n\nThis is a demo of the 98.css design system.\nThe chat assistant is available via the\nbubble in the bottom-right corner.\n\nEnjoy the nostalgia! 🖥️"}
            style={{
              flex: "1 1 auto",
              border: "none",
              resize: "none",
              fontFamily: "'Fixedsys', 'Courier New', monospace",
              fontSize: 12,
              padding: 4,
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Chat Bubble */}
      {!chatOpen && (
        <button
          data-testid="chat-bubble"
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed",
            bottom: 38,
            right: 12,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#000080",
            color: "white",
            border: "2px outset #c0c0c0",
            cursor: "pointer",
            zIndex: 999,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
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
            bottom: 34,
            right: 12,
            width: 420,
            height: 540,
            zIndex: 998,
            display: "flex",
            flexDirection: "column",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <div className="title-bar">
            <div className="title-bar-text" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setThreadsOpen(!threadsOpen)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 12,
                  padding: "0 2px",
                }}
              >
                ☰
              </button>
              Tambo Chat
            </div>
            <div className="title-bar-controls">
              <button
                aria-label="Minimize"
                onClick={() => { setChatOpen(false); setThreadsOpen(false); }}
              />
              <button
                aria-label="Close"
                onClick={() => { setChatOpen(false); setThreadsOpen(false); }}
              />
            </div>
          </div>

          {/* Threads Overlay */}
          {threadsOpen && <ThreadsOverlay onClose={() => setThreadsOpen(false)} />}

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
                                      transform: state.isOpen
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
          </div>

          {/* Input */}
          <div style={{ padding: 4, borderTop: "1px solid #808080" }}>
            <MessageInput.Root>
              <MessageInput.StagedImages />
              <MessageInput.Content
                render={
                  <div
                    style={{ display: "flex", gap: 4, alignItems: "flex-start" }}
                  />
                }
              >
                <MessageInput.Error
                  render={(props) => (
                    <div style={{ color: "red", fontSize: 11 }} {...props} />
                  )}
                />
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={
                    <textarea
                      rows={2}
                      style={{ flex: "1 1 auto", resize: "none", fontSize: 11 }}
                    />
                  }
                />
                <MessageInput.FileButton
                  render={<button type="button">File</button>}
                />
                <MessageInput.SubmitButton
                  render={<button>Send</button>}
                />
                <MessageInput.StopButton
                  render={<button>Stop</button>}
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
            bottom: 28,
            left: 0,
            width: 240,
            zIndex: 1001,
          }}
        >
          <div className="title-bar" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", position: "absolute", left: 0, top: 0, bottom: 0, width: 22, background: "#000080" }}>
            <div className="title-bar-text" style={{ color: "#c0c0c0", fontWeight: "bold", fontSize: 12, letterSpacing: 2 }}>
              Windows 98
            </div>
          </div>
          <div className="window-body" style={{ padding: 0, marginLeft: 22 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <StartMenuItem icon="🖥️" label="My Computer" onClick={() => { setExplorerOpen(true); setStartMenuOpen(false); }} />
              <StartMenuItem icon="📁" label="My Documents" onClick={() => setStartMenuOpen(false)} />
              <StartMenuItem icon="📝" label="Notepad" onClick={() => { setNotepadOpen(true); setStartMenuOpen(false); }} />
              <StartMenuItem icon="💬" label="Tambo Chat" onClick={() => { setChatOpen(true); setStartMenuOpen(false); }} />
              <div style={{ borderTop: "1px solid #808080", borderBottom: "1px solid #fff", margin: "2px 4px" }} />
              <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                <StartMenuItem icon="🚪" label="Shut Down..." onClick={() => setStartMenuOpen(false)} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Desktop Icon ──────────────────────────────────────────── */

function DesktopIcon({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 70,
        cursor: "pointer",
        padding: 4,
        color: "white",
        textShadow: "1px 1px 1px rgba(0,0,0,0.9)",
        fontSize: 11,
        textAlign: "center",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
      <span style={{ marginTop: 2 }}>{label}</span>
    </div>
  );
}

/* ── Drive Icon ────────────────────────────────────────────── */

function DriveIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 70,
        padding: 6,
        cursor: "default",
        fontSize: 10,
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
      <span style={{ marginTop: 2 }}>{label}</span>
    </div>
  );
}

/* ── Start Menu Item ───────────────────────────────────────── */

function StartMenuItem({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px",
        cursor: "pointer",
        fontSize: 11,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#000080";
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "inherit";
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ── Taskbar ───────────────────────────────────────────────── */

function Taskbar({ startMenuOpen, onStartClick }: { startMenuOpen: boolean; onStartClick: () => void }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
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
        height: 28,
        background: "#c0c0c0",
        borderTop: "2px outset #dfdfdf",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "2px 2px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={onStartClick}
        style={{
          fontWeight: "bold",
          fontSize: 11,
          height: 22,
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          ...(startMenuOpen ? { borderStyle: "inset" } : {}),
        }}
      >
        <span style={{ fontSize: 14 }}>🪟</span>
        Start
      </button>
      <div
        className="sunken-panel"
        style={{
          padding: "1px 8px",
          fontSize: 11,
          height: 20,
          display: "flex",
          alignItems: "center",
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
        top: 20,
        left: 0,
        right: 0,
        background: "#c0c0c0",
        border: "2px outset #dfdfdf",
        zIndex: 10,
        maxHeight: 200,
        overflow: "auto",
        padding: 4,
      }}
    >
      <ThreadHistory.Root>
        <ThreadHistory.NewThreadButton
          render={<button type="button" style={{ marginBottom: 4, width: "100%" }} />}
        >
          + New thread
        </ThreadHistory.NewThreadButton>
        <ThreadHistory.List
          render={(props, state) => (
            <div {...props} className="sunken-panel" style={{ overflow: "auto" }}>
              <ul className="tree-view" style={{ margin: 0, padding: 0 }}>
                {state.filteredThreads.map((thread) => (
                  <ThreadHistory.Item
                    key={thread.id}
                    thread={thread}
                    render={({ children, ...itemProps }, { isActive }) => (
                      <li>
                        <button
                          {...itemProps}
                          onClick={(e) => {
                            itemProps.onClick?.(e);
                            onClose();
                          }}
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
