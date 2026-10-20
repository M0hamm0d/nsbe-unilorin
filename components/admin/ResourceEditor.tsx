"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMockCollection } from "@/lib/admin/use-mock";
import { RESOURCES } from "@/lib/admin/mock-data";
import type { Resource } from "@/lib/admin/types";
import { DEPARTMENTS, LEVELS, RESOURCE_TYPES } from "@/lib/academic-resources";
import { nowISO, uid } from "@/lib/admin/format";
import { useAdmin } from "./AdminProvider";
import { AreaField, Banner, Card, Check, Chips, EmptyState, FieldError, PageHeader, SelectField, StatusBadge, TextField } from "./ui";
import { findDuplicate, typeLabel } from "./ResourcesManager";
import Icon from "./Icon";

const MAX_MB = 25;
const blank = (): Resource => ({ id: uid("rs"), code: "", title: "", dept: "", level: "", type: "past-question", session: "", status: "draft", updatedAt: nowISO().slice(0, 10) });
type Upload = { name: string; size: number; progress: number; error?: string };

export default function ResourceEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";
  const { items, ready, add, update } = useMockCollection<Resource>("resources", RESOURCES);
  const { toast, audit } = useAdmin();
  const [f, setF] = useState<Resource | null>(null);
  const [up, setUp] = useState<Upload | null>(null);
  const [show, setShow] = useState(false);
  const [allowDup, setAllowDup] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const input = useRef<HTMLInputElement>(null);
  const existing = items.find((x) => x.id === id);

  useEffect(() => { if (!ready || f) return; if (isNew) setF(blank()); else if (existing) setF({ ...existing }); }, [ready, existing, isNew, f]);
  useEffect(() => () => clearInterval(timer.current), []);

  if (ready && !isNew && !existing && !f) return <EmptyState title="Resource not found" text="It may have been removed." action={<Link href="/admin/resources" className="adm-btn">Back to resources</Link>} />;
  if (!f) return <p className="adm-m">Loading…</p>;

  const dup = findDuplicate(f, items);
  const needsSession = f.type === "past-question";
  const errs = {
    file: !f.fileName ? "Upload the file before publishing." : "",
    dept: !f.dept ? "Select a department." : "", level: !f.level ? "Select an academic level." : "",
    code: !f.code.trim() ? "Enter the course code, for example CPE 311." : "", title: !f.title.trim() ? "Enter the course title." : "",
    session: needsSession && !f.session.trim() ? "Add the session for past questions, for example 2023/2024." : "",
    dup: dup && !allowDup ? "Confirm this is different from the existing resource." : "",
  };
  const clean = Object.values(errs).every((v) => !v);
  const saved = items.some((x) => x.id === f.id);
  const S = <K extends keyof Resource>(k: K, v: Resource[K]) => setF({ ...f, [k]: v });

  function pick(file?: File) {
    if (!file) return;
    clearInterval(timer.current);
    if (file.type !== "application/pdf") return setUp({ name: file.name, size: file.size, progress: 0, error: "Only PDF files are accepted." });
    if (file.size > MAX_MB * 1024 * 1024) return setUp({ name: file.name, size: file.size, progress: 0, error: `This file is ${(file.size / 1048576).toFixed(0)} MB. Files must be ${MAX_MB} MB or smaller. Compress it or choose another file.` });
    let p = 0;
    setUp({ name: file.name, size: file.size, progress: 0 });
    // Mock upload: simulates progress. Replace with a Supabase Storage upload later.
    timer.current = setInterval(() => {
      p += 12 + Math.random() * 10;
      if (p >= 100) {
        clearInterval(timer.current);
        setUp({ name: file.name, size: file.size, progress: 100 });
        setF((cur) => cur && { ...cur, fileName: file.name, fileSize: `${(file.size / 1048576).toFixed(1)} MB` });
        toast("File uploaded.");
      } else setUp({ name: file.name, size: file.size, progress: Math.round(p) });
    }, 220);
  }

  function save(status: Resource["status"], msg: string) {
    const rec = { ...f!, status, updatedAt: nowISO().slice(0, 10) };
    if (saved) update(rec.id, rec); else add(rec);
    setF(rec); audit(`${msg} ${rec.code} ${rec.title}`.trim());
    toast(status === "published" ? "Published. Students can now open it in the Academic Hub." : "Saved.");
    if (!saved) router.replace(`/admin/resources/${rec.id}`);
  }
  const uploading = !!up && !up.error && up.progress < 100;
  const list: [string, boolean][] = [["File uploaded", !errs.file], ["Department, level and type chosen", !errs.dept && !errs.level], ["Course code and title", !errs.code && !errs.title], ["Session added", !errs.session], ["No unconfirmed duplicate", !errs.dup]];

  return (
    <>
      <PageHeader title={saved ? "Edit resource" : "Add resource"} sub="Upload the file, then add the details students will search by."><StatusBadge status={f.status} /></PageHeader>
      <div className="adm-grid adm-main-side">
        <Card className="adm-cp"><div className="adm-fg">
          <div className="adm-f">
            <span className="adm-lb">File</span>
            <div className="adm-dz" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}>
              <Icon name="upl" size={24} /><b>{f.fileName ? `${f.fileName} · ${f.fileSize}` : "Drag a PDF here, or choose a file"}</b><span>PDF only, up to {MAX_MB} MB.</span>
              <button type="button" className="adm-btn2 adm-sm" onClick={() => input.current?.click()}>{f.fileName ? "Replace file" : "Choose file"}</button>
              <input ref={input} type="file" accept="application/pdf" className="adm-sr" onChange={(e) => pick(e.target.files?.[0])} />
            </div>
            {up && !up.error && (
              <div className="adm-card adm-cp" style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><b>{up.name}</b><span className="adm-note">{(up.size / 1048576).toFixed(1)} MB · {up.progress}%</span></div>
                <div className="adm-pbar" role="progressbar" aria-valuenow={up.progress} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${up.progress}%` }} /></div>
                <span className="adm-note">{up.progress < 100 ? "Uploading…" : "Uploaded"}</span>
              </div>)}
            {up?.error && <Banner kind="danger"><b>{up.name}</b>: {up.error}</Banner>}
            {show && errs.file && !up?.error && <FieldError text={errs.file} />}
          </div>
          {dup && <Banner kind="warn"><div><b>Possible duplicate.</b> {dup.code} · {typeLabel(dup.type)}{dup.session ? ` · ${dup.session}` : ""} already exists ({dup.status}). <Link href={`/admin/resources/${dup.id}`} className="adm-link">View existing</Link>
            <div style={{ marginTop: 8 }}><Check checked={allowDup} onChange={setAllowDup} error={show ? errs.dup : ""}>This is different, add it anyway</Check></div></div></Banner>}
          <div className="adm-r2">
            <SelectField label="Department" placeholder="Select a department" value={f.dept} onChange={(e) => S("dept", e.target.value)} options={DEPARTMENTS.map((d) => ({ value: d.name, label: d.name }))} error={show ? errs.dept : ""} />
            <Chips label="Academic level" options={LEVELS} value={f.level} onChange={(v) => S("level", v)} error={show ? errs.level : ""} />
          </div>
          <div className="adm-r2">
            <TextField label="Course code" placeholder="e.g. CPE 311" value={f.code} onChange={(e) => S("code", e.target.value)} error={show ? errs.code : ""} />
            <TextField label="Course title" value={f.title} onChange={(e) => S("title", e.target.value)} error={show ? errs.title : ""} />
          </div>
          <div className="adm-r2">
            <SelectField label="Resource type" value={f.type} onChange={(e) => S("type", e.target.value)} options={RESOURCE_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
            <TextField label={needsSession ? "Session or year" : "Session or year (optional)"} placeholder="e.g. 2023/2024" value={f.session} onChange={(e) => S("session", e.target.value)} error={show ? errs.session : ""} />
          </div>
          <AreaField label="Notes for students" optional value={f.notes ?? ""} onChange={(e) => S("notes", e.target.value)} />
        </div></Card>

        <div className="adm-stack">
          <Card className="adm-cp"><h2>Publish</h2>
            <div className="adm-actions" style={{ marginBottom: 14 }}>
              <button className="adm-btn2" disabled={uploading} onClick={() => { if (!f.code.trim() && !f.title.trim()) { setShow(true); return toast("Add a course code or title to save.", "bad"); } save(f.status === "published" ? "published" : "draft", f.status === "published" ? "Updated" : "Saved draft of"); }}>{f.status === "published" ? "Save changes" : "Save draft"}</button>
              {f.status === "published" && <button className="adm-btn2" onClick={() => save("draft", "Unpublished")}>Unpublish</button>}
              {f.status === "archived" && <button className="adm-btn2" onClick={() => save("draft", "Restored")}>Restore</button>}
            </div>
            {f.status !== "published" && <button className="adm-btn adm-wide" disabled={uploading} aria-disabled={!clean} onClick={() => { setShow(true); if (!clean) return toast("Complete the checklist before publishing.", "bad"); save("published", "Published"); }}>Publish resource</button>}
            {uploading && <p className="adm-note" style={{ marginTop: 8 }}>Wait for the upload to finish.</p>}
            <div className="adm-checklist" style={{ marginTop: 16 }}>{list.map(([t, ok]) => <div key={t} className={ok ? "ok" : "no"}><Icon name={ok ? "ok" : "x"} size={16} />{t}</div>)}</div>
          </Card>
          <Card className="adm-cp"><h2>Preview for students</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div><div className="adm-t">{f.code || "Course code"} — {f.title || "Course title"}</div><div className="adm-note">{typeLabel(f.type)} · {f.level || "Level"} · {f.session || "Session"} · PDF</div></div>
              <span className="adm-btn2 adm-sm">Open</span></div>
          </Card>
        </div>
      </div>
    </>
  );
}
