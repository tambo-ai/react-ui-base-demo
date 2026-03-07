"use client";
import "papercss/dist/paper.min.css";

export default function PaperCSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ height: "100vh" }}>{children}</div>;
}
