"use client";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";

export default function PolarisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProvider i18n={{}}>{children}</AppProvider>;
}
