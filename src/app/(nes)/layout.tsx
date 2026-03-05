"use client";
import { Press_Start_2P } from "next/font/google";
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
