"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export default function ChakraLayout({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}
