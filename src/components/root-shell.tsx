import type { Locale } from "@/i18n/config";
import { fontClassNames } from "@/lib/fonts";

// 페인트 전에 저장된 테마를 적용해 다크모드 깜빡임(FOUC)을 막는다
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

/** 로케일별 루트 레이아웃이 공유하는 html/body 셸 */
export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontClassNames} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
