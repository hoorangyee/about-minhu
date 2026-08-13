import type { Diagram } from "@/types/portfolio";

/** 로케일 공용. 기하는 한 벌만 두고 라벨만 이중어를 갖습니다 */
export const diagrams: Record<string, Diagram> = {
  "crm-web-migration": {
    nodes: [
      { id: "native", col: 0, row: 0, label: { ko: "데스크톱 CRM", en: "Desktop CRM" }, sublabel: { ko: "C# · WPF", en: "C# · WPF" } },
      { id: "host", col: 1, row: 0, label: { ko: "WebView2 호스트", en: "WebView2 host" } },
      { id: "web", col: 2, row: 0, tone: "accent", label: { ko: "웹 앱", en: "Web app" }, sublabel: { ko: "React", en: "React" } },
      { id: "api", col: 3, row: 0, tone: "accent", label: { ko: "API", en: "API" }, sublabel: { ko: "Kotlin · Spring", en: "Kotlin · Spring" } },
      { id: "db", col: 3, row: 1, label: { ko: "MSSQL", en: "MSSQL" } },
    ],
    edges: [
      { from: "native", to: "host", label: { ko: "임베드", en: "embeds" } },
      { from: "host", to: "web", label: { ko: "브릿지", en: "bridge" } },
      { from: "web", to: "api", label: { ko: "REST", en: "REST" } },
      { from: "api", to: "db" },
    ],
    groups: [
      { members: ["web", "api"], tone: "accent", label: { ko: "담당 범위", en: "My scope" } },
    ],
    caption: {
      ko: "데스크톱 CRM 안의 WebView2 호스트가 웹 앱을 띄우고, 웹 앱은 신설한 API를 거쳐 데이터베이스에 닿습니다. 웹 앱과 API가 담당 범위입니다.",
      en: "A WebView2 host inside the desktop CRM serves the web app, which reaches the database through a newly built API. The web app and the API are my scope.",
    },
  },
};
