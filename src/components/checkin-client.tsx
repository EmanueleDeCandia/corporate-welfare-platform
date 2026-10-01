"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { formatEuro, FRIEND_DISCOUNT_RATE, servicePrice, voucherTypeLabel } from "@/lib/utils";

type Service = "hotel" | "aperitivo" | "theater";

export function CheckinClient({
  venue,
  loggedIn,
  role,
  inviteCode,
}: {
  venue: {
    id: number;
    name: string;
    type: string;
    checkinCode: string;
    priceHotelCents: number;
    priceAperitivoCents: number;
    priceShowCents: number;
  };
  loggedIn: boolean;
  role?: string;
  inviteCode?: string;
}) {
  const router = useRouter();
  const options = (
    [
      venue.priceHotelCents > 0 ? "hotel" : null,
      venue.priceAperitivoCents > 0 ? "aperitivo" : null,
      venue.priceShowCents > 0 ? "theater" : null,
    ] as Array<Service | null>
  ).filter((item): item is Service => Boolean(item));

  const [service, setService] = useState<Service>(options[0] ?? "hotel");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const listPrice = servicePrice(venue, service);
  const isFriend = role === "friend";
  const discount = isFriend ? Math.round(listPrice * FRIEND_DISCOUNT_RATE) : 0;
  const total = listPrice - discount;

  async function pay(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueId: venue.id,
        service,
        cardName,
        cardNumber,
        inviteCode,
      }),
    });
    const data = (await response.json()) as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) {
      setMessage(data.error ?? "Pagamento non riuscito.");
      return;
    }
    setMessage(data.message ?? "Pagamento confermato.");
    router.refresh();
  }

  if (!loggedIn) {
    return (
      <div className="rounded-[28px] bg-white p-6">
        <h2 className="font-serif text-2xl text-forest">Identificazione ospite</h2>
        <p className="mt-2 text-sm leading-6 text-olive">
          Inquadra il QR del luogo e accedi. Se sei stato invitato, registra un account amico: il
          sistema ti riconosce e applica il micro-sconto community.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={`/login?next=/checkin/${venue.checkinCode}`} className="rounded-full bg-forest px-5 py-2 text-sm text-cream">
            Ho già un account
          </a>
          <a
            href={inviteCode ? `/registrati?invite=${inviteCode}` : "/registrati"}
            className="rounded-full border border-forest/15 px-5 py-2 text-sm"
          >
            Registrati come amico
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={pay} className="rounded-[28px] bg-white p-6">
      <p className="text-xs uppercase tracking-[0.16em] text-olive">Pagamento ospite · pay-local</p>
      <h2 className="mt-2 font-serif text-2xl text-forest">Saldo in struttura</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setService(item)}
            className={`rounded-full px-4 py-2 text-sm ${
              service === item ? "bg-forest text-cream" : "bg-cream text-forest"
            }`}
          >
            {voucherTypeLabel(item)}
          </button>
        ))}
      </div>
      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Prezzo di listino</dt>
          <dd>{formatEuro(listPrice)}</dd>
        </div>
        <div className="flex justify-between text-terracotta">
          <dt>Micro-sconto community</dt>
          <dd>-{formatEuro(discount)}</dd>
        </div>
        <div className="flex justify-between font-medium text-forest">
          <dt>Totale da pagare ora</dt>
          <dd>{formatEuro(total)}</dd>
        </div>
      </dl>
      <div className="mt-5 grid gap-3">
        <input
          required
          placeholder="Intestatario carta"
          value={cardName}
          onChange={(event) => setCardName(event.target.value)}
          className="rounded-2xl border border-forest/10 bg-cream px-4 py-3"
        />
        <input
          required
          placeholder="Numero carta (simulazione Stripe)"
          value={cardNumber}
          onChange={(event) => setCardNumber(event.target.value)}
          className="rounded-2xl border border-forest/10 bg-cream px-4 py-3"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="MM/AA"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
            className="rounded-2xl border border-forest/10 bg-cream px-4 py-3"
          />
          <input
            required
            placeholder="CVC"
            value={cvc}
            onChange={(event) => setCvc(event.target.value)}
            className="rounded-2xl border border-forest/10 bg-cream px-4 py-3"
          />
        </div>
      </div>
      {role === "employee" ? (
        <p className="mt-3 text-xs text-olive">
          Stai pagando come dipendente senza usare un voucher. Per il riscatto welfare usa il
          portafoglio.
        </p>
      ) : null}
      {message ? <p className="mt-3 text-sm text-forest">{message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-2xl bg-terracotta py-3 text-sm font-medium text-cream"
      >
        {pending ? "Autorizzazione in corso…" : `Paga ${formatEuro(total)}`}
      </button>
    </form>
  );
}
