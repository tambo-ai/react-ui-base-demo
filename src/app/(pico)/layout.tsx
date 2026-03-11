"use client";
import "@picocss/pico/css/pico.min.css";

export default function PicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ height: "100vh", fontSize: "1rem" }}>{children}</div>;
}
