"use client";
import "@carbon/react/index.scss";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";

export default function CarbonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="cds--layer-one">
        <TamboProvider apiKey={tamboApiKey} userKey="demo-user">
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
