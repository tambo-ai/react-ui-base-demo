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
import { default as NextLink } from "next/link";
import {
  Button,
  Textarea,
  FormControl,
  Stack,
  Spinner,
  NavList,
  IconButton,
  Link,
  Heading,
  Timeline,
} from "@primer/react";
import "@primer/css/dist/primer.css";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationIcon,
  LightBulbIcon,
  PaperAirplaneIcon,
  PaperclipIcon,
  StopIcon,
} from "@primer/octicons-react";
import { ChatLayout } from "@/components/chat-layout";
import { PropsWithChildren, useEffect } from "react";

export default function PrimerDemo() {
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
      colors={{ border: "var(--borderColor-muted)" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <Link as={NextLink} href="/">
            ← Home
          </Link>
          <span> / </span>
          <Link as={NextLink} href="#" aria-current="page">
            Primer
          </Link>
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
                        <ReasoningInfo.Root render={<Timeline clipSidebar />}>
                          <ReasoningInfo.Trigger render={<Timeline.Item />}>
                            <Timeline.Badge>
                              <ReasoningInfo.StatusText
                                render={(_props, state) =>
                                  state.isLoading ? (
                                    <Spinner size="small" />
                                  ) : (
                                    <LightBulbIcon size="small" />
                                  )
                                }
                              />
                            </Timeline.Badge>
                            <Timeline.Body>
                              <ReasoningInfo.StatusText />
                            </Timeline.Body>
                          </ReasoningInfo.Trigger>
                          <ReasoningInfo.Content>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>
                        <ToolcallInfo.Root render={<Timeline clipSidebar />}>
                          <Timeline.Item>
                            <Timeline.Badge>
                              <ToolcallInfo.StatusIcon
                                render={(props, state) => {
                                  switch (state.status) {
                                    case "loading":
                                      return <Spinner size="small" />;
                                    case "success":
                                      return <CheckCircleIcon size="small" />;
                                    case "error":
                                      return <ExclamationIcon size="small" />;
                                  }
                                }}
                              />
                            </Timeline.Badge>
                            <Timeline.Body>
                              <ToolcallInfo.Trigger
                                render={(props, { state }) => (
                                  <CollapsibleTrigger state={state} {...props}>
                                    <ToolcallInfo.ToolName />
                                  </CollapsibleTrigger>
                                )}
                              />
                              <ToolcallInfo.Content
                                render={<Stack style={{ marginTop: 8 }} />}
                              >
                                <ToolcallInfo.Parameters
                                  render={<CodeBlock title="Parameters" />}
                                />
                                <ToolcallInfo.Result
                                  render={<CodeBlock title="Result" />}
                                />
                              </ToolcallInfo.Content>
                            </Timeline.Body>
                          </Timeline.Item>
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
            <MessageInput.Content
              render={<Stack direction="horizontal" align="start" />}
            >
              <FormControl style={{ flex: "1 1 auto" }}>
                <FormControl.Label visuallyHidden>Message</FormControl.Label>
                <MessageInput.Error
                  render={<FormControl.Validation variant="error" />}
                />
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={<Textarea resize="none" rows={2} block />}
                />
              </FormControl>
              <Stack direction="horizontal" align="center">
                <MessageInput.FileButton
                  render={
                    <IconButton icon={PaperclipIcon} aria-label="Attach File" />
                  }
                />
                <MessageInput.SubmitButton
                  render={
                    <IconButton
                      icon={PaperAirplaneIcon}
                      variant="primary"
                      type="submit"
                      aria-label="Send"
                    />
                  }
                />
                <MessageInput.StopButton
                  render={
                    <IconButton
                      icon={StopIcon}
                      variant="danger"
                      aria-label="Stop"
                    />
                  }
                />
              </Stack>
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar divider>
        <ThreadHistory.Root>
          <Heading variant="small">Threads</Heading>
          <ThreadHistory.NewThreadButton render={<Button size="small" />}>
            + New thread
          </ThreadHistory.NewThreadButton>
          <ThreadHistory.List
            render={(props, state) => (
              <NavList {...props}>
                {state.filteredThreads.map((thread) => (
                  <ThreadHistory.Item
                    key={thread.id}
                    thread={thread}
                    render={({ children, ...props }, { isActive }) => (
                      <NavList.Item
                        aria-current={isActive ? "page" : undefined}
                        {...props}
                      >
                        {children}
                      </NavList.Item>
                    )}
                  />
                ))}
              </NavList>
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
    <pre {...props}>
      {children}
      <div
        style={{
          display: "inline-block",
          marginLeft: 8,
          padding: 2,
          transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
        }}
      >
        <ChevronDownIcon size="small" />
      </div>
    </pre>
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
        backgroundColor:
          role === "user"
            ? "var(--bgColor-accent-emphasis, #0969da)"
            : "var(--bgColor-muted, #f6f8fa)",
        color:
          role === "user"
            ? "var(--fgColor-onEmphasis, #ffffff)"
            : "var(--fgColor-default, #1f2328)",
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
        border: "1px solid var(--borderColor-default, #d0d7de)",
        overflow: "hidden",
        fontSize: 10,
      }}
    >
      {title && (
        <div
          style={{
            padding: "2px 8px",
            backgroundColor: "var(--bgColor-muted, #f6f8fa)",
            borderBottom: "1px solid var(--borderColor-default, #d0d7de)",
            fontWeight: 600,
            color: "var(--fgColor-muted, #656d76)",
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
          color: "var(--fgColor-default, #1f2328)",
          lineHeight: 1.5,
        }}
      >
        {children}
      </pre>
    </div>
  );
}
