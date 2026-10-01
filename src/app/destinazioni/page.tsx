import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getDestinations, getVenues } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DestinationsListPage() {
  const [destinations, venues] = await Promise.all([getDestinations(), getVenues()]);

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-olive">Macro-aree del circuito</p>
          <h1 className="mt-2 font-serif text-4xl text-forest sm:text-5xl">I comprensori RADICI</h1>
          <p className="mt-4 text-base leading-relaxed text-forest/80">
            Dalle colline maceratesi alle vigne delle Langhe, dai poderi senesi alle masserie del Salento:
            quattro geografie dove il welfare aziendale finanzia agriturismi a conduzione familiare,
            cultura ed eccellenze a KM 0.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {destinations.map((destination) => {
            const count = venues.filter((row) => row.destination.id === destination.id).length;
            return (
              <Link
                key={destination.id}
                href={`/destinazioni/${destination.slug}`}
                className="group relative overflow-hidden rounded-[32px] bg-forest text-cream shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={destination.coverImage}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block rounded-full bg-gold/20 backdrop-blur-md px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-gold border border-gold/30">
                      {destination.region}
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{destination.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-cream/80">
                      {destination.tagline}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-cream/15 pt-3 text-xs text-cream/70">
                      <span>{count} strutture convenzionate</span>
                      <span className="inline-flex items-center gap-1 text-gold font-medium group-hover:translate-x-1 transition-transform">
                        Scopri territorio <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </PublicShell>
  );
}
