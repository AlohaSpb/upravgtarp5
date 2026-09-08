import { getDb } from "@/db";
import { sections } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const updates: Partial<typeof sections.$inferInsert> = { updatedAt: new Date() };
  if (body.content !== undefined) updates.content = body.content;
  if (body.visible !== undefined) updates.visible = Boolean(body.visible);
  if (body.position !== undefined) updates.position = Number(body.position);

  const [updated] = await db
    .update(sections)
    .set(updates)
    .where(eq(sections.id, id))
    .returning();

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ section: updated });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.delete(sections).where(eq(sections.id, id));

  return Response.json({ ok: true });
}
