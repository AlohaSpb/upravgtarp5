import type { SiteSettingsRecord } from "@/lib/section-types";

export function Footer({ settings }: { settings: SiteSettingsRecord }) {
  return (
    <footer className="border-t border-white/10 bg-[#080a0e] py-10 text-white/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <div className="flex items-center gap-2 text-white">
          <span className="text-xl">{settings.logoEmoji}</span>
          <span className="font-bold">{settings.siteName}</span>
        </div>
        {settings.tagline ? <p className="text-sm text-white/45">{settings.tagline}</p> : null}
        <p className="text-xs">{settings.footerText}</p>
      </div>
    </footer>
  );
}
