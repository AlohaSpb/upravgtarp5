import Link from "next/link";
import type { SectionRecord, SiteSettingsRecord } from "@/lib/section-types";
import { getSectionNavigation } from "@/lib/section-types";

export function Header({ sections, settings }: { sections: SectionRecord[]; settings: SiteSettingsRecord }) {
  const navItems = sections
    .map((section) => ({ section, navigation: getSectionNavigation(section) }))
    .filter(({ navigation }) => navigation.show && navigation.label)
    .filter(({ navigation }, index, arr) => arr.findIndex((item) => item.navigation.link === navigation.link) === index);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d12]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="text-2xl">{settings.logoEmoji}</span>
          <span className="text-lg font-black tracking-tight">{settings.siteName}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
          {navItems.map(({ section, navigation }) => (
            <Link key={section.id} href={navigation.link} className="transition hover:text-white">
              {navigation.label}
            </Link>
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
