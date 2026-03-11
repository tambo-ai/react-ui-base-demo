import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Tambo UI Demo",
  description:
    "The same headless AI chat skinned with 14 different design systems — built with @tambo-ai/react-ui-base",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html { font-size: 16px !important; -webkit-text-size-adjust: 100%; overflow-x: hidden; }
              body { margin: 0 !important; padding: 0 !important; font-size: 16px !important; overflow-x: hidden; }
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
