import { db } from "@/db";
import { sections as sectionsTable, siteSettings as siteSettingsTable } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import type { SectionRecord, SiteSettingsRecord } from "@/lib/section-types";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();

  const [rows, [settingsRow]] = await Promise.all([
    db.select().from(sectionsTable).orderBy(asc(sectionsTable.position)),
    db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 1)),
  ]);

  const visibleSections = rows.filter((row) => row.visible) as unknown as SectionRecord[];
  const settings = settingsRow as unknown as SiteSettingsRecord;

  return (
    <main className="min-h-screen bg-[#0b0d12]">
      <Header sections={visibleSections} settings={settings} />
      {visibleSections.map((section) => (
        <SectionRenderer key={section.id} section={section} settings={settings} />
      ))}
      <Footer settings={settings} />
    </main>
  );
}
