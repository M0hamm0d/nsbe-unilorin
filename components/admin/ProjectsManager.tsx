"use client";

import { useState } from "react";
import { useMockCollection } from "@/lib/admin/use-mock";
import { PROJECTS } from "@/lib/admin/mock-data";
import type { Project, PubStatus } from "@/lib/admin/types";
import { DEPARTMENTS } from "@/lib/academic-resources";
import { nowISO, uid } from "@/lib/admin/format";
import { useAdmin } from "./AdminProvider";
import { AreaField, Badge, Banner, Card, Check, FilterSelect, PageHeader, SearchBox, SelectField, StatusBadge, Tabs, TextField } from "./ui";
import Icon from "./Icon";

const blank = (): Project => ({ id: uid("pj"), title: "", dept: "", abstract: "", keywords: "", reviewed: { suitable: false, attribution: false, reuse: false }, status: "draft", updatedAt: nowISO().slice(0, 10) });

export default function ProjectsManager() {
  const { items, add, update } = useMockCollection<Project>("projects", PROJECTS);
  const { toast, audit } = useAdmin();
  const [tab, setTab] = useState<PubStatus>("published");
  const [q, setQ] = useState(""); const [dept, setDept] = useState(""); const [year, setYear] = useState("");
  const [f, setF] = useState<Project | null>(null);
  const [show, setShow] = useState(false);

  const rows = items.filter((p) => p.status === tab && (!dept || p.dept === dept) && (!year || p.year === year) && `${p.title} ${p.keywords} ${p.dept}`.toLowerCase().includes(q.toLowerCase()));
  const years = Array.from(new Set(items.map((p) => p.year).filter(Boolean) as string[])).sort().reverse().map((y) => ({ value: y, label: y }));
  const count = (s: PubStatus) => items.filter((p) => p.status === s).length;
  const rev = f?.reviewed;
  const errs = f ? {
    title: !f.title.trim() ? "Enter the project title." : "", dept: !f.dept ? "Select a department." : "",
    abstract: !f.abstract.trim() ? "Add the abstract." : "", keywords: !f.keywords.trim() ? "Add at least one keyword." : "",
    link: !f.docLink && !f.repoLink ? "Add a project document or a repository link." : "",
    repo: f.repoLink && !/^https?:\/\//i.test(f.repoLink) ? "Enter a full link starting with https://" : "",
    review: !(rev!.suitable && rev!.attribution && rev!.reuse) ? "Tick all three checks before publishing." : "",
  } : null;
  const clean = errs ? Object.values(errs).every((v) => !v) : false;

  function save(next: Project, msg: string) {
    const rec = { ...next, updatedAt: nowISO().slice(0, 10) };
    if (items.some((x) => x.id === rec.id)) update(rec.id, rec); else add(rec);
    setF(rec); audit(`${msg} project ${rec.title}`); toast(msg === "Published" ? "Published to the project repository." : "Saved.");
  }

  return (
    <>
      <PageHeader title="Final-year projects" sub="Curated academic records, not just files.">
        <button className="adm-btn" onClick={() => { setF(blank()); setShow(false); }}><Icon name="file" size={16} /> Add project</button>
      </PageHeader>
      <Tabs value={tab} onChange={setTab} items={[{ id: "published", label: "Published", count: count("published") }, { id: "draft", label: "Drafts", count: count("draft") }, { id: "archived", label: "Archived", count: count("archived") }]} />
      <div className="adm-filters">
        <SearchBox value={q} onChange={setQ} placeholder="Search by title, keyword or department" />
        <FilterSelect label="All departments" value={dept} onChange={setDept} options={DEPARTMENTS.map((d) => ({ value: d.name, label: d.name }))} />
        <FilterSelect label="Any year" value={year} onChange={setYear} options={years} />
      </div>
      <div className="adm-grid adm-main-side">
        <Card><div className="adm-tw"><table>
          <thead><tr><th>Project</th><th>Department</th><th>Year</th><th>Link</th><th>Status</th><th>Review</th><th /></tr></thead>
          <tbody>{rows.map((p) => (
            <tr key={p.id}>
              <td><div className="adm-t">{p.title}</div><div className="adm-m">{p.keywords}</div></td><td>{p.dept}</td><td>{p.year || "—"}</td>
              <td>{p.docLink ? "Document" : p.repoLink ? "Repository" : "—"}</td><td><StatusBadge status={p.status} /></td>
              <td>{p.reviewed.suitable && p.reviewed.attribution && p.reviewed.reuse ? <Badge kind="done">Checked</Badge> : <Badge kind="warn">Not checked</Badge>}</td>
              <td><button className="adm-btn2 adm-sm" onClick={() => { setF({ ...p, reviewed: { ...p.reviewed } }); setShow(false); }}>Edit</button></td>
            </tr>))}</tbody></table>
          {!rows.length && <p className="adm-pager">No projects match.</p>}</div></Card>

        {f && errs && (
          <Card className="adm-cp"><h2>{items.some((x) => x.id === f.id) ? "Edit project" : "Add project"}</h2>
            <div className="adm-fg">
              <TextField label="Project title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} error={show ? errs.title : ""} />
              <SelectField label="Department" placeholder="Select a department" value={f.dept} onChange={(e) => setF({ ...f, dept: e.target.value })} options={DEPARTMENTS.map((d) => ({ value: d.name, label: d.name }))} error={show ? errs.dept : ""} />
              <AreaField label="Abstract" value={f.abstract} onChange={(e) => setF({ ...f, abstract: e.target.value })} error={show ? errs.abstract : ""} />
              <TextField label="Keywords" help="Separate with commas." value={f.keywords} onChange={(e) => setF({ ...f, keywords: e.target.value })} error={show ? errs.keywords : ""} />
              <TextField label="Project document file name" optional help="Mock: type a file name. Real uploads come with Supabase Storage." value={f.docLink ?? ""} onChange={(e) => setF({ ...f, docLink: e.target.value || undefined })} error={show ? errs.link : ""} />
              <TextField label="Repository link" optional placeholder="https://" value={f.repoLink ?? ""} onChange={(e) => setF({ ...f, repoLink: e.target.value || undefined })} error={show ? errs.repo : ""} />
              <Banner><div>Add <b>author, team, supervisor and year</b> only when confirmed and relevant.</div></Banner>
              <div className="adm-r2">
                <TextField label="Year" optional value={f.year ?? ""} onChange={(e) => setF({ ...f, year: e.target.value || undefined })} />
                <TextField label="Supervisor" optional value={f.supervisor ?? ""} onChange={(e) => setF({ ...f, supervisor: e.target.value || undefined })} />
              </div>
              <fieldset className="adm-f adm-fs"><legend>Review before publishing</legend>
                <div className="adm-fg" style={{ gap: 10 }}>
                  <Check checked={f.reviewed.suitable} onChange={(v) => setF({ ...f, reviewed: { ...f.reviewed, suitable: v } })}>The project is suitable for sharing</Check>
                  <Check checked={f.reviewed.attribution} onChange={(v) => setF({ ...f, reviewed: { ...f.reviewed, attribution: v } })}>Attribution is clear</Check>
                  <Check checked={f.reviewed.reuse} onChange={(v) => setF({ ...f, reviewed: { ...f.reviewed, reuse: v } })} error={show ? errs.review : ""}>Reuse terms are clear</Check>
                </div></fieldset>
              <div className="adm-actions">
                <button className="adm-btn2" onClick={() => { if (!f.title.trim()) { setShow(true); return toast("Add a title to save.", "bad"); } save(f, f.status === "published" ? "Updated" : "Saved draft of"); }}>{f.status === "published" ? "Save changes" : "Save draft"}</button>
                {f.status !== "published" ? <button className="adm-btn" onClick={() => { setShow(true); if (!clean) return toast("Complete the required fields and checks.", "bad"); save({ ...f, status: "published" }, "Published"); }}>Publish project</button>
                  : <button className="adm-btn2" onClick={() => save({ ...f, status: "draft" }, "Unpublished")}>Unpublish</button>}
                {f.status !== "archived" && items.some((x) => x.id === f.id) && <button className="adm-btn2" onClick={() => save({ ...f, status: "archived" }, "Archived")}>Archive</button>}
              </div>
            </div>
          </Card>)}
      </div>
    </>
  );
}
