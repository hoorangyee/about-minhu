import type { Profile } from "@/types/portfolio";

export const profile: Profile = {
  name: "박민후",
  role: "소프트웨어 엔지니어",
  status: "새로운 문제를 찾고 있습니다",
  headline: ["복잡한 문제를", "단순한 구조로 풀어냅니다."],
  summary:
    "지난 2년간 병원용 CRM을 데스크톱(C#/WPF)에서 웹(React), 백엔드 API(Kotlin)까지 스택을 넓혀 가며 만들어 왔습니다. 문제를 발견하면 구조를 제안하고, 반복되는 일은 자동화합니다.",
  about: [
    "2024년부터 스마트닥터에서 병원용 CRM을 만들고 있습니다. 데스크톱 앱(C#/WPF) 유지보수로 시작해 웹 전환(React)에서 담당 모듈의 설계와 구현을 맡았고, 지금은 백엔드 API(Kotlin/Spring)까지 직접 개발합니다. 한 사람이 프론트부터 백엔드까지 다루면 개발 속도와 정합성이 훨씬 좋아진다고 판단했고, 실제로 그렇게 일하고 있습니다.",
    "증상보다 구조를 고치는 쪽을 선호합니다. 예약 1건이 바뀔 때마다 화면 전체를 다시 조회하던 구조를 단건 갱신으로 바꾸고, 64비트 전환을 막던 32비트 전용 연동 모듈들을 별도 프로세스로 분리해서 같은 문제가 반복되지 않게 만들었습니다.",
    "반복 작업은 자동화합니다. 릴리즈 태깅·Jira 버전 관리·리뷰어 지정을 GitHub Actions로 자동화했고, 고객 스크린샷으로 오류를 파악하던 환경에 Sentry와 로딩속도 모니터링 봇을 도입했습니다. 도구를 만들어 팀의 시간을 아끼는 일을 좋아합니다.",
  ],
  email: "alsgn2003@naver.com",
  github: "https://github.com/hoorangyee",
  linkedin: "https://www.linkedin.com/in/민후-박-3673bb283/",
  resumeUrl: undefined,
  siteUrl: "https://example.com", // TODO: 배포 후 실제 도메인으로 교체
};
