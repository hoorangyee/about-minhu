import Image from "next/image";
import type { Diagram, Project, ProjectDetail } from "@/types/portfolio";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { DiagramView } from "@/components/diagram/diagram";

export function ProjectDetailView({
  project,
  detail,
  diagram,
  locale,
  titleId,
}: {
  project: Project;
  detail: ProjectDetail;
  diagram?: Diagram;
  locale: Locale;
  titleId: string;
}) {
  const dict = ui[locale].projects;
  const links = [
    { url: project.githubUrl, label: dict.code },
    { url: project.demoUrl, label: dict.demo },
    { url: project.paperUrl, label: dict.paper },
    { url: project.bookUrl, label: dict.book },
  ].filter((link): link is { url: string; label: string } => Boolean(link.url));

  return (
    <div>
      <div>
        <h3 id={titleId} className="text-xl font-bold tracking-tight">
          {project.title}
        </h3>
        <p className="mt-1 text-xs font-medium text-accent">
          {project.context}
          {project.period ? ` · ${project.period}` : ""}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{detail.lead}</p>

      {diagram && (
        <figure className="my-7">
          <DiagramView
            diagram={diagram}
            locale={locale}
            idPrefix={project.slug ?? "project"}
            title={project.title}
          />
          <figcaption className="mt-3 text-xs leading-relaxed text-muted">
            {diagram.caption[locale]}
          </figcaption>
        </figure>
      )}

      {detail.sections.map((section) => (
        <section key={section.heading} className="mt-6">
          <h4 className="text-sm font-bold">{section.heading}</h4>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-2 text-sm leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      {detail.screenshot && (
        <figure className="mt-7">
          <Image
            src={detail.screenshot.src}
            width={detail.screenshot.width}
            height={detail.screenshot.height}
            alt={detail.screenshot.alt}
            sizes="(max-width: 736px) calc(100vw - 5rem), 672px"
            className="h-auto w-full rounded-lg border border-line"
          />
          <figcaption className="mt-3 text-xs leading-relaxed text-muted">
            {detail.screenshot.caption}
          </figcaption>
        </figure>
      )}

      <p className="mt-7 border-t border-line pt-4 font-mono text-xs text-muted">
        {(project.roles ?? project.techStack).join(" / ")}
      </p>
      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
