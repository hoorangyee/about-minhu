import type { Locale } from "@/i18n/config";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";

export function PortfolioPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Header locale={locale} />
      <main className="flex-1">
        <Hero locale={locale} />
        <About locale={locale} />
        <Skills locale={locale} />
        <Experience locale={locale} />
        <Projects locale={locale} />
        <Education locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
