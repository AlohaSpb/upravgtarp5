import { getDb } from "@/db";
import { sections } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { isAuthenticated } from "@/lib/auth";
import { SECTION_TYPES, defaultContentFor, SectionType } from "@/lib/section-types";
import { asc } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const db = getDb();
  await ensureSeeded();
  const includeHidden = request.nextUrl.searchParams.get("all") === "1";

  const rows = await db.select().from(sections).orderBy(asc(sections.position));
  const filtered = includeHidden ? rows : rows.filter((row) => row.visible);

  return Response.json({ sections: filtered });
}

export async function POST(request: NextRequest) {
  const db = getDb();
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const type = body?.type as SectionType | undefined;

  if (!type || !SECTION_TYPES.includes(type)) {
    return Response.json({ error: "Invalid section type" }, { status: 400 });
  }

  const rows = await db.select().from(sections);
  const maxPosition = rows.reduce((max, row) => Math.max(max, row.position), -1);

  const content = defaultContentFor(type) as Record<string, unknown>;
  if (type === "custom") {
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const link = typeof body?.link === "string" ? body.link.trim() : "";
    if (title) {
      content.title = title;
      content.navLabel = title;
    }
    if (link) content.navLink = link.startsWith("/") || link.startsWith("http") ? link : `/${link}`;
  }

  const [created] = await db
    .insert(sections)
    .values({
      type,
      content,
      position: maxPosition + 1,
      visible: true,
    })
    .returning();

  return Response.json({ section: created });
}
