import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getContent } from "@/data/content";

export function Hero({ locale }: { locale: Locale }) {
  const { profile } = getContent(locale);
  const dict = ui[locale].hero;
  return (
    <section id="top" className="mx-auto flex max-w-5xl flex-col justify-center px-6 pb-24 pt-20 md:min-h-[calc(100vh-3.5rem)] md:pb-32 md:pt-0">
      <p
        className="animate-rise flex items-center gap-2 text-sm font-medium tracking-wide text-muted"
        style={{ animationDelay: "0ms" }}
      >
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        {profile.status}
      </p>

      <h1
        className="animate-rise mt-6 font-serif text-4xl font-extrabold leading-[1.25] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.2]"
        style={{ animationDelay: "120ms" }}
      >
        {profile.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <p
        className="animate-rise mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        style={{ animationDelay: "240ms" }}
      >
        {locale === "ko" ? (
          <>
            <strong className="font-semibold text-ink">
              {profile.role} {profile.name}
            </strong>
            입니다. {profile.summary}
          </>
        ) : (
          <>
            <strong className="font-semibold text-ink">
              {profile.name}
            </strong>{" "}
            — {profile.role}. {profile.summary}
          </>
        )}
      </p>

      <div
        className="animate-rise mt-10 flex flex-wrap items-center gap-3"
        style={{ animationDelay: "360ms" }}
      >
        <a
          href={`mailto:${profile.email}`}
          className="rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-85"
        >
          {dict.emailCta}
        </a>
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            {dict.github}
          </a>
        )}
        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            {dict.resume}
          </a>
        )}
      </div>
    </section>
  );
}
