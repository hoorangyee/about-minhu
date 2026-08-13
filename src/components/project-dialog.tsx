"use client";

import { useRef, type ReactNode } from "react";

/**
 * 여닫는 기계 장치만 담당합니다. 내용은 서버에서 렌더링해 children으로 들어오므로
 * 클라이언트 번들에는 본문도 SVG도 포함되지 않습니다.
 */
export function ProjectDialog({
  trigger,
  triggerClassName,
  labelledById,
  closeLabel,
  children,
}: {
  trigger: ReactNode;
  triggerClassName: string;
  labelledById: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  function open() {
    ref.current?.showModal();
    // showModal()이 배경 상호작용은 막지만 일부 브라우저에서 본문 스크롤은 남습니다
    document.body.style.overflow = "hidden";
  }

  return (
    <>
      <button type="button" onClick={open} className={triggerClassName}>
        {trigger}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={labelledById}
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(event) => {
          // 배경을 클릭하면 이벤트 대상이 dialog 자신입니다
          if (event.target === ref.current) ref.current?.close();
        }}
        className="m-auto w-[min(46rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto rounded-lg border border-line bg-surface p-0 text-ink"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={closeLabel}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {children}
        </div>
      </dialog>
    </>
  );
}
