"use client";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import { statusCardComponent } from "@/lib/demo-component";
import { initialMessages } from "@/lib/initial-messages";
import { useLocalStorage } from "@/lib/use-local-storage";

function getOrCreateId(): string {
  const key = "tambo-demo-user-key";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [userKey] = useLocalStorage("tambo-demo-user-key", "");

  // Lazily initialize on first client render
  if (typeof window !== "undefined" && !userKey) {
    getOrCreateId();
  }

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
