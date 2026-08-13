import type { Locale } from "@/i18n/config";

/** 데이터(경력·프로젝트 등)가 아닌 UI 고정 문자열의 로케일별 사전 */
export const ui = {
  ko: {
    sections: {
      about: "소개",
      skills: "기술",
      experience: "경력",
      projects: "프로젝트",
      education: "학력",
      contact: "연락처",
    },
    hero: {
      emailCta: "이메일 보내기",
      github: "GitHub ↗",
      resume: "이력서 ↗",
    },
    projects: {
      workGroup: "재직 중 수행",
      personalGroup: "개인 · 오픈소스",
      code: "코드 ↗",
      demo: "데모 ↗",
      paper: "논문 ↗",
      privateNote: "사내 프로젝트 · 코드 비공개",
      detail: "자세히 보기",
      close: "닫기",
    },
    contact: {
      blurb: "커피챗, 채용 제안, 협업 제안 모두 환영합니다.",
      resume: "이력서 ↗",
    },
    header: {
      navLabel: "섹션 이동",
      menuOpen: "메뉴 열기",
      menuClose: "메뉴 닫기",
      toLight: "라이트 모드로 전환",
      toDark: "다크 모드로 전환",
      langSwitch: "Switch to English",
      langLabel: "EN",
    },
  },
  en: {
    sections: {
      about: "About",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      education: "Education",
      contact: "Contact",
    },
    hero: {
      emailCta: "Email me",
      github: "GitHub ↗",
      resume: "Résumé ↗",
    },
    projects: {
      workGroup: "At work",
      personalGroup: "Personal · Open source",
      code: "Code ↗",
      demo: "Demo ↗",
      paper: "Paper ↗",
      privateNote: "Proprietary — code not public",
      detail: "View details",
      close: "Close",
    },
    contact: {
      blurb: "Coffee chats, job opportunities, and collaboration proposals are all welcome.",
      resume: "Résumé ↗",
    },
    header: {
      navLabel: "Sections",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
      langSwitch: "한국어로 보기",
      langLabel: "KO",
    },
  },
} satisfies Record<Locale, unknown>;

export type UiDict = (typeof ui)[Locale];
