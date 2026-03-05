"use client";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";

export default function PolarisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider i18n={{}}>
          <TamboProvider apiKey={tamboApiKey} userKey="demo-user">
            {children}
          </TamboProvider>
        </AppProvider>
      </body>
    </html>
  );
}
