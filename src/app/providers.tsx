"use client";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import { statusCardComponent } from "@/lib/demo-component";
import { initialMessages } from "@/lib/initial-messages";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TamboProvider
      apiKey={tamboApiKey}
      userKey="demo-user"
      components={[statusCardComponent]}
      initialMessages={initialMessages}
    >
      {children}
    </TamboProvider>
  );
}
