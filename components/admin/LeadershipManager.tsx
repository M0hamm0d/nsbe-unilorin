"use client";

import { useEffect, useState } from "react";
import { LEADERS } from "@/lib/admin/mock-data";
import type { Leader } from "@/lib/admin/types";
import { uid } from "@/lib/admin/format";
import { saveAdminLeader, deleteAdminLeader } from "@/lib/admin/actions";
import { useAdmin } from "./AdminProvider";
import { Banner, Card, ConfirmDialog, ImageDrop, PageHeader, Switch, TextField } from "./ui";
import Icon from "./Icon";

function parseSocials(raw?: string): { linkedin: string; twitter: string; email: string } {
  if (!raw) return { linkedin: "", twitter: "", email: "" };
  try {
    if (raw.trim().startsWith("{")) {
      const parsed = JSON.parse(raw);
      return {
        linkedin: parsed.linkedin || "",
        twitter: parsed.twitter || "",
        email: parsed.email || "",
      };
    }
  } catch {}
  if (raw.includes("linkedin.com")) return { linkedin: raw.trim(), twitter: "", email: "" };
  if (raw.includes("@")) return { linkedin: "", twitter: "", email: raw.trim() };
  return { linkedin: "", twitter: "", email: "" };
}

export default function LeadershipManager({ initialItems }: { initialItems?: Leader[] }) {
  const [items, setItems] = useState<Leader[]>(initialItems && initialItems.length > 0 ? initialItems : LEADERS);
  const { toast, audit } = useAdmin();
  const [f, setF] = useState<Leader | null>(null);
  const [show, setShow] = useState(false);
  const [del, setDel] = useState<Leader | null>(null);
  const [saving, setSaving] = useState(false);

  // Clear any legacy localStorage mock data so it doesn't conflict with real Supabase records
  useEffect(() => {
    try {
      localStorage.removeItem("nsbe-admin-mock:v1:leadership");
    } catch {}
  }, []);

  // Sync if initialItems updates from server revalidation
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
    const next = [...sorted];
    [next[i], next[j]] = [next[j], next[i]];
    const updated = next.map((x, n) => ({ ...x, order: n + 1 }));
    setItems(updated);
    audit(`Changed the display order of ${sorted[i].name}`);
    for (const leader of updated) {
      await saveAdminLeader(leader);
    }
  }

  const errs = f
    ? {
        name: !f.name.trim() ? "Enter the full name." : "",
        role: !f.role.trim() ? "Enter the approved role or title." : "",
      }
    : null;

  const currentSocials = parseSocials(f?.bio);

  function updateSocial(key: "linkedin" | "twitter" | "email", val: string) {
    if (!f) return;
    const nextSocials = { ...currentSocials, [key]: val.trim() };
    setF({ ...f, bio: JSON.stringify(nextSocials) });
  }

  async function save() {
    if (!f || !errs || saving) return;
    setShow(true);
    if (Object.values(errs).some(Boolean)) return toast("Fix the highlighted fields.", "bad");

    const isExisting = items.some((x) => x.id === f.id);
    const itemToSave: Leader = isExisting ? f : { ...f, order: items.length + 1 };

    setSaving(true);
    // Optimistic UI update
    if (isExisting) {
      setItems((prev) => prev.map((x) => (x.id === itemToSave.id ? itemToSave : x)));
    } else {
      setItems((prev) => [...prev, itemToSave]);
    }

    audit(`Saved leadership profile ${itemToSave.name}`);
    setF(null);

    try {
      const res = await saveAdminLeader(itemToSave);
      if (res.ok) {
        toast("Profile saved successfully.");
        if (res.id && res.id !== itemToSave.id) {
          // If a new item was assigned a UUID, update local state with it
          setItems((prev) => prev.map((x) => (x.id === itemToSave.id ? { ...itemToSave, id: res.id! } : x)));
        }
      } else {
        toast("Failed to save profile.", "bad");
      }
    } catch {
      toast("An error occurred while saving.", "bad");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(l: Leader, visible: boolean) {
    const next = { ...l, visible };
    setItems((prev) => prev.map((x) => (x.id === l.id ? next : x)));
    audit(`${visible ? "Showed" : "Hid"} ${l.name} on the Leadership page`);
    await saveAdminLeader(next);
  }

  return (
    <>
      <PageHeader title="Leadership" sub="Manage chapter executives, portraits, and social links.">
        <button
          className="adm-btn"
          onClick={() => {
            setF({ id: uid("ld"), name: "", role: "", bio: "", visible: true, order: items.length + 1 });
            setShow(false);
          }}
        >
          <Icon name="users" size={16} /> Add executive
        </button>
      </PageHeader>
      <Banner kind="warn">
        <b>Use verified information only.</b> Names, roles, portraits and socials must be confirmed by chapter executives.
      </Banner>
      <div className="adm-grid adm-main-side-n">
        <div className="adm-leaders">
          {sorted.map((l, i) => (
            <Card key={l.id} className="adm-cp">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  className="adm-person"
                  style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {l.portrait ? (
                    <img src={l.portrait} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    "PHOTO"
                  )}
                </div>
                <span className="adm-note">Order {l.order}</span>
              </div>
              <div style={{ margin: "10px 0" }}>
                <div className="adm-t">{l.name}</div>
                <div className="adm-m">{l.role}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Switch label="Public" checked={l.visible} onChange={(v) => toggleVisible(l, v)} />
                <div className="adm-actions">
                  <button
                    className="adm-btn2 adm-sm"
                    onClick={() => {
                      setF({ ...l });
                      setShow(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="adm-btn2 adm-sm"
                    aria-label={`Move ${l.name} earlier`}
                    disabled={i === 0}
                    onClick={() => move(l.id, -1)}
                  >
                    ↑
                  </button>
                  <button
                    className="adm-btn2 adm-sm"
                    aria-label={`Move ${l.name} later`}
                    disabled={i === sorted.length - 1}
                    onClick={() => move(l.id, 1)}
                  >
                    ↓
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {f && errs && (
          <Card className="adm-cp">
            <h2>{items.some((x) => x.id === f.id) ? "Edit profile" : "Add executive"}</h2>
            <div className="adm-fg">
              <TextField
                label="Full name"
                placeholder="e.g. Olumide Ogunjimi"
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                error={show ? errs.name : ""}
              />
              <TextField
                label="Approved role or title"
                placeholder="e.g. Chapter President"
                value={f.role}
                onChange={(e) => setF({ ...f, role: e.target.value })}
                error={show ? errs.role : ""}
              />
              <ImageDrop
                label="Executive Portrait Photo"
                value={f.portrait}
                onChange={(n) => setF({ ...f, portrait: n })}
                hint="Portrait or square crop photo."
              />
              <div className="adm-r2">
                <TextField
                  label="LinkedIn profile (optional)"
                  placeholder="https://linkedin.com/in/username"
                  value={currentSocials.linkedin}
                  onChange={(e) => updateSocial("linkedin", e.target.value)}
                />
                <TextField
                  label="X / Twitter (optional)"
                  placeholder="https://x.com/username"
                  value={currentSocials.twitter}
                  onChange={(e) => updateSocial("twitter", e.target.value)}
                />
              </div>
              <TextField
                label="Contact email (optional)"
                placeholder="name@example.com"
                value={currentSocials.email}
                onChange={(e) => updateSocial("email", e.target.value)}
              />
              <Switch
                label="Show on the public Leadership page"
                checked={f.visible}
                onChange={(v) => setF({ ...f, visible: v })}
              />
              <div className="adm-actions">
                <button className="adm-btn2" onClick={() => setF(null)} disabled={saving}>
                  Cancel
                </button>
                <button className="adm-btn" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save profile"}
                </button>
                {items.some((x) => x.id === f.id) && (
                  <button className="adm-btnd" onClick={() => setDel(f)} disabled={saving}>
                    Remove
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
        title={`Remove ${del?.name ?? "this profile"}?`}
        confirmLabel="Remove profile"
        onCancel={() => setDel(null)}
        onConfirm={async () => {
          if (!del) return;
          const target = del;
          setItems((prev) => prev.filter((x) => x.id !== target.id));
          audit(`Removed leadership profile ${target.name}`);
          toast("Profile removed.");
          setDel(null);
          setF(null);
          await deleteAdminLeader(target.id);
        }}
      >
        This removes the profile from the admin and the public Leadership page. It cannot be undone. To keep it, hide it instead.
      </ConfirmDialog>
    </>
  );
}
