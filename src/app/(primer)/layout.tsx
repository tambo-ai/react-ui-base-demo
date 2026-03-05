"use client";
import "@primer/primitives/dist/css/functional/themes/light.css";
import { ThemeProvider, BaseStyles } from "@primer/react";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";

export default function PrimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider colorMode="day">
          <BaseStyles>
            <TamboProvider apiKey={tamboApiKey} userKey="demo-user">
              {children}
            </TamboProvider>
          </BaseStyles>
        </ThemeProvider>
      </body>
    </html>
  );
}
