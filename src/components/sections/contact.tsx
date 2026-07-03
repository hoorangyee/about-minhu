import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getContent } from "@/data/content";
import { SectionShell } from "@/components/section-shell";

export function Contact({ locale }: { locale: Locale }) {
  const { profile } = getContent(locale);
  const dict = ui[locale].contact;
  return (
    <SectionShell id="contact" locale={locale}>
      <p className="leading-relaxed text-muted">{dict.blurb}</p>
      <a
        href={`mailto:${profile.email}`}
        className="mt-6 inline-block break-all font-serif text-2xl font-bold tracking-tight underline decoration-line decoration-2 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent sm:text-3xl md:text-4xl"
      >
        {profile.email}
      </a>
      <div className="mt-10 flex flex-wrap gap-6 text-sm font-semibold">
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            GitHub ↗
          </a>
        )}
        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn ↗
          </a>
        )}
        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            {dict.resume}
          </a>
        )}
      </div>
    </SectionShell>
  );
}
