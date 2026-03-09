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
  const { ref } = useScrollToBottom();
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
 * Auto-scrolls a container to the bottom whenever content changes.
 * Uses a callback ref so it works with conditionally rendered elements.
 * Combines MutationObserver, ResizeObserver, and polling for reliability.
 * Respects user scroll position — stops auto-scrolling when the user scrolls up.
 */
export function useScrollToBottom() {
  const elRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    const el = elRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
      isNearBottomRef.current = true;
    }
  }, []);

  const ref = useCallback((el: HTMLDivElement | null) => {
    // Cleanup previous observer
    cleanupRef.current?.();
    cleanupRef.current = null;
    elRef.current = el;

    if (!el) return;

    const BOTTOM_THRESHOLD = 500;

    const checkIfNearBottom = () => {
      return el.scrollTop + el.clientHeight >= el.scrollHeight - BOTTOM_THRESHOLD;
    };

    const doScroll = () => {
      if (!isNearBottomRef.current) return;
      el.scrollTop = el.scrollHeight;
    };

    // Scroll multiple times to handle layout timing issues with React 19
    const scheduleScroll = () => {
      if (!isNearBottomRef.current) return;
      el.scrollTop = el.scrollHeight;
      requestAnimationFrame(() => {
        if (!isNearBottomRef.current) return;
        el.scrollTop = el.scrollHeight;
        requestAnimationFrame(() => {
          if (!isNearBottomRef.current) return;
          el.scrollTop = el.scrollHeight;
        });
      });
    };

    // Track user scroll position
    const onScroll = () => {
      isNearBottomRef.current = checkIfNearBottom();
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    // MutationObserver catches DOM additions (new messages, text changes)
    const mutationObserver = new MutationObserver(scheduleScroll);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // ResizeObserver fires after layout when content size changes
    const resizeObserver = new ResizeObserver(doScroll);
    resizeObserver.observe(el);

    // Also observe direct children so we catch when inner content grows
    const observeChildren = () => {
      for (const child of Array.from(el.children)) {
        resizeObserver.observe(child);
      }
    };
    observeChildren();

    // Initial scroll
    isNearBottomRef.current = true;
    scheduleScroll();

    cleanupRef.current = () => {
      el.removeEventListener("scroll", onScroll);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

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
