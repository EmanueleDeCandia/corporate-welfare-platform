import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function PublicShell({
  children,
  darkHeader = false,
}: {
  children: ReactNode;
  darkHeader?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader dark={darkHeader} />
      {children}
      <SiteFooter />
    </div>
  );
}
