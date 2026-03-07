"use client";
import { useCallback, useSyncExternalStore } from "react";

const resolvedCache = new Map<string, string>();

function resolve(key: string, initialValue: string | (() => string)): string {
  const cached = resolvedCache.get(key);
  if (cached !== undefined) return cached;

  initialValue =
    typeof initialValue === "function" ? initialValue() : initialValue;

  if (typeof window === "undefined") {
    resolvedCache.set(key, initialValue);
    return initialValue;
  }

  const existing = localStorage.getItem(key);
  if (existing !== null) {
    resolvedCache.set(key, existing);
    return existing;
  }

  localStorage.setItem(key, initialValue);
  resolvedCache.set(key, initialValue);
  return initialValue;
}

export function useLocalStorage(
  key: string,
  initialValue: string | (() => string),
): [string, (value: string) => void] {
  const fallback = resolve(key, initialValue);

  const subscribe = useCallback(
    (callback: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    return localStorage.getItem(key) ?? fallback;
  }, [key, fallback]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: string) => {
      localStorage.setItem(key, next);
      resolvedCache.set(key, next);
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key],
  );

  return [value, setValue];
}
