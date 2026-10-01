"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { vouchers } from "@/db/schema";
import { voucherTypeLabel } from "@/lib/utils";

export function VenueRedeem({
  vouchers: items,
  venueId,
}: {
  vouchers: Array<typeof vouchers.$inferSelect>;
  venueId: number;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [voucherId, setVoucherId] = useState(items[0]?.id ?? 0);

  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-cream/70">
        Non hai voucher compatibili disponibili. Controlla il portafoglio o paga come ospite.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <select
        value={voucherId}
        onChange={(event) => setVoucherId(Number(event.target.value))}
        className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm"
      >
        {items.map((item) => (
          <option key={item.id} value={item.id} className="text-ink">
            {voucherTypeLabel(item.type)} · slot {item.slotIndex}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setMessage("");
          const response = await fetch("/api/vouchers/redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voucherId, venueId }),
          });
          const data = (await response.json()) as { error?: string; message?: string };
          setPending(false);
          setMessage(data.message ?? data.error ?? "");
          if (response.ok) router.refresh();
        }}
        className="w-full rounded-full bg-terracotta py-3 text-sm font-semibold uppercase tracking-[0.14em]"
      >
        {pending ? "Riscatto…" : "Riscatta"}
      </button>
      {message ? <p className="text-sm text-gold">{message}</p> : null}
    </div>
  );
}
