import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-forest/10 bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl tracking-[0.16em]">RADICI</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-cream/75">
            Il welfare aziendale che fa crescere il territorio. Le imprese finanziano soggiorni e
            aperitivi KM 0, i dipendenti scoprono le destinazioni, gli amici pagano in locale e i
            fornitori incassano due canali: B2B e B2C.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Portale</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-cream/80">
            <Link href="/esplora">Mappa e strutture</Link>
            <Link href="/destinazioni">Macro-aree</Link>
            <Link href="/imprese">Vetrina imprese ESG</Link>
            <Link href="/come-funziona">Modello pay-per-use</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Circuiti</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-cream/80">
            <Link href="/account">Portafoglio welfare</Link>
            <Link href="/login">Accesso dipendente</Link>
            <Link href="/login">Pannello fornitore</Link>
            <p>P.IVA imprese in fatturazione diretta</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} RADICI · Certificati di impatto sociale territoriale · Italia
      </div>
    </footer>
  );
}