"use client";
import "./neobrutalism-globals.css";

export default function NeobrutalismLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#FAFAF9",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
