"use client";
import { Press_Start_2P } from "next/font/google";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";
import "nes.css/css/nes.min.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export default function NesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={pressStart2P.className}
        style={{
          backgroundColor: "#212529",
          color: "#fff",
          margin: 0,
          height: "100vh",
        }}
      >
        <TamboProvider apiKey={tamboApiKey} userKey="demo-user">{children}</TamboProvider>
      </body>
    </html>
  );
}
