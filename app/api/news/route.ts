import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchNews";

export async function GET() {
  const articles = await fetchNews();
  return NextResponse.json({ articles, generatedAt: new Date().toISOString() });
}
