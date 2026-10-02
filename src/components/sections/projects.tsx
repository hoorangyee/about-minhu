import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Project } from "@/types/portfolio";
import { ui, type UiDict } from "@/i18n/ui";
import { getContent } from "@/data/content";
import { diagrams } from "@/data/diagrams";
import { SectionShell } from "@/components/section-shell";
import { ProjectDialog } from "@/components/project-dialog";
import { ProjectDetailView } from "@/components/project-detail";

/* relative는 상세 버튼의 ::after가 카드 전체를 덮을 기준입니다 */
const CARD_CLASS =
  "relative mb-5 grid row-span-6 grid-rows-subgrid rounded-lg border border-line bg-surface p-6 transition-colors hover:border-accent";

/*
 * subgrid로 6개 구획(제목/맥락/설명/성과/기술/링크)의 행 트랙을 옆 카드와 공유해
 * 같은 행의 카드끼리 높이와 각 구획의 세로 위치가 정확히 정렬됩니다.
 * 따라서 이 컴포넌트는 감싸는 요소 없이 6개 구획만 내보냅니다.
 */
function CardBody({
  project,
  dict,
  titleId,
  action,
}: {
  project: Project;
  dict: UiDict["projects"];
  titleId?: string;
  /** 상세가 있는 카드의 트리거 버튼 */
  action?: ReactNode;
}) {
  const links = [
    { url: project.githubUrl, label: dict.code },
    { url: project.demoUrl, label: dict.demo },
    { url: project.paperUrl, label: dict.paper },
    { url: project.bookUrl, label: dict.book },
  ].filter((l): l is { url: string; label: string } => Boolean(l.url));

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-lg font-bold">
          {project.title}
        </h3>
        {project.period && (
          <span className="shrink-0 font-mono text-xs text-muted">{project.period}</span>
        )}
      </div>
      {project.context && (
        <p className="row-start-2 mt-1 text-xs font-medium text-accent">{project.context}</p>
      )}
      <p className="row-start-3 mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
      {project.impact && <p className="row-start-4 mt-3 text-sm font-medium">{project.impact}</p>}
      <p className="row-start-5 mt-4 self-end font-mono text-xs text-muted">
        {(project.roles ?? project.techStack).join(" / ")}
      </p>
      <div className="row-start-6 mt-5 flex flex-wrap gap-x-4 gap-y-2 self-end border-t border-line pt-4 text-sm">
        {action}
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 font-semibold transition-colors hover:text-accent"
          >
            {link.label}
          </a>
        ))}
        {!action && links.length === 0 && (
          <span className="text-muted">{dict.privateNote}</span>
        )}
      </div>
    </>
  );
}

export function Projects({ locale }: { locale: Locale }) {
  const { projects, projectDetails } = getContent(locale);
  const dict = ui[locale].projects;
  const groups = [
    { key: "work", label: dict.workGroup },
    { key: "personal", label: dict.personalGroup },
  ] as const;

  return (
    <SectionShell id="projects" locale={locale}>
      <div className="space-y-12">
        {groups.map((group) => {
          const items = projects.filter((p) => p.group === group.key);
          if (items.length === 0) return null;
          return (
            <div key={group.key}>
              <h3 className="mb-4 text-sm font-medium tracking-wide text-muted">{group.label}</h3>
              <div className="-mb-5 grid gap-x-5 sm:grid-cols-2">
                {items.map((project) => {
                  const detail = project.slug ? projectDetails[project.slug] : undefined;
                  if (!detail || !project.slug) {
                    return (
                      <article key={project.title} className={CARD_CLASS}>
                        <CardBody project={project} dict={dict} />
                      </article>
                    );
                  }
                  const cardTitleId = `project-${project.slug}-card-title`;
                  const dialogTitleId = `project-${project.slug}-title`;
                  const triggerId = `project-${project.slug}-trigger`;
                  /*
                   * 닫힌 dialog는 display:none이라 격자 항목을 만들지 않으므로
                   * 여섯째 구획 안에 트리거와 나란히 두어도 subgrid 정렬이 그대로입니다.
                   */
                  return (
                    <article key={project.title} className={CARD_CLASS}>
                      <CardBody
                        project={project}
                        dict={dict}
                        titleId={cardTitleId}
                        action={
                          <ProjectDialog
                            triggerId={triggerId}
                            triggerLabel={dict.detail}
                            triggerLabelledById={cardTitleId}
                            labelledById={dialogTitleId}
                            closeLabel={dict.close}
                          >
                            <ProjectDetailView
                              project={project}
                              detail={detail}
                              diagram={diagrams[project.slug]}
                              locale={locale}
                              titleId={dialogTitleId}
                            />
                          </ProjectDialog>
                        }
                      />
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
