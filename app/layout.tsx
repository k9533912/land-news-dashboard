import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "한국도로공사 토지부문 언론동향",
  description: "토지보상·토지임대·무단점유 관련 최신 뉴스 모니터링",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "'Malgun Gothic', Arial, sans-serif", background: "#f0f4f8" }}>
        {children}
      </body>
    </html>
  );
}
