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

  "clinical-record-screen": {
    nodes: [
      { id: "code", col: 0, row: 0, label: { ko: "처방코드 자동완성", en: "Code autocomplete" }, sublabel: { ko: "입력 디바운싱", en: "debounced input" } },
      { id: "form", col: 1, row: 0, tone: "accent", label: { ko: "폼 상태", en: "Form state" }, sublabel: { ko: "단일 진실 원천", en: "single source" } },
      { id: "gate", col: 2, row: 0, tone: "accent", label: { ko: "저장 게이트", en: "Save gate" }, sublabel: { ko: "중복 저장 방지", en: "dedupe guard" } },
      { id: "api", col: 3, row: 0, label: { ko: "진료 저장 API", en: "Record API" } },
      { id: "fee", col: 0, row: 1, label: { ko: "진찰료 자동 산정", en: "Fee calculation" } },
      { id: "dur", col: 2, row: 1, label: { ko: "DUR 점검", en: "DUR check" } },
    ],
    edges: [
      { from: "code", to: "form" },
      { from: "fee", to: "form" },
      { from: "form", to: "gate", label: { ko: "검증", en: "validate" } },
      { from: "gate", to: "dur", label: { ko: "이상 시", en: "if flagged" } },
      { from: "gate", to: "api", label: { ko: "저장", en: "save" } },
    ],
    groups: [
      { members: ["form", "gate"], tone: "accent", label: { ko: "신규 구축", en: "Newly built" } },
    ],
    caption: {
      ko: "입력 보조 기능들이 폼 상태 하나로 모이고, 저장 게이트가 검증과 중복 방지를 거쳐 API로 보냅니다. 처방에 이상이 있으면 DUR 점검 결과를 먼저 띄웁니다.",
      en: "Input helpers converge on a single form state, and a save gate runs validation and dedupe before calling the API. Flagged prescriptions surface a DUR check first.",
    },
  },

  "call-center-crm": {
    nodes: [
      { id: "cti", col: 0, row: 0, label: { ko: "CTI 미들웨어", en: "CTI middleware" }, sublabel: { ko: "전화 연동", en: "telephony" } },
      { id: "ws", col: 1, row: 0, label: { ko: "WebSocket", en: "WebSocket" }, sublabel: { ko: "지수 백오프 재연결", en: "backoff reconnect" } },
      { id: "web", col: 2, row: 0, tone: "accent", label: { ko: "상담 화면", en: "Console UI" }, sublabel: { ko: "React", en: "React" } },
      { id: "api", col: 3, row: 0, tone: "accent", label: { ko: "상담 API", en: "Console API" }, sublabel: { ko: "Kotlin", en: "Kotlin" } },
      // excel·manual을 col1에 세로로 두는 이유: col0에 두면 web으로 가는 간선의
      // 수평 구간이 col1의 상자를 관통합니다. col1↔col2 사이 빈 통로로 올려보냅니다
      { id: "excel", col: 1, row: 1, label: { ko: "엑셀 대량 업로드", en: "Bulk upload" } },
      { id: "manual", col: 1, row: 2, label: { ko: "단일 등록", en: "Manual entry" } },
      { id: "db", col: 3, row: 1, label: { ko: "MSSQL", en: "MSSQL" } },
    ],
    edges: [
      { from: "cti", to: "ws", label: { ko: "수신 이벤트", en: "inbound call" } },
      { from: "ws", to: "web" },
      { from: "web", to: "api" },
      { from: "api", to: "db" },
      { from: "excel", to: "web" },
      { from: "manual", to: "web" },
    ],
    groups: [
      { members: ["web", "api"], tone: "accent", label: { ko: "담당 범위", en: "My scope" } },
    ],
    caption: {
      ko: "수신 전화, 엑셀 대량 업로드, 단일 등록 세 갈래로 상담 건이 들어옵니다. 전화 연동은 CTI 미들웨어와 WebSocket으로 통신하며, 화면과 API를 함께 담당했습니다.",
      en: "Leads arrive through three channels: inbound calls, bulk spreadsheet upload, and manual entry. Telephony runs over a WebSocket link to CTI middleware; I built both the console UI and its API.",
    },
  },
};
