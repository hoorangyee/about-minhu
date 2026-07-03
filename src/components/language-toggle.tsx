"use client";

import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/config";
import { ui } from "@/i18n/ui";

/** 반대 로케일로 이동하는 토글 — 현재 보고 있는 섹션(해시)을 유지한다 */
export function LanguageToggle({ locale }: { locale: Locale }) {
  const target = localePath(locale === "ko" ? "en" : "ko");
  const dict = ui[locale].header;
  return (
    <a
      href={target}
      aria-label={dict.langSwitch}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = target + window.location.hash;
      }}
      className="flex h-9 items-center justify-center rounded-md px-2 font-mono text-xs font-semibold text-muted transition-colors hover:bg-accent-soft hover:text-accent"
    >
      {dict.langLabel}
    </a>
  );
}
