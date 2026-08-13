"use client";

import { useRef, type ReactNode } from "react";

/**
 * 여닫는 기계 장치만 담당합니다. 내용은 서버에서 렌더링해 children으로 들어오므로
 * 클라이언트 번들에는 본문도 SVG도 포함되지 않습니다.
 *
 * 트리거는 카드 안 짧은 버튼이고, ::after로 카드 전체를 덮어 어디를 눌러도 열립니다.
 * 카드 전체를 버튼으로 감싸면 제목·설명이 버튼의 접근성 이름에 전부 들어가고
 * `h3`가 제목 트리에서 사라지므로 이 구조를 씁니다.
 */
export function ProjectDialog({
  triggerId,
  triggerLabel,
  triggerLabelledById,
  labelledById,
  closeLabel,
  children,
}: {
  triggerId: string;
  triggerLabel: string;
  /** 카드 제목 h3의 id. 버튼 이름 앞에 붙어 어느 프로젝트를 여는지 알립니다 */
  triggerLabelledById: string;
  /** 모달 제목 h3의 id */
  labelledById: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const savedBodyOverflow = useRef("");
  const pressedOnBackdrop = useRef(false);

  function open() {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    // 같은 모달을 다시 열면 이전 스크롤 위치가 남아 있습니다
    dialog.scrollTop = 0;
    savedBodyOverflow.current = document.body.style.overflow;
    // showModal()이 배경 상호작용은 막지만 일부 브라우저에서 본문 스크롤은 남습니다
    document.body.style.overflow = "hidden";
  }

  return (
    <>
      <button
        type="button"
        id={triggerId}
        aria-labelledby={`${triggerLabelledById} ${triggerId}`}
        onClick={open}
        className="cursor-pointer font-semibold text-accent after:absolute after:inset-0 after:rounded-lg after:content-['']"
      >
        {triggerLabel}
        <span aria-hidden> →</span>
      </button>
      <dialog
        ref={ref}
        aria-labelledby={labelledById}
        onClose={() => {
          document.body.style.overflow = savedBodyOverflow.current;
        }}
        onMouseDown={(event) => {
          pressedOnBackdrop.current = event.target === ref.current;
        }}
        onClick={(event) => {
          /*
           * 배경을 클릭하면 이벤트 대상이 dialog 자신입니다. 본문에서 시작한 드래그가
           * 배경에서 끝나는 경우까지 닫지 않도록 누른 지점과 뗀 지점을 함께 봅니다.
           */
          if (pressedOnBackdrop.current && event.target === ref.current) ref.current?.close();
        }}
        className="m-auto max-h-[85vh] w-[min(46rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-line bg-surface p-0 text-ink"
      >
        <div className="sticky top-0 z-10 flex justify-end bg-surface px-3 pt-3 pb-1">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={closeLabel}
            className="flex size-9 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-accent"
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
        </div>
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">{children}</div>
      </dialog>
    </>
  );
}
