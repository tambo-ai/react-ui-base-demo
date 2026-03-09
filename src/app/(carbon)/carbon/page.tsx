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
import { useScrollToBottom } from "@/components/chat-layout";
import { useState, useEffect, useRef, PropsWithChildren } from "react";
import {
  Button,
  TextArea,
  Tile,
  ClickableTile,
  InlineLoading,
  InlineNotification,
  SideNav,
  SideNavItems,
  SideNavLink,
  Stack,
  Grid,
  Column,
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "@carbon/react";
import {
  Send,
  Attachment,
  StopFilled,
  ChevronDown,
  Checkmark,
  Warning,
  Chat,
  Close,
  ListBoxes,
  Dashboard,
  Activity,
  CloudMonitoring,
  NetworkEnterprise,
  CheckmarkOutline,
  WarningAlt,
  ErrorOutline,
} from "@carbon/react/icons";

/* ------------------------------------------------------------------ */
/*  Dashboard data                                                     */
/* ------------------------------------------------------------------ */

const metrics = [
  {
    label: "System Uptime",
    value: "99.97%",
    trend: "+0.02%",
    trendUp: true,
    icon: Activity,
  },
  {
    label: "Active Services",
    value: "142 / 148",
    trend: "6 degraded",
    trendUp: false,
    icon: CloudMonitoring,
  },
  {
    label: "Network Throughput",
    value: "2.4 Gbps",
    trend: "+12% avg",
    trendUp: true,
    icon: NetworkEnterprise,
  },
  {
    label: "Deployments (24h)",
    value: "38",
    trend: "3 pending",
    trendUp: true,
    icon: Dashboard,
  },
];

const tableRows = [
  {
    id: "svc-001",
    service: "Auth Gateway",
    status: "Healthy",
    statusKind: "success" as const,
    region: "us-east-1",
    cpu: "23%",
    memory: "512 MB",
    lastIncident: "14 days ago",
  },
  {
    id: "svc-002",
    service: "Payment API",
    status: "Warning",
    statusKind: "warning" as const,
    region: "us-west-2",
    cpu: "78%",
    memory: "1.8 GB",
    lastIncident: "2 hours ago",
  },
  {
    id: "svc-003",
    service: "User Service",
    status: "Healthy",
    statusKind: "success" as const,
    region: "eu-central-1",
    cpu: "45%",
    memory: "768 MB",
    lastIncident: "30 days ago",
  },
  {
    id: "svc-004",
    service: "Notification Hub",
    status: "Critical",
    statusKind: "error" as const,
    region: "ap-south-1",
    cpu: "92%",
    memory: "3.2 GB",
    lastIncident: "Active",
  },
  {
    id: "svc-005",
    service: "Data Pipeline",
    status: "Healthy",
    statusKind: "success" as const,
    region: "us-east-1",
    cpu: "56%",
    memory: "2.1 GB",
    lastIncident: "7 days ago",
  },
];

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function CarbonPage() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();
  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const threadsRef = useRef<HTMLDivElement>(null);
  const { ref: chatScrollRef } = useScrollToBottom(500);

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  // Click-outside to close threads overlay
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
    <div style={{ minHeight: "100vh", background: "#f4f4f4" }}>
      {/* ---------- Header ---------- */}
      <Header
        aria-label="Tambo Operations"
      >
        <HeaderName href="#" prefix="IBM">
          Tambo Ops
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="Threads"
            onClick={() => setThreadsOpen((o) => !o)}
          >
            <ListBoxes size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      {/* ---------- Threads overlay ---------- */}
      {threadsOpen && (
        <div
          ref={threadsRef}
          style={{
            position: "fixed",
            top: 48,
            right: 16,
            width: 300,
            maxHeight: "70vh",
            zIndex: 200,
            overflow: "auto",
            background: "#fff",
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 16px rgba(0,0,0,.12)",
          }}
        >
          <div style={{ padding: 16, borderBottom: "1px solid #e0e0e0" }}>
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: 14,
                fontWeight: 600,
                color: "#161616",
              }}
            >
              Threads
            </h3>
            <ThreadHistory.Root>
              <ThreadHistory.NewThreadButton
                render={
                  <Button
                    kind="primary"
                    size="sm"
                    style={{ width: "100%", marginBottom: 8 }}
                  />
                }
              >
                + New thread
              </ThreadHistory.NewThreadButton>
              <ThreadHistory.List
                render={(_props, state) => (
                  <SideNav
                    isRail={false}
                    expanded
                    isFixedNav
                    aria-label="Thread list"
                    style={{
                      position: "static",
                      width: "100%",
                      maxWidth: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <SideNavItems>
                      {state.filteredThreads.map((thread) => (
                        <ThreadHistory.Item
                          key={thread.id}
                          thread={thread}
                          render={({ children, ...props }, { isActive }) => (
                            <SideNavLink
                              {...(props as any)}
                              isActive={isActive}
                              style={{ cursor: "pointer" }}
                            >
                              {children}
                            </SideNavLink>
                          )}
                        />
                      ))}
                    </SideNavItems>
                  </SideNav>
                )}
              />
            </ThreadHistory.Root>
          </div>
        </div>
      )}

      {/* ---------- Dashboard content ---------- */}
      <div style={{ paddingTop: 48 }}>
        <Grid style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 0" }}>
          {/* Section title: Metrics */}
          <Column lg={16} md={8} sm={4}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#161616",
                margin: "0 0 16px",
              }}
            >
              System Overview
            </h2>
          </Column>

          {/* Metric tiles */}
          {metrics.map((m) => (
            <Column key={m.label} lg={4} md={4} sm={4}>
              <ClickableTile
                style={{
                  marginBottom: 16,
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{ fontSize: 12, color: "#525252", fontWeight: 400 }}
                  >
                    {m.label}
                  </span>
                  <m.icon size={20} style={{ color: "#0f62fe" }} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: "#161616",
                      margin: "8px 0 4px",
                    }}
                  >
                    {m.value}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: m.trendUp ? "#198038" : "#da1e28",
                    }}
                  >
                    {m.trend}
                  </span>
                </div>
              </ClickableTile>
            </Column>
          ))}

          {/* Section title: Services */}
          <Column lg={16} md={8} sm={4}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#161616",
                margin: "16px 0 16px",
              }}
            >
              Service Health
            </h2>
          </Column>

          {/* Data table */}
          <Column lg={16} md={8} sm={4}>
            <Tile style={{ padding: 0, marginBottom: 24, overflow: "hidden" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#e0e0e0",
                      textAlign: "left",
                    }}
                  >
                    <th style={thStyle}>Service</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Region</th>
                    <th style={thStyle}>CPU</th>
                    <th style={thStyle}>Memory</th>
                    <th style={thStyle}>Last Incident</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr
                      key={row.id}
                      style={{ borderBottom: "1px solid #e0e0e0" }}
                    >
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 500 }}>{row.service}</span>
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <StatusIcon kind={row.statusKind} />
                          {row.status}
                        </span>
                      </td>
                      <td style={tdStyle}>{row.region}</td>
                      <td style={tdStyle}>{row.cpu}</td>
                      <td style={tdStyle}>{row.memory}</td>
                      <td style={tdStyle}>{row.lastIncident}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tile>
          </Column>
        </Grid>
      </div>

      {/* ---------- Floating chat bubble ---------- */}
      {!chatOpen && (
        <button
          data-testid="chat-bubble"
          onClick={() => setChatOpen(true)}
          aria-label="Open chat"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 150,
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "none",
            background: "#0f62fe",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,.2)",
          }}
        >
          <Chat size={24} />
        </button>
      )}

      {/* ---------- Chat window ---------- */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 400,
            height: 520,
            zIndex: 150,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#fff",
            border: "1px solid #e0e0e0",
            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #e0e0e0",
              background: "#161616",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14 }}>Chat</span>
            <button
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Close size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatScrollRef}
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
                        <ReasoningInfo.Root>
                          <Tile
                            style={{
                              borderLeft: "3px solid #f1c21b",
                              backgroundColor: "#fff1d6",
                            }}
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
                                    fontSize: 12,
                                    color: "#161616",
                                  }}
                                >
                                  <ReasoningInfo.StatusText
                                    render={(_props, state) =>
                                      state.isLoading ? (
                                        <InlineLoading />
                                      ) : (
                                        <span>💡</span>
                                      )
                                    }
                                  />
                                  <ReasoningInfo.StatusText />
                                </button>
                              )}
                            />
                            <ReasoningInfo.Content
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                color: "#525252",
                                lineHeight: 1.5,
                              }}
                            >
                              <ReasoningInfo.Steps />
                            </ReasoningInfo.Content>
                          </Tile>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <Tile
                            style={{
                              borderLeft: "3px solid #0f62fe",
                            }}
                          >
                            <ToolcallInfo.Trigger
                              render={(props, { state }) => (
                                <CollapsibleTrigger state={state} {...props}>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 6,
                                    }}
                                  >
                                    <ToolcallInfo.StatusIcon
                                      render={(_p, s) => {
                                        switch (s.status) {
                                          case "loading":
                                            return <InlineLoading />;
                                          case "success":
                                            return <Checkmark size={16} />;
                                          case "error":
                                            return <Warning size={16} />;
                                        }
                                      }}
                                    />
                                    <ToolcallInfo.ToolName />
                                  </span>
                                </CollapsibleTrigger>
                              )}
                            />
                            <ToolcallInfo.Content
                              style={{ marginTop: 8 }}
                            >
                              <Stack gap={3}>
                                <ToolcallInfo.Parameters
                                  render={<CodeBlock title="Parameters" />}
                                />
                                <ToolcallInfo.Result
                                  render={<CodeBlock title="Result" />}
                                />
                              </Stack>
                            </ToolcallInfo.Content>
                          </Tile>
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
                          render={<InlineLoading description="Thinking..." />}
                        />
                      </Message.Root>
                    ))}
                  </>
                )}
              />
            </ThreadContent.Root>
          </div>

          {/* Input area */}
          <div
            style={{
              borderTop: "1px solid #e0e0e0",
              padding: 8,
              flexShrink: 0,
            }}
          >
            <MessageInput.Root>
              <MessageInput.StagedImages />
              <MessageInput.Error
                render={(props) => (
                  <div {...props}>
                    <InlineNotification
                      kind="error"
                      title="Error"
                      subtitle={props.children as string}
                      lowContrast
                      hideCloseButton
                    />
                  </div>
                )}
              />
              <MessageInput.Content
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-end",
                }}
              >
                <div style={{ flex: 1 }}>
                  <MessageInput.Textarea
                    placeholder="Type a message..."
                    render={
                      <TextArea
                        labelText=""
                        hideLabel
                        rows={2}
                      />
                    }
                  />
                </div>
                <MessageInput.FileButton
                  render={
                    <Button
                      kind="ghost"
                      size="md"
                      renderIcon={Attachment}
                      hasIconOnly
                      iconDescription="Attach file"
                    />
                  }
                />
                <MessageInput.SubmitButton
                  render={
                    <Button
                      kind="primary"
                      size="md"
                      renderIcon={Send}
                      hasIconOnly
                      iconDescription="Send"
                    />
                  }
                />
                <MessageInput.StopButton
                  render={
                    <Button
                      kind="danger"
                      size="md"
                      renderIcon={StopFilled}
                      hasIconOnly
                      iconDescription="Stop"
                    />
                  }
                />
              </MessageInput.Content>
            </MessageInput.Root>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Table styles                                                       */
/* ------------------------------------------------------------------ */

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "#161616",
  textTransform: "uppercase",
  letterSpacing: "0.32px",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
  color: "#161616",
};

/* ------------------------------------------------------------------ */
/*  Helper: Status icon for table                                      */
/* ------------------------------------------------------------------ */

function StatusIcon({ kind }: { kind: "success" | "warning" | "error" }) {
  switch (kind) {
    case "success":
      return <CheckmarkOutline size={16} style={{ color: "#198038" }} />;
    case "warning":
      return <WarningAlt size={16} style={{ color: "#f1c21b" }} />;
    case "error":
      return <ErrorOutline size={16} style={{ color: "#da1e28" }} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Helper components (kept from original)                             */
/* ------------------------------------------------------------------ */

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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: 12,
        color: "#525252",
      }}
      {...props}
    >
      {children}
      <span
        style={{
          display: "inline-flex",
          transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      >
        <ChevronDown size={16} />
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
      style={{
        padding: "8px 16px",
        backgroundColor: role === "user" ? "#0f62fe" : "#f4f4f4",
        color: role === "user" ? "#fff" : "#161616",
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
    <Tile style={{ padding: 8 }}>
      {title && (
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#525252",
            marginBottom: 4,
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "IBM Plex Mono, ui-monospace, monospace",
          fontSize: 10,
          lineHeight: 1.5,
          color: "#161616",
        }}
      >
        {children}
      </pre>
    </Tile>
  );
}
