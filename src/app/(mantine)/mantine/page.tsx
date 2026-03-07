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
import {
  Button,
  Textarea,
  Card,
  Loader,
  Alert,
  Text,
  NavLink,
  Stack,
  Group,
  Paper,
  Anchor,
  Breadcrumbs,
  Code,
  ActionIcon,
  Collapse,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChatLayout } from "@/components/chat-layout";
import { PropsWithChildren, useEffect } from "react";

export default function MantineDemo() {
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
      colors={{ border: "#dee2e6" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <Breadcrumbs>
            <Anchor component={Link} href="/">
              Home
            </Anchor>
            <Anchor component={Link} href="#" aria-current="page">
              Mantine
            </Anchor>
          </Breadcrumbs>
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
          </ChatLayout.Container>
        </ChatLayout.MessageArea>
      </ChatLayout.Content>
      <ChatLayout.InputArea padding="normal">
        <ChatLayout.Container size="medium">
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
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar divider>
        <ThreadHistory.Root>
          <Text fw={600} size="lg" mb="sm">
            Threads
          </Text>
          <ThreadHistory.NewThreadButton
            render={<Button size="xs" variant="light" mb="sm" />}
          >
            + New thread
          </ThreadHistory.NewThreadButton>
          <ThreadHistory.List
            render={(props, state) => (
              <Stack gap={0} {...props}>
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
