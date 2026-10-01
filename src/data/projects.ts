import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    title: "데스크톱 → 웹 CRM 전환",
    slug: "crm-web-migration",
    group: "work",
    context: "스마트닥터 · 담당 모듈 설계·구현, 실행 기반까지",
    period: "2025 — 현재",
    description:
      "데스크톱 CRM의 예약·진료 화면을 웹으로 옮기는 장기 전환 프로젝트입니다. 예약 캘린더와 진료 기록 화면을 설계·구현하고, 인증·네이티브 브릿지·WebView2 런타임 배포까지 함께 구축했습니다. 이후 'API 신설 → 독립 웹 앱 → 웹뷰 임베드' 패턴을 확립해 데스크톱 전용 화면 3종을 이식했습니다.",
    impact: "웹·API·데스크톱 3개 코드베이스에 걸친 크로스 스택 개발",
    techStack: ["React", "TypeScript", "Zustand", "Kotlin", "C#", "WebView2"],
  },
  {
    title: "콜센터 상담 관리 시스템",
    slug: "call-center-crm",
    group: "work",
    context: "스마트닥터 · 프론트엔드와 백엔드 API를 함께 개발",
    period: "2026",
    description:
      "병원 콜센터의 상담 건(리드) 수집·배분·이력 관리를 담당하는 신규 웹 모듈. 전화 연동 미들웨어와 WebSocket으로 통신해 수신 전화에서 상담 건을 자동 생성하고, 엑셀 대량 업로드·개별 등록·수신 전화 자동 생성의 수집 채널 3종과 서버사이드 필터 체계를 갖췄습니다. 수신 1건에 상담 건이 중복 생성되던 경쟁 조건, 재연결 불안정 같은 현장 문제를 요구 접수부터 검증까지 짧은 주기로 해결했습니다.",
    impact: "운영에서 확인한 카테고리 12개 조건의 최초 옵션 조회 재현: 12회 → 1회, 91.7% 감소",
    techStack: ["React", "TypeScript", "Kotlin", "WebSocket", "MSSQL"],
  },
  {
    title: "토스 결제 단말 연동",
    slug: "payment-terminal",
    group: "work",
    context: "스마트닥터 · 데스크톱·웹·백엔드에 걸친 연동",
    period: "2026",
    description:
      "CRM 수납 흐름에 토스 결제 단말을 연동했습니다. 데스크톱(.NET)에는 자동 재연결을 갖춘 WebSocket 클라이언트를, 웹에는 결제 세션 상태머신을 구현했고, 결제 플러그인과 CRM이 서로 다른 파드에 붙으면 단말을 찾지 못하던 인메모리 세션 레지스트리의 한계를 Kafka fan-out 릴레이 구조로 해결했습니다.",
    impact: "멀티 파드 환경의 결제 세션 라우팅 구조를 직접 제안·설계",
    techStack: ["Kafka", "WebSocket", "C#", "React", "Zustand"],
  },
  {
    title: "데스크톱 CRM 64비트 전환",
    slug: "desktop-x64",
    group: "work",
    context: "스마트닥터 · 직접 제안하고 주도",
    period: "2025",
    description:
      "CRM 본체의 64비트 전환을 가로막던 것은 통신사별 전화 연동과 결제 단말기의 32비트 전용 DLL이었습니다. 이들을 별도 32비트 프로세스로 분리하고 본체와 IPC로 통신하는 구조를 설계해, 프로세스 생명주기 관리·자동 재시작·오류 로깅까지 갖췄습니다. 사용 환경의 OS 비트 분포를 Sentry로 수집해 전환 판단의 근거 데이터도 만들었습니다.",
    impact: "레거시 연동 호환성을 유지한 채 64비트 전환 기반 마련",
    techStack: ["C#", ".NET", "WPF", "IPC", "Sentry"],
  },
  {
    title: "클라우드 코드 서명 전환과 Windows 앱 공용 CI 구축",
    slug: "windows-code-signing",
    group: "work",
    context: "스마트닥터 · 사내 Windows 앱을 위한 공용 서명 CI 구축",
    period: "2026.08–09",
    description:
      "물리 USB 인증 장치의 관리 부담과 CI/CD 자동화 제약을 해결하기 위해 Windows 코드 서명을 DigiCert KeyLocker 기반 클라우드 방식으로 전환했습니다. 사내 Windows 앱들의 기존 빌드 CI에서 재사용할 수 있도록 서명·검증 절차를 공용 GitHub Action으로 구축하고 팀에 사용 기준을 공유했습니다.",
    impact: "물리 USB 의존 없이 여러 앱에서 재사용하는 클라우드 코드 서명 CI",
    techStack: ["GitHub Actions", "PowerShell", "DigiCert KeyLocker"],
  },
  {
    title: "배포 알림 릴레이",
    slug: "deploy-notifier",
    group: "work",
    context: "스마트닥터 · 배포 파이프라인 연동 사내 도구",
    period: "2026",
    description:
      "상용 핫픽스가 실제로 나갔는지를 각자 확인해야 하던 부담을 줄이려고 만든 사내 도구. 배포 웹훅을 받아 직전 배포와의 커밋 범위를 비교하고, 거기 담긴 이슈 키로 Jira에 연결된 Slack 스레드를 찾아 배포 완료를 답글로 남깁니다. 정기 릴리즈까지 알리면 소음이 될 것으로 보고 핫픽스성 배포만 골라내며, 판별에 필요한 정보가 없으면 잘못 알리는 대신 침묵하고 경고 로그만 남깁니다.",
    impact: "요청받지 않고 만들어 팀 운영에 정착",
    techStack: ["TypeScript", "Vercel Functions", "Slack API", "Jira API"],
  },
  {
    title: "LRAGE — 법률 도메인 RAG 평가 툴킷",
    group: "personal",
    context: "공동 연구 오픈소스 · 1저자",
    period: "2024 — 2025",
    description:
      "법률 태스크에서 LLM을 RAG 설정으로 평가하는 오픈소스 툴킷. lm-evaluation-harness를 확장해 Retriever·Reranker 추상 계층과 LLM-as-a-Judge 평가를 더했고, Pile-of-law 사전 구축 인덱스와 GUI를 제공합니다. 한국어(KBL)·영어(LegalBench)·중국어(LawBench) 법률 벤치마크로 검증했습니다.",
    impact: "1저자 데모 논문 arXiv 공개",
    techStack: ["Python", "lm-evaluation-harness", "Pyserini", "Hugging Face"],
    githubUrl: "https://github.com/hoorangyee/LRAGE",
    demoUrl: "https://huggingface.co/spaces/wonseok-uos/LRAGE",
    paperUrl: "https://arxiv.org/abs/2504.01840",
  },
  {
    title: "Woodshed — 기타 릭 기록·공유 커뮤니티",
    group: "personal",
    context: "개인 프로젝트 · 기획부터 배포까지",
    period: "2026",
    description:
      "기타리스트가 릭(짧은 프레이즈)을 TAB으로 기록하고 공유하는 커뮤니티. 프렛을 클릭해 입력하고 해머온·벤딩 같은 아티큘레이션을 실제 악보로 렌더링하는 그래픽 TAB 에디터를 직접 만들었고, 계정·공개 범위·탐색 피드·좋아요/댓글/컬렉션에 신고 모더레이션 큐까지 서비스 운영에 필요한 요소를 갖췄습니다.",
    techStack: ["Next.js", "TypeScript", "Drizzle", "Turso", "Auth.js", "Vitest"],
    githubUrl: "https://github.com/hoorangyee/woodshed",
  },
  {
    title: "한국 건축: 예언 모델",
    slug: "architecture-prediction-model",
    group: "personal",
    context: "건축 전공 팀원과 공동 출품 · 문제의식·논리 구성",
    period: "2026",
    description:
      "AI의 예측에 맞춘 공간에서의 행동이 다시 예측을 강화하는 미래를 가정한 협업 작품입니다. 선택하지 않은 삶의 가능성이 데이터에서 사라질 수 있다는 문제의식을 정리하고 피드백 루프의 논리 구성과 서사·발표 검토에 기여했습니다.",
    impact: "2026 젊은 건축가포럼 건축상 · 입선",
    techStack: [],
    roles: ["문제의식 정리", "피드백 루프 논리 구성", "서사·발표 검토"],
    bookUrl: "https://a5124-architecture-book.vercel.app",
  },
];
