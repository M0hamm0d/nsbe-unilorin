"use client";

import { useState } from "react";
import { useMockCollection } from "@/lib/admin/use-mock";
import { LEADERS } from "@/lib/admin/mock-data";
import type { Leader } from "@/lib/admin/types";
import { uid } from "@/lib/admin/format";
import { useAdmin } from "./AdminProvider";
import { AreaField, Banner, Card, ConfirmDialog, ImageDrop, PageHeader, Switch, TextField } from "./ui";
import Icon from "./Icon";

const MAX_BIO = 280;

export default function LeadershipManager() {
  const { items, add, update, remove, set } = useMockCollection<Leader>("leadership", LEADERS);
  const { toast, audit } = useAdmin();
  const [f, setF] = useState<Leader | null>(null);
  const [show, setShow] = useState(false);
  const [del, setDel] = useState<Leader | null>(null);
  const sorted = [...items].sort((a, b) => a.order - b.order);

  function move(id: string, dir: -1 | 1) {
    const i = sorted.findIndex((x) => x.id === id), j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const next = [...sorted];
    [next[i], next[j]] = [next[j], next[i]];
    set(next.map((x, n) => ({ ...x, order: n + 1 })));
    audit(`Changed the display order of ${sorted[i].name}`);
  }
  const errs = f ? { name: !f.name.trim() ? "Enter the full name." : "", role: !f.role.trim() ? "Enter the approved role or title." : "", bio: f.bio.length > MAX_BIO ? `Keep the biography under ${MAX_BIO} characters.` : "",
    term: f.termStart && f.termEnd && f.termEnd < f.termStart ? "The term can’t end before it starts." : "" } : null;

  function save() {
    if (!f || !errs) return;
    setShow(true);
    if (Object.values(errs).some(Boolean)) return toast("Fix the highlighted fields.", "bad");
    if (items.some((x) => x.id === f.id)) update(f.id, f); else add({ ...f, order: items.length + 1 });
    audit(`Updated leadership profile ${f.name}`); toast("Profile saved."); setF(null);
  }

  return (
    <>
      <PageHeader title="Leadership" sub="Manage current executives and their public profiles.">
        <button className="adm-btn" onClick={() => { setF({ id: uid("ld"), name: "", role: "", bio: "", visible: false, order: items.length + 1 }); setShow(false); }}><Icon name="users" size={16} /> Add executive</button>
      </PageHeader>
      <Banner kind="warn"><b>Use verified information only.</b> Names, roles, portraits and term dates must be confirmed by the chapter. Never copy them from design reference screenshots.</Banner>
      <div className="adm-grid adm-main-side-n">
        <div className="adm-leaders">
          {sorted.map((l, i) => (
            <Card key={l.id} className="adm-cp">
              <div style={{ display: "flex", justifyContent: "space-between" }}><div className="adm-person">PHOTO</div><span className="adm-note">Order {l.order}</span></div>
              <div style={{ margin: "10px 0" }}><div className="adm-t">{l.name}</div><div className="adm-m">{l.role}</div><div className="adm-m">{l.termStart || l.termEnd ? `${l.termStart || "?"} to ${l.termEnd || "present"}` : "Term not set"}</div></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Switch label="Public" checked={l.visible} onChange={(v) => { update(l.id, { visible: v }); audit(`${v ? "Showed" : "Hid"} ${l.name} on the Leadership page`); }} />
                <div className="adm-actions">
                  <button className="adm-btn2 adm-sm" onClick={() => { setF({ ...l }); setShow(false); }}>Edit</button>
                  <button className="adm-btn2 adm-sm" aria-label={`Move ${l.name} earlier`} disabled={i === 0} onClick={() => move(l.id, -1)}>↑</button>
                  <button className="adm-btn2 adm-sm" aria-label={`Move ${l.name} later`} disabled={i === sorted.length - 1} onClick={() => move(l.id, 1)}>↓</button>
                </div>
              </div>
            </Card>))}
        </div>
        {f && errs && (
          <Card className="adm-cp"><h2>{items.some((x) => x.id === f.id) ? "Edit profile" : "Add executive"}</h2>
            <div className="adm-fg">
              <TextField label="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={show ? errs.name : ""} />
              <TextField label="Approved role or title" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} error={show ? errs.role : ""} />
              <ImageDrop label="Portrait" value={f.portrait} onChange={(n) => setF({ ...f, portrait: n })} hint="Square crop, approved photo only." />
              <AreaField label="Short biography" help={`Up to ${MAX_BIO} characters · ${f.bio.length} used`} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} error={show ? errs.bio : ""} />
              <div className="adm-r2">
                <TextField label="Term starts" optional type="date" value={f.termStart ?? ""} onChange={(e) => setF({ ...f, termStart: e.target.value })} />
                <TextField label="Term ends" optional type="date" value={f.termEnd ?? ""} onChange={(e) => setF({ ...f, termEnd: e.target.value })} error={show ? errs.term : ""} />
              </div>
              <Switch label="Show on the public Leadership page" checked={f.visible} onChange={(v) => setF({ ...f, visible: v })} />
              <div className="adm-actions"><button className="adm-btn2" onClick={() => setF(null)}>Cancel</button><button className="adm-btn" onClick={save}>Save profile</button>
                {items.some((x) => x.id === f.id) && <button className="adm-btnd" onClick={() => setDel(f)}>Remove</button>}</div>
            </div>
          </Card>)}
      </div>
      <ConfirmDialog open={!!del} danger title={`Remove ${del?.name ?? "this profile"}?`} confirmLabel="Remove profile" onCancel={() => setDel(null)}
        onConfirm={() => { if (!del) return; remove(del.id); audit(`Removed leadership profile ${del.name}`); toast("Profile removed."); setDel(null); setF(null); }}>
        This removes the profile from the admin and the public Leadership page. It cannot be undone. To keep it, hide it instead.
      </ConfirmDialog>
    </>
  );
}
