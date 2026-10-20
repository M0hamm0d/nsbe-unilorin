"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV } from "@/lib/admin/nav";
import { can, ROLE_LABEL } from "@/lib/admin/permissions";
import type { Role } from "@/lib/admin/types";
import Icon from "./Icon";
import Image from "next/image";

export default function AdminShell({ user, children }: { user: { name: string; email: string; role: Role }; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="adm-shell">
      <nav className={`adm-sb${open ? " is-open" : ""}`} aria-label="Admin">
        <div className="adm-brand"><Image src="/nsbe-logo.png" alt="NSBE Unilorin" width={32} height={32} /><div>NSBE Unilorin<small>Admin</small></div></div>
        {NAV.map((g) => {
          const items = g.items.filter((i) => can(user.role, i.area));
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <h6>{g.group}</h6>
              {items.map((i) => (
                <Link key={i.href} href={i.href} className={isActive(i.href) ? "is-on" : ""} aria-current={isActive(i.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                  <Icon name={i.icon} />{i.label}
                </Link>
              ))}
            </div>
          );
        })}
        <div className="adm-me"><b>{user.name}</b>{ROLE_LABEL[user.role]} · <button type="button" onClick={signOut}>Sign out</button></div>
      </nav>
      {open && <button className="adm-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <div className="adm-main">
        <header className="adm-tp">
          <button className="adm-menu" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}><Icon name="menu" size={22} /></button>
          {/* <span className="adm-tag">Mock data</span> */}
          <Link href="/" target="_blank" className="adm-pv">View public site <Icon name="up" size={16} /></Link>
          <span className="adm-av" title={user.email}>{user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
        </header>
        <main className="adm-ct">{children}</main>
      </div>
    </div>
  );
}
