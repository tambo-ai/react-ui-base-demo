/**
 * Shared route definitions for all recording scripts.
 * Ordered per storyboard — maximum visual contrast between adjacent cuts.
 */

export interface Route {
  name: string;
  path: string;
  hasChat: boolean;
}

export const routes: Route[] = [
  { name: "landing", path: "/", hasChat: false },
  { name: "primer", path: "/primer", hasChat: true },
  { name: "neobrutalism", path: "/neobrutalism", hasChat: true },
  { name: "carbon", path: "/carbon", hasChat: true },
  { name: "nes", path: "/nes", hasChat: true },
  { name: "polaris", path: "/polaris", hasChat: true },
  { name: "retro", path: "/retro", hasChat: true },
  { name: "daisyui", path: "/daisyui", hasChat: true },
  { name: "mantine", path: "/mantine", hasChat: true },
  { name: "win98", path: "/win98", hasChat: true },
  { name: "chakra", path: "/chakra", hasChat: true },
  { name: "winxp", path: "/winxp", hasChat: true },
  { name: "papercss", path: "/papercss", hasChat: true },
  { name: "pico", path: "/pico", hasChat: true },
  { name: "antd", path: "/antd", hasChat: true },
];

/** Only routes that have a chat widget. */
export const chatRoutes = routes.filter((r) => r.hasChat);
