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
  Page,
  InlineGrid,
  Divider,
  Badge,
} from "@shopify/polaris";
import {
  SendIcon,
  AttachmentIcon,
  StopCircleIcon,
  ChevronDownIcon,
  CheckIcon,
  AlertCircleIcon,
  LightbulbIcon,
  OrderIcon,
  ProductIcon,
  PersonIcon,
  ChatIcon,
  MenuIcon,
  XIcon,
  CashDollarIcon,
  StoreIcon,
} from "@shopify/polaris-icons";
import { useScrollToBottom } from "@/components/chat-layout";
import { useState, useEffect, useRef, PropsWithChildren } from "react";

// Mock dashboard data
const summaryCards = [
  { title: "Total Orders", value: "1,245", change: "+12%", icon: OrderIcon },
  { title: "Revenue", value: "$48,290", change: "+8.3%", icon: CashDollarIcon },
  { title: "Customers", value: "3,891", change: "+5.1%", icon: PersonIcon },
  { title: "Products", value: "264", change: "+2", icon: ProductIcon },
];

const recentOrders = [
  { id: "#1042", customer: "Alice Johnson", total: "$124.00", status: "Fulfilled", date: "Mar 7, 2026" },
  { id: "#1041", customer: "Bob Smith", total: "$89.50", status: "Pending", date: "Mar 7, 2026" },
  { id: "#1040", customer: "Carol White", total: "$215.00", status: "Fulfilled", date: "Mar 6, 2026" },
  { id: "#1039", customer: "Dan Brown", total: "$67.25", status: "Unfulfilled", date: "Mar 6, 2026" },
  { id: "#1038", customer: "Eve Davis", total: "$342.00", status: "Fulfilled", date: "Mar 5, 2026" },
];

function getStatusTone(status: string): "success" | "attention" | "warning" | "info" | undefined {
  switch (status) {
    case "Fulfilled":
      return "success";
    case "Pending":
      return "attention";
    case "Unfulfilled":
      return "warning";
    default:
      return "info";
  }
}

export default function PolarisDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();
  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const threadsRef = useRef<HTMLDivElement>(null);
  const { ref: chatScrollRef, scrollToBottom } = useScrollToBottom();

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  // Click-outside-to-close for threads overlay
  useEffect(() => {
    if (!threadsOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (threadsRef.current && !threadsRef.current.contains(e.target as Node)) {
        setThreadsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [threadsOpen]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [chatOpen, scrollToBottom]);

  return (
    <div style={{ minHeight: "100vh", background: "#f6f6f7", position: "relative" }}>
      {/* Top bar */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <InlineStack gap="300" blockAlign="center">
          <Icon source={StoreIcon} tone="base" />
          <Text as="span" variant="headingSm" tone="text-inverse">
            My Shopify Store
          </Text>
          <Link
            href="/"
            style={{ color: "#8c9196", textDecoration: "none", fontSize: 13, marginLeft: 8 }}
          >
            &larr; Home
          </Link>
        </InlineStack>
        <div style={{ position: "relative" }}>
          <Button
            icon={MenuIcon}
            onClick={() => setThreadsOpen((prev) => !prev)}
            accessibilityLabel="Threads"
            variant="tertiary"
            tone="critical"
          >
            Threads
          </Button>
        </div>
      </div>

      {/* Threads overlay */}
      {threadsOpen && (
        <div
          ref={threadsRef}
          style={{
            position: "absolute",
            top: 56,
            right: 24,
            width: 320,
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingSm">
                  Threads
                </Text>
                <Button
                  icon={XIcon}
                  variant="tertiary"
                  onClick={() => setThreadsOpen(false)}
                  accessibilityLabel="Close threads"
                />
              </InlineStack>
              <ThreadHistory.Root>
                <ThreadHistory.NewThreadButton
                  render={<Button variant="primary" fullWidth />}
                >
                  + New thread
                </ThreadHistory.NewThreadButton>
              </ThreadHistory.Root>
              <Divider />
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
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
              </div>
            </BlockStack>
          </Card>
        </div>
      )}

      {/* Main dashboard content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 100px" }}>
        <Page title="Store Dashboard">
          <BlockStack gap="600">
            {/* Welcome banner */}
            <Banner tone="info" title="Welcome back!">
              <p>Here is a summary of your store performance. Use the chat assistant for help.</p>
            </Banner>

            {/* Summary cards */}
            <InlineGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap="400">
              {summaryCards.map((card) => (
                <Card key={card.title}>
                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="span" variant="bodySm" tone="subdued">
                        {card.title}
                      </Text>
                      <Icon source={card.icon} tone="base" />
                    </InlineStack>
                    <Text as="p" variant="headingLg">
                      {card.value}
                    </Text>
                    <Badge tone="success">{card.change}</Badge>
                  </BlockStack>
                </Card>
              ))}
            </InlineGrid>

            <Divider />

            {/* Recent orders */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Recent Orders
                </Text>
                <Divider />
                {/* Table header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 100px 120px 110px",
                    gap: 8,
                    padding: "0 4px",
                  }}
                >
                  <Text as="span" variant="bodySm" fontWeight="semibold" tone="subdued">
                    Order
                  </Text>
                  <Text as="span" variant="bodySm" fontWeight="semibold" tone="subdued">
                    Customer
                  </Text>
                  <Text as="span" variant="bodySm" fontWeight="semibold" tone="subdued">
                    Total
                  </Text>
                  <Text as="span" variant="bodySm" fontWeight="semibold" tone="subdued">
                    Status
                  </Text>
                  <Text as="span" variant="bodySm" fontWeight="semibold" tone="subdued">
                    Date
                  </Text>
                </div>
                {recentOrders.map((order) => (
                  <div key={order.id}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "80px 1fr 100px 120px 110px",
                        gap: 8,
                        padding: "8px 4px",
                        alignItems: "center",
                      }}
                    >
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        {order.id}
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {order.customer}
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {order.total}
                      </Text>
                      <Badge tone={getStatusTone(order.status)}>{order.status}</Badge>
                      <Text as="span" variant="bodySm" tone="subdued">
                        {order.date}
                      </Text>
                    </div>
                    <Divider />
                  </div>
                ))}
              </BlockStack>
            </Card>
          </BlockStack>
        </Page>
      </div>

      {/* Floating chat bubble */}
      {!chatOpen && (
        <div data-testid="chat-bubble" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 900 }}>
          <Button
            variant="primary"
            icon={ChatIcon}
            size="large"
            onClick={() => setChatOpen(true)}
            accessibilityLabel="Open chat"
          >
            Chat
          </Button>
        </div>
      )}

      {/* Chat window */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 420,
            height: 560,
            zIndex: 900,
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              background: "#f6f6f7",
              padding: "12px 16px",
              borderBottom: "1px solid #e1e3e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <InlineStack gap="200" blockAlign="center">
              <Icon source={ChatIcon} tone="base" />
              <Text as="span" variant="headingSm">
                Assistant
              </Text>
            </InlineStack>
            <Button
              icon={XIcon}
              variant="tertiary"
              onClick={() => setChatOpen(false)}
              accessibilityLabel="Close chat"
            />
          </div>

          {/* Chat messages area */}
          <div
            ref={chatScrollRef}
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              padding: 16,
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
          </div>

          {/* Chat input area */}
          <div
            style={{
              borderTop: "1px solid #e1e3e5",
              padding: 12,
              background: "#fff",
              flexShrink: 0,
            }}
          >
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
                      <textarea
                        rows={2}
                        style={{
                          width: "100%",
                          resize: "none",
                          border: "1px solid var(--p-color-border)",
                          borderRadius: "var(--p-border-radius-200)",
                          padding:
                            "var(--p-space-200) var(--p-space-300)",
                          fontSize: "var(--p-font-size-325)",
                          lineHeight: "var(--p-font-line-height-500)",
                          fontFamily: "var(--p-font-family-sans)",
                          color: "var(--p-color-text)",
                          background: "var(--p-color-bg-surface)",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
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
          </div>
        </div>
      )}
    </div>
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
