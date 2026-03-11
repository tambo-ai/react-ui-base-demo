"use client";

const skins = [
  {
    name: "GitHub Primer",
    href: "/primer",
    description: "GitHub's design system — clean, minimal, developer-focused",
    color: "#1f883d",
    bg: "#f6f8fa",
  },
  {
    name: "Shopify Polaris",
    href: "/polaris",
    description: "Shopify's commerce design system — friendly and functional",
    color: "#008060",
    bg: "#f1f8f5",
  },
  {
    name: "IBM Carbon",
    href: "/carbon",
    description: "IBM's enterprise design system — structured and systematic",
    color: "#0f62fe",
    bg: "#edf5ff",
  },
  {
    name: "Ant Design",
    href: "/antd",
    description: "The world's most popular React UI library — enterprise-grade",
    color: "#1677ff",
    bg: "#e6f4ff",
  },
  {
    name: "Mantine",
    href: "/mantine",
    description: "Modern React components — polished and developer-friendly",
    color: "#228be6",
    bg: "#e7f5ff",
  },
  {
    name: "Chakra UI",
    href: "/chakra",
    description: "Composable React components — accessible and flexible",
    color: "#319795",
    bg: "#e6fffa",
  },
  {
    name: "Neobrutalism",
    href: "/neobrutalism",
    description: "Bold borders, chunky shadows, playful chaos — neobrutalism.dev",
    color: "#000000",
    bg: "#FFF8DC",
  },
  {
    name: "DaisyUI",
    href: "/daisyui",
    description: "Tailwind component classes — cyberpunk theme",
    color: "#ff00ff",
    bg: "#1a103c",
  },
  {
    name: "NES.css",
    href: "/nes",
    description: "8-bit pixel art retro gaming aesthetic",
    color: "#212529",
    bg: "#fff",
  },
  {
    name: "Windows 98",
    href: "/win98",
    description: "Faithful recreation of the classic Win98 interface — 98.css",
    color: "#000080",
    bg: "#c0c0c0",
  },
  {
    name: "Windows XP",
    href: "/winxp",
    description: "Luna blue theme from the golden age of Windows — XP.css",
    color: "#003c74",
    bg: "#ECE9D8",
  },
  {
    name: "Paper CSS",
    href: "/papercss",
    description: "Hand-drawn, sketchy borders — everything looks handmade",
    color: "#41403e",
    bg: "#fff",
  },
  {
    name: "Pico CSS",
    href: "/pico",
    description: "Classless semantic CSS — beautiful with zero classes",
    color: "#546b78",
    bg: "#f8f9fa",
  },
  {
    name: "Retro-Futuristic",
    href: "/retro",
    description: "Amber phosphor CRT terminal — cassette futurism aesthetic",
    color: "#ff6a00",
    bg: "#050505",
  },
];

const LINKS = [
  { label: "Component Library", href: "https://ui.tambo.co" },
  { label: "Docs", href: "https://docs.tambo.co" },
  { label: "GitHub", href: "https://github.com/tambo-ai/tambo" },
  { label: "Discord", href: "https://discord.gg/dJNvPEHth6" },
];

function isDark(bg: string) {
  const hex = bg.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=DM+Sans:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fafaf8; }

        .skin-card {
          display: block;
          text-decoration: none;
          border-radius: 10px;
          padding: 22px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          color: inherit;
          position: relative;
        }
        .skin-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        .link-subtle {
          color: #888;
          text-decoration: none;
          transition: color 0.15s;
        }
        .link-subtle:hover { color: #333; }

        .skin-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 580px) {
          .skin-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 820px) {
          .skin-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1080px) {
          .skin-grid { grid-template-columns: repeat(5, 1fr); }
        }
      `}</style>

      <main style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <header style={{ padding: "40px 32px 0", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}>
            <a
              href="https://tambo.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/octo-icon.svg"
                alt="Tambo"
                width={36}
                height={36}
                style={{ borderRadius: 8 }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tambo-wordmark.svg"
                alt="Tambo"
                height={20}
                style={{ opacity: 0.85 }}
              />
            </a>

            <nav style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-subtle"
                  style={{ fontSize: 14 }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <h1 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 38,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#1a1a1a",
            marginBottom: 10,
            lineHeight: 1.2,
          }}>
            One headless chat,{" "}
            <em style={{ fontStyle: "italic" }}>{skins.length} design systems</em>
          </h1>
          <p style={{
            fontSize: 16,
            color: "#777",
            marginBottom: 36,
            lineHeight: 1.6,
            maxWidth: 520,
          }}>
            The same AI chat built with{" "}
            <a
              href="https://www.npmjs.com/package/@tambo-ai/react-ui-base"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              @tambo-ai/react-ui-base
            </a>{" "}
            — pick a skin to see it in action.
          </p>
        </header>

        {/* Grid */}
        <section style={{ padding: "0 32px 48px", maxWidth: 1200, margin: "0 auto" }}>
          <div className="skin-grid">
            {skins.map((skin) => {
              const dark = isDark(skin.bg);
              return (
                <a
                  key={skin.href}
                  href={skin.href}
                  className="skin-card"
                  style={{
                    backgroundColor: skin.bg,
                    border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: skin.color,
                      marginBottom: 14,
                      opacity: 0.75,
                    }}
                  />
                  <h2
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 16,
                      fontWeight: 500,
                      margin: "0 0 6px",
                      color: dark ? "#fff" : "#1a1a1a",
                    }}
                  >
                    {skin.name}
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)",
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {skin.description}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: "20px 32px",
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>
            Built with{" "}
            <a
              href="https://github.com/tambo-ai/tambo"
              target="_blank"
              rel="noopener noreferrer"
              className="link-subtle"
            >
              Tambo
            </a>
            {" — "}open-source generative UI for React
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-subtle"
                style={{ fontSize: 13 }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </>
  );
}
