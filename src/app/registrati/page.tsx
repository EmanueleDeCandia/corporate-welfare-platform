import { RegisterForm } from "@/components/register-form";
import { PublicShell } from "@/components/public-shell";
import { getInviteByCode } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;
  const record = invite ? await getInviteByCode(invite) : null;

  return (
    <PublicShell>
      <main className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <section className="rounded-[32px] bg-white p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-olive">Account amico / consumer</p>
          <h1 className="mt-2 font-serif text-4xl text-forest">Entra nel circuito pay-local</h1>
          <p className="mt-3 text-sm leading-6 text-ink/75">
            Niente voucher aziendali: paghi i servizi locali con la tua carta e ottieni un
            micro-sconto. Chi ti ha invitato riceve Punti Impatto.
          </p>
          <div className="mt-6">
            <RegisterForm
              inviteCode={record?.code}
              firstName={record?.firstName}
              lastName={record?.lastName}
              email={record?.email}
            />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}