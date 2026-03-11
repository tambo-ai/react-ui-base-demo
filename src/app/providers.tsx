"use client";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import { statusCardComponent } from "@/lib/demo-component";
import { hackerNewsComponent } from "@/lib/hackernews-component";
import { hackernewsTool } from "@/lib/hackernews-tool";
import { initialMessages } from "@/lib/initial-messages";
import { useUserKey } from "@/lib/use-user-key";

const tamboUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/tambo`
    : undefined;

export function Providers({ children }: { children: React.ReactNode }) {
  const userKey = useUserKey();

  return (
    <TamboProvider
      apiKey={tamboApiKey}
      tamboUrl={tamboUrl}
      userKey={userKey}
      components={[statusCardComponent, hackerNewsComponent]}
      tools={[hackernewsTool]}
      initialMessages={initialMessages}
    >
      {children}
    </TamboProvider>
  );
}
