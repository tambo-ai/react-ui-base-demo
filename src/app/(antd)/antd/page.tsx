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
  Input,
  Card,
  Spin,
  Alert,
  Typography,
  Menu,
  Space,
  Flex,
} from "antd";
import {
  SendOutlined,
  PaperClipOutlined,
  StopOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { ChatLayout } from "@/components/chat-layout";
import { PropsWithChildren, useEffect } from "react";

export default function AntdDemo() {
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
      colors={{ border: "#f0f0f0" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <Space>
            <Link href="/">
              <Typography.Link>&larr; Home</Typography.Link>
            </Link>
            <span>/</span>
            <Typography.Text>Ant Design</Typography.Text>
          </Space>
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
                          <ReasoningInfo.Trigger
                            render={(props) => (
                              <Card
                                size="small"
                                style={{ marginBottom: 4 }}
                                {...props}
                              >
                                <Flex align="center" gap={8}>
                                  <ReasoningInfo.StatusText
                                    render={(_props, state) =>
                                      state.isLoading ? (
                                        <Spin size="small" />
                                      ) : (
                                        <BulbOutlined />
                                      )
                                    }
                                  />
                                  <ReasoningInfo.StatusText />
                                </Flex>
                              </Card>
                            )}
                          />
                          <ReasoningInfo.Content>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>
                        <ToolcallInfo.Root>
                          <Card size="small" style={{ marginBottom: 4 }}>
                            <Flex align="center" gap={8}>
                              <ToolcallInfo.StatusIcon
                                render={(_props, state) => {
                                  switch (state.status) {
                                    case "loading":
                                      return <Spin size="small" />;
                                    case "success":
                                      return (
                                        <CheckCircleOutlined
                                          style={{ color: "#52c41a" }}
                                        />
                                      );
                                    case "error":
                                      return (
                                        <ExclamationCircleOutlined
                                          style={{ color: "#ff4d4f" }}
                                        />
                                      );
                                  }
                                }}
                              />
                              <ToolcallInfo.Trigger
                                render={(props, { state }) => (
                                  <Flex align="center" gap={8} {...props}>
                                    <ToolcallInfo.ToolName />
                                    <CollapsibleTrigger state={state as "open" | "closed"} />
                                  </Flex>
                                )}
                              />
                            </Flex>
                            <ToolcallInfo.Content>
                              <Space
                                direction="vertical"
                                style={{ width: "100%", marginTop: 8 }}
                              >
                                <ToolcallInfo.Parameters
                                  render={<CodeBlock title="Parameters" />}
                                />
                                <ToolcallInfo.Result
                                  render={<CodeBlock title="Result" />}
                                />
                              </Space>
                            </ToolcallInfo.Content>
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
                          render={<Spin size="small" />}
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
            <MessageInput.Content render={<Flex gap={8} align="start" />}>
              <Flex vertical style={{ flex: "1 1 auto" }}>
                <MessageInput.Error
                  render={(props) => (
                    <Alert
                      type="error"
                      showIcon
                      style={{ marginBottom: 8 }}
                      message={props.children}
                    />
                  )}
                />
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={<Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />}
                />
              </Flex>
              <Space>
                <MessageInput.FileButton
                  render={
                    <Button icon={<PaperClipOutlined />} aria-label="Attach File" />
                  }
                />
                <MessageInput.SubmitButton
                  render={
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      aria-label="Send"
                    />
                  }
                />
                <MessageInput.StopButton
                  render={
                    <Button
                      danger
                      icon={<StopOutlined />}
                      aria-label="Stop"
                    />
                  }
                />
              </Space>
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar divider>
        <ThreadHistory.Root>
          <Typography.Title level={5} style={{ margin: "0 0 8px" }}>
            Threads
          </Typography.Title>
          <ThreadHistory.NewThreadButton
            render={<Button size="small" block />}
          >
            + New thread
          </ThreadHistory.NewThreadButton>
          <ThreadHistory.List
            render={(props, state) => (
              <Menu
                mode="inline"
                selectedKeys={
                  state.filteredThreads
                    .filter((t) => t.id === currentThreadId)
                    .map((t) => t.id)
                }
                style={{ border: "none", marginTop: 8 }}
                items={state.filteredThreads.map((thread) => ({
                  key: thread.id,
                  label: (
                    <ThreadHistory.Item
                      thread={thread}
                      render={(props) => <span {...props} />}
                    />
                  ),
                }))}
              />
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
    <span {...props} style={{ cursor: "pointer" }}>
      {children}
      <DownOutlined
        style={{
          fontSize: 10,
          marginLeft: 4,
          transform: state === "open" ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      />
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
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        backgroundColor: role === "user" ? "#1677ff" : "#f5f5f5",
        color: role === "user" ? "#ffffff" : "rgba(0, 0, 0, 0.88)",
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
    <div
      style={{
        borderRadius: 6,
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        fontSize: 10,
      }}
    >
      {title && (
        <div
          style={{
            padding: "2px 8px",
            backgroundColor: "#fafafa",
            borderBottom: "1px solid #f0f0f0",
            fontWeight: 600,
            color: "rgba(0, 0, 0, 0.45)",
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: "8px 12px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace",
          color: "rgba(0, 0, 0, 0.88)",
          lineHeight: 1.5,
        }}
      >
        {children}
      </pre>
    </div>
  );
}
