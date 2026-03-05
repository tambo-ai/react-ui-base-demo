"use client";
// Side-effect import: loads neobrutalism styles scoped to this route group
import "./neobrutalism-globals.css";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";

export default function NeobrutalismLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#FAFAF9",
          margin: 0,
          height: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <TamboProvider apiKey={tamboApiKey} userKey="demo-user">{children}</TamboProvider>
      </body>
    </html>
  );
}
