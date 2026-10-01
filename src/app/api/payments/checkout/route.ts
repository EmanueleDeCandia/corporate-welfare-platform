import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { invites, notifications, transactions, users, venues } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { awardImpact } from "@/lib/data";
import {
  FRIEND_DISCOUNT_RATE,
  defaultServiceForVenue,
  servicePrice,
  voucherTypeLabel,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Accedi o registrati per pagare come ospite." }, { status: 401 });
  }

  const body = (await request.json()) as {
    venueId?: number;
    service?: "hotel" | "aperitivo" | "theater";
    cardName?: string;
    cardNumber?: string;
    inviteCode?: string;
  };

  if (!body.venueId) {
    return NextResponse.json({ error: "Struttura mancante." }, { status: 400 });
  }

  const card = (body.cardNumber ?? "").replace(/\s+/g, "");
  if (card.length < 12 || !(body.cardName ?? "").trim()) {
    return NextResponse.json({ error: "Inserisci i dati della carta per simulare l'incasso." }, { status: 400 });
  }

  const [venue] = await db.select().from(venues).where(eq(venues.id, body.venueId)).limit(1);
  if (!venue) {
    return NextResponse.json({ error: "Struttura non trovata." }, { status: 404 });
  }

  const service = body.service ?? defaultServiceForVenue(venue.type);
  const listPrice = servicePrice(venue, service);
  if (listPrice <= 0) {
    return NextResponse.json({ error: "Servizio non disponibile in questa struttura." }, { status: 400 });
  }

  const isFriend = me.role === "friend";
  const discountCents = isFriend ? Math.round(listPrice * FRIEND_DISCOUNT_RATE) : 0;
  const amountCents = listPrice - discountCents;

  let invite =
    body.inviteCode
      ? (await db.select().from(invites).where(eq(invites.code, body.inviteCode)).limit(1))[0]
      : undefined;
  if (!invite) {
    invite = (await db.select().from(invites).where(eq(invites.email, me.email)).limit(1))[0];
  }

  const [tx] = await db
    .insert(transactions)
    .values({
      type: "consumer_payment",
      status: "receipted",
      userId: me.id,
      venueId: venue.id,
      inviteId: invite?.id ?? null,
      amountCents,
      discountCents,
      listPriceCents: listPrice,
      serviceLabel: `${voucherTypeLabel(service)} · pagamento ospite`,
    })
    .returning();

  const inviterId = invite?.inviterId ?? me.invitedByUserId;
  let inviterName = "";
  if (inviterId) {
    const awarded = await awardImpact(inviterId, 1);
    inviterName = awarded ? `${awarded.firstName} ${awarded.lastName}` : "";
    if (invite && invite.status !== "converted") {
      await db
        .update(invites)
        .set({ status: "converted", friendUserId: me.id })
        .where(eq(invites.id, invite.id));
    }
  }

  const guest = `${me.firstName} ${me.lastName}`;
  await db.insert(notifications).values({
    venueId: venue.id,
    type: "referral",
    title: "Notifica referral / consumer",
    body: `L'utente amico "${guest}"${inviterName ? ` (invitato da ${inviterName})` : ""} ha concluso il saldo.`,
    payload: {
      guest,
      inviter: inviterName,
      amountCents,
      invoiceHint: `INCASSO RICEVUTO: € ${(amountCents / 100).toFixed(2).replace(".", ",")} (pagato direttamente dall'utente via carta)`,
      vatNote: "Emettere normale scontrino/corrispettivo fiscale all'ospite.",
      impact: inviterName ? `Assegnato +1 Punto Impatto a ${inviterName}` : "Nessun referral collegato",
      transactionId: tx.id,
    },
  });

  return NextResponse.json({
    ok: true,
    amountCents,
    discountCents,
    message: `Pagamento confermato presso ${venue.name}.`,
  });
}