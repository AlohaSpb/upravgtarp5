import Link from "next/link";
import type { SectionRecord, SiteSettingsRecord } from "@/lib/section-types";

const NAV_LABELS: Record<string, string> = {
  hero: "Главная",
  features: "Меню",
  stats: "Показатели",
  rules: "Положения",
  news: "Объявления",
  gallery: "Материалы",
  text: "Об управлении",
  cta: "",
  contacts: "Контакты",
};

const NAV_ANCHORS: Record<string, string> = {
  features: "menu",
};

export function Header({ sections, settings }: { sections: SectionRecord[]; settings: SiteSettingsRecord }) {
  const navItems = sections
    .filter((section) => NAV_LABELS[section.type])
    .filter((section, index, arr) => arr.findIndex((s) => s.type === section.type) === index);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d12]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <a href="#hero" className="flex items-center gap-2 text-white">
          <span className="text-2xl">{settings.logoEmoji}</span>
          <span className="text-lg font-black tracking-tight">{settings.siteName}</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
          {navItems.map((section) => (
            <a key={section.id} href={`#${NAV_ANCHORS[section.type] ?? section.type}`} className="transition hover:text-white">
              {NAV_LABELS[section.type]}
            </a>
          ))}
        </nav>
        <Link
          href="/admin"
          className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/40 hover:text-white"
        >
          Админ
        </Link>
      </div>
    </header>
  );
}
