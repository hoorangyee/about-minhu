import type { Locale } from "@/i18n/config";
import { profile as profileKo } from "@/data/profile";
import { skills as skillsKo } from "@/data/skills";
import { experiences as experiencesKo } from "@/data/experience";
import { projects as projectsKo } from "@/data/projects";
import { educations as educationsKo } from "@/data/education";
import { projectDetails as projectDetailsKo } from "@/data/project-details";
import { profile as profileEn } from "@/data/en/profile";
import { skills as skillsEn } from "@/data/en/skills";
import { experiences as experiencesEn } from "@/data/en/experience";
import { projects as projectsEn } from "@/data/en/projects";
import { educations as educationsEn } from "@/data/en/education";
import { projectDetails as projectDetailsEn } from "@/data/en/project-details";

const content = {
  ko: {
    profile: profileKo,
    skills: skillsKo,
    experiences: experiencesKo,
    projects: projectsKo,
    educations: educationsKo,
    projectDetails: projectDetailsKo,
  },
  en: {
    profile: profileEn,
    skills: skillsEn,
    experiences: experiencesEn,
    projects: projectsEn,
    educations: educationsEn,
    projectDetails: projectDetailsEn,
  },
} as const;

export function getContent(locale: Locale) {
  return content[locale];
}
