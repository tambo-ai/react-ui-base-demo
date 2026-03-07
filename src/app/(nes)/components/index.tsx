"use client";

import * as React from "react";
import { PropsWithChildren } from "react";

// -- Button --

export interface NesButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

export function NesButton({
  variant = "default",
  className,
  ...props
}: NesButtonProps) {
  const variantClass =
    variant === "default" ? "" : ` is-${variant}`;
  return (
    <button
      className={`nes-btn${variantClass}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

// -- Heading --

export function NesHeading({
  children,
  style,
  ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: 10,
        fontWeight: 400,
        color: "#fff",
        ...style,
      }}
      {...props}
    >
      {children}
    </h2>
  );
}

// -- Container --

export interface NesContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "rounded" | "dark" | "rounded-dark";
}

export function NesContainer({
  variant = "default",
  className,
  ...props
}: NesContainerProps) {
  const classes = ["nes-container"];
  if (variant === "rounded" || variant === "rounded-dark")
    classes.push("is-rounded");
  if (variant === "dark" || variant === "rounded-dark")
    classes.push("is-dark");
  if (className) classes.push(className);
  return <div className={classes.join(" ")} {...props} />;
}

// -- Balloon (message bubble) --

export interface NesBalloonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "right";
}

export function NesBalloon({
  direction = "left",
  children,
  className,
  ...props
}: NesBalloonProps) {
  return (
    <div
      className={`nes-balloon from-${direction}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

// -- NavList (sidebar thread list) --

export function NesNavList({
  children,
  ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 4 }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface NesNavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export function NesNavItem({
  isActive,
  className,
  style,
  ...props
}: NesNavItemProps) {
  return (
    <button
      className={isActive ? "nes-btn is-warning" : "nes-btn"}
      style={{
        display: "block",
        width: "100%",
        fontSize: 8,
        textAlign: "left" as const,
        cursor: "pointer",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap" as const,
        ...style,
      }}
      {...props}
    />
  );
}

// -- Spinner / Loading --

export function NesSpinner({
  size = "small",
}: {
  size?: "small" | "medium";
}) {
  const iconSize = size === "small" ? "is-small" : "is-medium";
  return (
    <span style={{ display: "inline-flex", animation: "nes-blink 1s infinite" }}>
      <i className={`nes-icon star ${iconSize}`} />
    </span>
  );
}

// -- Timeline (for reasoning/toolcall display) --

export function NesTimeline({
  children,
  ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        borderLeft: "4px solid #f7dc6f",
        paddingLeft: 8,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function NesTimelineItem({
  children,
  icon,
  ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode }>) {
  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 8 }}
      {...props}
    >
      {icon && <span style={{ flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
