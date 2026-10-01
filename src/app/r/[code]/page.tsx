import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { getInviteByCode } from "@/lib/data";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ReferralLandingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const invite = await getInviteByCode(code);
  if (!invite) notFound();
  const [inviter] = await db.select().from(users).where(eq(users.id, invite.inviterId)).limit(1);

  return (
    <PublicShell>
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <section className="rounded-[32px] bg-white p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-olive">Invito referral</p>
          <h1 className="mt-2 font-serif text-4xl text-forest">
            {inviter ? `${inviter.firstName} ${inviter.lastName}` : "Un amico"} ti aspetta nei locali
            RADICI
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink/75">
            Ciao {invite.firstName}, questo QR è il tuo lascito nel circuito. Non userai voucher
            aziendali: pagherai cena o camera con la tua carta, con un micro-sconto immediato. Al
            saldo, {inviter?.firstName ?? "chi ti ha invitato"} riceverà +1 Punto Impatto Sociale.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-[180px_1fr]">
            <img
              src={`/api/qr/${invite.code}?kind=invite`}
              alt="QR invito"
              className="rounded-3xl border border-gold/30"
            />
            <div className="rounded-3xl bg-cream p-4 text-sm leading-6 text-forest">
              <p>1. Presentati in un hotel, agriturismo o teatro partner.</p>
              <p>2. Inquadra il QR del luogo oppure usa questo invito per registrarti.</p>
              <p>3. Paga con carta: scontrino a te, punto impatto a chi ti ha invitato.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/registrati?invite=${invite.code}`}
              className="rounded-full bg-terracotta px-5 py-2 text-sm text-cream"
            >
              Crea account amico
            </Link>
            <Link href="/esplora" className="rounded-full border border-forest/15 px-5 py-2 text-sm">
              Vedi le strutture
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}