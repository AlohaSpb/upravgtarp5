import { getDb } from "@/db";
import { sections, siteSettings } from "@/db/schema";
import { defaultContentFor, SectionType } from "@/lib/section-types";
import { eq, sql } from "drizzle-orm";

const DEFAULT_ORDER: SectionType[] = [
  "hero",
  "features",
  "text",
  "rules",
  "news",
  "contacts",
];

export async function ensureSeeded() {
  const db = getDb();
  const countResult = await db.execute(sql`select count(*)::int as count from ${sections}`);
  const rows = (countResult as unknown as { rows: { count: number }[] }).rows;
  const count = rows[0]?.count ?? 0;

  if (!count) {
    await db.insert(sections).values(
      DEFAULT_ORDER.map((type, index) => ({
        type,
        content: defaultContentFor(type),
        position: index,
        visible: true,
      }))
    );
  }

  const existingSettings = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({ id: 1 });
  }
}
