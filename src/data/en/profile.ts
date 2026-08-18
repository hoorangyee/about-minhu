import type { Profile } from "@/types/portfolio";
import { profile as profileKo } from "@/data/profile";

// 영어판 프로필 — 연락처·URL은 한국어판과 공유
export const profile: Profile = {
  name: "Minhu Park",
  role: "Software Engineer",
  status: "Looking for the next problem to solve",
  headline: ["Complex problems,", "simple structures."],
  summary:
    "For the past two years I've built a clinic CRM across the stack — from a C#/WPF desktop app through a React web migration to Kotlin backend APIs. When I find a structural problem I propose a fix, and I automate whatever repeats.",
  about: [
    "I've been building a clinic CRM at SmartDoctor since 2024. I started out maintaining the desktop app (C#/WPF), took on the design and implementation of my modules in the web migration (React), and now build the backend APIs (Kotlin/Spring) as well. I believe development moves faster and stays more consistent when one person can handle everything from the frontend to the backend, and that's how I work today.",
    "I prefer fixing structures over symptoms. I rebuilt a flow that re-fetched an entire screen whenever a single reservation changed into single-item updates, and isolated the 32-bit-only integration modules that blocked a 64-bit migration into a separate process, so the same problems don't come back.",
    "I automate repetitive work. I moved release tagging, Jira version management, and reviewer assignment onto GitHub Actions, and brought Sentry and a load-time monitoring bot into an environment where errors used to be diagnosed from customer screenshots. I enjoy building tools that give the team its time back.",
  ],
  email: profileKo.email,
  github: profileKo.github,
  linkedin: profileKo.linkedin,
  resumeUrl: profileKo.resumeUrl,
  siteUrl: profileKo.siteUrl,
};
