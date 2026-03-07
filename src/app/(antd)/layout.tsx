"use client";
import { ConfigProvider } from "antd";

export default function AntdLayout({ children }: { children: React.ReactNode }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}
