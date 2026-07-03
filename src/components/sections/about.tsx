import type { Locale } from "@/i18n/config";
import { getContent } from "@/data/content";
import { SectionShell } from "@/components/section-shell";

export function About({ locale }: { locale: Locale }) {
  const { profile } = getContent(locale);
  return (
    <SectionShell id="about" locale={locale}>
      <div className="max-w-prose space-y-5 leading-relaxed text-ink/90">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </SectionShell>
  );
}
