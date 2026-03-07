"use client";

import { defineTool, type TamboTool } from "@tambo-ai/react";

export interface HNPost {
  id: number;
  title: string;
  url: string;
  author: string;
  points: number;
  comments: number;
}

export const hackernewsTool: TamboTool = defineTool({
  name: "get_hackernews_top_posts",
  description:
    "Fetches the top 3 posts from Hacker News. Returns an array of posts with title, url, author, points, and comment count.",
  tool: async () => {
    const res = await fetch("/api/hackernews");
    const posts: HNPost[] = await res.json();
    return posts;
  },
  inputSchema: {
    type: "object",
    properties: {},
  },
  outputSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        url: { type: "string" },
        author: { type: "string" },
        points: { type: "number" },
        comments: { type: "number" },
      },
    },
  },
});
