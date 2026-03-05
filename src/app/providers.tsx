"use client";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import { statusCardComponent } from "@/lib/demo-component";
import { initialMessages } from "@/lib/initial-messages";
import { useUserKey } from "@/lib/use-user-key";

export function Providers({ children }: { children: React.ReactNode }) {
  const userKey = useUserKey();

  if (!userKey) return null;

  return (
    <TamboProvider
      apiKey={tamboApiKey}
      userKey={userKey}
      components={[statusCardComponent]}
      initialMessages={initialMessages}
    >
      {children}
    </TamboProvider>
  );
}
