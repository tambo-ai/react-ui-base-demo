"use client";
import "@carbon/styles/css/styles.css";

export default function CarbonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="cds--layer-one" style={{ fontSize: "0.875rem" }}>{children}</div>;
}
