"use client";
import "@carbon/styles/css/styles.css";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import { statusCardComponent } from "@/lib/demo-component";
import { initialMessages } from "@/lib/initial-messages";

export default function CarbonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="cds--layer-one">
        <TamboProvider
          apiKey={tamboApiKey}
          userKey="demo-user"
          components={[statusCardComponent]}
          initialMessages={initialMessages}
        >
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
