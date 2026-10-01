import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications, transactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const me = await getCurrentUser();
  if (!me || me.role !== "provider" || !me.venueId) {
    return NextResponse.json({ error: "Accesso riservato al fornitore." }, { status: 403 });
  }

  const { id } = await context.params;
  const notificationId = Number(id);
  const body = (await request.json().catch(() => ({}))) as { action?: string };

  const [notification] = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.id, notificationId), eq(notifications.venueId, me.venueId)))
    .limit(1);

  if (!notification) {
    return NextResponse.json({ error: "Notifica non trovata." }, { status: 404 });
  }

  await db.update(notifications).set({ read: true }).where(eq(notifications.id, notification.id));

  const payload = (notification.payload ?? {}) as Record<string, any>;
  const txId = Number(payload.transactionId ?? 0);
  if (txId && body.action === "confirm") {
    await db
      .update(transactions)
      .set({ status: notification.type === "welfare" ? "invoiced" : "receipted" })
      .where(eq(transactions.id, txId));
  }

  return NextResponse.json({ ok: true });
}