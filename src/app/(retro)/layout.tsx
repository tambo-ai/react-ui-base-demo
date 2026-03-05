"use client";
import "./retro-globals.css";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import { statusCardComponent } from "@/lib/demo-component";
import { initialMessages } from "@/lib/initial-messages";

export default function RetroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#050505",
          color: "#ffb000",
          margin: 0,
          height: "100vh",
          fontFamily: "'Courier New', monospace",
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
