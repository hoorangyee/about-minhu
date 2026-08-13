"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { profile as profileKo } from "@/data/profile";
import { profile as profileEn } from "@/data/en/profile";
import { getSections } from "@/data/sections";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

/*
 * content.ts는 projectDetails까지 포함한 로케일 전체 데이터를 한 객체로 묶습니다.
 * Header는 클라이언트 컴포넌트라 getContent를 쓰면 그 객체 전체가 클라이언트 번들에
 * 실리므로, 실제로 쓰는 profile만 로케일별로 직접 가져옵니다.
 */
export function Header({ locale }: { locale: Locale }) {
  const profile = locale === "ko" ? profileKo : profileEn;
  const dict = ui[locale].header;
  const sections = getSections(locale);

  const [activeId, setActiveId] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  // 내비 클릭 직후에는 클릭한 섹션을 고정한다. 마지막 두 섹션처럼 같은 최하단
  // 스크롤 위치를 공유하는 경우 기하 계산만으로는 클릭 의도를 구분할 수 없기 때문.
  // 사용자가 직접 스크롤 입력(휠·터치·키보드)을 하면 고정을 풀고 계산으로 복귀한다.
  const pinnedId = useRef<string | null>(null);

  function handleNavClick(id: string) {
    pinnedId.current = id;
    setActiveId(id);
    setMenuOpen(false);
  }

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      if (pinnedId.current !== null) {
        setActiveId(pinnedId.current);
        return;
      }
      // 마지막 섹션은 페이지를 끝까지 내려도 기준선에 닿지 못할 수 있으므로 바닥 도달을 우선 판정
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActiveId(sections[sections.length - 1].id);
        return;
      }
      // 기준선(뷰포트 38% 지점)을 지난 마지막 섹션을 활성으로 판정 — 히어로에서는 없음("")
      const anchorY = window.innerHeight * 0.38;
      let current = "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= anchorY) current = s.id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    const unpin = () => {
      if (pinnedId.current !== null) {
        pinnedId.current = null;
        schedule();
      }
    };
    // 직접 링크(예: /#contact)로 진입한 경우에도 해당 섹션을 고정
    const hashId = window.location.hash.slice(1);
    if (sections.some((s) => s.id === hashId)) {
      pinnedId.current = hashId;
    }
    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("wheel", unpin, { passive: true });
    window.addEventListener("touchstart", unpin, { passive: true });
    window.addEventListener("keydown", unpin);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", unpin);
      window.removeEventListener("touchstart", unpin);
      window.removeEventListener("keydown", unpin);
      if (raf) cancelAnimationFrame(raf);
    };
    // sections는 locale별 정적 데이터라 참조만 바뀌고 내용 구조는 동일
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a
          href="#top"
          className="font-serif text-lg font-bold tracking-tight"
          onClick={() => {
            pinnedId.current = null;
            setActiveId("");
            setMenuOpen(false);
          }}
        >
          {profile.name}
        </a>

        <nav aria-label={dict.navLabel} className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={activeId === s.id ? "true" : undefined}
              onClick={() => handleNavClick(s.id)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                activeId === s.id
                  ? "text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageToggle locale={locale} />
          <ThemeToggle toLight={dict.toLight} toDark={dict.toDark} />
          <button
            type="button"
            aria-label={menuOpen ? dict.menuClose : dict.menuOpen}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-accent md:hidden"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label={dict.navLabel}
          className="border-t border-line px-6 py-3 md:hidden"
        >
          <ul className="flex flex-col">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => handleNavClick(s.id)}
                  className="flex items-baseline gap-3 py-2.5 text-sm text-ink"
                >
                  <span className="font-serif text-xs text-accent">
                    {s.marker}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
