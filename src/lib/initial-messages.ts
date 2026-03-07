import type { InitialInputMessage } from "@tambo-ai/react";

export const initialMessages: InitialInputMessage[] = [
  {
    role: "user",
    content: [{ type: "text", text: "What can you help me with?" }],
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "I can help with all sorts of things! I can answer questions, generate status cards, use tools to look things up, and walk you through my reasoning process. Try asking me to create a status card or just chat about anything.",
      },
    ],
  },
  {
    role: "user",
    content: [
      { type: "text", text: "Give me the top posts from Hacker News" },
    ],
  },
];
