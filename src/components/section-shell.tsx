import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getSections, type SectionId } from "@/data/sections";

interface SectionShellProps {
  id: SectionId;
  locale: Locale;
  children: ReactNode;
}

/** 좌측 sticky 마커·제목 + 우측 본문의 2단 문서형 섹션 레이아웃 — 번호·제목은 섹션 정의에서 도출 */
export function SectionShell({ id, locale, children }: SectionShellProps) {
  const section = getSections(locale).find((s) => s.id === id);
  return (
    <section id={id} className="scroll-mt-20 border-t border-line">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 md:grid-cols-[180px_1fr] md:gap-12 md:py-24">
        <div className="md:sticky md:top-24 md:self-start">
          <h2 className="flex items-baseline gap-3">
            <span aria-hidden className="font-serif text-xl font-bold text-accent">
              {section?.marker}.
            </span>
            <span className="text-xl font-bold tracking-tight">
              {section?.title}
            </span>
          </h2>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
