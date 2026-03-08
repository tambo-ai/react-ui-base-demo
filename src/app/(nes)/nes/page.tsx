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
import {
  NesButton,
  NesHeading,
  NesContainer,
  NesBalloon,
  NesNavList,
  NesNavItem,
  NesSpinner,
  NesTimeline,
  NesTimelineItem,
} from "../components";

// RPG inventory items
const INVENTORY = [
  { name: "Iron Sword", icon: "⚔️", qty: 1, desc: "ATK +12" },
  { name: "Leather Shield", icon: "🛡️", qty: 1, desc: "DEF +8" },
  { name: "Health Potion", icon: "❤️", qty: 5, desc: "HP +50" },
  { name: "Mana Crystal", icon: "💎", qty: 3, desc: "MP +30" },
  { name: "Torch", icon: "🔥", qty: 10, desc: "Light source" },
  { name: "Gold Coins", icon: "🪙", qty: 247, desc: "Currency" },
];

const PARTY_MEMBERS = [
  { name: "HERO", cls: "Warrior", hp: 120, maxHp: 120, mp: 30, maxMp: 30, lvl: 12 },
  { name: "MAGE", cls: "Wizard", hp: 65, maxHp: 80, mp: 90, maxMp: 100, lvl: 11 },
  { name: "HEALER", cls: "Cleric", hp: 95, maxHp: 95, mp: 45, maxMp: 60, lvl: 10 },
];

export default function NesDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const [tab, setTab] = useState<"party" | "inventory" | "quests">("party");

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
        backgroundColor: "#212529",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          borderBottom: "4px solid #fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ textDecoration: "none", color: "#fff", fontSize: 10 }}>
            ← HOME
          </Link>
          <span style={{ fontSize: 10 }}>TAMBO QUEST</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NesButton
            variant="warning"
            style={{ fontSize: 8, padding: "2px 8px" }}
            onClick={() => setThreadsOpen(!threadsOpen)}
          >
            SAVE SLOTS
          </NesButton>
        </div>
      </div>

      {/* Threads overlay */}
      {threadsOpen && <ThreadsOverlay onClose={() => setThreadsOpen(false)} />}

      {/* Main content area */}
      <div style={{ flex: "1 1 auto", overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Game title section */}
        <NesContainer variant="dark" style={{ padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>⚔️ TAMBO QUEST ⚔️</div>
          <div style={{ fontSize: 8, color: "#aaa" }}>
            An 8-bit adventure in AI chat interfaces
          </div>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 16, fontSize: 8 }}>
            <span>🏰 Chapter 3: The Component Library</span>
          </div>
        </NesContainer>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <NesButton
            variant={tab === "party" ? "primary" : "default"}
            style={{ fontSize: 8 }}
            onClick={() => setTab("party")}
          >
            PARTY
          </NesButton>
          <NesButton
            variant={tab === "inventory" ? "primary" : "default"}
            style={{ fontSize: 8 }}
            onClick={() => setTab("inventory")}
          >
            ITEMS
          </NesButton>
          <NesButton
            variant={tab === "quests" ? "primary" : "default"}
            style={{ fontSize: 8 }}
            onClick={() => setTab("quests")}
          >
            QUESTS
          </NesButton>
        </div>

        {/* Party tab */}
        {tab === "party" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PARTY_MEMBERS.map((member) => (
              <NesContainer key={member.name} variant="dark" style={{ padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 10, marginBottom: 4 }}>{member.name}</div>
                    <div style={{ fontSize: 8, color: "#aaa" }}>Lv.{member.lvl} {member.cls}</div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 8 }}>
                    <div>
                      HP{" "}
                      <progress
                        className="nes-progress is-success"
                        value={member.hp}
                        max={member.maxHp}
                        style={{ width: 100, height: 12 }}
                      />
                      {" "}{member.hp}/{member.maxHp}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      MP{" "}
                      <progress
                        className="nes-progress is-primary"
                        value={member.mp}
                        max={member.maxMp}
                        style={{ width: 100, height: 12 }}
                      />
                      {" "}{member.mp}/{member.maxMp}
                    </div>
                  </div>
                </div>
              </NesContainer>
            ))}
          </div>
        )}

        {/* Inventory tab */}
        {tab === "inventory" && (
          <NesContainer variant="dark" style={{ padding: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {INVENTORY.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4px 0",
                    borderBottom: "2px dashed #333",
                    fontSize: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#aaa" }}>{item.desc}</span>
                    <span>x{item.qty}</span>
                  </div>
                </div>
              ))}
            </div>
          </NesContainer>
        )}

        {/* Quests tab */}
        {tab === "quests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <NesContainer variant="dark" style={{ padding: 12 }}>
              <div style={{ fontSize: 10, marginBottom: 8 }}>
                <i className="nes-icon is-small star" /> ACTIVE QUESTS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 8 }}>
                <div style={{ borderLeft: "4px solid #f7dc6f", paddingLeft: 8 }}>
                  <div style={{ marginBottom: 2 }}>Build the Chat Interface</div>
                  <div style={{ color: "#aaa" }}>Implement ThreadContent and MessageInput components</div>
                  <progress
                    className="nes-progress is-warning"
                    value={75}
                    max={100}
                    style={{ width: "100%", height: 10, marginTop: 4 }}
                  />
                </div>
                <div style={{ borderLeft: "4px solid #92cc41", paddingLeft: 8 }}>
                  <div style={{ marginBottom: 2 }}>Defeat the Bug Dragon</div>
                  <div style={{ color: "#aaa" }}>Fix 3 critical issues in the rendering pipeline</div>
                  <progress
                    className="nes-progress is-success"
                    value={2}
                    max={3}
                    style={{ width: "100%", height: 10, marginTop: 4 }}
                  />
                </div>
                <div style={{ borderLeft: "4px solid #209cee", paddingLeft: 8 }}>
                  <div style={{ marginBottom: 2 }}>Explore the Design Systems</div>
                  <div style={{ color: "#aaa" }}>Visit all 14 themed demo pages</div>
                  <progress
                    className="nes-progress is-primary"
                    value={5}
                    max={14}
                    style={{ width: "100%", height: 10, marginTop: 4 }}
                  />
                </div>
              </div>
            </NesContainer>
          </div>
        )}
      </div>

      {/* Chat Bubble */}
      {!chatOpen && (
        <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 999 }}>
          <NesButton
            variant="primary"
            onClick={() => setChatOpen(true)}
            style={{ fontSize: 14, padding: "8px 12px" }}
          >
            💬
          </NesButton>
        </div>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            width: 380,
            height: 500,
            zIndex: 998,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <NesContainer
            variant="dark"
            style={{
              padding: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Chat header */}
            <div
              style={{
                padding: "8px 12px",
                borderBottom: "4px solid #fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 10 }}>💬 NPC CHAT</span>
              <NesButton
                variant="error"
                style={{ fontSize: 8, padding: "2px 6px" }}
                onClick={() => { setChatOpen(false); setThreadsOpen(false); }}
              >
                X
              </NesButton>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
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
                            <NesContainer
                              variant="rounded"
                              style={{ padding: 8, fontSize: 8, backgroundColor: "#f7dc6f" }}
                            >
                              <NesTimeline>
                                <NesTimelineItem
                                  icon={
                                    <ReasoningInfo.StatusText
                                      render={(_props, state) =>
                                        state.isLoading ? (
                                          <NesSpinner size="small" />
                                        ) : (
                                          <i className="nes-icon is-small star" />
                                        )
                                      }
                                    />
                                  }
                                >
                                  <ReasoningInfo.Trigger
                                    render={(props) => (
                                      <button
                                        {...props}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 6,
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          padding: 0,
                                          fontSize: 8,
                                          color: "#212529",
                                        }}
                                      >
                                        <ReasoningInfo.StatusText />
                                      </button>
                                    )}
                                  />
                                  <ReasoningInfo.Content
                                    style={{ marginTop: 6, fontSize: 8, color: "#212529", lineHeight: 1.8 }}
                                  >
                                    <ReasoningInfo.Steps />
                                  </ReasoningInfo.Content>
                                </NesTimelineItem>
                              </NesTimeline>
                            </NesContainer>
                          </ReasoningInfo.Root>

                          <ToolcallInfo.Root>
                            <NesContainer variant="rounded-dark" style={{ padding: 8, fontSize: 8 }}>
                              <NesTimeline>
                                <NesTimelineItem
                                  icon={
                                    <ToolcallInfo.StatusIcon
                                      render={(_p, s) => {
                                        switch (s.status) {
                                          case "loading":
                                            return <NesSpinner size="small" />;
                                          case "success":
                                            return <i className="nes-icon is-small heart" />;
                                          case "error":
                                            return <i className="nes-icon is-small close" />;
                                        }
                                      }}
                                    />
                                  }
                                >
                                  <ToolcallInfo.Trigger
                                    render={(props, { state }) => (
                                      <CollapsibleTrigger state={state} {...props}>
                                        <ToolcallInfo.ToolName />
                                      </CollapsibleTrigger>
                                    )}
                                  />
                                  <ToolcallInfo.Content style={{ marginTop: 6, fontSize: 8, color: "#aaa" }}>
                                    <ToolcallInfo.Parameters render={<CodeBlock title="Parameters" />} />
                                    <ToolcallInfo.Result render={<CodeBlock title="Result" />} />
                                  </ToolcallInfo.Content>
                                </NesTimelineItem>
                              </NesTimeline>
                            </NesContainer>
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
                            <NesSpinner />
                          </Message.LoadingIndicator>
                        </Message.Root>
                      ))}
                    </>
                  )}
                />
              </ThreadContent.Root>
            </div>

            {/* Input */}
            <div style={{ padding: 8, borderTop: "4px solid #fff" }}>
              <MessageInput.Root>
                <MessageInput.StagedImages style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }} />
                <MessageInput.Error style={{ marginBottom: 8, padding: 8, fontSize: 8, color: "#e76e55" }} />
                <MessageInput.Content style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <MessageInput.Textarea
                      placeholder="Type..."
                      style={{
                        minHeight: 36,
                        maxHeight: 72,
                        padding: 8,
                        fontSize: 8,
                        border: "4px solid #212529",
                        outline: "none",
                        width: "100%",
                        boxSizing: "border-box",
                        lineHeight: 1.8,
                        backgroundColor: "#fff",
                        color: "#212529",
                      }}
                    />
                  </div>
                  <MessageInput.SubmitButton
                    render={<NesButton variant="primary" style={{ fontSize: 8 }} />}
                  >
                    Send
                  </MessageInput.SubmitButton>
                  <MessageInput.StopButton
                    render={<NesButton variant="error" style={{ fontSize: 8 }} />}
                  >
                    Stop
                  </MessageInput.StopButton>
                </MessageInput.Content>
              </MessageInput.Root>
            </div>
          </NesContainer>
        </div>
      )}
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
      style={{
        position: "fixed",
        top: 48,
        right: 16,
        width: 280,
        maxHeight: 350,
        overflow: "auto",
        zIndex: 1001,
      }}
    >
      <NesContainer variant="dark" style={{ padding: 12 }}>
        <div style={{ fontSize: 10, marginBottom: 8 }}>
          <i className="nes-icon is-small heart" /> SAVE SLOTS
        </div>
        <ThreadHistory.Root>
          <ThreadHistory.NewThreadButton
            render={<NesButton variant="primary" style={{ width: "100%", fontSize: 8, marginBottom: 8 }} />}
          >
            + New Save
          </ThreadHistory.NewThreadButton>
          <ThreadHistory.List
            render={(_props, state) => (
              <NesNavList>
                {state.filteredThreads.map((thread) => (
                  <ThreadHistory.Item
                    key={thread.id}
                    thread={thread}
                    render={({ children, ...props }, { isActive }) => (
                      <NesNavItem
                        isActive={isActive}
                        {...props}
                        onClick={(e) => {
                          props.onClick?.(e);
                          onClose();
                        }}
                      >
                        {children}
                      </NesNavItem>
                    )}
                  />
                ))}
              </NesNavList>
            )}
          />
        </ThreadHistory.Root>
      </NesContainer>
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
        marginBottom: 16,
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: 8,
        color: "#fff",
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
    <NesBalloon direction={role === "user" ? "right" : "left"} {...props}>
      <p style={{ fontSize: 8, lineHeight: 1.8, color: "#212529", margin: 0 }}>
        {children}
      </p>
    </NesBalloon>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div style={{ marginTop: 4 }}>
      {title && (
        <div style={{ fontSize: 8, fontWeight: 600, color: "#aaa", marginBottom: 2 }}>
          {title}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 8,
          lineHeight: 1.5,
          color: "#ccc",
        }}
      >
        {children}
      </pre>
    </div>
  );
}
