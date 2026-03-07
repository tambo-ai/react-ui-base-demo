"use client";

import type { TamboComponent } from "@tambo-ai/react";

interface HNPost {
  id: number;
  title: string;
  url: string;
  author: string;
  points: number;
  comments: number;
}

function HackerNewsPosts({ posts }: { posts?: HNPost[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #e1e4e8",
        maxWidth: 480,
      }}
    >
      {posts?.map((post, i) => (
        <a
          key={post.id}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            gap: 12,
            padding: "12px 16px",
            backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb",
            textDecoration: "none",
            color: "inherit",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#ff6600",
              minWidth: 24,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            {i + 1}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#24292f",
                lineHeight: 1.4,
                marginBottom: 4,
              }}
            >
              {post.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#656d76",
                display: "flex",
                gap: 12,
              }}
            >
              <span>{post.points} pts</span>
              <span>{post.author}</span>
              <span>{post.comments} comments</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export const hackerNewsComponent: TamboComponent = {
  name: "HackerNewsPosts",
  description:
    "Displays a list of Hacker News posts with title, author, points, and comment count. Use after fetching HN posts.",
  component: HackerNewsPosts,
  propsSchema: {
    type: "object",
    properties: {
      posts: {
        type: "array",
        description: "Array of Hacker News posts to display",
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
          required: ["id", "title", "url", "author", "points", "comments"],
        },
      },
    },
    required: ["posts"],
  },
};
