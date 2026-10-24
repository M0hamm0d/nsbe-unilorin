"use client";

import { useState, useEffect } from "react";
import { AUDIT, USERS } from "@/lib/admin/mock-data";
import type { AdminUser, AuditEntry, Role } from "@/lib/admin/types";
import { ROLE_LABEL } from "@/lib/admin/permissions";
import { uid } from "@/lib/admin/format";
import {
  approveAdminUser,
  deleteAdminUser,
  registerAdminUser,
  restoreAdminUser,
  revokeAdminUser,
  updateAdminUserRole,
} from "@/lib/admin/actions";
import { useAdmin } from "./AdminProvider";
import { Badge, Banner, Card, CardHead, ConfirmDialog, PageHeader, SelectField, TextField } from "./ui";
import Icon from "./Icon";

const ROLES = Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label }));
const MATRIX: [string, boolean[]][] = [
  ["Publish events and programs", [true, true, false]],
  ["Upload and publish resources", [true, true, true]],
  ["View tutorial and join submissions", [true, true, false]],
  ["Manage sponsors and settings", [true, false, false]],
  ["Change roles and revoke access", [true, false, false]],
];
const KIND = { active: "pub", invited: "warn", revoked: "bad" } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AccessManager({ initialUsers }: { initialUsers?: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(
    initialUsers && initialUsers.length > 0 ? initialUsers : USERS
  );
  const [audit] = useState<AuditEntry[]>(AUDIT);
  const { user: me, toast, audit: log } = useAdmin();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [err, setErr] = useState("");
  const [revoke, setRevoke] = useState<AdminUser | null>(null);
  const [rejecting, setRejecting] = useState<AdminUser | null>(null);

  // Sync if initialUsers updates from server
  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) {
      setUsers(initialUsers);
    }
  }, [initialUsers]);

  const admins = users.filter((u) => u.role === "admin" && u.status === "active").length;
  const pendingUsers = users.filter((u) => u.status === "invited");
  const authorizedUsers = users.filter((u) => u.status !== "invited");

  async function invite() {
    const e = email.trim().toLowerCase();
    if (!EMAIL.test(e)) return setErr("Enter a valid email address, for example name@example.com.");
    if (users.some((u) => u.email === e && u.status !== "revoked")) {
      return setErr("That person already has access or a pending invitation.");
    }
    setErr("");

    const newId = uid("u");
    const name = e.split("@")[0];
    const newUser: AdminUser = { id: newId, name, email: e, role, status: "invited", lastActive: "—" };

    setUsers((prev) => [newUser, ...prev]);
    log(`Invited ${e} as ${ROLE_LABEL[role]}`);
    toast("Invitation recorded.");
    setEmail("");

    await registerAdminUser({ name, email: e, role });
  }

  async function handleApprove(u: AdminUser) {
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: "active" as const } : item))
    );
    log(`Approved dashboard access for ${u.name} (${ROLE_LABEL[u.role]})`);
    toast(`Access approved for ${u.name}. They can now sign in.`);
    await approveAdminUser(u.id, u.role);
  }

  async function handleReject(u: AdminUser) {
    setUsers((prev) => prev.filter((item) => item.id !== u.id));
    log(`Rejected access request for ${u.name}`);
    toast(`Access request for ${u.name} was rejected.`);
    setRejecting(null);
    await deleteAdminUser(u.id);
  }

  async function changeRole(u: AdminUser, r: Role) {
    if (u.role === "admin" && r !== "admin" && admins <= 1) {
      return toast("There must be at least one active admin.", "bad");
    }
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, role: r } : item))
    );
    log(`Changed ${u.name}’s role from ${ROLE_LABEL[u.role]} to ${ROLE_LABEL[r]}`);
    toast("Role updated.");
    await updateAdminUserRole(u.id, r);
  }

  async function handleRestore(u: AdminUser) {
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: "active" as const } : item))
    );
    log(`Restored access for ${u.name}`);
    toast("Access restored.");
    await restoreAdminUser(u.id);
  }

  async function handleRevokeConfirm() {
    if (!revoke) return;
    if (revoke.role === "admin" && admins <= 1) {
      toast("There must be at least one active admin.", "bad");
      return setRevoke(null);
    }
    const target = revoke;
    setUsers((prev) =>
      prev.map((item) => (item.id === target.id ? { ...item, status: "revoked" as const } : item))
    );
    log(`Revoked access for ${target.name}`);
    toast("Access revoked.");
    setRevoke(null);
    await revokeAdminUser(target.id);
  }

  return (
    <>
      <PageHeader
        title="Access & roles"
        sub="Control who can use the dashboard. Review pending registrations, assign roles, and manage permissions."
      />

      <Banner>
        <div>
          Only <b>Admins</b> can change roles, approve new executive registrations, or revoke access.
        </div>
      </Banner>

      <div className="adm-grid adm-main-side">
        <div className="adm-stack">
          {/* Pending Signups / Registrations */}
          {pendingUsers.length > 0 && (
            <Card style={{ borderColor: "var(--pale)", background: "#f8fdf9" }}>
              <CardHead
                title={`Pending Approvals (${pendingUsers.length})`}
              />
              <div className="adm-tw">
                <table>
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Requested Role</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="adm-t">{u.name}</div>
                          <div className="adm-m">{u.email}</div>
                        </td>
                        <td>
                          <select
                            aria-label={`Role for ${u.name}`}
                            className="adm-in adm-sel"
                            style={{ width: 170 }}
                            value={u.role}
                            onChange={(e) => changeRole(u, e.target.value as Role)}
                          >
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <Badge kind="warn">Pending Approval</Badge>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <button
                              type="button"
                              className="adm-btn adm-sm"
                              onClick={() => handleApprove(u)}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="adm-btnd adm-sm"
                              onClick={() => setRejecting(u)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Active & Revoked Team Members */}
          <Card>
            <CardHead title="Authorized users" />
            <div className="adm-tw">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last active</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {authorizedUsers.map((u) => {
                    const self = u.email === me.email;
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="adm-t">
                            {u.name}
                            {self && <span className="adm-m"> (you)</span>}
                          </div>
                          <div className="adm-m">{u.email}</div>
                        </td>
                        <td>
                          <select
                            aria-label={`Role for ${u.name}`}
                            className="adm-in adm-sel"
                            style={{ width: 180 }}
                            value={u.role}
                            disabled={self || u.status === "revoked"}
                            onChange={(e) => changeRole(u, e.target.value as Role)}
                          >
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <Badge kind={KIND[u.status]}>
                            {u.status[0].toUpperCase() + u.status.slice(1)}
                          </Badge>
                        </td>
                        <td>{u.lastActive}</td>
                        <td style={{ textAlign: "right" }}>
                          {u.status === "revoked" ? (
                            <button
                              type="button"
                              className="adm-btn2 adm-sm"
                              onClick={() => handleRestore(u)}
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="adm-btnd adm-sm"
                              disabled={self}
                              title={self ? "You can’t revoke your own access" : undefined}
                              onClick={() => setRevoke(u)}
                            >
                              Revoke access
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Permission Matrix */}
          <Card>
            <CardHead title="What each role can do" />
            <div className="adm-tw">
              <table>
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Admin</th>
                    <th>Editor</th>
                    <th>Resource manager</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map(([a, v]) => (
                    <tr key={a}>
                      <td>{a}</td>
                      {v.map((x, i) => (
                        <td key={i}>{x ? <Icon name="ok" size={16} /> : "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Invite form & Audit Log */}
        <div className="adm-stack">
          <Card className="adm-cp">
            <h2>Invite an executive</h2>
            <div className="adm-fg">
              <TextField
                label="Email address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={err}
              />
              <SelectField
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                options={ROLES}
              />
              <button className="adm-btn adm-wide" onClick={invite}>
                Send invitation
              </button>
            </div>
          </Card>

          <Card>
            <CardHead title="Audit log" />
            {audit.slice(0, 8).map((a) => (
              <div className="adm-li" key={a.id}>
                <div>
                  <div className="adm-t">
                    {a.actor} · {a.text}
                  </div>
                  <div className="adm-note">{a.at}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Revoke Confirmation Dialog */}
      <ConfirmDialog
        open={!!revoke}
        danger
        title={`Revoke access for ${revoke?.name ?? ""}?`}
        confirmLabel="Revoke access"
        onCancel={() => setRevoke(null)}
        onConfirm={handleRevokeConfirm}
      >
        They will be signed out and lose dashboard access. You can restore access later.
      </ConfirmDialog>

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        open={!!rejecting}
        danger
        title={`Reject access request for ${rejecting?.name ?? ""}?`}
        confirmLabel="Reject Request"
        onCancel={() => setRejecting(null)}
        onConfirm={() => rejecting && handleReject(rejecting)}
      >
        This will dismiss their registration request. They will not be able to log in to the admin dashboard.
      </ConfirmDialog>
    </>
  );
}
