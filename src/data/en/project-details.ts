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

  "clinical-record-screen": {
    lead: "Built a new clinical records screen inside the reservation-info panel, covering diagnosis and prescription entry through fee calculation and saving. It was the largest single module I owned in the migration.",
    sections: [
      {
        heading: "Background",
        body: [
          "Inside the reservation-info panel sits the record-entry screen: diagnosis codes and prescriptions, consultation-fee and exam-fee calculation, treatment-pass usage, and saving the record itself. I rebuilt the full workflow on the web, from prescription entry to saving.",
          "Because the screen deals directly with prescriptions and diagnoses, integrating DUR — Korea's HIRA drug-utilization review — came along naturally while building it. The check runs as two calls: issue a confirmation number, then run the review. When nothing is flagged, saving proceeds without a popup; when something is flagged, the check result surfaces first. I wired this into the save gate.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "I built several input-assist features around diagnosis and prescription entry. Prescription-code autocomplete debounces input and sorts search results, and shows group-order and treatment-pass status through icons and tooltips. Entering a duplicate diagnosis code triggers a warning, and deleting a code also clears its fee assignment.",
          "The save pipeline consolidates onto a single save API and chains into payment completion once a save succeeds. Consultation and symptom notes save as RTF.",
          "Since the screen runs inside a desktop webview, I also handled the embedding: passing customer and reservation IDs as query parameters, syncing the URL when the customer changes, optimizing WebView2 memory usage, and gating exposure behind a QA-only flag for a staged rollout.",
          "In March 2026 I addressed scrolling, layout, tooltip, and focus issues found in QA, and marked records saved from NC (the in-house EMR) as read-only. Later QA rounds covered insurance-change handling, missing exam fees, blocking zero-amount payments on already-completed records, and auto-filling group-order prescription attributes and statement notes.",
        ],
      },
      {
        heading: "What was tricky",
        body: [
          "Clicking the save button repeatedly could create duplicate records for the same visit. I added a dedupe guard to the save gate to stop it.",
          "The provider-assignment popup (doctor, counselor, assistant) had its state scattered across several places, so values wouldn't hold correctly across opening and closing it. I fixed this with a refactor that made the form the single source of truth.",
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

  "dur-integration": {
    lead: "Building the reservation-info panel's new 'record entry' tab included DUR — Korea's HIRA drug-utilization review — integration end to end, from the web popup through the backend broker. Since it's an external integration that's hard to eyeball, I also built a separate CLI that replays the call path and auto-checks responses against declared cases.",
    sections: [
      {
        heading: "Background",
        body: [
          "The reservation-info panel's new 'record entry' tab brought prescription and diagnosis entry together with the rest of the existing EMR feature set, and DUR integration came along as a natural part of building it — HIRA's (Health Insurance Review & Assessment Service) drug-utilization review, which flags interactions and duplicate prescriptions. There was no separate HIRA certification or review process involved; it was a fresh integration built from scratch.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "On the web I built a new DUR check popup slice: issue a confirmation number, then run the check, as two calls. Results render in a table, reasons can be entered and sent in bulk, and the whole thing is wired into the save gate — when nothing is flagged, saving proceeds with no popup at all.",
          "On the backend I built the broker connection to HIRA from scratch. I moved a hardcoded 38-character auth code to a dynamic database lookup, implemented every check type that can appear on a prescription, and unified the outgoing message format. Interaction checks run against a master database loaded from S3 (SQLite packed in a zip), and daily maximum dosage for capacity-warning items is normalized to active-ingredient milligrams. I added a check-cancellation endpoint and made the reference database's version follow whatever version was actually loaded, instead of a fixed value.",
          "I kept fixing what surfaced once the integration was in. Deleting a record now also triggers DUR cancellation, so the HIRA-side check entry doesn't linger. I added a resubmit path for check response codes 53004 through 53008, aligned the invariant that the DUR confirmation number and the outside-prescription issuance number must match with how NC (the in-house EMR) handles it, and fixed an infinite loop in issuance-number generation caused by a date-max lookup that didn't match its own LIKE condition. Daily dosage now accepts fractional values, and I removed a spot where a single dose was being split and calculated twice.",
        ],
      },
      {
        heading: "Why a separate verification tool",
        body: [
          "DUR checks are a real call to a HIRA server and back, so looking at the screen alone couldn't tell me whether a given response was actually correct.",
          "So I built a separate CLI, dur-conformance, in its own repo. It replays the same confirmation-number and check calls the CRM makes, runs the cases declared in YAML one by one, compares each response against its expected values, and writes a report. It isn't wired into CI; I ran it by hand after reworking the outgoing message format or the check logic.",
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

  "cashdoc-mobile": {
    lead: "Built a new mobile operations screen for Cashdoc's clinic event CMS, an in-house service separate from SmartDoctor. Alongside the screens themselves, I widened a data structure across four repositories so consultation notifications, which had nowhere to land before, could join reservation alerts in the same inbox.",
    sections: [
      {
        heading: "Background",
        body: [
          "Cashdoc is a separate in-house service from the SmartDoctor CRM, and its clinic event CMS had no mobile operations screen. I was pulled onto building one during this period and have kept owning it since. Clinic admins can handle day-to-day operations — confirming reservations, responding to consultations, replying to reviews — from a phone, without being at a PC.",
        ],
      },
      {
        heading: "Screens built",
        body: [
          "I stood up the `/mobile` route and shell, built a shared UI kit — bottom sheets, confirmation sheets, list-state components — and hung the screens off it. A home dashboard (today's tasks) leads, and reservations split into a list (date-range and status-chip filters, search, inline confirm), a detail view (confirm, cancel, mark visited), and new-reservation creation. Consultations got an applicant list and detail view (status changes, notes, SMS); reviews got a reviews-and-Q&A list with a reply screen. On top of that sit the notification inbox (list, read state, deep links) and the catch-all covering announcements, clinic-profile completeness, and logout — the full set a mobile operator needs.",
          "I matched the design against a demo prototype as I built out each real screen, and added a trigger that routes mobile-device visitors straight to the mobile screens. Reservation lookups were aligned to the same filter model as the PC reservation-management screen, with counts driven off the current query results, and I worked through a run of mobile-specific rough edges: counts flickering to empty on every filter change, a horizontal scroll strip getting clipped at the screen edge, and the page starting zoomed in on first load.",
          "I also touched the build environment to stop Vercel builds from dying with out-of-memory errors — lowering the build worker count and raising the dev server's heap limit.",
        ],
      },
      {
        heading: "Widening the notification inbox",
        body: [
          "The inbox only ever held reservation notifications; consultation notifications had no home on any server at all. That wasn't a screen-level bug to patch — it was a structural gap in where the data could even go — and fixing it touched four repositories.",
          "Rather than build a new event or delivery path just for consultations, I added one more branch onto the existing `ApplicantCreated` domain event. On the storage side, I extended the table that used to hold only reservation alerts so it could carry both kinds, and enforced with a CHECK constraint that exactly one of its two foreign keys gets filled, so reservation and consultation notifications can't get mixed up.",
          "I split the deploy into four steps, in this order: schema, then API, then frontend, then the ingestion that actually writes consultation data. The first three ship with no consultation data flowing yet, so stopping anywhere in that sequence leaves the screen behaving exactly as it did before. Only the last step, ingestion, starts writing rows into the inbox table — which means rolling back is just flipping that one switch back off.",
        ],
      },
    ],
  },
};
