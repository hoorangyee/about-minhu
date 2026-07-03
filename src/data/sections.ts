import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

/** 페이지 섹션 순서 정의 — 마커는 순서에서, 제목은 로케일 사전에서 도출 */
const sectionIds = [
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export function getSections(locale: Locale) {
  return sectionIds.map((id, i) => ({
    id,
    marker: `${i + 1}`,
    title: ui[locale].sections[id],
  }));
}

export type SectionDef = ReturnType<typeof getSections>[number];
