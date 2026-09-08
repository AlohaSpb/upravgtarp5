import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const db = getDb();
  await ensureSeeded();
  const body = await request.json().catch(() => null);
  const password = body?.password as string | undefined;

  if (!password) {
    return Response.json({ error: "Введите пароль" }, { status: 400 });
  }

  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));

  if (!settings || settings.adminPassword !== password) {
    return Response.json({ error: "Неверный пароль" }, { status: 401 });
  }

  await setSessionCookie();
  return Response.json({ ok: true });
}
