"use client";
import { useLocalStorage } from "./use-local-storage";

const STORAGE_KEY = "tambo-demo-user-key";
const envUserKey = process.env.NEXT_PUBLIC_TAMBO_USER_KEY;

export function useUserKey(): string {
  const [localKey] = useLocalStorage(STORAGE_KEY, () => crypto.randomUUID());
  return envUserKey || localKey;
}
