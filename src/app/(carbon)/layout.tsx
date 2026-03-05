"use client";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";

export default function CarbonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TamboProvider apiKey={tamboApiKey}>
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
