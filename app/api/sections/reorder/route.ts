import { getDb } from "@/db";
import { sections } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const db = getDb();
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const order = body?.order as string[] | undefined;

  if (!Array.isArray(order)) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  await Promise.all(
    order.map((id, index) =>
      db.update(sections).set({ position: index, updatedAt: new Date() }).where(eq(sections.id, id))
    )
  );

  return Response.json({ ok: true });
}
