import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    title: "데스크톱 → 웹 CRM 전환",
    slug: "crm-web-migration",
    group: "work",
    context: "스마트닥터 · 담당 모듈 설계·구현, 실행 기반까지",
    period: "2025 — 현재",
    description:
      "데스크톱 CRM의 핵심 화면을 웹(React)으로 옮기는 장기 마이그레이션. 월 단위 예약 캘린더 화면을 시작으로 담당 모듈의 설계와 구현을 수행했고, 월 전체 일괄 조회를 주 단위 분할 캐싱으로 바꿔 조회 성능을 개선했습니다. 웹이 데스크톱 안 웹뷰로 실행되는 구조여서 인증(refresh token)·네이티브 브릿지·WebView2 런타임 배포 같은 실행 기반을 함께 만들었고, 후반에는 'API 신설 → 독립 웹 앱 → 웹뷰 임베드' 패턴을 확립해 데스크톱 전용 화면 3종을 이식했습니다.",
    impact: "웹·API·데스크톱 3개 코드베이스에 걸친 크로스 스택 개발",
    techStack: ["React", "TypeScript", "Zustand", "Kotlin", "C#", "WebView2"],
  },
  {
    title: "진료 기록 화면 신규 구축",
    slug: "clinical-record-screen",
    group: "work",
    context: "스마트닥터 · 웹 전환 최대 모듈",
    period: "2026",
    description:
      "상병(진단명)·처방 입력, 진료비·진찰료 산정, 시술권 사용 처리, 진료 기록 저장까지 담는 진료 화면을 웹에 새로 구축했습니다. 처방코드 자동완성(입력 디바운싱), 진찰료 자동 산정·해제, 저장 버튼 연타로 인한 중복 생성 방지, form을 단일 진실 원천으로 만드는 리팩터링 등 세밀한 입력 UX와 데이터 정합성을 모두 다뤘습니다.",
    impact: "분기 관련 티켓 약 60건 규모의 최대 모듈을 담당",
    techStack: ["React", "TypeScript", "Kotlin", "WebView2"],
  },
  {
    title: "콜센터 상담 관리 시스템",
    slug: "call-center-crm",
    group: "work",
    context: "스마트닥터 · 프론트엔드와 백엔드 API를 함께 개발",
    period: "2026",
    description:
      "병원 콜센터의 상담 건(리드) 수집·배분·이력 관리를 담당하는 신규 웹 모듈. 전화 연동 미들웨어와 WebSocket으로 통신해 수신 전화에서 상담 건을 자동 생성하고, 엑셀 대량 업로드·개별 등록·수신 전화 자동 생성의 수집 채널 3종과 서버사이드 필터 체계를 갖췄습니다. 수신 1건에 상담 건이 중복 생성되던 경쟁 조건, 재연결 불안정 같은 현장 문제를 요구 접수부터 검증까지 짧은 주기로 해결했습니다.",
    impact: "콜센터를 운영하는 대형 성형외과 고객사 도입에 기여",
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
    title: "DUR(의약품 안전 점검) 연동과 검증 도구",
    slug: "dur-integration",
    group: "work",
    context: "스마트닥터 · 웹·백엔드 연동 + 자체 검증 CLI",
    period: "2026",
    description:
      "진료 화면에서 처방·상병 정보로 심평원(HIRA)의 의약품 안전 점검을 수행하는 기능을 웹 팝업부터 백엔드 브로커 연동까지 구축했습니다. 처방전 내 모든 점검 종류를 구현하고, 점검 응답을 케이스(YAML) 기반으로 자동 검증하는 CLI 도구를 직접 만들어 외부 연동의 정확성을 회귀 검증할 수 있게 했습니다.",
    techStack: ["Kotlin", "React", "AWS S3", "SQLite"],
  },
  {
    title: "배포 알림 릴레이",
    slug: "deploy-notifier",
    group: "work",
    context: "스마트닥터 · 필요를 느껴 직접 만들고 운영",
    period: "2026",
    description:
      "상용 핫픽스가 실제로 나갔는지를 각자 확인해야 하던 상황을 없앤 사내 도구. 배포 웹훅을 받아 직전 배포와의 커밋 범위를 비교하고, 거기 담긴 이슈 키로 Jira에 연결된 Slack 스레드를 찾아 배포 완료를 답글로 남깁니다. 정기 릴리즈까지 알리면 소음이 되므로 핫픽스성 배포만 골라내며, 판별에 필요한 정보가 없으면 잘못 알리는 대신 침묵하고 경고 로그만 남깁니다.",
    impact: "요청받지 않고 만들어 팀 운영에 정착",
    techStack: ["TypeScript", "Vercel Functions", "Slack API", "Jira API"],
  },
  {
    title: "캐시닥 병원 CMS 모바일 화면",
    slug: "cashdoc-mobile",
    group: "work",
    context: "스마트닥터 · 사내 별도 서비스",
    period: "2026",
    description:
      "모바일 화면 전체를 새로 만들었습니다. 병원 관리자가 PC 앞에 없어도 예약 확정, 상담 응대, 후기 답변 같은 일상 운영을 처리할 수 있게 하려는 목적으로 보입니다. 홈·예약·상담·후기·알림함·설정을 공용 UI 킷 위에 올렸고, 신규 상담이 들어오면 알림함에 쌓이도록 스키마·API·프런트·적재를 네 개 저장소에 걸쳐 연결했습니다.",
    impact: "제품군을 넘나드는 개발까지 담당 범위 확장",
    techStack: ["Next.js", "TypeScript", "GraphQL", "Prisma"],
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
];