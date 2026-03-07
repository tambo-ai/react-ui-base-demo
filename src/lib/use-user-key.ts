"use client";
import { useLocalStorage } from "./use-local-storage";

const STORAGE_KEY = "tambo-demo-user-key";

export function useUserKey(): string {
  const [userKey] = useLocalStorage(STORAGE_KEY, () => crypto.randomUUID());
  return userKey;
}
