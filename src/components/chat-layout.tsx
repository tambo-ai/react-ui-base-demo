import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  type HTMLAttributes,
} from "react";

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "normal" | "dense";
}

interface DividerProps {
  divider?: boolean;
}

function paddingStyle(
  size: "normal" | "dense" = "normal",
  axis: "x" | "y" | "both" = "both",
) {
  const value = size === "normal" ? 16 : 8;
  switch (axis) {
    case "x":
      return { paddingLeft: value, paddingRight: value };
    case "y":
      return { paddingTop: value, paddingBottom: value };
    case "both":
    default:
      return { padding: value };
  }
}

interface ChatLayoutColors {
  border?: string;
}

function ChatLayoutRoot({
  children,
  style,
  className,
  colors,
  ...rest
}: Omit<LayoutProps, "padding"> & { colors?: ChatLayoutColors }) {
  const colorStyleVariables = {
    "--cl-border-color": colors?.border ?? "#eee",
  } as React.CSSProperties;

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gridTemplateRows: "auto 1fr auto",
        height: "100vh",
        overflow: "hidden",
        ...colorStyleVariables,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ChatLayoutSidebar({
  children,
  style,
  className,
  padding,
  divider,
  ...rest
}: LayoutProps & DividerProps) {
  return (
    <div
      className={className}
      style={{
        gridColumn: 1,
        gridRow: "1 / 4",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...(divider
          ? { borderRight: "1px solid var(--cl-border-color, #eee)" }
          : {}),
        ...paddingStyle(padding),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ChatLayoutBreadcrumb({
  children,
  style,
  className,
  padding,
  ...rest
}: LayoutProps) {
  return (
    <div
      className={className}
      style={{
        gridColumn: 2,
        gridRow: 1,
        ...paddingStyle(padding),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ChatLayoutMessageArea({
  children,
  style,
  className,
  padding,
  ...rest
}: LayoutProps) {
  return (
    <div
      className={className}
      style={{
        gridColumn: 2,
        gridRow: 2,
        ...paddingStyle(padding),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ChatLayoutContent({
  children,
  style,
  className,
  autoScroll = true,
  ...rest
}: LayoutProps & { autoScroll?: boolean }) {
  const { ref } = useScrollToBottom(500);
  return (
    <div
      ref={autoScroll ? ref : undefined}
      className={className}
      style={{
        overflowY: "auto",
        flex: "1 1 auto",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Auto-scrolls a container to the bottom when content changes,
 * but only if the user is already near the bottom (within `threshold` px).
 */
export function useScrollToBottom(threshold = 80) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      if (nearBottom) {
        el.scrollTop = el.scrollHeight;
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, scrollToBottom };
}

function ChatLayoutInputArea({
  children,
  style,
  className,
  padding,
  ...rest
}: LayoutProps) {
  return (
    <div
      className={className}
      style={{
        gridColumn: 2,
        gridRow: 3,
        ...paddingStyle(padding),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ChatLayoutContainer({
  size = "full",
  padding,
  ...rest
}: LayoutProps & {
  size?: "full" | "large" | "medium" | "small";
}) {
  const maxWidth = {
    full: "100%",
    large: 960,
    medium: 640,
    small: 480,
  }[size];
  return (
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        ...paddingStyle(padding, "x"),
      }}
      {...rest}
    />
  );
}

export const ChatLayout = {
  Root: ChatLayoutRoot,
  Sidebar: ChatLayoutSidebar,
  Content: ChatLayoutContent,
  Container: ChatLayoutContainer,
  Breadcrumb: ChatLayoutBreadcrumb,
  MessageArea: ChatLayoutMessageArea,
  InputArea: ChatLayoutInputArea,
};
