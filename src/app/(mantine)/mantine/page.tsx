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
  Textarea,
  Card,
  Loader,
  Alert,
  Text,
  Title,
  NavLink,
  Stack,
  Group,
  Paper,
  Code,
  ActionIcon,
  Badge,
  Progress,
  Avatar,
  SimpleGrid,
  ThemeIcon,
} from "@mantine/core";

/* ------------------------------------------------------------------ */
/*  Dashboard data                                                     */
/* ------------------------------------------------------------------ */

const projects = [
  {
    name: "Website Redesign",
    status: "In Progress",
    statusColor: "blue",
    progress: 68,
    tasks: "17 / 25",
    due: "Mar 22",
    members: ["AK", "SL", "JW"],
  },
  {
    name: "Mobile App v2",
    status: "Review",
    statusColor: "yellow",
    progress: 85,
    tasks: "34 / 40",
    due: "Mar 15",
    members: ["RD", "TP"],
  },
  {
    name: "API Migration",
    status: "On Track",
    statusColor: "green",
    progress: 42,
    tasks: "8 / 19",
    due: "Apr 10",
    members: ["MN", "AK", "RD", "JW"],
  },
  {
    name: "Design System",
    status: "At Risk",
    statusColor: "red",
    progress: 25,
    tasks: "5 / 20",
    due: "Apr 30",
    members: ["SL", "TP"],
  },
];

const teamMembers = [
  { initials: "AK", name: "Alice Kim", role: "Lead Engineer", color: "blue" },
  { initials: "SL", name: "Sam Lee", role: "Designer", color: "grape" },
  { initials: "JW", name: "Jamie Wu", role: "Frontend Dev", color: "teal" },
  { initials: "RD", name: "Raj Desai", role: "Backend Dev", color: "orange" },
  { initials: "TP", name: "Tara Park", role: "PM", color: "pink" },
];

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function MantineDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();
  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const threadsRef = useRef<HTMLDivElement>(null);
  const { ref: chatScrollRef } = useScrollToBottom();

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
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* ---------- Header ---------- */}
      <Paper
        shadow="xs"
        p="sm"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#fff",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <Group justify="space-between">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
              <Text size="sm" fw={700}>T</Text>
            </ThemeIcon>
            <Title order={3}>Tambo Projects</Title>
          </Group>
          <Button
            variant="light"
            size="sm"
            onClick={() => setThreadsOpen((o) => !o)}
          >
            Threads
          </Button>
        </Group>
      </Paper>

      {/* ---------- Threads overlay ---------- */}
      {threadsOpen && (
        <div
          ref={threadsRef}
          style={{
            position: "fixed",
            top: 60,
            right: 16,
            width: 300,
            maxHeight: "70vh",
            zIndex: 200,
            overflow: "auto",
          }}
        >
          <Paper shadow="md" radius="md" p="md" withBorder>
            <Text fw={600} size="lg" mb="sm">
              Threads
            </Text>
            <ThreadHistory.Root>
              <ThreadHistory.NewThreadButton
                render={<Button size="xs" variant="light" mb="sm" fullWidth />}
              >
                + New thread
              </ThreadHistory.NewThreadButton>
              <ThreadHistory.List
                render={(_props, state) => (
                  <Stack gap={0}>
                    {state.filteredThreads.map((thread) => (
                      <ThreadHistory.Item
                        key={thread.id}
                        thread={thread}
                        render={({ children, ...props }, { isActive }) => (
                          <NavLink
                            active={isActive}
                            label={children}
                            onClick={props.onClick}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      />
                    ))}
                  </Stack>
                )}
              />
            </ThreadHistory.Root>
          </Paper>
        </div>
      )}

      {/* ---------- Dashboard content ---------- */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {/* Project cards */}
        <Title order={4} mb="md">
          Projects
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
          {projects.map((p) => (
            <Card key={p.name} shadow="sm" radius="md" withBorder padding="lg">
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{p.name}</Text>
                <Badge color={p.statusColor} variant="light">
                  {p.status}
                </Badge>
              </Group>
              <Progress value={p.progress} size="sm" radius="xl" mb="sm" color={p.statusColor} />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Tasks: {p.tasks}
                </Text>
                <Text size="sm" c="dimmed">
                  Due: {p.due}
                </Text>
              </Group>
              <Group gap={4} mt="sm">
                {p.members.map((m) => (
                  <Avatar key={m} size="sm" radius="xl" color="blue">
                    {m}
                  </Avatar>
                ))}
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {/* Team members */}
        <Title order={4} mb="md">
          Team
        </Title>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md">
          {teamMembers.map((m) => (
            <Card key={m.initials} shadow="sm" radius="md" withBorder padding="md" style={{ textAlign: "center" }}>
              <Avatar size="lg" radius="xl" mx="auto" mb="xs" color={m.color}>
                {m.initials}
              </Avatar>
              <Text fw={500} size="sm">
                {m.name}
              </Text>
              <Text size="xs" c="dimmed">
                {m.role}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </div>

      {/* ---------- Floating chat bubble ---------- */}
      {!chatOpen && (
        <ActionIcon
          data-testid="chat-bubble"
          size={56}
          radius="xl"
          variant="filled"
          color="blue"
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 150,
            boxShadow: "0 4px 12px rgba(0,0,0,.15)",
          }}
          aria-label="Open chat"
        >
          <Text size="xl">💬</Text>
        </ActionIcon>
      )}

      {/* ---------- Chat window ---------- */}
      {chatOpen && (
        <Paper
          shadow="xl"
          radius="md"
          withBorder
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 440,
            height: 580,
            zIndex: 150,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Chat header */}
          <Group
            justify="space-between"
            p="sm"
            style={{ borderBottom: "1px solid #dee2e6", flexShrink: 0 }}
          >
            <Text fw={600}>Chat</Text>
            <ActionIcon variant="subtle" onClick={() => setChatOpen(false)} aria-label="Close chat">
              ✕
            </ActionIcon>
          </Group>

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
                        <ReasoningInfo.Root
                          render={
                            <Paper
                              withBorder
                              p="xs"
                              radius="sm"
                              style={{ marginBottom: 4 }}
                            />
                          }
                        >
                          <ReasoningInfo.Trigger
                            render={
                              <Group gap="xs" style={{ cursor: "pointer" }} />
                            }
                          >
                            <ReasoningInfo.StatusText
                              render={(_props, state) =>
                                state.isLoading ? (
                                  <Loader size="xs" />
                                ) : (
                                  <Text size="sm" c="dimmed">
                                    💡
                                  </Text>
                                )
                              }
                            />
                            <ReasoningInfo.StatusText
                              render={(props) => (
                                <Text size="sm" c="dimmed" {...props} />
                              )}
                            />
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root
                          render={
                            <Paper
                              withBorder
                              p="xs"
                              radius="sm"
                              style={{ marginBottom: 4 }}
                            />
                          }
                        >
                          <Group gap="xs">
                            <ToolcallInfo.StatusIcon
                              render={(_props, state) => {
                                switch (state.status) {
                                  case "loading":
                                    return <Loader size="xs" />;
                                  case "success":
                                    return (
                                      <Text size="sm" c="green">
                                        ✓
                                      </Text>
                                    );
                                  case "error":
                                    return (
                                      <Text size="sm" c="red">
                                        ✗
                                      </Text>
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
                          </Group>
                          <ToolcallInfo.Content
                            render={<Stack gap="xs" mt="xs" />}
                          >
                            <ToolcallInfo.Parameters
                              render={<CodeBlock title="Parameters" />}
                            />
                            <ToolcallInfo.Result
                              render={<CodeBlock title="Result" />}
                            />
                          </ToolcallInfo.Content>
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
                          render={<Loader size="sm" />}
                        />
                      </Message.Root>
                    ))}
                  </>
                )}
              />
            </ThreadContent.Root>
          </div>

          {/* Input area */}
          <div style={{ borderTop: "1px solid #dee2e6", padding: 8, flexShrink: 0 }}>
            <MessageInput.Root>
              <MessageInput.StagedImages />
              <MessageInput.Content render={<Group align="start" gap="sm" />}>
                <div style={{ flex: "1 1 auto" }}>
                  <MessageInput.Error
                    render={(props) => (
                      <Alert color="red" mb="xs" {...props} />
                    )}
                  />
                  <MessageInput.Textarea
                    placeholder="Type a message..."
                    render={<Textarea autosize minRows={2} maxRows={4} />}
                  />
                </div>
                <Group gap="xs">
                  <MessageInput.FileButton
                    render={
                      <ActionIcon variant="default" aria-label="Attach File">
                        📎
                      </ActionIcon>
                    }
                  />
                  <MessageInput.SubmitButton
                    render={
                      <ActionIcon
                        variant="filled"
                        color="blue"
                        type="submit"
                        aria-label="Send"
                      >
                        ➤
                      </ActionIcon>
                    }
                  />
                  <MessageInput.StopButton
                    render={
                      <ActionIcon
                        variant="filled"
                        color="red"
                        aria-label="Stop"
                      >
                        ■
                      </ActionIcon>
                    }
                  />
                </Group>
              </MessageInput.Content>
            </MessageInput.Root>
          </div>
        </Paper>
      )}
    </div>
  );
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
    <Text
      size="sm"
      style={{ cursor: "pointer", userSelect: "none" }}
      {...props}
    >
      {children}
      <span
        style={{
          display: "inline-block",
          marginLeft: 8,
          transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
          transition: "transform 150ms ease",
        }}
      >
        ▼
      </span>
    </Text>
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
        padding: "8px 12px",
        borderRadius: 6,
        backgroundColor: role === "user" ? "#228be6" : "#f8f9fa",
        color: role === "user" ? "#ffffff" : "#1f2328",
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
    <Paper
      withBorder
      radius="sm"
      style={{ overflow: "hidden", fontSize: 10 }}
    >
      {title && (
        <div
          style={{
            padding: "2px 8px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            fontWeight: 600,
            color: "#868e96",
          }}
        >
          {title}
        </div>
      )}
      <Code
        block
        style={{
          margin: 0,
          padding: "8px 12px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          lineHeight: 1.5,
          background: "transparent",
        }}
      >
        {children}
      </Code>
    </Paper>
  );
}
