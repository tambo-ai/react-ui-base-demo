"use client";
import "./neobrutalism-globals.css";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import { statusCardComponent } from "@/lib/demo-component";
import { initialMessages } from "@/lib/initial-messages";

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
        <TamboProvider
          apiKey={tamboApiKey}
          userKey="demo-user"
          components={[statusCardComponent]}
          initialMessages={initialMessages}
        >
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
