"use client";

import { useEffect, useState } from "react";
import { SPONSORS } from "@/lib/admin/mock-data";
import type { Sponsor } from "@/lib/admin/types";
import { uid } from "@/lib/admin/format";
import { saveAdminSponsor, deleteAdminSponsor } from "@/lib/admin/actions";
import { useAdmin } from "./AdminProvider";
import { AreaField, Badge, Banner, Card, Check, ConfirmDialog, ImageDrop, PageHeader, Switch, TextField } from "./ui";
import Icon from "./Icon";

const status = (s: Sponsor) =>
  s.confirmed ? (
    <Badge kind="pub">Approved</Badge>
  ) : s.website || s.logo ? (
    <Badge kind="warn">Awaiting approval</Badge>
  ) : (
    <Badge kind="arch">Internal placeholder</Badge>
  );

export default function SponsorsManager({ initialItems }: { initialItems?: Sponsor[] }) {
  const [items, setItems] = useState<Sponsor[]>(initialItems && initialItems.length > 0 ? initialItems : SPONSORS);
  const { toast, audit } = useAdmin();
  const [f, setF] = useState<Sponsor | null>(null);
  const [show, setShow] = useState(false);
  const [del, setDel] = useState<Sponsor | null>(null);
  const [saving, setSaving] = useState(false);

  // Clear legacy mock localStorage
  useEffect(() => {
    try {
      localStorage.removeItem("nsbe-admin-mock:v1:sponsors");
    } catch {}
  }, []);

  // Sync with server revalidation
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const sorted = [...items].sort((a, b) => a.order - b.order);

  async function move(id: string, dir: -1 | 1) {
    const i = sorted.findIndex((x) => x.id === id);
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const n = [...sorted];
    [n[i], n[j]] = [n[j], n[i]];
    const updated = n.map((x, k) => ({ ...x, order: k + 1 }));
    setItems(updated);
    audit(`Changed the display order of partner ${sorted[i].name}`);
    for (const sp of updated) {
      await saveAdminSponsor(sp);
    }
  }

  const errs = f
    ? {
        name: !f.name.trim() ? "Enter the organisation’s name." : "",
        site: f.website && !/^https?:\/\//i.test(f.website) ? "Enter a full link starting with https://" : "",
        logo: f.visible && !f.logo ? "Upload the approved logo before showing this partner." : "",
      }
    : null;

  async function save() {
    if (!f || !errs || saving) return;
    setShow(true);
    if (Object.values(errs).some(Boolean)) return toast("Fix the highlighted fields.", "bad");

    const isExisting = items.some((x) => x.id === f.id);
    const rec: Sponsor = {
      ...f,
      name: f.name.trim(),
      visible: f.confirmed ? f.visible : false, // unconfirmed entries can never be public
      order: isExisting ? f.order : items.length + 1,
    };

    setSaving(true);
    // Optimistic UI update
    if (isExisting) {
      setItems((prev) => prev.map((x) => (x.id === rec.id ? rec : x)));
    } else {
      setItems((prev) => [...prev, rec]);
    }

    audit(`Updated partner ${rec.name}`);
    setF(null);

    try {
      const res = await saveAdminSponsor(rec);
      if (res.ok) {
        toast("Partner saved successfully.");
        if (res.id && res.id !== rec.id) {
          setItems((prev) => prev.map((x) => (x.id === rec.id ? { ...rec, id: res.id! } : x)));
        }
      } else {
        toast("Failed to save partner to database.", "bad");
      }
    } catch {
      toast("Error saving partner.", "bad");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(s: Sponsor, v: boolean) {
    const updated = { ...s, visible: v };
    setItems((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
    audit(`${v ? "Showed" : "Hid"} partner ${s.name}`);
    await saveAdminSponsor(updated);
  }

  return (
    <>
      <PageHeader title="Sponsors & partners" sub="Verified partners shown on the public site.">
        <button
          className="adm-btn"
          onClick={() => {
            setF({
              id: uid("sp"),
              name: "",
              description: "",
              order: items.length + 1,
              confirmed: true,
              visible: true,
            });
            setShow(false);
          }}
        >
          <Icon name="hand" size={16} /> Add partner
        </button>
      </PageHeader>
      <Banner kind="warn">
        <div>
          <b>Unconfirmed entries stay internal.</b> A logo is only published after the partnership is approved. Never imply a partnership that is not confirmed.
        </div>
      </Banner>
      <div className="adm-grid adm-main-side">
        <Card>
          <div className="adm-tw">
            <table>
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Order</th>
                  <th>Website</th>
                  <th>Approval</th>
                  <th>Visibility</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div
                          className="adm-th"
                          style={{
                            width: 72,
                            height: 44,
                            padding: 4,
                            background: "var(--bg)",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          {s.logo ? (
                            <img
                              src={s.logo}
                              alt={s.name}
                              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            />
                          ) : (
                            <span style={{ fontSize: 10, color: "var(--muted)" }}>NO LOGO</span>
                          )}
                        </div>
                        <div>
                          <div className="adm-t">{s.name}</div>
                          <div className="adm-m">{s.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="adm-actions" style={{ gap: 4 }}>
                        <span>{s.order}</span>
                        <button
                          className="adm-btn2 adm-sm"
                          aria-label={`Move ${s.name} earlier`}
                          disabled={i === 0}
                          onClick={() => move(s.id, -1)}
                        >
                          ↑
                        </button>
                        <button
                          className="adm-btn2 adm-sm"
                          aria-label={`Move ${s.name} later`}
                          disabled={i === sorted.length - 1}
                          onClick={() => move(s.id, 1)}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td>{s.website ? s.website.replace(/^https?:\/\//, "") : "—"}</td>
                    <td>{status(s)}</td>
                    <td>
                      <Switch
                        label={s.visible ? "Visible" : s.confirmed ? "Hidden" : "Never public"}
                        checked={s.visible}
                        disabled={!s.confirmed}
                        onChange={(v) => toggleVisible(s, v)}
                      />
                    </td>
                    <td>
                      <button
                        className="adm-btn2 adm-sm"
                        onClick={() => {
                          setF({ ...s });
                          setShow(false);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        {f && errs && (
          <Card className="adm-cp">
            <h2>{items.some((x) => x.id === f.id) ? "Edit partner" : "Add partner"}</h2>
            <div className="adm-fg">
              <TextField
                label="Organisation name"
                placeholder="e.g. Siemens, Bosch, Schneider Electric"
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                error={show ? errs.name : ""}
              />
              <AreaField
                label="Short description"
                optional
                placeholder="e.g. Global technology partner supporting student engineering labs."
                value={f.description}
                onChange={(e) => setF({ ...f, description: e.target.value })}
              />
              <TextField
                label="Website"
                optional
                placeholder="https://"
                value={f.website ?? ""}
                onChange={(e) => setF({ ...f, website: e.target.value || undefined })}
                error={show ? errs.site : ""}
              />
              <ImageDrop
                label="Approved logo"
                folder="sponsors"
                value={f.logo}
                onChange={(n) => setF({ ...f, logo: n })}
                hint="Upload an SVG, PNG, JPG or WebP logo file."
              />
              <Check
                checked={f.confirmed}
                onChange={(v) => setF({ ...f, confirmed: v, visible: v ? f.visible : false })}
              >
                The partnership and logo use are confirmed in writing.
              </Check>
              <Switch
                label="Visible on the public site"
                checked={f.visible}
                disabled={!f.confirmed}
                onChange={(v) => setF({ ...f, visible: v })}
              />
              {!f.confirmed && (
                <p className="adm-note" style={{ marginTop: -8 }}>
                  Visibility unlocks once the partnership is confirmed.
                </p>
              )}
              {show && errs.logo && (
                <span className="adm-ferr">
                  <Icon name="warn" size={14} />
                  {errs.logo}
                </span>
              )}
              <div className="adm-actions">
                <button className="adm-btn2" onClick={() => setF(null)} disabled={saving}>
                  Cancel
                </button>
                <button className="adm-btn" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : f.confirmed ? "Save partner" : "Save as internal"}
                </button>
                {items.some((x) => x.id === f.id) && (
                  <button className="adm-btnd" onClick={() => setDel(f)} disabled={saving}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
      <ConfirmDialog
        open={!!del}
        danger
        title={`Delete ${del?.name ?? "this partner"}?`}
        confirmLabel="Delete permanently"
        onCancel={() => setDel(null)}
        onConfirm={async () => {
          if (!del) return;
          const target = del;
          setItems((prev) => prev.filter((x) => x.id !== target.id));
          audit(`Deleted partner ${target.name}`);
          toast("Partner deleted.");
          setDel(null);
          setF(null);
          await deleteAdminSponsor(target.id);
        }}
      >
        This removes the entry from the admin and the public site. It cannot be undone.
      </ConfirmDialog>
    </>
  );
}
