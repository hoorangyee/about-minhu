import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/data/content";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogAlt(locale: Locale) {
  const { profile } = getContent(locale);
  return `${profile.name} — ${profile.role}`;
}

/** 로케일별 OG 이미지 렌더링 — (ko)/(en) 라우트 그룹의 opengraph-image가 공유 */
export async function renderOgImage(locale: Locale) {
  const { profile } = getContent(locale);
  const pretendardBold = await readFile(
    path.join(
      process.cwd(),
      "node_modules/pretendard/dist/web/static/woff/Pretendard-Bold.woff",
    ),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f8f8f7",
          color: "#191b1f",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#3452c4",
            }}
          />
          <div style={{ fontSize: 28, color: "#5f6672" }}>{profile.role}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {profile.headline.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#3452c4" }}>
          {profile.name}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: "Pretendard",
          data: pretendardBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
