import type { Locale } from "@/i18n/config";
import { getContent } from "@/data/content";
import { SectionShell } from "@/components/section-shell";

export function Experience({ locale }: { locale: Locale }) {
  const { experiences } = getContent(locale);
  return (
    <SectionShell id="experience" locale={locale}>
      <ol className="space-y-12">
        {experiences.map((exp) => (
          <li
            key={`${exp.company}-${exp.period}`}
            className="grid gap-2 md:grid-cols-[150px_1fr] md:gap-6"
          >
            <p className="font-mono text-xs leading-6 text-muted">
              {exp.period}
            </p>
            <div>
              <h3 className="text-lg font-bold">{exp.company}</h3>
              <p className="mt-0.5 text-sm text-accent">{exp.role}</p>
              <ul className="mt-4 space-y-2.5">
                {exp.highlights.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-ink/90">
                    <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-muted" />
                    {item}
                  </li>
                ))}
              </ul>
              {exp.techStack && (
                <p className="mt-4 font-mono text-xs text-muted">
                  {exp.techStack.join(" / ")}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
