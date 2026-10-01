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

      <p className="mt-7 border-t border-line pt-4 font-mono text-xs text-muted">
        {(project.roles ?? project.techStack).join(" / ")}
      </p>
      {project.bookUrl && (
        <a
          href={project.bookUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-accent transition-colors hover:text-ink"
        >
          {ui[locale].projects.book}
        </a>
      )}
    </div>
  );
}
