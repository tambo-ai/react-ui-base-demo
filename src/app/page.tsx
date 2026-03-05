export default function Home() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1>Tambo UI Demo</h1>
      <p>Choose a demo skin:</p>
      <ul style={{ marginTop: 16, lineHeight: 2 }}>
        <li><a href="/primer">GitHub Primer</a></li>
        <li><a href="/polaris">Shopify Polaris</a></li>
        <li><a href="/carbon">IBM Carbon</a></li>
        <li><a href="/neobrutalism">Neobrutalism</a></li>
        <li><a href="/nes">NES.css</a></li>
        <li><a href="/retro">Retro-Futuristic</a></li>
      </ul>
    </main>
  );
}
