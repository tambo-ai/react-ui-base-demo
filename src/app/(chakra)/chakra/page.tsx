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
} from "@chakra-ui/react";
import { ChatLayout } from "@/components/chat-layout";
import { PropsWithChildren, useEffect } from "react";

export default function ChakraDemo() {
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
      colors={{ border: "#E2E8F0" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <Link href="/" style={{ color: "#3182CE", textDecoration: "none" }}>
            &larr; Home
          </Link>
          <span> / </span>
          <Text as="span" fontWeight="semibold">
            Chakra
          </Text>
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
                              <Card.Root
                                size="sm"
                                variant="outline"
                                mb={2}
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
                          <Card.Root size="sm" variant="outline" mb={2}>
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
          </ChatLayout.Container>
        </ChatLayout.MessageArea>
      </ChatLayout.Content>
      <ChatLayout.InputArea padding="normal">
        <ChatLayout.Container size="medium">
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
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar divider>
        <ThreadHistory.Root>
          <Heading size="sm" mb={2}>
            Threads
          </Heading>
          <ThreadHistory.NewThreadButton
            render={<Button size="sm" variant="outline" mb={2} />}
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
                    render={({ children, ...props }, { isActive }) => (
                      <Button
                        variant={isActive ? "solid" : "ghost"}
                        colorPalette={isActive ? "blue" : undefined}
                        size="sm"
                        justifyContent="flex-start"
                        width="100%"
                        {...props}
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
