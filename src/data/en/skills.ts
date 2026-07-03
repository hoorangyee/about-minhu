import type { SkillCategory } from "@/types/portfolio";

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    items: ["TypeScript", "C#", "Kotlin", "SQL"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Zustand", "Tailwind CSS", "FSD architecture"],
  },
  {
    category: "Backend",
    items: ["Spring", "JPA/Hibernate", "Kafka", "WebSocket", "MSSQL", "AWS S3"],
  },
  {
    category: "Desktop",
    items: [".NET · WPF · WinForms", "WebView2 bridge", "Inter-process communication (IPC)"],
  },
  {
    category: "Tooling · Observability",
    items: ["GitHub Actions", "Sentry", "GA4", "Jira automation"],
  },
];
