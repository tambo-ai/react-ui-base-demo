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
  TextArea,
  Tile,
  InlineLoading,
  InlineNotification,
  SideNav,
  SideNavItems,
  SideNavLink,
  Breadcrumb,
  BreadcrumbItem,
  Stack,
} from "@carbon/react";
import {
  Send,
  Attachment,
  StopFilled,
  ChevronDown,
  Checkmark,
  Warning,
} from "@carbon/react/icons";
import { ChatLayout } from "@/components/chat-layout";
import { PropsWithChildren, useEffect } from "react";

export default function CarbonPage() {
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
      colors={{ border: "#e0e0e0" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb>
          <Breadcrumb noTrailingSlash>
            <BreadcrumbItem>
              <Link href="/" style={{ color: "#0f62fe" }}>
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>Carbon</BreadcrumbItem>
          </Breadcrumb>
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
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar divider>
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 600,
              color: "#161616",
            }}
          >
            Threads
          </h2>
          <ThreadHistory.Root>
            <ThreadHistory.NewThreadButton
              render={<Button kind="primary" size="sm" style={{ width: "100%" }} />}
            >
              + New thread
            </ThreadHistory.NewThreadButton>
          </ThreadHistory.Root>
        </div>
        <ThreadHistory.Root>
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
