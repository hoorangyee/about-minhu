export interface Profile {
  /** 이름 */
  name: string;
  /** 직무 한 줄 (예: "백엔드 개발자") */
  role: string;
  /** 히어로 상단 상태 라인 (예: "현재 OO에서 일하고 있습니다") */
  status: string;
  /** 히어로 헤드라인 — 배열의 각 항목이 한 줄로 렌더링됨 */
  headline: string[];
  /** 히어로 하단 요약 문단 */
  summary: string;
  /** About 섹션 문단들 */
  about: string[];
  email: string;
  github?: string;
  linkedin?: string;
  /** public/ 아래 이력서 PDF 경로 (없으면 버튼 미노출) */
  resumeUrl?: string;
  /** 배포 후 실제 도메인 (메타데이터·sitemap에 사용) */
  siteUrl: string;
}

export interface SkillCategory {
  /** 카테고리 이름 (예: "언어", "백엔드") */
  category: string;
  items: string[];
}

export interface Experience {
  company: string;
  role: string;
  /** 표기용 기간 (예: "2022.03 — 현재") */
  period: string;
  /** 핵심 성과 — 숫자·규모가 드러나게 쓰는 것을 권장 */
  highlights: string[];
  techStack?: string[];
}

export interface Education {
  school: string;
  /** 예: "컴퓨터과학부 학사" */
  degree: string;
  /** 표기용 기간 (예: "2019.03 — 2024.02") */
  period: string;
  /** 연구·활동 등 보충 한 줄 (선택) */
  note?: string;
}

export interface Project {
  title: string;
  description: string;
  /** 재직 중 수행(work) / 개인·오픈소스(personal) — 프로젝트 섹션의 그룹 구분 */
  group: "work" | "personal";
  /** 수행 맥락 한 줄 (예: "OO 재직 중 · 프론트·백엔드 함께 개발") — 코드 비공개 프로젝트의 신뢰를 보강 */
  context?: string;
  /** 표기용 수행 시기 (예: "2026") */
  period?: string;
  /** 성과·역할이 드러나는 한 줄 (선택) */
  impact?: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  paperUrl?: string;
}
