export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

/** 로케일의 루트 경로 — 기본 로케일(ko)은 프리픽스 없음 */
export function localePath(locale: Locale): string {
  return locale === "ko" ? "/" : "/en";
}
