"use client";

import { useState } from "react";
import { useMockCollection } from "@/lib/admin/use-mock";
import { AUDIT, USERS } from "@/lib/admin/mock-data";
import type { AdminUser, AuditEntry, Role } from "@/lib/admin/types";
import { ROLE_LABEL } from "@/lib/admin/permissions";
import { uid } from "@/lib/admin/format";
import { useAdmin } from "./AdminProvider";
import { Badge, Banner, Card, CardHead, ConfirmDialog, PageHeader, SelectField, TextField } from "./ui";
import Icon from "./Icon";

const ROLES = Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label }));
const MATRIX: [string, boolean[]][] = [
  ["Publish events and programs", [true, true, false]], ["Upload and publish resources", [true, true, true]],
  ["View tutorial and join submissions", [true, true, false]], ["Manage sponsors and settings", [true, false, false]], ["Change roles and revoke access", [true, false, false]],
];
const KIND = { active: "pub", invited: "warn", revoked: "bad" } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AccessManager() {
  const { items: users, update, add } = useMockCollection<AdminUser>("users", USERS);
  const { items: audit } = useMockCollection<AuditEntry>("audit", AUDIT);
  const { user: me, toast, audit: log } = useAdmin();
  const [email, setEmail] = useState(""); const [role, setRole] = useState<Role>("editor"); const [err, setErr] = useState("");
  const [revoke, setRevoke] = useState<AdminUser | null>(null);
  const admins = users.filter((u) => u.role === "admin" && u.status === "active").length;

  function invite() {
    const e = email.trim().toLowerCase();
    if (!EMAIL.test(e)) return setErr("Enter a valid email address, for example name@example.com.");
    if (users.some((u) => u.email === e && u.status !== "revoked")) return setErr("That person already has access or a pending invitation.");
    setErr("");
    add({ id: uid("u"), name: e.split("@")[0], email: e, role, status: "invited", lastActive: "—" });
    log(`Invited ${e} as ${ROLE_LABEL[role]}`); toast("Invitation recorded. In the live system this sends an email."); setEmail("");
  }
  function changeRole(u: AdminUser, r: Role) {
    if (u.role === "admin" && r !== "admin" && admins <= 1) return toast("There must be at least one active admin.", "bad");
    update(u.id, { role: r }); log(`Changed ${u.name}’s role from ${ROLE_LABEL[u.role]} to ${ROLE_LABEL[r]}`); toast("Role updated.");
  }

  return (
    <>
      <PageHeader title="Access & roles" sub="Control who can use the dashboard. There is no public sign-up for admin access." />
      <Banner><div>Only <b>Admins</b> can change roles, invite executives or revoke access. Every change is recorded in the audit log.</div></Banner>
      <div className="adm-grid adm-main-side">
        <div className="adm-stack">
          <Card><CardHead title="Authorized users" /><div className="adm-tw"><table>
            <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last active</th><th /></tr></thead>
            <tbody>{users.map((u) => {
              const self = u.email === me.email;
              return (
                <tr key={u.id}>
                  <td><div className="adm-t">{u.name}{self && <span className="adm-m"> (you)</span>}</div><div className="adm-m">{u.email}</div></td>
                  <td><select aria-label={`Role for ${u.name}`} className="adm-in adm-sel" style={{ width: 180 }} value={u.role} disabled={self || u.status === "revoked"} onChange={(e) => changeRole(u, e.target.value as Role)}>{ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></td>
                  <td><Badge kind={KIND[u.status]}>{u.status[0].toUpperCase() + u.status.slice(1)}</Badge></td><td>{u.lastActive}</td>
                  <td>{u.status === "revoked" ? <button className="adm-btn2 adm-sm" onClick={() => { update(u.id, { status: "active" }); log(`Restored access for ${u.name}`); toast("Access restored."); }}>Restore</button>
                    : <button className="adm-btnd adm-sm" disabled={self} title={self ? "You can’t revoke your own access" : undefined} onClick={() => setRevoke(u)}>Revoke access</button>}</td>
                </tr>);})}</tbody></table></div></Card>
          <Card><CardHead title="What each role can do" /><div className="adm-tw"><table>
            <thead><tr><th>Area</th><th>Admin</th><th>Editor</th><th>Resource manager</th></tr></thead>
            <tbody>{MATRIX.map(([a, v]) => <tr key={a}><td>{a}</td>{v.map((x, i) => <td key={i}>{x ? <Icon name="ok" size={16} /> : "—"}</td>)}</tr>)}</tbody></table></div></Card>
        </div>
        <div className="adm-stack">
          <Card className="adm-cp"><h2>Invite an executive</h2><div className="adm-fg">
            <TextField label="Email address" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={err} />
            <SelectField label="Role" value={role} onChange={(e) => setRole(e.target.value as Role)} options={ROLES} />
            <button className="adm-btn adm-wide" onClick={invite}>Send invitation</button></div></Card>
          <Card><CardHead title="Audit log" />{audit.slice(0, 8).map((a) => <div className="adm-li" key={a.id}><div><div className="adm-t">{a.actor} · {a.text}</div><div className="adm-note">{a.at}</div></div></div>)}</Card>
        </div>
      </div>
      <ConfirmDialog open={!!revoke} danger title={`Revoke access for ${revoke?.name ?? ""}?`} confirmLabel="Revoke access" onCancel={() => setRevoke(null)}
        onConfirm={() => { if (!revoke) return; if (revoke.role === "admin" && admins <= 1) { toast("There must be at least one active admin.", "bad"); return setRevoke(null); } update(revoke.id, { status: "revoked" }); log(`Revoked access for ${revoke.name}`); toast("Access revoked."); setRevoke(null); }}>
        They will be signed out and lose dashboard access. You can restore access later. This will be recorded in the audit log.
      </ConfirmDialog>
    </>
  );
}
