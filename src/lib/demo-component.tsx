"use client";

import type { TamboComponent } from "@tambo-ai/react";

function StatusCard({
  title,
  status,
  message,
}: {
  title: string;
  status: "success" | "warning" | "error" | "info";
  message: string;
}) {
  const colors = {
    success: { bg: "#dcfce7", border: "#16a34a", text: "#15803d" },
    warning: { bg: "#fef9c3", border: "#ca8a04", text: "#a16207" },
    error: { bg: "#fecaca", border: "#dc2626", text: "#b91c1c" },
    info: { bg: "#dbeafe", border: "#2563eb", text: "#1d4ed8" },
  };
  const c = colors[status] ?? colors.info;

  return (
    <div
      style={{
        border: `2px solid ${c.border}`,
        borderRadius: 8,
        padding: 16,
        backgroundColor: c.bg,
        maxWidth: 320,
      }}
    >
      <div style={{ fontWeight: 700, color: c.text, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: c.text }}>{message}</div>
    </div>
  );
}

export const statusCardComponent: TamboComponent = {
  name: "StatusCard",
  description:
    "A status card that displays a title, status level, and message. Use for showing alerts, notifications, or status updates.",
  component: StatusCard,
  propsSchema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Card title" },
      status: {
        type: "string",
        enum: ["success", "warning", "error", "info"],
        description: "Status level",
      },
      message: { type: "string", description: "Status message" },
    },
    required: ["title", "status", "message"],
  },
};
