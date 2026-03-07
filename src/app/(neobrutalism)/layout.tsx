"use client";
import "./neobrutalism-globals.css";

export default function NeobrutalismLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground font-base" style={{ height: "100vh" }}>
      {children}
    </div>
  );
}
