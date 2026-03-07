import { NextResponse } from "next/server";

interface HNItem {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  descendants?: number;
}

export async function GET() {
  const topIdsRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
  );
  const topIds: number[] = await topIdsRes.json();

  const items = await Promise.all(
    topIds.slice(0, 3).map(async (id) => {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      );
      const item: HNItem = await res.json();
      return {
        id: item.id,
        title: item.title,
        url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
        author: item.by,
        points: item.score,
        comments: item.descendants ?? 0,
      };
    }),
  );

  return NextResponse.json(items);
}
