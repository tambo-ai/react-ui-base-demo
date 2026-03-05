"use client";
import { useState, useEffect } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import { statusCardComponent } from "@/lib/demo-component";
import { initialMessages } from "@/lib/initial-messages";

const STORAGE_KEY = "tambo-demo-user-key";

function getUserKey(): string {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [userKey, setUserKey] = useState("");

  useEffect(() => {
    setUserKey(getUserKey());
  }, []);

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
