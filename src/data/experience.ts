import type { Experience } from "@/types/portfolio";

export const experiences: Experience[] = [
  {
    company: "스마트닥터",
    role: "소프트웨어 엔지니어 — 병원용 CRM 개발",
    period: "2024.08 — 현재",
    highlights: [
      "데스크톱 CRM(C#/WPF) 유지보수·기능 개발로 시작해 웹 전환(React)에서 담당 모듈의 설계·구현을 수행하고, 백엔드 API(Kotlin/Spring)까지 직접 개발 — 약 2년간 Jira 티켓 735건, 머지 PR 772건 처리",
      "웹 CRM 전환에서 월 단위 예약 캘린더, 진료 기록 화면(분기 티켓 약 60건 규모의 최대 모듈), 시술 이력 조회 도구를 담당하고, 월 전체 일괄 조회를 주 단위 분할 캐싱으로 바꿔 조회 성능 개선",
      "예약 1건 변경에도 화면 전체를 재조회하던 데스크톱 새로고침 구조를 단건 갱신으로 개선하고, 내장 브라우저 CefSharp → WebView2 교체를 제안·주도",
      "네이티브 화면 3종을 'API 신설 → 독립 웹 앱 → 웹뷰 임베드' 패턴으로 이식하는 등 웹·API·데스크톱 3개 코드베이스에 걸친 크로스 스택 개발",
      "고객 스크린샷에 의존하던 오류 파악을 Sentry 도입과 GA4 기반 화면 로딩속도 모니터링 봇 구축으로 자동 수집·알림 체계로 전환",
      "rc/hotfix 자동 태깅, Jira 릴리즈 자동 생성, rc 간 cherry-pick 체이닝, AI 코드리뷰 봇 운영 등 릴리즈·리뷰 자동화 체계 구축",
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
