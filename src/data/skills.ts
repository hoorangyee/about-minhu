import type { SkillCategory } from "@/types/portfolio";

export const skills: SkillCategory[] = [
  {
    category: "언어",
    items: ["TypeScript", "C#", "Kotlin", "SQL"],
  },
  {
    category: "프론트엔드",
    items: ["React", "Next.js", "Zustand", "Tailwind CSS", "FSD 아키텍처"],
  },
  {
    category: "백엔드",
    items: ["Spring", "JPA/Hibernate", "Kafka", "WebSocket", "MSSQL", "AWS S3"],
  },
  {
    category: "데스크톱",
    items: [".NET · WPF · WinForms", "WebView2 브릿지", "프로세스 간 통신(IPC)"],
  },
  {
    category: "도구 · 관측성",
    items: ["GitHub Actions", "Sentry", "GA4", "Jira 자동화"],
  },
];
