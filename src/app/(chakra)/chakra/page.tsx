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
  Spinner,
  Text,
  Stack,
  HStack,
  VStack,
  Box,
  Heading,
  Flex,
  Code,
  IconButton,
  Collapsible,
  Badge,
  Progress,
} from "@chakra-ui/react";
import { useScrollToBottom } from "@/components/chat-layout";
import { PropsWithChildren, useState, useEffect, useRef } from "react";

// ---------- stat data ----------
const stats = [
  { label: "Visitors", value: "24,512", change: "+12.3%", positive: true },
  { label: "Conversions", value: "1,284", change: "+8.1%", positive: true },
  { label: "Revenue", value: "$48,290", change: "+23.6%", positive: true },
  { label: "Bounce Rate", value: "32.1%", change: "-4.2%", positive: false },
];

const recentActivity = [
  { id: 1, text: "New signup from jane@example.com", time: "2 min ago", type: "signup" },
  { id: 2, text: "Payment of $299 received", time: "8 min ago", type: "payment" },
  { id: 3, text: "Campaign 'Spring Launch' went live", time: "23 min ago", type: "campaign" },
  { id: 4, text: "Conversion goal reached: 1,000 signups", time: "1 hr ago", type: "milestone" },
  { id: 5, text: "Server response time improved by 18%", time: "2 hr ago", type: "performance" },
];

const channelProgress = [
  { label: "Organic Search", value: 72 },
  { label: "Direct", value: 54 },
  { label: "Social Media", value: 38 },
  { label: "Email", value: 61 },
  { label: "Referral", value: 29 },
];

// ---------- main component ----------
export default function ChakraDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);

  const threadsRef = useRef<HTMLDivElement>(null);
  const { ref: scrollRef, scrollToBottom } = useScrollToBottom(500);

  // auto-switch to most recent thread on load
  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  // click-outside to close threads overlay
  useEffect(() => {
    if (!threadsOpen) return;
    function handleClick(e: MouseEvent) {
      if (threadsRef.current && !threadsRef.current.contains(e.target as Node)) {
        setThreadsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [threadsOpen]);

  // scroll to bottom when chat opens
  useEffect(() => {
    if (chatOpen) scrollToBottom();
  }, [chatOpen, scrollToBottom]);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* ===== TOP HEADER ===== */}
      <Flex
        as="header"
        position="sticky"
        top={0}
        zIndex={20}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={6}
        py={3}
        align="center"
        justify="space-between"
      >
        <HStack gap={3}>
          <Link href="/" style={{ color: "#3182CE", textDecoration: "none", fontSize: 14 }}>
            &larr; Home
          </Link>
          <Heading size="md" fontWeight="bold">
            Tambo Analytics
          </Heading>
        </HStack>
        <HStack gap={2}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setThreadsOpen((v) => !v)}
          >
            Threads
          </Button>
        </HStack>
      </Flex>

      {/* ===== THREADS OVERLAY ===== */}
      {threadsOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={30}
          bg="blackAlpha.400"
        >
          <Box
            ref={threadsRef}
            position="absolute"
            top="56px"
            right="16px"
            w="320px"
            maxH="70vh"
            bg="white"
            borderRadius="lg"
            boxShadow="xl"
            overflow="auto"
            p={4}
          >
            <ThreadHistory.Root>
              <Heading size="sm" mb={2}>
                Threads
              </Heading>
              <ThreadHistory.NewThreadButton
                render={<Button size="sm" variant="outline" mb={2} width="100%" />}
              >
                + New thread
              </ThreadHistory.NewThreadButton>
              <ThreadHistory.List
                render={(props, state) => (
                  <VStack align="stretch" gap={1} {...props}>
                    {state.filteredThreads.map((thread) => (
                      <ThreadHistory.Item
                        key={thread.id}
                        thread={thread}
                        render={({ children, ...itemProps }, { isActive }) => (
                          <Button
                            variant={isActive ? "solid" : "ghost"}
                            colorPalette={isActive ? "blue" : undefined}
                            size="sm"
                            justifyContent="flex-start"
                            width="100%"
                            {...itemProps}
                          >
                            {children}
                          </Button>
                        )}
                      />
                    ))}
                  </VStack>
                )}
              />
            </ThreadHistory.Root>
          </Box>
        </Box>
      )}

      {/* ===== DASHBOARD CONTENT ===== */}
      <Box maxW="1100px" mx="auto" px={6} py={6}>
        {/* Stat cards */}
        <Flex gap={4} mb={6} wrap="wrap">
          {stats.map((s) => (
            <Card.Root key={s.label} flex="1" minW="200px">
              <Card.Body>
                <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
                  {s.label}
                </Text>
                <Heading size="lg" mb={1}>
                  {s.value}
                </Heading>
                <Badge
                  colorPalette={s.positive ? "green" : "red"}
                  fontSize="xs"
                >
                  {s.change}
                </Badge>
              </Card.Body>
            </Card.Root>
          ))}
        </Flex>

        {/* Two-column: Recent Activity + Channel Breakdown */}
        <Flex gap={6} direction={{ base: "column", md: "row" }}>
          {/* Recent Activity */}
          <Card.Root flex="1.2">
            <Card.Body>
              <Heading size="sm" mb={4}>
                Recent Activity
              </Heading>
              <VStack align="stretch" gap={0}>
                {recentActivity.map((item, idx) => (
                  <Box key={item.id}>
                    <Flex justify="space-between" align="center" py={2}>
                      <Text fontSize="sm">{item.text}</Text>
                      <Text fontSize="xs" color="gray.400" flexShrink={0} ml={4}>
                        {item.time}
                      </Text>
                    </Flex>
                    {idx < recentActivity.length - 1 && (
                      <Box borderBottom="1px solid" borderColor="gray.100" />
                    )}
                  </Box>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Channel Breakdown */}
          <Card.Root flex="1">
            <Card.Body>
              <Heading size="sm" mb={4}>
                Traffic by Channel
              </Heading>
              <VStack align="stretch" gap={4}>
                {channelProgress.map((ch) => (
                  <Box key={ch.label}>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">{ch.label}</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {ch.value}%
                      </Text>
                    </Flex>
                    <Progress.Root value={ch.value} size="sm" colorPalette="blue">
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Box>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>
        </Flex>
      </Box>

      {/* ===== FLOATING CHAT BUBBLE ===== */}
      {!chatOpen && (
        <IconButton
          aria-label="Open chat"
          colorPalette="blue"
          variant="solid"
          size="lg"
          borderRadius="full"
          position="fixed"
          bottom="24px"
          right="24px"
          zIndex={25}
          boxShadow="lg"
          data-testid="chat-bubble"
          onClick={() => setChatOpen(true)}
        >
          💬
        </IconButton>
      )}

      {/* ===== CHAT WINDOW ===== */}
      {chatOpen && (
        <Card.Root
          position="fixed"
          bottom="24px"
          right="24px"
          w="400px"
          maxH="600px"
          zIndex={25}
          boxShadow="2xl"
          borderRadius="xl"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Chat header */}
          <Flex
            px={4}
            py={2}
            bg="blue.500"
            color="white"
            align="center"
            justify="space-between"
            flexShrink={0}
          >
            <Text fontWeight="bold" fontSize="sm">
              Tambo Chat
            </Text>
            <IconButton
              aria-label="Close chat"
              variant="ghost"
              size="xs"
              color="white"
              onClick={() => setChatOpen(false)}
            >
              ✕
            </IconButton>
          </Flex>

          {/* Messages area */}
          <Box
            ref={scrollRef}
            flex="1"
            overflowY="auto"
            px={4}
            py={3}
            bg="white"
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
                            render={(props) => (
                              <Card.Root
                                size="sm"
                                variant="outline"
                                mb={2}
                                style={{ backgroundColor: '#e8f5e9', opacity: 0.85 }}
                                {...props}
                              >
                                <Card.Body>
                                  <HStack>
                                    <ReasoningInfo.StatusText
                                      render={(_props, state) =>
                                        state.isLoading ? (
                                          <Spinner size="xs" />
                                        ) : (
                                          <Text>💡</Text>
                                        )
                                      }
                                    />
                                    <ReasoningInfo.StatusText />
                                  </HStack>
                                </Card.Body>
                              </Card.Root>
                            )}
                          />
                          <ReasoningInfo.Content
                            render={(props) => (
                              <Box pl={4} mb={2} {...props} />
                            )}
                          >
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <Card.Root size="sm" variant="outline" mb={2} style={{ backgroundColor: '#e8f5e9', opacity: 0.85 }}>
                            <Card.Body>
                              <HStack mb={1}>
                                <ToolcallInfo.StatusIcon
                                  render={(_props, state) => {
                                    switch (state.status) {
                                      case "loading":
                                        return <Spinner size="xs" />;
                                      case "success":
                                        return <Text>✅</Text>;
                                      case "error":
                                        return <Text>❌</Text>;
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
                              </HStack>
                              <ToolcallInfo.Content
                                render={(props) => (
                                  <VStack gap={2} mt={2} align="stretch" {...props} />
                                )}
                              >
                                <ToolcallInfo.Parameters
                                  render={<CodeBlock title="Parameters" />}
                                />
                                <ToolcallInfo.Result
                                  render={<CodeBlock title="Result" />}
                                />
                              </ToolcallInfo.Content>
                            </Card.Body>
                          </Card.Root>
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
                          render={<Spinner size="sm" />}
                        />
                      </Message.Root>
                    ))}
                  </>
                )}
              />
            </ThreadContent.Root>
          </Box>

          {/* Chat input */}
          <Box
            borderTop="1px solid"
            borderColor="gray.200"
            p={3}
            bg="gray.50"
            flexShrink={0}
          >
            <MessageInput.Root>
              <MessageInput.StagedImages />
              <MessageInput.Content
                render={(props) => (
                  <HStack align="start" gap={2} {...props} />
                )}
              >
                <Box flex="1 1 auto">
                  <MessageInput.Error
                    render={(props) => (
                      <Text color="red.500" fontSize="sm" mb={1} {...props} />
                    )}
                  />
                  <MessageInput.Textarea
                    placeholder="Type a message..."
                    render={
                      <Textarea
                        resize="none"
                        rows={2}
                        size="md"
                        width="100%"
                      />
                    }
                  />
                </Box>
                <HStack gap={1}>
                  <MessageInput.FileButton
                    render={
                      <IconButton
                        aria-label="Attach File"
                        variant="ghost"
                        size="sm"
                      >
                        📎
                      </IconButton>
                    }
                  />
                  <MessageInput.SubmitButton
                    render={
                      <IconButton
                        aria-label="Send"
                        colorPalette="blue"
                        variant="solid"
                        size="sm"
                        type="submit"
                      >
                        ➤
                      </IconButton>
                    }
                  />
                  <MessageInput.StopButton
                    render={
                      <IconButton
                        aria-label="Stop"
                        colorPalette="red"
                        variant="solid"
                        size="sm"
                      >
                        ⏹
                      </IconButton>
                    }
                  />
                </HStack>
              </MessageInput.Content>
            </MessageInput.Root>
          </Box>
        </Card.Root>
      )}
    </Box>
  );
}

// ---------- helper components (preserved) ----------

function MessageContent({
  role,
  children,
  ...props
}: PropsWithChildren<{ role: string }>) {
  return (
    <Flex
      mb={3}
      alignSelf={role === "user" ? "flex-end" : "flex-start"}
      maxW="70%"
      direction="column"
      gap={2}
      {...props}
    >
      {children}
    </Flex>
  );
}

function CollapsibleTrigger({
  state,
  children,
  ...props
}: PropsWithChildren<{ state: "open" | "closed" }>) {
  return (
    <Box as="pre" cursor="pointer" fontSize="xs" {...props}>
      {children}
      <Box
        as="span"
        display="inline-block"
        ml={2}
        transition="transform 0.2s"
        transform={state === "open" ? "rotate(-180deg)" : "rotate(0deg)"}
      >
        ▼
      </Box>
    </Box>
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
      p="8px 12px"
      borderRadius="md"
      bg={role === "user" ? "blue.500" : "gray.100"}
      color={role === "user" ? "white" : "gray.800"}
      fontSize="sm"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </Box>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <Box
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      fontSize="xs"
    >
      {title && (
        <Box
          p="2px 8px"
          bg="gray.50"
          borderBottom="1px solid"
          borderColor="gray.200"
          fontWeight="semibold"
          color="gray.500"
        >
          {title}
        </Box>
      )}
      <Code
        display="block"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        p="8px 12px"
        bg="transparent"
        fontSize="xs"
        lineHeight="1.5"
      >
        {children}
      </Code>
    </Box>
  );
}
