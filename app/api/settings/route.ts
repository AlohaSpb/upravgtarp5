import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  await ensureSeeded();
  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
  if (!settings) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const { adminPassword: _adminPassword, ...publicSettings } = settings;
  return Response.json({ settings: publicSettings });
}

export async function PATCH(request: NextRequest) {
  const db = getDb();
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const allowedFields = [
    "siteName",
    "tagline",
    "logoEmoji",
    "accentColor",
    "serverIp",
    "discordLink",
    "vkLink",
    "telegramLink",
    "youtubeLink",
    "footerText",
  ] as const;

  const updates: Partial<typeof siteSettings.$inferInsert> = { updatedAt: new Date() };
  for (const field of allowedFields) {
    if (typeof body[field] === "string") {
      updates[field] = body[field];
    }
  }

  if (typeof body.newPassword === "string" && body.newPassword.trim().length >= 4) {
    updates.adminPassword = body.newPassword.trim();
  }

  const [updated] = await db
    .update(siteSettings)
    .set(updates)
    .where(eq(siteSettings.id, 1))
    .returning();

  const { adminPassword: _adminPassword, ...publicSettings } = updated;
  return Response.json({ settings: publicSettings });
}
