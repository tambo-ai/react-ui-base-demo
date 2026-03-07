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
  TextField,
  BlockStack,
  InlineStack,
  Box,
  Card,
  Text,
  Spinner,
  Banner,
  Icon,
} from "@shopify/polaris";
import {
  SendIcon,
  AttachmentIcon,
  StopCircleIcon,
  ChevronDownIcon,
  CheckIcon,
  AlertCircleIcon,
  LightbulbIcon,
} from "@shopify/polaris-icons";
import { ChatLayout } from "@/components/chat-layout";
import { PropsWithChildren, useEffect } from "react";

export default function PolarisDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  return (
    <ChatLayout.Root
      style={{ height: "100vh" }}
      colors={{ border: "#e1e3e5" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <InlineStack gap="200" blockAlign="center">
            <Link
              href="/"
              style={{ color: "#008060", textDecoration: "none", fontSize: 13 }}
            >
              ← Home
            </Link>
            <Text as="span" variant="bodySm" tone="subdued">
              / Polaris
            </Text>
          </InlineStack>
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
                        <ReasoningInfo.Root>
                          <Card>
                            <BlockStack gap="200">
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
                                      color: "#8a6b0f",
                                    }}
                                  >
                                    <ReasoningInfo.StatusText
                                      render={(_props, state) =>
                                        state.isLoading ? (
                                          <Spinner size="small" />
                                        ) : (
                                          <Icon source={LightbulbIcon} />
                                        )
                                      }
                                    />
                                    <ReasoningInfo.StatusText />
                                  </button>
                                )}
                              />
                              <ReasoningInfo.Content>
                                <Box
                                  paddingBlockStart="200"
                                  color="text-secondary"
                                >
                                  <ReasoningInfo.Steps />
                                </Box>
                              </ReasoningInfo.Content>
                            </BlockStack>
                          </Card>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <Card>
                            <BlockStack gap="200">
                              <ToolcallInfo.Trigger
                                render={(props, { state }) => (
                                  <CollapsibleTrigger
                                    state={state}
                                    {...props}
                                  >
                                    <InlineStack gap="200" blockAlign="center">
                                      <ToolcallInfo.StatusIcon
                                        render={(_p, s) => {
                                          switch (s.status) {
                                            case "loading":
                                              return <Spinner size="small" />;
                                            case "success":
                                              return (
                                                <Icon source={CheckIcon} />
                                              );
                                            case "error":
                                              return (
                                                <Icon
                                                  source={AlertCircleIcon}
                                                />
                                              );
                                          }
                                        }}
                                      />
                                      <ToolcallInfo.ToolName />
                                    </InlineStack>
                                  </CollapsibleTrigger>
                                )}
                              />
                              <ToolcallInfo.Content>
                                <BlockStack gap="200">
                                  <ToolcallInfo.Parameters
                                    render={<CodeBlock title="Parameters" />}
                                  />
                                  <ToolcallInfo.Result
                                    render={<CodeBlock title="Result" />}
                                  />
                                </BlockStack>
                              </ToolcallInfo.Content>
                            </BlockStack>
                          </Card>
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
                          render={<Spinner size="small" />}
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
            <MessageInput.Error
              render={(props) => (
                <div {...props}>
                  <Banner tone="critical">{props.children}</Banner>
                </div>
              )}
            />
            <MessageInput.Content
              render={
                <InlineStack gap="200" blockAlign="end" wrap={false} />
              }
            >
              <div style={{ flex: "1 1 auto" }}>
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={
                    <TextField
                      label=""
                      labelHidden
                      multiline={2}
                      autoComplete="off"
                    />
                  }
                />
              </div>
              <InlineStack gap="100" blockAlign="center">
                <MessageInput.FileButton
                  render={
                    <Button icon={AttachmentIcon} accessibilityLabel="Attach" />
                  }
                />
                <MessageInput.SubmitButton
                  render={
                    <Button
                      variant="primary"
                      icon={SendIcon}
                      accessibilityLabel="Send"
                    />
                  }
                />
                <MessageInput.StopButton
                  render={
                    <Button
                      tone="critical"
                      icon={StopCircleIcon}
                      accessibilityLabel="Stop"
                    />
                  }
                />
              </InlineStack>
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar divider>
        <Box padding="400">
          <BlockStack gap="300">
            <Text as="h2" variant="headingSm">
              Threads
            </Text>
            <ThreadHistory.Root>
              <ThreadHistory.NewThreadButton
                render={<Button variant="primary" fullWidth />}
              >
                + New thread
              </ThreadHistory.NewThreadButton>
            </ThreadHistory.Root>
          </BlockStack>
        </Box>
        <Box padding="200" overflowY="scroll">
          <ThreadHistory.Root>
            <ThreadHistory.List
              render={(_props, state) => (
                <BlockStack gap="100">
                  {state.filteredThreads.map((thread) => (
                    <ThreadHistory.Item
                      key={thread.id}
                      thread={thread}
                      render={({ children, ...props }, { isActive }) => (
                        <Button
                          {...(props as any)}
                          fullWidth
                          textAlign="start"
                          variant={isActive ? "primary" : "tertiary"}
                        >
                          {children}
                        </Button>
                      )}
                    />
                  ))}
                </BlockStack>
              )}
            />
          </ThreadHistory.Root>
        </Box>
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
        color: "#6d7175",
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
        <Icon source={ChevronDownIcon} />
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
    <Box
      padding="300"
      borderRadius="200"
      background={role === "user" ? "bg-fill-success" : "bg-surface-secondary"}
      color={role === "user" ? "text-inverse" : "text"}
      {...(props as any)}
    >
      <Text as="p" variant="bodyMd">
        {children}
      </Text>
    </Box>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <Card>
      {title && (
        <Box paddingBlockEnd="100">
          <Text as="span" variant="bodySm" fontWeight="semibold" tone="subdued">
            {title}
          </Text>
        </Box>
      )}
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace",
          fontSize: 10,
          lineHeight: 1.5,
        }}
      >
        {children}
      </pre>
    </Card>
  );
}
