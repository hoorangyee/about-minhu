import type { Experience } from "@/types/portfolio";

export const experiences: Experience[] = [
  {
    company: "SmartDoctor",
    role: "Software Engineer — Clinic CRM",
    period: "Aug 2024 — Present",
    highlights: [
      "Started with maintenance and feature work on the desktop CRM (C#/WPF), designed and built my modules in the web migration (React), and now develop the backend APIs (Kotlin/Spring) directly — about 735 Jira tickets and 772 merged PRs over two years",
      "Owned the monthly reservation calendar, the clinical records screen (the largest module at ~60 tickets in a quarter), and a treatment history tool in the web migration, and improved query performance by splitting month-wide fetches into per-week cached requests",
      "Rebuilt the desktop refresh flow that re-fetched everything on a single reservation change into single-item updates, and proposed and led replacing the embedded browser (CefSharp → WebView2)",
      "Ported three desktop-only screens with an 'add API → standalone web app → webview embed' pattern — cross-stack development across the web, API, and desktop codebases",
      "Replaced screenshot-based error reports with automated collection and alerting by introducing Sentry and building a GA4-based load-time monitoring bot",
      "Built the release and review automation: automatic rc/hotfix tagging, Jira release creation, cherry-pick chaining across rc branches, and an AI code-review bot",
    ],
    techStack: [
      "TypeScript",
      "React",
      "C#",
      ".NET",
      "Kotlin",
      "Spring",
      "Kafka",
      "MSSQL",
      "GitHub Actions",
      "Sentry",
    ],
  },
];
