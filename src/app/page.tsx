'use client';

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

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        Tambo UI Demo
      </h1>
      <p style={{ fontSize: 18, color: "#666", marginBottom: 40 }}>
        The same headless AI chat — {skins.length} different design systems. Pick a skin to
        see it in action.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {skins.map((skin) => (
          <a
            key={skin.href}
            href={skin.href}
            style={{
              display: "block",
              textDecoration: "none",
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 24,
              backgroundColor: skin.bg,
              transition: "transform 0.15s, box-shadow 0.15s",
              color: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <div
              style={{
                width: 40,
                height: 6,
                borderRadius: 3,
                backgroundColor: skin.color,
                marginBottom: 16,
              }}
            />
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                margin: "0 0 8px",
                color: ["#ff6a00", "#ff00ff"].includes(skin.color) ? "#333" : skin.color,
              }}
            >
              {skin.name}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: skin.bg === "#050505" || skin.bg === "#1a103c" ? "#999" : "#666",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {skin.description}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
