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
        color: "#ff6a00",
        height: "100vh",
        fontFamily: "'VT323', 'Courier New', monospace",
      }}
    >
      {children}
    </div>
  );
}
