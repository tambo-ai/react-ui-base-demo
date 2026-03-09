"use client";
import "papercss/dist/paper.min.css";

export default function PaperCSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ height: "100vh" }}>
      {/* Load Neucha handwritten font for Paper CSS */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Neucha&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
