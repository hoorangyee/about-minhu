import type { ProjectDetail } from "@/types/portfolio";

export const projectDetails: Record<string, ProjectDetail> = {
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
          "The month view originally fetched an entire month's reservations in one request. I replaced that with per-week cached requests, which improved query performance as the migration grew.",
          "Because the web app runs inside a desktop webview, I also built the runtime foundation alongside the screens: refresh-token authentication, a bridge for events like settings changes between desktop and web, and pinned WebView2 runtime deployment after recurring runtime errors on certain hospital PCs.",
        ],
      },
      {
        heading: "Establishing a pattern",
        body: [
          "Later in the migration I settled on a repeatable pattern — add the API, build a standalone web app, embed it in the desktop webview — and applied it to three more desktop-only screens: assignment inquiry, the clinic status board, and the reception/wait-status board. Building the API first and the web app in isolation before wiring it into the desktop webview kept all three ports fast and consistent.",
        ],
      },
    ],
  },

  "clinical-record-screen": {
    lead: "Built a new clinical records screen inside the reservation-info panel, covering diagnosis and prescription entry through fee calculation and saving. It was the largest single module of the quarter.",
    sections: [
      {
        heading: "Background",
        body: [
          "Inside the reservation-info panel sits the record-entry screen: diagnosis codes and prescriptions, consultation-fee and exam-fee calculation, treatment-pass usage, and saving the record itself. Rebuilding this screen on the web was, by ticket count, the largest project of the quarter, with roughly 60 related tickets.",
          "Because the screen deals directly with prescriptions and diagnoses, integrating DUR — Korea's HIRA drug-utilization review — came along naturally while building it. The check runs as two calls: issue a confirmation number, then run the review. When nothing is flagged, saving proceeds without a popup; when something is flagged, the check result surfaces first. I wired this into the save gate.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "I built several input-assist features around diagnosis and prescription entry. Prescription-code autocomplete debounces input and sorts search results, and shows group-order and treatment-pass status through icons and tooltips. Entering a duplicate diagnosis code triggers a warning, and deleting a code also clears its fee assignment.",
          "The save pipeline consolidates onto a single save API and chains into payment completion once a save succeeds. Consultation and symptom notes save as RTF.",
          "Since the screen runs inside a desktop webview, I also handled the embedding: passing customer and reservation IDs as query parameters, syncing the URL when the customer changes, optimizing WebView2 memory usage, and gating exposure behind a QA-only flag for a staged rollout.",
          "In March I worked through roughly 30 tickets against this screen in a focused QA round — scrolling, layout, tooltip, and focus issues, plus marking records saved from NC (the in-house EMR) as read-only. Later QA rounds covered insurance-change handling, missing exam fees, blocking zero-amount payments on already-completed records, and auto-filling group-order prescription attributes and statement notes.",
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
          "A new web module for managing marketing leads and inbound-call consultations at a clinic's call center. Field feedback from a large plastic-surgery clinic running its own call center kept arriving as tickets, and the module went through short cycles of intake, build, and on-site verification. By the end of the quarter it was live at that one clinic, handling roughly 480 leads and calls a day.",
          "Telephony runs over a local WebSocket to the 'MediCall' CTI middleware, with exponential backoff on reconnect. For this module I also built the backend API (the hospital module) myself, not just the frontend.",
        ],
      },
      {
        heading: "Three intake channels",
        body: [
          "Leads arrive through three channels: a bulk Excel upload, manual single-lead registration, and automatic creation from inbound calls. The bulk upload became a wizard — upload, customer matching, then data correction — with a modal calling out failed rows and cleanup around the server's matchType classification. I had the validate response embed candidate customers directly, which removed the burst of per-row customer-search calls that used to follow it.",
          "The manual registration modal auto-matches contact info and requires both lead-source fields to be filled together. On an inbound call, the module auto-assigns the logged-in agent and creates a lead automatically; if the number isn't registered yet, it opens the registration modal automatically.",
          "The lead list got header filters across eight columns, a two-level tree filter for lead source, and filter state persisted to localStorage. I later moved column filtering entirely server-side so the list, tabs, and Excel export all agreed on the same result set. I also added an API for a customer's full consultation history plus edit/delete on individual records, and, across three repositories — the desktop permission tree, the API's enum, and the web's permission checks — eleven CCMS-specific permission codes.",
        ],
      },
      {
        heading: "What broke in the field",
        body: [
          "A race condition let a single inbound call spawn two leads, and consultation drafts in progress would disappear if the call dropped mid-conversation. I fixed both as part of stabilizing the inbound-call path.",
          "Later, in July, I removed an N+1 pattern where the lead-source dropdown queried its options once per row, replacing it with a single batch endpoint for the whole list.",
        ],
      },
    ],
  },
};
