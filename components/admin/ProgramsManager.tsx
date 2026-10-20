"use client";

import { useEffect, useState } from "react";
import { useMockCollection } from "@/lib/admin/use-mock";
import { PROGRAMS } from "@/lib/admin/mock-data";
import type { Program } from "@/lib/admin/types";
import { nowISO, uid } from "@/lib/admin/format";
import { useAdmin } from "./AdminProvider";
import { AreaField, Card, ConfirmDialog, ImageDrop, PageHeader, StatusBadge, Switch, TextField } from "./ui";
import Icon from "./Icon";

const blank = (): Program => ({ id: uid("pg"), title: "", description: "", status: "draft", visible: false, updatedAt: nowISO().slice(0, 10) });

export default function ProgramsManager() {
  const { items, ready, add, update, remove } = useMockCollection<Program>("programs", PROGRAMS);
  const { toast, audit } = useAdmin();
  const [f, setF] = useState<Program | null>(null);
  const [show, setShow] = useState(false);
  const [del, setDel] = useState<Program | null>(null);

  useEffect(() => { if (ready && new URLSearchParams(window.location.search).get("new") === "1") setF(blank()); }, [ready]);

  const saved = f ? items.some((x) => x.id === f.id) : false;
  const errs = f ? {
    title: !f.title.trim() ? "Add a title." : "",
    description: !f.description.trim() ? "Add a short description." : "",
    image: !f.image ? "Add an image before publishing." : "",
    ctaUrl: f.ctaLabel && !f.ctaUrl ? "Add the link for this button." : "",
  } : null;
  const clean = errs ? Object.values(errs).every((v) => !v) : false;

  function save(next: Program, msg: string) {
    const rec = { ...next, updatedAt: nowISO().slice(0, 10) };
    if (items.some((x) => x.id === rec.id)) update(rec.id, rec); else add(rec);
    setF(rec); audit(`${msg} program ${rec.title}`); toast(msg === "Published" ? "Published. It now shows on the public Programs page." : "Saved.");
  }

  return (
    <>
      <PageHeader title="Programs & initiatives" sub="Manage the chapter’s confirmed programs. Only visible, published programs appear on the public site.">
        <button className="adm-btn" onClick={() => { setF(blank()); setShow(false); }}><Icon name="spark" size={16} /> New program</button>
      </PageHeader>
      <div className="adm-grid adm-main-side">
        <Card>
          <div className="adm-tw"><table>
            <thead><tr><th>Program</th><th>Category</th><th>Call to action</th><th>Status</th><th>Visibility</th><th /></tr></thead>
            <tbody>{items.map((p) => (
              <tr key={p.id}>
                <td><div className="adm-t">{p.title}</div><div className="adm-m">{p.description ? p.description.slice(0, 70) + (p.description.length > 70 ? "…" : "") : "No description yet"}</div></td>
                <td>{p.category || "—"}</td>
                <td>{p.ctaLabel ? `“${p.ctaLabel}”` : "—"}</td>
                <td><StatusBadge status={p.status} /></td>
                <td><Switch label="Visible" checked={p.visible} disabled={p.status !== "published"} onChange={(v) => { update(p.id, { visible: v }); audit(`${v ? "Showed" : "Hid"} program ${p.title}`); }} /></td>
                <td><div className="adm-actions"><button className="adm-btn2 adm-sm" onClick={() => { setF({ ...p }); setShow(false); }}>Edit</button></div></td>
              </tr>))}</tbody></table></div>
        </Card>

        {f && errs && (
          <Card className="adm-cp">
            <h2>{saved ? "Edit program" : "New program"}</h2>
            <div className="adm-fg">
              <TextField label="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} error={show ? errs.title : ""} />
              <AreaField label="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} error={show ? errs.description : ""} />
              <ImageDrop label="Image" value={f.image} onChange={(n) => setF({ ...f, image: n })} />
              {show && errs.image && <span className="adm-ferr"><Icon name="warn" size={14} />{errs.image}</span>}
              <TextField label="Category" optional help="Optional. Turn categories on only when there are enough programs to need them." value={f.category ?? ""} onChange={(e) => setF({ ...f, category: e.target.value || undefined })} />
              <div className="adm-r2">
                <TextField label="Call-to-action label" optional value={f.ctaLabel ?? ""} onChange={(e) => setF({ ...f, ctaLabel: e.target.value || undefined })} />
                <TextField label="Link" optional placeholder="https:// or /path" value={f.ctaUrl ?? ""} onChange={(e) => setF({ ...f, ctaUrl: e.target.value || undefined })} error={show ? errs.ctaUrl : ""} />
              </div>
              <Switch label="Visible on the public site" checked={f.visible} disabled={f.status !== "published"} onChange={(v) => setF({ ...f, visible: v })} />
              {f.status !== "published" && <p className="adm-note" style={{ marginTop: -8 }}>Visibility turns on after the program is published.</p>}
              <div className="adm-actions">
                <button className="adm-btn2" onClick={() => { if (!f.title.trim()) { setShow(true); return toast("Add a title to save.", "bad"); } save(f, f.status === "published" ? "Updated" : "Saved draft of"); }}>{f.status === "published" ? "Save changes" : "Save draft"}</button>
                {f.status !== "published"
                  ? <button className="adm-btn" onClick={() => { setShow(true); if (!clean) return toast("Complete the required fields first.", "bad"); save({ ...f, status: "published", visible: true }, "Published"); }}>Publish program</button>
                  : <button className="adm-btn2" onClick={() => save({ ...f, status: "draft", visible: false }, "Unpublished")}>Unpublish</button>}
                {f.status !== "archived" && saved && <button className="adm-btn2" onClick={() => save({ ...f, status: "archived", visible: false }, "Archived")}>Archive</button>}
                {saved && <button className="adm-btnd" onClick={() => setDel(f)}>Delete</button>}
              </div>
            </div>
          </Card>
        )}
      </div>
      <ConfirmDialog open={!!del} danger title={`Delete “${del?.title ?? ""}”?`} confirmLabel="Delete permanently" onCancel={() => setDel(null)}
        onConfirm={() => { if (!del) return; remove(del.id); audit(`Deleted program ${del.title}`); toast("Program deleted."); setDel(null); setF(null); }}>
        This removes the program from the admin and the public site. It cannot be undone. Archive it instead to keep a record.
      </ConfirmDialog>
    </>
  );
}
