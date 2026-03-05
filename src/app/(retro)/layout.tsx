"use client";
import "./retro-globals.css";

export default function RetroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#050505",
        color: "#ffb000",
        height: "100vh",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {children}
    </div>
  );
}
