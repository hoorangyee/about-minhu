import type { Project } from "@/types/portfolio";
import { projects as projectsKo } from "@/data/projects";

const linksOf = (title: string) => {
  const ko = projectsKo.find((p) => p.title.startsWith(title));
  return { githubUrl: ko?.githubUrl, demoUrl: ko?.demoUrl, paperUrl: ko?.paperUrl };
};

export const projects: Project[] = [
  {
    title: "Desktop-to-Web CRM Migration",
    slug: "crm-web-migration",
    group: "work",
    context: "SmartDoctor · Module design & implementation, plus the runtime foundation",
    period: "2025 — Present",
    description:
      "A long-running migration of the desktop CRM's reservation and clinical screens to the web. I designed and built the reservation calendar and clinical records screen, alongside authentication, the native bridge, and WebView2 runtime deployment. I then established an 'add API → standalone web app → webview embed' pattern and ported three desktop-only screens.",
    impact: "Cross-stack development spanning the web, API, and desktop codebases",
    techStack: ["React", "TypeScript", "Zustand", "Kotlin", "C#", "WebView2"],
  },
  {
    title: "Call Center Consultation Management",
    slug: "call-center-crm",
    group: "work",
    context: "SmartDoctor · Frontend and backend API together",
    period: "2026",
    description:
      "A new web module for collecting, assigning, and tracking consultation leads at clinic call centers. It talks to the telephony middleware over WebSocket to create leads from incoming calls automatically, and provides three intake channels — bulk Excel upload, individual registration, and incoming-call auto-creation — plus server-side filtering. Fixed field-reported issues in short cycles, including a race condition that duplicated leads on a single call and reconnection instability.",
    impact: "Replay with 12 categories observed in production: initial option requests 12 → 1, down 91.7%",
    techStack: ["React", "TypeScript", "Kotlin", "WebSocket", "MSSQL"],
  },
  {
    title: "Toss Payment Terminal Integration",
    slug: "payment-terminal",
    group: "work",
    context: "SmartDoctor · Across desktop, web, and backend",
    period: "2026",
    description:
      "Integrated Toss payment terminals into the CRM checkout flow. Built a WebSocket client with automatic reconnection for the desktop (.NET) and a payment-session state machine for the web, and solved the multi-pod failure — where the payment plugin and the CRM connected to different pods and couldn't find each other — by replacing the in-memory session registry with a Kafka fan-out relay.",
    impact: "Proposed and designed the session routing for multi-pod environments",
    techStack: ["Kafka", "WebSocket", "C#", "React", "Zustand"],
  },
  {
    title: "64-bit Migration of the Desktop CRM",
    slug: "desktop-x64",
    group: "work",
    context: "SmartDoctor · Proposed and led",
    period: "2025",
    description:
      "What blocked the CRM's 64-bit migration was the set of 32-bit-only DLLs for carrier telephony and payment terminals. I designed a structure that isolates them in a separate 32-bit process communicating with the main app over IPC, complete with lifecycle management, automatic restarts, and error logging. I also collected the OS bitness distribution of real installations via Sentry to ground the migration decision in data.",
    impact: "Cleared the path to 64-bit while keeping legacy integrations compatible",
    techStack: ["C#", ".NET", "WPF", "IPC", "Sentry"],
  },
  {
    title: "Cloud Code Signing Migration & Shared CI for Windows Apps",
    slug: "windows-code-signing",
    group: "work",
    context: "SmartDoctor · Shared signing CI for internal Windows apps",
    period: "2026.08–09",
    description:
      "Migrated Windows code signing to DigiCert KeyLocker in the cloud to address the management overhead and CI/CD constraints of physical USB authentication. Built a shared GitHub action for signing and verification that internal Windows apps can reuse in their existing build pipelines, and shared usage guidance with the team.",
    impact: "Reusable cloud code-signing CI across apps without physical USB dependence",
    techStack: ["GitHub Actions", "PowerShell", "DigiCert KeyLocker"],
  },
  {
    title: "Deploy Notification Relay",
    slug: "deploy-notifier",
    group: "work",
    context: "SmartDoctor · Internal tool wired into the deploy pipeline",
    period: "2026",
    description:
      "An internal tool built to cut down on everyone individually checking whether a production hotfix actually shipped. It listens for deploy webhooks, diffs the commit range against the previous deploy, and posts a completion reply on the Slack thread linked to whatever Jira issue keys show up in those commits. I judged that notifying on regular releases too would likely become noise, so it picks out hotfix-shaped deploys only, and when it doesn't have enough information to tell, it stays silent and logs a warning rather than risk a false report.",
    impact: "Built without being asked, and now a fixture of how the team operates",
    techStack: ["TypeScript", "Vercel Functions", "Slack API", "Jira API"],
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
  {
    title: "Korean Architecture: A Prediction Model",
    slug: "architecture-prediction-model",
    group: "personal",
    context: "Joint entry with an architecture teammate · Problem framing & argument development",
    period: "2026",
    description:
      "A collaborative work imagining a future where behavior in spaces shaped by AI predictions reinforces those predictions. I helped frame the question of how lives never chosen can disappear from the data, structure the feedback-loop argument, and review the narrative and presentation.",
    impact: "2026 젊은 건축가포럼 건축상 · Selected Entry",
    techStack: [],
    roles: ["Problem Framing", "Feedback-Loop Argument", "Narrative & Presentation Review"],
    bookUrl: "https://a5124-architecture-book.vercel.app",
  },
];
