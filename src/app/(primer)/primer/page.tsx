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
  Header,
  UnderlineNav,
  Label,
  CounterLabel,
  StateLabel,
  BranchName,
  TreeView,
  ActionMenu,
  ActionList,
  Avatar,
  Text,
  Overlay,
} from "@primer/react";
import "@primer/css/dist/primer.css";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CodeIcon,
  CommentDiscussionIcon,
  EyeIcon,
  FileCodeIcon,
  FileDirectoryFillIcon,
  FileIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  LawIcon,
  LightBulbIcon,
  ExclamationIcon,
  PaperAirplaneIcon,
  PaperclipIcon,
  PlayIcon,
  RepoIcon,
  StarIcon,
  StopIcon,
  RepoForkedIcon,
  TagIcon,
  BookIcon,
  GearIcon,
  ShieldIcon,
  GraphIcon,
  TableIcon,
  PeopleIcon,
  XIcon,
  ThreeBarsIcon,
} from "@primer/octicons-react";
import { useScrollToBottom } from "@/components/chat-layout";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

// Fake repo file data
const REPO_FILES = [
  { name: ".github", type: "dir" as const, message: "Update CI workflow", time: "2 days ago" },
  { name: "src", type: "dir" as const, message: "Add new components", time: "1 day ago" },
  { name: "tests", type: "dir" as const, message: "Add unit tests for utils", time: "3 days ago" },
  { name: "docs", type: "dir" as const, message: "Update API documentation", time: "5 days ago" },
  { name: ".gitignore", type: "file" as const, message: "Add dist to gitignore", time: "2 weeks ago" },
  { name: "LICENSE", type: "file" as const, message: "Initial commit", time: "3 months ago" },
  { name: "README.md", type: "file" as const, message: "Update readme with examples", time: "1 day ago" },
  { name: "package.json", type: "file" as const, message: "Bump version to 2.1.0", time: "1 day ago" },
  { name: "tsconfig.json", type: "file" as const, message: "Enable strict mode", time: "1 week ago" },
];

const NAV_ITEMS = [
  { label: "Code", icon: CodeIcon, counter: undefined, current: true },
  { label: "Issues", icon: IssueOpenedIcon, counter: 12 },
  { label: "Pull requests", icon: GitPullRequestIcon, counter: 3 },
  { label: "Actions", icon: PlayIcon },
  { label: "Projects", icon: TableIcon },
  { label: "Wiki", icon: BookIcon },
  { label: "Security", icon: ShieldIcon },
  { label: "Insights", icon: GraphIcon },
  { label: "Settings", icon: GearIcon },
];

export default function PrimerDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);

  const { ref: scrollRef } = useScrollToBottom(500);

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bgColor-default, #ffffff)",
        color: "var(--fgColor-default, #1f2328)",
      }}
    >
      {/* GitHub Header */}
      <Header>
        <Header.Item>
          <Header.Link as={NextLink} href="/" style={{ fontSize: 16 }}>
            <RepoIcon size={32} />
          </Header.Link>
        </Header.Item>
        <Header.Item full>
          <Header.Link as={NextLink} href="#" style={{ fontSize: 14, fontWeight: 600 }}>
            tambo-ai / react-ui-base
          </Header.Link>
        </Header.Item>
        <Header.Item>
          <ThreadsButton onClick={() => setThreadsOpen(!threadsOpen)} />
        </Header.Item>
      </Header>

      {/* Threads Overlay */}
      {threadsOpen && (
        <ThreadsPanel onClose={() => setThreadsOpen(false)} />
      )}

      {/* Repo nav */}
      <div
        style={{
          borderBottom: "1px solid var(--borderColor-muted, #d0d7de)",
          backgroundColor: "var(--bgColor-default, #ffffff)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <UnderlineNav aria-label="Repository">
            {NAV_ITEMS.map((item) => (
              <UnderlineNav.Item
                key={item.label}
                aria-current={item.current ? "page" : undefined}
                icon={item.icon}
                counter={item.counter}
              >
                {item.label}
              </UnderlineNav.Item>
            ))}
          </UnderlineNav>
        </div>
      </div>

      {/* Repo content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px" }}>
        {/* Repo header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BranchName as="span">main</BranchName>
            <Text style={{ fontSize: 14, color: "var(--fgColor-muted, #656d76)" }}>
              <GitBranchIcon size={16} /> 4 branches
            </Text>
            <Text style={{ fontSize: 14, color: "var(--fgColor-muted, #656d76)" }}>
              <TagIcon size={16} /> 12 tags
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button size="small" leadingVisual={StarIcon} count={128}>
              Star
            </Button>
            <Button size="small" leadingVisual={EyeIcon} count={15}>
              Watch
            </Button>
            <Button size="small" leadingVisual={RepoForkedIcon} count={23}>
              Fork
            </Button>
          </div>
        </div>

        {/* About section + file browser */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          {/* File browser */}
          <div>
            {/* Latest commit bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                backgroundColor: "var(--bgColor-muted, #f6f8fa)",
                border: "1px solid var(--borderColor-default, #d0d7de)",
                borderRadius: "6px 6px 0 0",
                fontSize: 14,
              }}
            >
              <Avatar src="https://github.com/ghost.png" size={20} alt="avatar" />
              <Text style={{ fontWeight: 600, fontSize: 13 }}>tambo-dev</Text>
              <Text style={{ color: "var(--fgColor-muted, #656d76)", fontSize: 13, flex: 1 }}>
                Bump version to 2.1.0
              </Text>
              <Text style={{ color: "var(--fgColor-muted, #656d76)", fontSize: 13 }}>
                <GitCommitIcon size={16} /> abc1234
              </Text>
              <Text style={{ color: "var(--fgColor-muted, #656d76)", fontSize: 13 }}>
                yesterday
              </Text>
            </div>

            {/* File list */}
            <div
              style={{
                border: "1px solid var(--borderColor-default, #d0d7de)",
                borderTop: "none",
                borderRadius: "0 0 6px 6px",
                overflow: "hidden",
              }}
            >
              {REPO_FILES.map((file, i) => (
                <div
                  key={file.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr auto",
                    alignItems: "center",
                    padding: "8px 16px",
                    fontSize: 14,
                    borderTop: i > 0 ? "1px solid var(--borderColor-muted, #d0d7de)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {file.type === "dir" ? (
                      <span style={{ color: "var(--color-fg-muted, #54aeff)" }}><FileDirectoryFillIcon size={16} /></span>
                    ) : (
                      <span style={{ color: "var(--fgColor-muted, #656d76)" }}><FileIcon size={16} /></span>
                    )}
                    <Link href="#" muted={false} style={{ fontWeight: file.type === "dir" ? 600 : 400 }}>
                      {file.name}
                    </Link>
                  </div>
                  <Text style={{ color: "var(--fgColor-muted, #656d76)", fontSize: 13 }}>
                    {file.message}
                  </Text>
                  <Text style={{ color: "var(--fgColor-muted, #656d76)", fontSize: 13, textAlign: "right" }}>
                    {file.time}
                  </Text>
                </div>
              ))}
            </div>

            {/* README */}
            <div
              style={{
                marginTop: 16,
                border: "1px solid var(--borderColor-default, #d0d7de)",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--bgColor-muted, #f6f8fa)",
                  borderBottom: "1px solid var(--borderColor-default, #d0d7de)",
                  fontWeight: 600,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <BookIcon size={16} />
                README.md
              </div>
              <div style={{ padding: "16px 24px", fontSize: 14, lineHeight: 1.6 }}>
                <h1 style={{ fontSize: 28, fontWeight: 600, borderBottom: "1px solid var(--borderColor-muted, #d0d7de)", paddingBottom: 8, marginBottom: 16 }}>
                  @tambo-ai/react-ui-base
                </h1>
                <p style={{ color: "var(--fgColor-default, #1f2328)", marginBottom: 12 }}>
                  A headless component library for building AI chat interfaces with any design system.
                  Provides unstyled, accessible primitives for thread management, message rendering,
                  and input handling.
                </p>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 20, marginBottom: 8 }}>Features</h2>
                <ul style={{ paddingLeft: 24, color: "var(--fgColor-default, #1f2328)" }}>
                  <li>Headless components — bring your own styling</li>
                  <li>Thread history management</li>
                  <li>Reasoning and tool call display</li>
                  <li>File attachments and image staging</li>
                  <li>Works with any React component library</li>
                </ul>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 20, marginBottom: 8 }}>Quick Start</h2>
                <pre
                  style={{
                    padding: 16,
                    backgroundColor: "var(--bgColor-muted, #f6f8fa)",
                    borderRadius: 6,
                    border: "1px solid var(--borderColor-default, #d0d7de)",
                    fontSize: 13,
                    overflow: "auto",
                  }}
                >
                  {`npm install @tambo-ai/react-ui-base @tambo-ai/react`}
                </pre>
              </div>
            </div>
          </div>

          {/* Sidebar - About */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <Heading as="h3" style={{ fontSize: 16, marginBottom: 8 }}>
                About
              </Heading>
              <Text style={{ fontSize: 14, lineHeight: 1.5 }}>
                Headless UI components for building AI chat interfaces. Works with Primer, Chakra,
                Mantine, and more.
              </Text>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              <Text style={{ fontSize: 13, color: "var(--fgColor-muted, #656d76)", display: "flex", alignItems: "center", gap: 8 }}>
                <BookIcon size={16} /> Readme
              </Text>
              <Text style={{ fontSize: 13, color: "var(--fgColor-muted, #656d76)", display: "flex", alignItems: "center", gap: 8 }}>
                <LawIcon size={16} /> MIT license
              </Text>
              <Text style={{ fontSize: 13, color: "var(--fgColor-muted, #656d76)", display: "flex", alignItems: "center", gap: 8 }}>
                <StarIcon size={16} /> 128 stars
              </Text>
              <Text style={{ fontSize: 13, color: "var(--fgColor-muted, #656d76)", display: "flex", alignItems: "center", gap: 8 }}>
                <EyeIcon size={16} /> 15 watching
              </Text>
              <Text style={{ fontSize: 13, color: "var(--fgColor-muted, #656d76)", display: "flex", alignItems: "center", gap: 8 }}>
                <RepoForkedIcon size={16} /> 23 forks
              </Text>
            </div>

            <div style={{ borderTop: "1px solid var(--borderColor-muted, #d0d7de)", paddingTop: 16, marginBottom: 16 }}>
              <Heading as="h3" style={{ fontSize: 14, marginBottom: 8 }}>
                Languages
              </Heading>
              <div
                style={{
                  display: "flex",
                  borderRadius: 6,
                  overflow: "hidden",
                  height: 8,
                  marginBottom: 8,
                }}
              >
                <div style={{ width: "68%", backgroundColor: "#3178c6" }} />
                <div style={{ width: "24%", backgroundColor: "#f1e05a" }} />
                <div style={{ width: "8%", backgroundColor: "#e34c26" }} />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12 }}>
                <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: "#3178c6", marginRight: 4 }} />TypeScript 68%</span>
                <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: "#f1e05a", marginRight: 4 }} />JavaScript 24%</span>
                <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: "#e34c26", marginRight: 4 }} />HTML 8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bubble */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: "var(--bgColor-accent-emphasis, #0969da)",
            color: "var(--fgColor-onEmphasis, #ffffff)",
            border: "none",
            cursor: "pointer",
            zIndex: 999,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <CommentDiscussionIcon size={24} />
        </button>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 400,
            height: 520,
            zIndex: 998,
            display: "flex",
            flexDirection: "column",
            borderRadius: 12,
            border: "1px solid var(--borderColor-default, #d0d7de)",
            backgroundColor: "var(--bgColor-default, #ffffff)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--borderColor-muted, #d0d7de)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "var(--bgColor-muted, #f6f8fa)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CommentDiscussionIcon size={16} />
              <Text style={{ fontWeight: 600, fontSize: 14 }}>Tambo Chat</Text>
            </div>
            <IconButton
              icon={XIcon}
              aria-label="Close chat"
              variant="invisible"
              size="small"
              onClick={() => {
                setChatOpen(false);
                setThreadsOpen(false);
              }}
            />
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ThreadContent.Root
              style={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}
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
                                render={(_props, state) => {
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
          </div>

          {/* Input */}
          <div
            style={{
              padding: "8px 12px",
              borderTop: "1px solid var(--borderColor-muted, #d0d7de)",
            }}
          >
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
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Threads Button (for header) ──────────────────────────── */

function ThreadsButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      icon={ThreeBarsIcon}
      aria-label="Thread history"
      variant="invisible"
      size="small"
      onClick={onClick}
      style={{ color: "var(--fgColor-onEmphasis, #ffffff)" }}
    />
  );
}

/* ── Threads Panel (overlay) ──────────────────────────────── */

function ThreadsPanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 60,
        right: 16,
        width: 300,
        maxHeight: 400,
        overflow: "auto",
        backgroundColor: "var(--bgColor-default, #ffffff)",
        border: "1px solid var(--borderColor-default, #d0d7de)",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        zIndex: 1001,
        padding: 16,
      }}
    >
      <ThreadHistory.Root>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Heading as="h3" style={{ fontSize: 14 }}>Threads</Heading>
          <ThreadHistory.NewThreadButton render={<Button size="small" />}>
            + New
          </ThreadHistory.NewThreadButton>
        </div>
        <ThreadHistory.List
          render={(props, state) => (
            <NavList {...props}>
              {state.filteredThreads.map((thread) => (
                <ThreadHistory.Item
                  key={thread.id}
                  thread={thread}
                  render={({ children, ...itemProps }, { isActive }) => (
                    <NavList.Item
                      aria-current={isActive ? "page" : undefined}
                      {...itemProps}
                      onClick={(e) => {
                        itemProps.onClick?.(e);
                        onClose();
                      }}
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
    </div>
  );
}

/* ── Message helpers ──────────────────────────────────────── */

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
        maxWidth: "85%",
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
