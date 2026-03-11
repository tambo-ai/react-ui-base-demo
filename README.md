# Tambo UI Base Demo

**One headless AI chat, 14 design systems.** A live showcase of [`@tambo-ai/react-ui-base`](https://github.com/tambo-ai/tambo/tree/main/packages/react-ui-base) — the unstyled primitive layer from [Tambo](https://tambo.co) that lets you build AI chat interfaces with any component library or design system.

Browse the full component library at **[ui.tambo.co](https://ui.tambo.co)**.

## What This Demonstrates

The same Tambo-powered AI chat — thread history, message rendering, tool calls, reasoning traces, file attachments, and generative components — skinned with 14 completely different UI frameworks:

| Skin | Library | Style |
|------|---------|-------|
| **GitHub Primer** | `@primer/react` | Clean, developer-focused |
| **Shopify Polaris** | `@shopify/polaris` | Commerce-grade, friendly |
| **IBM Carbon** | `@carbon/react` | Enterprise, systematic |
| **Ant Design** | `antd` | Feature-rich, enterprise |
| **Mantine** | `@mantine/core` | Modern, polished |
| **Chakra UI** | `@chakra-ui/react` | Composable, accessible |
| **Neobrutalism** | Custom (Tailwind) | Bold borders, chunky shadows |
| **DaisyUI** | `daisyui` | Cyberpunk Tailwind theme |
| **NES.css** | `nes.css` | 8-bit pixel art retro |
| **Windows 98** | `98.css` | Classic Win98 interface |
| **Windows XP** | `xp.css` | Luna blue theme |
| **Paper CSS** | `papercss` | Hand-drawn, sketchy |
| **Pico CSS** | `@picocss/pico` | Classless semantic CSS |
| **Retro-Futuristic** | Custom CSS | Amber CRT terminal, cassette futurism |

Every skin uses the exact same headless primitives from `@tambo-ai/react-ui-base`. The only thing that changes is the styling layer.

## What is `@tambo-ai/react-ui-base`?

A headless (unstyled) component library that provides the structure and behavior for AI chat interfaces without imposing any visual design. It follows a compound component pattern with `render` prop delegation, so you can slot in any design system's elements.

### Primitives included

- **`ThreadContent`** — message list container with filtering and empty/loading states
- **`ThreadHistory`** — thread sidebar with search, new-thread button, and active-thread tracking
- **`ThreadDropdown`** — compact thread switcher as a dropdown
- **`Message`** — individual message with content, images, rendered components, and loading indicator
- **`MessageInput`** — textarea with submit/stop buttons, file attachment, staged images, and elicitation support
- **`ReasoningInfo`** — collapsible reasoning/thinking trace display
- **`ToolcallInfo`** — tool call status, parameters, and results with expand/collapse
- **`GenerationStage`** — streaming vs. waiting state branching
- **`Elicitation`** — dynamic form fields for agent-driven user input
- **`McpPrompts`** / **`McpResources`** — MCP protocol prompt and resource browsing

```tsx
import {
  ThreadContent,
  ThreadHistory,
  Message,
  MessageInput,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";
```

### How it works

Each primitive exposes a `render` prop that accepts either a React element or a render function with access to component state. You provide the visual shell; the primitive handles all the wiring.

```tsx
<MessageInput.SubmitButton
  render={
    <IconButton
      icon={PaperAirplaneIcon}
      variant="primary"
      aria-label="Send"
    />
  }
/>
```

```tsx
<ToolcallInfo.StatusIcon
  render={(_props, state) => {
    switch (state.status) {
      case "loading":
        return <Spinner size="small" />;
      case "success":
        return <CheckCircleIcon />;
      case "error":
        return <AlertIcon />;
    }
  }}
/>
```

## What is Tambo?

[Tambo](https://github.com/tambo-ai/tambo) is an open-source React toolkit for building agents that render UI (generative UI). Register your components with Zod schemas, and the AI agent picks the right one and streams props so users can interact with real components — not just text.

- Streaming infrastructure with cancellation, error recovery, and reconnection
- MCP integration (tools, prompts, elicitations, sampling)
- Client-side tool execution
- Works with OpenAI, Anthropic, Gemini, Mistral, and any OpenAI-compatible provider
- MIT licensed, self-hostable or use Tambo Cloud

Learn more: [docs.tambo.co](https://docs.tambo.co) | [GitHub](https://github.com/tambo-ai/tambo) | [Discord](https://discord.gg/dJNvPEHth6)

## Getting Started

```bash
git clone https://github.com/tambo-ai/react-ui-base-demo.git
cd react-ui-base-demo
npm install
```

Create a `.env.local` file with your Tambo API key:

```
NEXT_PUBLIC_TAMBO_API_KEY=your-key-here
```

Get a free key at [tambo.co](https://tambo.link/yXkF0hQ).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and pick a skin.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Skin picker landing page
│   ├── (primer)/primer/            # GitHub Primer skin
│   ├── (polaris)/polaris/          # Shopify Polaris skin
│   ├── (carbon)/carbon/            # IBM Carbon skin
│   ├── (antd)/antd/                # Ant Design skin
│   ├── (mantine)/mantine/          # Mantine skin
│   ├── (chakra)/chakra/            # Chakra UI skin
│   ├── (neobrutalism)/neobrutalism/# Neobrutalism skin
│   ├── (daisyui)/daisyui/          # DaisyUI skin
│   ├── (nes)/nes/                  # NES.css skin
│   ├── (win98)/win98/              # Windows 98 skin
│   ├── (winxp)/winxp/              # Windows XP skin
│   ├── (papercss)/papercss/        # Paper CSS skin
│   ├── (pico)/pico/                # Pico CSS skin
│   └── (retro)/retro/              # Retro-futuristic skin
├── components/
│   └── chat-layout.tsx             # Shared layout primitives
└── lib/
    ├── demo-component.tsx          # StatusCard generative component
    ├── hackernews-component.tsx    # HackerNews generative component
    ├── hackernews-tool.ts          # Client-side tool (fetches HN posts)
    └── initial-messages.ts         # Seed conversation
```

## Tech Stack

- [Next.js](https://nextjs.org) 16 with App Router
- [React](https://react.dev) 19
- [`@tambo-ai/react`](https://www.npmjs.com/package/@tambo-ai/react) — Tambo React SDK
- [`@tambo-ai/react-ui-base`](https://www.npmjs.com/package/@tambo-ai/react-ui-base) — headless UI primitives
- [Tailwind CSS](https://tailwindcss.com) 4

## License

MIT
