import { NextResponse } from "next/server";

const CATEGORIES: Record<string, string[]> = {
  토지보상: ["한국도로공사 토지보상", "도로공사 수용재결", "도로공사 보상금 토지"],
  토지임대: ["한국도로공사 토지임대", "도로공사 부지임대", "도로공사 도로점용"],
  무단점유: ["한국도로공사 무단점유", "도로공사 변상금"],
};

interface NaverItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

interface Article {
  title: string;
  description: string;
  link: string;
  publisher: string;
  pubDate: string;
}

function stripTags(text: string) {
  return text.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

async function fetchNews(query: string, clientId: string, clientSecret: string): Promise<NaverItem[]> {
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=5&sort=date`;
  const res = await fetch(url, {
    headers: { "X-Naver-Client-Id": clientId, "X-Naver-Client-Secret": clientSecret },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export async function GET() {
  const clientId = process.env.NAVER_CLIENT_ID ?? "";
  const clientSecret = process.env.NAVER_CLIENT_SECRET ?? "";

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Naver API keys not configured" }, { status: 500 });
  }

  const results: Record<string, Article[]> = {};
  const seenLinks = new Set<string>();
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;

  for (const [category, queries] of Object.entries(CATEGORIES)) {
    results[category] = [];
    for (const query of queries) {
      const items = await fetchNews(query, clientId, clientSecret);
      for (const item of items) {
        const key = item.originallink || item.link;
        if (seenLinks.has(key)) continue;
        const pubTime = new Date(item.pubDate).getTime();
        if (pubTime < cutoff) continue;
        seenLinks.add(key);
        const publisher = (item.originallink || item.link).replace(/^https?:\/\//, "").split("/")[0];
        results[category].push({
          title: stripTags(item.title),
          description: stripTags(item.description),
          link: item.originallink || item.link,
          publisher,
          pubDate: new Date(item.pubDate).toLocaleDateString("ko-KR"),
        });
      }
    }
  }

  return NextResponse.json({ articles: results, generatedAt: new Date().toISOString() });
}
