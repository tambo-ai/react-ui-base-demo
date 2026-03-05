"use client";
import { useLocalStorage } from "./use-local-storage";

const STORAGE_KEY = "tambo-demo-user-key";

export function useUserKey(): string {
  const [userKey, setUserKey] = useLocalStorage(STORAGE_KEY, "");

  if (typeof window !== "undefined" && !userKey) {
    const id = crypto.randomUUID();
    setUserKey(id);
  }

  return userKey;
}
