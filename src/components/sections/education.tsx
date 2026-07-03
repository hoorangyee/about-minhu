import type { Locale } from "@/i18n/config";
import { getContent } from "@/data/content";
import { SectionShell } from "@/components/section-shell";

export function Education({ locale }: { locale: Locale }) {
  const { educations } = getContent(locale);
  return (
    <SectionShell id="education" locale={locale}>
      <ol className="space-y-8">
        {educations.map((edu) => (
          <li
            key={`${edu.school}-${edu.period}`}
            className="grid gap-2 md:grid-cols-[150px_1fr] md:gap-6"
          >
            <p className="font-mono text-xs leading-6 text-muted">
              {edu.period}
            </p>
            <div>
              <h3 className="text-lg font-bold">{edu.school}</h3>
              <p className="mt-0.5 text-sm text-muted">{edu.degree}</p>
              {edu.note && (
                <p className="mt-3 leading-relaxed text-ink/90">{edu.note}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
