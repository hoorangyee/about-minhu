import type { Metadata, Viewport } from "next";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/config";
import { getContent } from "@/data/content";

export function buildMetadata(locale: Locale): Metadata {
  const { profile } = getContent(locale);
  const title = `${profile.name} — ${profile.role}`;
  return {
    metadataBase: new URL(profile.siteUrl),
    title,
    description: profile.summary,
    openGraph: {
      title,
      description: profile.summary,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: localePath(locale),
      languages: {
        ko: localePath("ko"),
        en: localePath("en"),
      },
    },
  };
}

export const sharedViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8f7" },
    { media: "(prefers-color-scheme: dark)", color: "#14161c" },
  ],
};
