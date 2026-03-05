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
    name: "Neobrutalism",
    href: "/neobrutalism",
    description: "Bold borders, chunky shadows, playful chaos",
    color: "#000000",
    bg: "#FFF8DC",
  },
  {
    name: "NES.css",
    href: "/nes",
    description: "8-bit pixel art retro gaming aesthetic",
    color: "#212529",
    bg: "#fff",
  },
  {
    name: "Retro-Futuristic",
    href: "/retro",
    description: "Amber phosphor terminal with scanline effects",
    color: "#ffb000",
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
        The same headless AI chat — six different design systems. Pick a skin to
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
                color: skin.color === "#ffb000" ? "#333" : skin.color,
              }}
            >
              {skin.name}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#666",
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
