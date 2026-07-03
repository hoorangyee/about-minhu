import type { Locale } from "@/i18n/config";
import { getContent } from "@/data/content";
import { SectionShell } from "@/components/section-shell";

export function Skills({ locale }: { locale: Locale }) {
  const { skills } = getContent(locale);
  return (
    <SectionShell id="skills" locale={locale}>
      <dl>
        {skills.map((group) => (
          <div
            key={group.category}
            className="grid gap-1 border-b border-line py-5 first:pt-0 sm:grid-cols-[140px_1fr] sm:gap-4"
          >
            <dt className="text-sm font-medium tracking-wide text-muted">
              {group.category}
            </dt>
            <dd className="flex flex-wrap items-baseline font-medium leading-relaxed">
              {group.items.map((item, i) => (
                <span key={item} className="whitespace-nowrap">
                  {item}
                  {i < group.items.length - 1 && (
                    <span aria-hidden className="mx-2 text-line">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
