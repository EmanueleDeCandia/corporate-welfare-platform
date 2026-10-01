"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

const filters = [
  { href: "/esplora", label: "Mappa dinamica" },
  { href: "/esplora?tipo=hotel", label: "Hotel Partner" },
  { href: "/esplora?tipo=agriturismo", label: "Agriturismi Gusto" },
  { href: "/esplora?tipo=theater", label: "Teatri" },
];

export function SearchPanel({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/esplora?${params.toString()}`);
  }

  return (
    <div className="w-full rounded-[28px] bg-paper/95 p-3 shadow-[0_24px_60px_rgba(16,36,28,0.18)] backdrop-blur">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-2xl bg-cream px-4 py-3">
          <Search size={18} className="text-olive" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca hotel, ristoranti o esperienze nella destinazione"
            className="w-full bg-transparent text-sm outline-none placeholder:text-olive/70"
          />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-forest px-6 py-3 text-sm font-medium text-cream"
        >
          Esplora il territorio
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <a
            key={filter.href}
            href={filter.href}
            className="rounded-full border border-forest/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-forest hover:border-terracotta hover:text-terracotta"
          >
            {filter.label}
          </a>
        ))}
      </div>
    </div>
  );
}