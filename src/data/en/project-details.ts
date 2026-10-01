import type { ProjectDetail } from "@/types/portfolio";

export const projectDetails: Record<string, ProjectDetail> = {
  "architecture-prediction-model": {
    lead: "A joint entry with an architecture teammate. I contributed from a CS/AI perspective to the core idea, prediction-system concepts, narrative, and presentation logic. My architecture teammate led the architectural design.",
    sections: [
      {
        heading: "The question",
        body: [
          "A thought experiment taking a future of fully predictable human behavior to its extreme. It asks not only whether AI predictions are accurate, but how environments designed around those predictions influence human choice.",
        ],
      },
      {
        heading: "A self-reinforcing prediction loop",
        body: [
          "AI predicts behavior, spaces are designed around those predictions, and people live within them. Their behavior becomes data that reinforces the original predictions: prediction → spatial design → behavior → data → prediction.",
          "Lives that were never chosen leave no trace in that data. The project questions whether high prediction accuracy describes the range of possible lives, or reflects choices narrowed by an environment built around the predictions.",
        ],
      },
      {
        heading: "My role and collaboration",
        body: [
          "I helped clarify the core idea and problem framing, develop the AI and prediction-system concepts, and structure the feedback-loop argument. Working with my architecture teammate, I reviewed the narrative and presentation logic and provided feedback.",
          "The collaboration brought a developer’s understanding of data and system feedback into architecture. My contribution was to examine the relationship between observed behavior and the choices an environment allows, and explain the conditions under which a technology operates and affects people.",
        ],
      },
      {
        heading: "Competition result",
        body: [
          "Our joint entry was selected in the 2026 젊은 건축가포럼 건축상 (입선 / Selected Entry).",
        ],
      },
    ],
  },
  "crm-web-migration": {
    lead: "A long-running migration of the desktop CRM's core screens to the web, starting with the reservation calendar and ending with a repeatable pattern applied to three more screens.",
    sections: [
      {
        heading: "Background",
        body: [
          "The desktop CRM is a C#/WPF application used every day by clinic front-desk and consultation staff. Migrating its core screens to the web has been running since 2025 and is still underway, starting as a desktop-and-web effort before growing to include the backend API codebase as well.",
          "The approach was to embed a WebView2 host inside the desktop CRM and move screens to the web one at a time, rather than rewriting the whole desktop app at once. Each screen could go live as soon as its port was done, instead of waiting on one big release.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "I started with the monthly reservation calendar — the \"month view\" — designing and building its layout, cell grid, department infinite-scroll, and column-width logic. From there I kept owning whatever screen came next in the migration, design through implementation.",
          "The month view originally fetched an entire month's reservations in one request. I split it into parallel weekly requests that can reuse the server’s date-range cache. Replaying the original and changed code confirmed identical reservation results when a 35-day range was split into five seven-day requests.",
          "Because the web app runs inside a desktop webview, I also built the runtime foundation alongside the screens: refresh-token authentication, a bridge for events like settings changes between desktop and web, and pinned WebView2 runtime deployment after recurring runtime errors on certain hospital PCs.",
        ],
      },
      {
        heading: "Representative module: clinical records and data integrity",
        body: [
          "I built the clinical records screen, the largest module I owned in the web migration, connecting diagnosis and prescription entry, fee calculation, treatment-pass usage, and saving. A duplicate-save guard and a form refactor that established a single source of truth resolved repeated-save and popup-state issues.",
        ],
      },
      {
        heading: "External integration and a verification tool",
        body: [
          "I integrated HIRA drug-utilization review (DUR) into the prescription-save flow, building both the web review popup and the backend broker integration. The workflow issues a confirmation number, runs the checks, handles the results, and proceeds to saving.",
          "Since results exchanged with an external server were hard to verify visually, I built a separate dur-conformance CLI. It replays the same call path as the integration and automatically compares responses from YAML-defined cases against expected results. It was run manually after changes to outbound messages or review logic, rather than connected to CI.",
        ],
      },
      {
        heading: "Establishing a pattern",
        body: [
          "Later in the migration I settled on a repeatable pattern — add the API, build a standalone web app, embed it in the desktop webview — and applied it to three more desktop-only screens: assignment inquiry, the clinic status board, and the reception/wait-status board. Building the API first and the web app in isolation before wiring it into the desktop webview kept all three ports fast and consistent.",
        ],
      },
      {
        heading: "Polling during persistent failures",
        body: [
          "Added longer polling intervals after consecutive failures. Screens with a 60-second base interval switch to 300 seconds after three consecutive failures. In the sustained-failure state, scheduled polling frequency falls from 60 to 12 times per hour (80%). This is calculated from the configured intervals, not measured production traffic.",
        ],
      },
    ],
  },

  "call-center-crm": {
    lead: "Built a new web module for managing call-center leads and inbound consultations from the ground up, owning telephony integration, three intake channels, and consultation history across both the UI and its API.",
    sections: [
      {
        heading: "Background",
        body: [
          "A new web module for managing marketing leads and inbound-call consultations at a clinic's call center. Field feedback from a large plastic-surgery clinic running its own call center kept arriving as tickets, and the module went through short cycles of intake, build, and on-site verification. Early on it was live at that one clinic, handling roughly 480 leads and calls a day.",
          "Telephony runs over a local WebSocket to the 'MediCall' CTI middleware, with exponential backoff on reconnect. For this module I also built the backend API myself, not just the frontend.",
        ],
      },
      {
        heading: "Three intake channels",
        body: [
          "Leads arrive through three channels: a bulk Excel upload, manual single-lead registration, and automatic creation from inbound calls. The bulk upload became a wizard — upload, customer matching, then data correction — with a modal calling out failed rows, and matched rows classified straight off the server's matchType. I had the validate response embed candidate customers directly, which removed the follow-up customer search for each distinct phone number requiring a match.",
          "The manual registration modal auto-matches contact info and requires both lead-source fields to be filled together. On an inbound call, the module auto-assigns the logged-in agent and creates a lead automatically; if the number isn't registered yet, it opens the registration modal automatically.",
          "The lead list got header filters across eight columns, a two-level tree filter for lead source, and filter state persisted to localStorage. I later moved column filtering entirely server-side so the list, tabs, and Excel export all agreed on the same result set. I also added an API for a customer's full consultation history, plus edit and delete on individual records. Permissions took eleven CCMS-specific codes, added across three repositories: the desktop permission tree, the API's enum, and the web's permission checks.",
        ],
      },
      {
        heading: "What broke in the field",
        body: [
          "A race condition let a single inbound call spawn two leads, and consultation drafts in progress would disappear if the call dropped mid-conversation. I fixed both as part of stabilizing the inbound-call path.",
          "Later, in July 2026, I removed an N+1 pattern that queried options once per lead-source category, replacing it with a single batch endpoint for the whole list.",
        ],
      },
      {
        heading: "Measured results",
        body: [
          "Replaying the original and changed customer-matching code with 1,000 distinct auto-matched phone numbers reduced follow-up searches from 1,000 to zero. Results also matched for repeated numbers, new customers, and ambiguous matches. The initial file validation and final registration requests were outside this measurement.",
          "Twenty-six recent production log responses showed 12 lead-source categories at one clinic. Replaying both implementations with that category count reduced initial option requests from 12 to 1 (91.7%). Including the category lookup, related requests fell from 13 to 2 (84.6%). An immediate remount with a fresh options cache made no additional option requests in either version.",
          "For Excel export, I removed redundant validation of merged-cell ranges. A local benchmark with 300 synthetic leads, 600 rows, and 4,500 merged ranges reduced median file-generation time from 1.77 seconds to 19 ms (98.9%). Both implementations ran five measured trials with Apache POI 5.4.1, and every output was checked for identical cell values and merged ranges. This measures file generation, excluding database queries and download time.",
        ],
      },
    ],
  },

  "payment-terminal": {
    lead: "Integrated a Toss payment terminal into the CRM's checkout flow, owning both the desktop and web client work plus backend stabilization. When sessions landed on different pods and lost track of each other, I fixed it with a Kafka relay.",
    sections: [
      {
        heading: "Background",
        body: [
          "This was an epic to wire a Toss payment terminal (their Front Plugin) into the CRM's checkout flow. The backend payment-session infrastructure already existed; I owned both the desktop CRM (.NET 6, WPF) and web client integrations, plus backend stabilization. The integration came about because Toss reached out about a partnership: pairing the terminal with MediCash, the company's own point-based payment service, to supply more Toss terminals to hospitals.",
          "Afterward I kept fixing balance-consistency issues that surfaced whenever MediCash points and Toss payments mixed, and reworked the pairing screens and settings after the integration moved from leader mode to client mode. As of August 2026 it's still pending production rollout.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "On the desktop CRM I built a WebSocket client with automatic reconnect and a single connection per app, implemented the Toss session and refund services, and wired them into the checkout screen.",
          "On the web side I built the payment slice itself: a Zustand session state machine, a retry queue, and the WebSocket hooks around them.",
          "On the backend I stabilized the failure and cancellation paths: sending session.abort to the plugin on cancel or failure so the terminal screen wouldn't get stuck, hardening the watchdogs that catch a dropped connection, and re-establishing the security context on the WebSocket handler.",
          "Later I worked through a chain of MediCash consistency bugs in order: the quick-checkout discount summary not updating when points were applied mid-session, balances left sitting in pending payment by the point amount even after payment completed, stale balances reappearing when a prescription reloaded, and usage not showing up on screen for records created without a reservation. When the integration moved from leader mode to client mode, I built a new device pairing screen — issuing codes, listing devices, deregistering them — and removed the old terminal settings UI from preferences.",
        ],
      },
      {
        heading: "The multi-pod problem",
        body: [
          "When the payment plugin's WebSocket and the CRM's WebSocket landed on different pods, we'd hit a DEVICE_OFFLINE error. Sessions lived in an in-memory registry, so whenever the two connections landed on different pods, neither pod had any way to find the other terminal.",
          "I proposed this structure myself and built it: a Kafka fan-out relay that carries session state across pods, so no matter which pod pairing the two connections land on, the session reaches the other side. Payment sessions now stay connected regardless of how the pods get assigned.",
        ],
      },
    ],
  },

  "desktop-x64": {
    lead: "Migrated the CRM host to 64-bit by isolating vendor DLLs that only shipped as 32-bit into their own process, talking to the host over IPC. I proposed and led the migration.",
    sections: [
      {
        heading: "Background",
        body: [
          "Porting the CRM host to 64-bit ran into vendor DLLs that only shipped as 32-bit builds: the carrier-specific Smart Call APIs for KT, LG, and SK, and the card payment-terminal (VAN) module. Smart Call is the telephony system wired into the CRM, and the terminal module handles card payments in the checkout flow.",
          "A 64-bit host can't load those DLLs as they stand, so the migration needed a way to keep both integrations working. The work ran from late July through September 2025.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "I split those DLLs into a dedicated 32-bit process (Dll32Server) that talks to the host over IPC, and moved the KT/LG/SK Smart Call integration and payment-terminal logic into it.",
          "I reworked how the process's lifecycle was managed, moved the host itself to multithreading, added automatic restarts with error logging, and changed startup to initialize only the services actually needed.",
          "I cleaned up event delivery as well, wiring a global event sender through injection to stop events from getting dropped, and running the process on an STA thread to accommodate the KT DLL's habit of raising its own UI.",
          "I supported regression testing across every carrier and the full payment-terminal surface, and fixed the items QA sent back as failed.",
        ],
      },
      {
        heading: "The data behind it",
        body: [
          "I added OS 32-bit/64-bit ratio tracking to our Sentry collection, which gave us the field's actual bitness distribution. It rode along with the Sentry observability work I did that same quarter.",
        ],
      },
    ],
  },

  "deploy-notifier": {
    lead: "A tool I built on my own, unasked, to remove the need for everyone to individually check whether a production deploy actually went out. It pulls the commit range from a deploy webhook, finds the Slack thread tied to each issue, and replies there — narrowed down to hotfixes only, and still in active use today.",
    sections: [
      {
        heading: "Background",
        body: [
          "Checking whether a production deploy had actually landed was left to each person who needed to know. The core behavior is simple: pull issue keys out of the commits in a deploy's range, find the Slack thread linked to each issue, and reply there once the deploy completes.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "I built the Vercel webhook entry point with signature verification and async processing, a client that looks up the previous production deploy and pulls the commit range through the GitHub compare API (handling pagination and response truncation), a Jira thread lookup paired with a Slack archive-link parser, and the step that checks for an existing reply before posting one. Webhook in, commit range, thread lookup, reply out — the four steps run as one pass.",
          "Redeploys of the same SHA are skipped, and commit file lookups run in parallel. I covered edge cases with tests: staying at 200 on a malformed webhook body, returning 401 when the secret isn't configured.",
          "On July 15, 2026 I widened the target projects to five, including the call-center console and the wait-status board, rotated the webhook secret, and cut over. I also wrote design-spec docs, a script that replays real payloads for verification, and a DRY_RUN mode.",
        ],
      },
      {
        heading: "Keeping alerts narrow",
        body: [
          "It started out notifying on every production deploy. I judged that notifying on routine releases too would likely become noise, so I narrowed it to hotfix-style deploys only: same branch as the previous production deploy, or same service prefix and major.minor with only the patch bumped, and only when the first commit line matches hotfix formatting.",
          "When it doesn't have enough information to decide, it stays silent and just logs a warning instead of sending anything. I chose silence over a wrong notification.",
        ],
      },
    ],
  },

};
