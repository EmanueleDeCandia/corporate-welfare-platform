import { NextResponse } from "next/server";
import { db } from "@/db";
import { invites } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { randomCode } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Devi accedere per invitare un amico." }, { status: 401 });
  }

  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const email = body.email?.trim().toLowerCase();

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "Inserisci nome, cognome e email dell'amico." }, { status: 400 });
  }

  const [invite] = await db
    .insert(invites)
    .values({
      inviterId: me.id,
      firstName,
      lastName,
      email,
      code: randomCode("ref"),
      status: "pending",
    })
    .returning();

  return NextResponse.json({ ok: true, invite });
}
