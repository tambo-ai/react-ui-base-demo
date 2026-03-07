import "@primer/primitives/dist/css/functional/themes/light.css";
import { ThemeProvider, BaseStyles } from "@primer/react";

export default function PrimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider colorMode="auto">
      <BaseStyles
        style={
          {
            "--base-duration-1000": "1000ms",
            "--base-easing-linear": "cubic-bezier(0,0,1,1)",
          } as React.CSSProperties
        }
      >
        {children}
      </BaseStyles>
    </ThemeProvider>
  );
}
