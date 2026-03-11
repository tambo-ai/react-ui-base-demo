import { NextResponse } from "next/server";
import https from "node:https";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

interface HNItem {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  descendants?: number;
}

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    https.get(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        agent,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString()));
          } catch (e) {
            reject(e);
          }
        });
      }
    ).on("error", reject);
  });
}

export async function GET() {
  try {
    const topIds = await fetchJson<number[]>(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );

    const items = await Promise.all(
      topIds.slice(0, 3).map(async (id) => {
        const item = await fetchJson<HNItem>(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return {
          id: item.id,
          title: item.title,
          url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
          author: item.by,
          points: item.score,
          comments: item.descendants ?? 0,
        };
      })
    );

    return NextResponse.json(items);
  } catch (err) {
    console.error("HN API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch HN posts" },
      { status: 500 }
    );
  }
}
