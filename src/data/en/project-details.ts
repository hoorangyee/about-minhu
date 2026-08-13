import type { ProjectDetail } from "@/types/portfolio";

export const projectDetails: Record<string, ProjectDetail> = {
  "crm-web-migration": {
    lead: "A long-running migration of the desktop CRM's core screens to the web, starting with the reservation calendar and ending with a repeatable pattern applied to three more screens.",
    sections: [
      {
        heading: "Background",
        body: [
          "The desktop CRM is what clinic front-desk and consultation staff use every day, and changing or adding a screen meant touching C#/WPF code and redeploying an installer. That made it hard to keep up with hospital-specific requests at any real speed.",
          "So a long-running migration began: embed a WebView2 host inside the desktop CRM and move screens to the web one at a time, rather than rewriting the whole desktop app at once. Each screen could go live as soon as its port was done, instead of waiting on one big release.",
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
};
