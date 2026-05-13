import { fetchNews } from "@/lib/fetchNews";

const CATEGORY_COLORS: Record<string, string> = {
  토지보상: "#1F497D",
  토지임대: "#2E7D32",
  무단점유: "#B71C1C",
};

export default async function Page() {
  const articles = await fetchNews();
  const now = new Date();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${weekdays[now.getDay()]})`;
  const total = Object.values(articles).reduce((s, v) => s + v.length, 0);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      {/* 헤더 */}
      <div style={{ background: "#1F497D", color: "white", borderRadius: "12px 12px 0 0", padding: "24px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: "bold" }}>한국도로공사 토지부문 언론동향</h1>
        <p style={{ margin: "8px 0 0", fontSize: 13, opacity: 0.85 }}>기준일: {dateStr} &nbsp;|&nbsp; 보고자: 김재웅</p>
      </div>

      <div style={{ background: "white", border: "1px solid #ddd", borderTop: "none", borderRadius: "0 0 12px 12px", padding: 24 }}>
        {/* 핵심 요약 */}
        <h2 style={{ color: "#1F497D", fontSize: 16, borderBottom: "2px solid #1F497D", paddingBottom: 6 }}>■ 핵심 요약</h2>
        {total === 0 ? (
          <p style={{ color: "#888", fontSize: 13 }}>해당 기간 내 관련 기사가 없습니다.</p>
        ) : (
          <table style={{ borderCollapse: "collapse", marginBottom: 8, width: "100%" }}>
            <thead>
              <tr style={{ background: "#f0f4f8" }}>
                <th style={{ padding: "6px 16px", textAlign: "left", fontSize: 13 }}>카테고리</th>
                <th style={{ padding: "6px 16px", textAlign: "left", fontSize: 13 }}>건수</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(articles).map(([cat, items]) => (
                <tr key={cat}>
                  <td style={{ padding: "5px 16px", fontSize: 13 }}>{cat}</td>
                  <td style={{ padding: "5px 16px", fontSize: 13, fontWeight: "bold" }}>{items.length}건</td>
                </tr>
              ))}
              <tr style={{ background: "#e8f0fe" }}>
                <td style={{ padding: "5px 16px", fontSize: 13, fontWeight: "bold" }}>합계</td>
                <td style={{ padding: "5px 16px", fontSize: 13, fontWeight: "bold" }}>{total}건</td>
              </tr>
            </tbody>
          </table>
        )}

        <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "20px 0" }} />

        {/* 카테고리별 기사 */}
        {Object.entries(articles).map(([cat, items], idx) => (
          <div key={cat}>
            <h2 style={{ color: CATEGORY_COLORS[cat] ?? "#1F497D", fontSize: 16, borderBottom: `2px solid ${CATEGORY_COLORS[cat] ?? "#1F497D"}`, paddingBottom: 6 }}>
              ■ {idx + 1}. {cat}
            </h2>
            {items.length === 0 ? (
              <p style={{ color: "#888", fontSize: 13 }}>※ 해당 기간 내 관련 기사 없음</p>
            ) : (
              items.map((art, i) => (
                <div key={i} style={{ marginBottom: 14, padding: "12px 16px", background: "#f9f9f9", borderLeft: `4px solid ${CATEGORY_COLORS[cat] ?? "#1F497D"}`, borderRadius: 4 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "bold", fontSize: 14 }}>[{i + 1}] {art.title}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666" }}>출처: {art.publisher} &nbsp;|&nbsp; 게재일: {art.pubDate}</p>
                  {art.description && <p style={{ margin: "0 0 6px", fontSize: 13 }}>{art.description.slice(0, 200)}{art.description.length > 200 ? "…" : ""}</p>}
                  <a href={art.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#0056B3" }}>기사 바로가기 →</a>
                </div>
              ))
            )}
            <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "20px 0" }} />
          </div>
        ))}

        <p style={{ fontSize: 11, color: "#aaa", textAlign: "center" }}>
          본 보고서는 네이버 뉴스 검색 API 기반으로 자동 생성됩니다.
        </p>
      </div>
    </main>
  );
}
