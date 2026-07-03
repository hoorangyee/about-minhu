import type { Project } from "@/types/portfolio";
import { projects as projectsKo } from "@/data/projects";

const linksOf = (title: string) => {
  const ko = projectsKo.find((p) => p.title.startsWith(title));
  return { githubUrl: ko?.githubUrl, demoUrl: ko?.demoUrl, paperUrl: ko?.paperUrl };
};

export const projects: Project[] = [
  {
    title: "Desktop-to-Web CRM Migration",
    group: "work",
    context: "SmartDoctor · Module design & implementation, plus the runtime foundation",
    period: "2025 — Present",
    description:
      "A long-running migration of the desktop CRM's core screens to the web (React). Starting with the monthly reservation calendar, I designed and built my modules and improved query performance by splitting month-wide fetches into per-week cached requests. Because the web app runs inside a desktop webview, I also built the runtime foundation — authentication (refresh tokens), the native bridge, and WebView2 runtime deployment. Later I established an 'add API → standalone web app → webview embed' pattern and ported three desktop-only screens.",
    impact: "Cross-stack development spanning the web, API, and desktop codebases",
    techStack: ["React", "TypeScript", "Zustand", "Kotlin", "C#", "WebView2"],
  },
  {
    title: "Clinical Records Screen",
    group: "work",
    context: "SmartDoctor · The largest module in the web migration",
    period: "2026",
    description:
      "Built a new clinical records screen covering diagnosis and prescription input, consultation-fee calculation, treatment-pass usage, and record saving. Handled fine-grained input UX and data integrity together: prescription autocomplete with input debouncing, automatic consultation-fee assignment and release, guards against duplicate saves from repeated clicks, and a refactor that made the form the single source of truth.",
    impact: "Owned the largest module of the migration (~60 tickets in a quarter)",
    techStack: ["React", "TypeScript", "Kotlin", "WebView2"],
  },
  {
    title: "Call Center Consultation Management",
    group: "work",
    context: "SmartDoctor · Frontend and backend API together",
    period: "2026",
    description:
      "A new web module for collecting, assigning, and tracking consultation leads at clinic call centers. It talks to the telephony middleware over WebSocket to create leads from incoming calls automatically, and provides three intake channels — bulk Excel upload, individual registration, and incoming-call auto-creation — plus server-side filtering. Fixed field-reported issues in short cycles, including a race condition that duplicated leads on a single call and reconnection instability.",
    impact: "Contributed to adoption by a large plastic-surgery clinic running a call center",
    techStack: ["React", "TypeScript", "Kotlin", "WebSocket", "MSSQL"],
  },
  {
    title: "Payment Terminal Integration",
    group: "work",
    context: "SmartDoctor · Across desktop, web, and backend",
    period: "2026",
    description:
      "Integrated external payment terminals into the CRM checkout flow. Built a WebSocket client with automatic reconnection for the desktop (.NET) and a payment-session state machine for the web, and solved the multi-pod failure — where the payment plugin and the CRM connected to different pods and couldn't find each other — by replacing the in-memory session registry with a Kafka fan-out relay.",
    impact: "Proposed and designed the session routing for multi-pod environments",
    techStack: ["Kafka", "WebSocket", "C#", "React", "Zustand"],
  },
  {
    title: "64-bit Migration of the Desktop CRM",
    group: "work",
    context: "SmartDoctor · Proposed and led",
    period: "2025",
    description:
      "What blocked the CRM's 64-bit migration was the set of 32-bit-only DLLs for carrier telephony and payment terminals. I designed a structure that isolates them in a separate 32-bit process communicating with the main app over IPC, complete with lifecycle management, automatic restarts, and error logging. I also collected the OS bitness distribution of real installations via Sentry to ground the migration decision in data.",
    impact: "Cleared the path to 64-bit while keeping legacy integrations compatible",
    techStack: ["C#", ".NET", "WPF", "IPC", "Sentry"],
  },
  {
    title: "DUR (Drug Safety Review) Integration & Verification Tool",
    group: "work",
    context: "SmartDoctor · Web + backend, plus a purpose-built verification CLI",
    period: "2026",
    description:
      "Built the drug-utilization-review flow that checks prescriptions and diagnoses against HIRA (Korea's health-insurance review agency), from the web popup to the backend broker integration. Implemented every check type for prescriptions and wrote a case-based (YAML) CLI tool that regression-verifies the integration's correctness.",
    techStack: ["Kotlin", "React", "AWS S3", "SQLite"],
  },
  {
    title: "LRAGE — Legal-Domain RAG Evaluation Toolkit",
    group: "personal",
    context: "Open-source research · First author",
    period: "2024 — 2025",
    description:
      "An open-source toolkit for evaluating LLMs on legal tasks in RAG settings. It extends lm-evaluation-harness with retriever and reranker abstractions and LLM-as-a-judge evaluation, ships pre-built indexes for Pile-of-law, and provides a GUI. Validated on Korean (KBL), English (LegalBench), and Chinese (LawBench) legal benchmarks.",
    impact: "First-author demo paper on arXiv; live demo on Hugging Face Spaces",
    techStack: ["Python", "lm-evaluation-harness", "Pyserini", "Hugging Face"],
    ...linksOf("LRAGE"),
  },
  {
    title: "Woodshed — A Community for Guitar Licks",
    group: "personal",
    context: "Personal project · From idea to deployment",
    period: "2026",
    description:
      "A community where guitarists write down and share licks as TAB. I built a graphic TAB editor — click frets to input notes, with hammer-ons, bends, and other articulations rendered as real sheet music — plus everything a running service needs: accounts, visibility controls, an explore feed, likes, comments, collections, and a moderation queue.",
    techStack: ["Next.js", "TypeScript", "Drizzle", "Turso", "Auth.js", "Vitest"],
    ...linksOf("Woodshed"),
  },
];
