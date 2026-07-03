import type { Locale } from "@/i18n/config";
import { getContent } from "@/data/content";

export function Footer({ locale }: { locale: Locale }) {
  const { profile } = getContent(locale);
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
