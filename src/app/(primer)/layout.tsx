"use client";
import "@primer/primitives/dist/css/functional/themes/light.css";
import { ThemeProvider, BaseStyles } from "@primer/react";

export default function PrimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider colorMode="day">
      <BaseStyles>{children}</BaseStyles>
    </ThemeProvider>
  );
}
