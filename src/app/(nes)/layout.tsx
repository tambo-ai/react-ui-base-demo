"use client";
import localFont from "next/font/local";
import "nes.css/css/nes.min.css";

const pressStart2P = localFont({
  src: "./PressStart2P-Regular.ttf",
  weight: "400",
  display: "swap",
});

export default function NesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={pressStart2P.className}
      style={{
        backgroundColor: "#212529",
        color: "#fff",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
}
