import { Suspense } from "react";
import type { ReactNode } from "react";
import { requireSession } from "@/lib/admin/auth";
import AdminProvider from "@/components/admin/AdminProvider";
import AdminShell from "@/components/admin/AdminShell";

export const instant = false;

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p role="status">Loading admin…</p>}>
      <AuthenticatedPanel>{children}</AuthenticatedPanel>
    </Suspense>
  );
}

async function AuthenticatedPanel({ children }: { children: ReactNode }) {
  const s = await requireSession(); // second gate after the middleware
  const user = { name: s.name, email: s.email, role: s.role };
  return (
    <AdminProvider user={user}>
      <AdminShell user={user}>{children}</AdminShell>
    </AdminProvider>
  );
}
