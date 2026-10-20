"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { logAudit } from "@/lib/admin/use-mock";
import { AUDIT } from "@/lib/admin/mock-data";
import type { Role } from "@/lib/admin/types";
import Icon from "./Icon";

type User = { name: string; email: string; role: Role };
type Toast = { id: number; kind: "ok" | "bad"; text: string };
type Ctx = { user: User; audit: (text: string) => void; toast: (text: string, kind?: "ok" | "bad") => void };

const AdminCtx = createContext<Ctx | null>(null);
export const useAdmin = () => {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin must be used inside AdminProvider");
  return c;
};

export default function AdminProvider({ user, children }: { user: User; children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((text: string, kind: "ok" | "bad" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const audit = useCallback((text: string) => logAudit(user.name, text, AUDIT), [user.name]);
  const value = useMemo(() => ({ user, audit, toast }), [user, audit, toast]);

  return (
    <AdminCtx.Provider value={value}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`adm-toast adm-toast--${t.kind}`}>
            <Icon name={t.kind === "ok" ? "ok" : "warn"} size={18} /> {t.text}
          </div>
        ))}
      </div>
    </AdminCtx.Provider>
  );
}
