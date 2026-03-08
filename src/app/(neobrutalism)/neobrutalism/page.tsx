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
import { useScrollToBottom } from "@/components/chat-layout";
import { PropsWithChildren, useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";

const PROJECTS = [
  {
    title: "BRAND OVERHAUL",
    category: "BRANDING",
    description: "Complete visual identity redesign for a tech startup. Bold colors, sharp type, zero compromise.",
    color: "bg-main",
    year: "2025",
  },
  {
    title: "POSTER SERIES",
    category: "PRINT",
    description: "Limited edition screen-printed poster series. 4 colors, hand-pulled, raw energy.",
    color: "bg-secondary-background",
    year: "2025",
  },
  {
    title: "WEB PLATFORM",
    category: "DIGITAL",
    description: "E-commerce platform with brutalist aesthetic. Fast, loud, unapologetic.",
    color: "bg-main",
    year: "2024",
  },
  {
    title: "TYPE SPECIMEN",
    category: "TYPOGRAPHY",
    description: "Custom display typeface designed for maximum impact at any size.",
    color: "bg-secondary-background",
    year: "2024",
  },
  {
    title: "MOTION REEL",
    category: "MOTION",
    description: "Kinetic typography and bold motion graphics for brand campaigns.",
    color: "bg-main",
    year: "2024",
  },
  {
    title: "ZINE COLLECTION",
    category: "EDITORIAL",
    description: "Self-published quarterly zine exploring counter-culture design movements.",
    color: "bg-secondary-background",
    year: "2023",
  },
];

const STATS = [
  { label: "PROJECTS SHIPPED", value: "127+" },
  { label: "HAPPY CLIENTS", value: "84" },
  { label: "AWARDS WON", value: "31" },
  { label: "CUPS OF COFFEE", value: "9,402" },
];

export default function NeobrutalismDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();
  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);

  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  return (
    <div className="min-h-screen bg-background text-foreground font-base">
      {/* NAV */}
      <nav className="border-b-2 border-border bg-secondary-background sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-foreground no-underline font-heading text-xl uppercase tracking-tight hover:text-main-foreground hover:bg-main px-2 py-1 rounded-base transition-colors"
          >
            BRUT.STUDIO
          </Link>
          <div className="flex items-center gap-3">
            <a href="#work" className="font-heading text-sm uppercase text-foreground no-underline hover:underline">
              Work
            </a>
            <a href="#stats" className="font-heading text-sm uppercase text-foreground no-underline hover:underline">
              Stats
            </a>
            <Button
              variant="neutral"
              size="sm"
              onClick={() => {
                setChatOpen(true);
                setThreadsOpen(true);
              }}
            >
              THREADS
            </Button>
            <Link href="/" className="no-underline">
              <Button variant="neutral" size="sm">
                ← HOME
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4 text-xs">CREATIVE AGENCY</Badge>
            <h1 className="font-heading text-5xl md:text-7xl uppercase leading-none tracking-tight text-foreground m-0 mb-6">
              WE MAKE
              <br />
              <span className="text-main-foreground bg-main px-3 py-1 inline-block border-2 border-border shadow-shadow mt-2">
                BOLD
              </span>
              <br />
              THINGS.
            </h1>
            <p className="text-lg text-foreground/80 max-w-md mb-8 font-base leading-relaxed">
              Design studio specializing in brands that refuse to blend in.
              No safe choices. No beige. Just raw, unapologetic creative work.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button size="lg" onClick={() => setChatOpen(true)}>
                LET&apos;S TALK
              </Button>
              <Button variant="neutral" size="lg" asChild>
                <a href="#work">VIEW WORK</a>
              </Button>
            </div>
          </div>

          <Card className="bg-main rotate-1 hover:rotate-0 transition-transform">
            <CardContent>
              <div className="font-heading text-6xl md:text-8xl text-main-foreground leading-none">
                ★
              </div>
              <p className="font-heading text-xl uppercase text-main-foreground mt-4">
                &ldquo;DESIGN IS NOT DECORATION. IT&apos;S COMMUNICATION WITH ATTITUDE.&rdquo;
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MARQUEE DIVIDER */}
      <div className="border-y-2 border-border bg-main py-3 overflow-hidden">
        <div className="font-heading text-sm uppercase tracking-widest text-main-foreground whitespace-nowrap animate-marquee flex gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              BRANDING ★ DIGITAL ★ PRINT ★ MOTION ★ TYPOGRAPHY ★ EDITORIAL ★
            </span>
          ))}
        </div>
      </div>

      {/* WORK SECTION */}
      <section id="work" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <Badge variant="neutral" className="mb-3">SELECTED</Badge>
            <h2 className="font-heading text-4xl md:text-5xl uppercase tracking-tight text-foreground m-0">
              WORK
            </h2>
          </div>
          <p className="font-heading text-sm uppercase text-foreground/60 hidden md:block">
            2023 — PRESENT
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, idx) => (
            <Card
              key={idx}
              className={`${project.color} group hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer`}
            >
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={project.color === "bg-main" ? "neutral" : "default"}>
                    {project.category}
                  </Badge>
                  <span className="font-heading text-xs text-foreground/50">
                    {project.year}
                  </span>
                </div>
                <h3 className="font-heading text-2xl uppercase tracking-tight text-foreground m-0 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed m-0">
                  {project.description}
                </p>
                <div className="mt-4 font-heading text-xs uppercase text-foreground/40 group-hover:text-foreground transition-colors">
                  VIEW PROJECT →
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section id="stats" className="border-y-2 border-border bg-secondary-background">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="font-heading text-4xl md:text-5xl text-foreground">
                  {stat.value}
                </div>
                <div className="font-heading text-xs uppercase tracking-wider text-foreground/60 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-heading text-sm uppercase text-foreground/60">
            &copy; 2026 BRUT.STUDIO — ALL RIGHTS RESERVED
          </div>
          <div className="flex gap-4">
            <Badge>TWITTER</Badge>
            <Badge>DRIBBBLE</Badge>
            <Badge variant="neutral">GITHUB</Badge>
          </div>
        </div>
      </footer>

      {/* FLOATING CHAT BUBBLE */}
      {!chatOpen && (
        <button
          data-testid="chat-bubble"
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow flex items-center justify-center text-2xl font-heading cursor-pointer hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
        >
          💬
        </button>
      )}

      {/* CHAT WINDOW */}
      {chatOpen && (
        <ChatWindow
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          threadsOpen={threadsOpen}
          setThreadsOpen={setThreadsOpen}
        />
      )}
    </div>
  );
}

function ChatWindow({
  chatOpen,
  setChatOpen,
  threadsOpen,
  setThreadsOpen,
}: {
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  threadsOpen: boolean;
  setThreadsOpen: (v: boolean) => void;
}) {
  const { ref: scrollRef } = useScrollToBottom(500);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Click outside to close threads overlay
  useEffect(() => {
    if (!threadsOpen) return;
    function handleClick(e: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setThreadsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [threadsOpen, setThreadsOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-48px)] flex flex-col rounded-base border-2 border-border shadow-shadow bg-background overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border bg-secondary-background shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-heading text-sm uppercase tracking-wide text-foreground">
            CHAT
          </span>
          <Badge variant="neutral" className="text-[10px]">AI</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThreadsOpen(!threadsOpen)}
            className="rounded-base border-2 border-border bg-background px-2 py-1 text-xs font-heading uppercase cursor-pointer hover:bg-main hover:text-main-foreground transition-colors text-foreground"
          >
            THREADS
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="rounded-base border-2 border-border bg-background w-7 h-7 flex items-center justify-center text-sm font-heading cursor-pointer hover:bg-main hover:text-main-foreground transition-colors text-foreground"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Threads overlay */}
      {threadsOpen && (
        <div
          ref={overlayRef}
          className="absolute top-12 left-3 right-3 z-10 rounded-base border-2 border-border shadow-shadow bg-background max-h-72 overflow-y-auto"
        >
          <div className="p-3 border-b-2 border-border bg-secondary-background">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs uppercase tracking-wide text-foreground">
                ALL THREADS
              </span>
              <ThreadHistory.Root>
                <ThreadHistory.NewThreadButton
                  render={<Button size="sm" className="text-xs uppercase h-7 px-2" />}
                >
                  + NEW
                </ThreadHistory.NewThreadButton>
              </ThreadHistory.Root>
            </div>
          </div>
          <div className="p-2">
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
                            className="w-full justify-start text-left truncate text-xs"
                            onClick={(e) => {
                              (props as any).onClick?.(e);
                              setThreadsOpen(false);
                            }}
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
        </div>
      )}

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <ThreadContent.Root
          style={{ display: "flex", flexDirection: "column" }}
        >
          <ThreadContent.Messages
            render={(_props, state) => (
              <>
                {state.filteredMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="text-4xl mb-3">★</div>
                    <p className="font-heading text-sm uppercase text-foreground/50">
                      START A CONVERSATION
                    </p>
                  </div>
                )}
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
      </div>

      {/* Input area */}
      <div className="border-t-2 border-border bg-secondary-background p-3 shrink-0">
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
              render={<Button variant="neutral" size="icon" className="shrink-0" />}
            >
              📎
            </MessageInput.FileButton>
            <div className="flex-1">
              <MessageInput.Textarea
                placeholder="Type a message..."
                render={<Textarea rows={2} />}
              />
            </div>
            <MessageInput.SubmitButton render={<Button className="shrink-0" />}>
              SEND
            </MessageInput.SubmitButton>
            <MessageInput.StopButton
              render={
                <Button
                  variant="noShadow"
                  className="bg-red-500 text-white border-border shrink-0"
                />
              }
            >
              STOP
            </MessageInput.StopButton>
          </MessageInput.Content>
        </MessageInput.Root>
      </div>
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
      className="mb-3 flex flex-col gap-2"
      style={{
        flex: "1 1 auto",
        alignSelf: role === "user" ? "flex-end" : "flex-start",
        maxWidth: "85%",
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
