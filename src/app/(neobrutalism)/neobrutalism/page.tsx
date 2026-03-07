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
import { ChatLayout } from "@/components/chat-layout";
import { PropsWithChildren, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";

export default function NeobrutalismDemo() {
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
      colors={{ border: "var(--border)" }}
    >
      <ChatLayout.Content>
        <ChatLayout.Breadcrumb
          className="border-b-2 border-border font-heading text-sm"
        >
          <Link href="/" className="text-foreground no-underline hover:underline">
            ← Home
          </Link>
          <span className="ml-2 text-foreground/60">/ Neobrutalism</span>
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
                          <Card className="bg-main py-3">
                            <CardContent>
                              <ReasoningInfo.Trigger
                                render={(props) => (
                                  <button
                                    {...props}
                                    className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 text-xs font-heading text-main-foreground"
                                  >
                                    <Badge>💡</Badge>
                                    <ReasoningInfo.StatusText />
                                  </button>
                                )}
                              />
                              <ReasoningInfo.Content className="mt-2 text-xs text-main-foreground/80 leading-relaxed">
                                <ReasoningInfo.Steps />
                              </ReasoningInfo.Content>
                            </CardContent>
                          </Card>
                        </ReasoningInfo.Root>

                        <ToolcallInfo.Root>
                          <Card className="py-3">
                            <CardContent>
                              <ToolcallInfo.Trigger
                                render={(props, { state }) => (
                                  <button
                                    {...props}
                                    className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 text-xs font-heading text-foreground"
                                  >
                                    <ToolcallInfo.StatusIcon
                                      render={(_p, s) => (
                                        <Badge variant={s.status === "error" ? "neutral" : "default"}>
                                          {s.status === "loading" ? "⏳" : s.status === "success" ? "✓" : "✗"}
                                        </Badge>
                                      )}
                                    />
                                    <ToolcallInfo.ToolName />
                                    <span
                                      className="inline-block transition-transform"
                                      style={{
                                        transform: state === "open" ? "rotate(-180deg)" : "rotate(0deg)",
                                      }}
                                    >
                                      ▼
                                    </span>
                                  </button>
                                )}
                              />
                              <ToolcallInfo.Content className="mt-2">
                                <div className="flex flex-col gap-2">
                                  <ToolcallInfo.Parameters
                                    render={<CodeBlock title="Parameters" />}
                                  />
                                  <ToolcallInfo.Result
                                    render={<CodeBlock title="Result" />}
                                  />
                                </div>
                              </ToolcallInfo.Content>
                            </CardContent>
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

                        <Message.LoadingIndicator>
                          <div className="rounded-base border-2 border-border bg-main px-3 py-2 shadow-shadow">
                            <Badge>⏳</Badge>
                          </div>
                        </Message.LoadingIndicator>
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
            <MessageInput.StagedImages className="flex gap-2 mb-2 flex-wrap" />
            <MessageInput.Error
              render={(props) => (
                <div {...props} className="mb-2">
                  <Alert variant="destructive">
                    <AlertDescription>{props.children}</AlertDescription>
                  </Alert>
                </div>
              )}
            />
            <MessageInput.Content className="flex gap-2 items-end">
              <MessageInput.FileButton
                render={<Button variant="neutral" size="icon" />}
              >
                📎
              </MessageInput.FileButton>
              <div className="flex-1">
                <MessageInput.Textarea
                  placeholder="Type a message..."
                  render={<Textarea rows={2} />}
                />
              </div>
              <MessageInput.SubmitButton render={<Button />}>
                SEND
              </MessageInput.SubmitButton>
              <MessageInput.StopButton
                render={
                  <Button
                    variant="noShadow"
                    className="bg-red-500 text-white border-border"
                  />
                }
              >
                STOP
              </MessageInput.StopButton>
            </MessageInput.Content>
          </MessageInput.Root>
        </ChatLayout.Container>
      </ChatLayout.InputArea>
      <ChatLayout.Sidebar
        divider
        className="bg-background"
      >
        <div className="p-4 border-b-2 border-border flex flex-col gap-2">
          <h2 className="m-0 text-base font-heading uppercase tracking-wide text-foreground">
            Threads
          </h2>
          <ThreadHistory.Root>
            <ThreadHistory.NewThreadButton
              render={<Button className="w-full uppercase" />}
            >
              + New thread
            </ThreadHistory.NewThreadButton>
          </ThreadHistory.Root>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          <ThreadHistory.Root>
            <ThreadHistory.List
              render={(_props, state) => (
                <div className="flex flex-col gap-1">
                  {state.filteredThreads.map((thread) => (
                    <ThreadHistory.Item
                      key={thread.id}
                      thread={thread}
                      render={({ children, ...props }, { isActive }) => (
                        <Button
                          {...(props as any)}
                          variant={isActive ? "default" : "neutral"}
                          size="sm"
                          className="w-full justify-start text-left truncate"
                        >
                          {children}
                        </Button>
                      )}
                    />
                  ))}
                </div>
              )}
            />
          </ThreadHistory.Root>
        </div>
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
      className="mb-3 flex flex-col gap-2"
      style={{
        flex: "1 1 auto",
        alignSelf: role === "user" ? "flex-end" : "flex-start",
        maxWidth: "70%",
      }}
      {...props}
    >
      {children}
    </div>
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
      className={`rounded-base border-2 border-border shadow-shadow px-3 py-2 text-sm font-base ${
        role === "user"
          ? "bg-main text-main-foreground"
          : "bg-secondary-background text-foreground"
      }`}
      {...props}
    >
      {children}
    </div>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="rounded-base border-2 border-border overflow-hidden text-[10px]">
      {title && (
        <div className="px-2 py-1 bg-secondary-background border-b-2 border-border font-heading text-foreground/60">
          {title}
        </div>
      )}
      <pre className="m-0 px-3 py-2 whitespace-pre-wrap break-words font-mono text-foreground leading-relaxed">
        {children}
      </pre>
    </div>
  );
}
