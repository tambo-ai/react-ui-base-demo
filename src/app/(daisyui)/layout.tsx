"use client";
import "./daisyui-globals.css";

export default function DaisyUILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="cyberpunk" style={{ height: "100vh" }}>
      {children}
    </div>
  );
}
