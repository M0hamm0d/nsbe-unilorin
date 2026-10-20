"use client";

import { useState } from "react";
import Link from "next/link";
import { useMockCollection } from "@/lib/admin/use-mock";
import { RESOURCES } from "@/lib/admin/mock-data";
import type { PubStatus, Resource } from "@/lib/admin/types";
import { DEPARTMENTS, LEVELS, RESOURCE_TYPES } from "@/lib/academic-resources";
import { fmtDate, nowISO } from "@/lib/admin/format";
import { useAdmin } from "./AdminProvider";
import { Badge, EmptyState, FilterSelect, PageHeader, SearchBox, StatusBadge, Tabs } from "./ui";
import Icon from "./Icon";

const PAGE = 8;
export const typeLabel = (v: string) => RESOURCE_TYPES.find((t) => t.value === v)?.label ?? v;
/** Same course, type and session already in the library (ignoring archived and itself). */
export const findDuplicate = (r: Pick<Resource, "id" | "code" | "type" | "session">, all: Resource[]) =>
  all.find((x) => x.id !== r.id && x.status !== "archived" && x.code.replace(/\s/g, "").toLowerCase() === r.code.replace(/\s/g, "").toLowerCase() && x.type === r.type && x.session === r.session);

export default function ResourcesManager() {
  const { items, update } = useMockCollection<Resource>("resources", RESOURCES);
  const { toast, audit } = useAdmin();
  const [tab, setTab] = useState<PubStatus>("published");
  const [q, setQ] = useState(""); const [dept, setDept] = useState(""); const [lvl, setLvl] = useState(""); const [type, setType] = useState(""); const [ses, setSes] = useState("");
  const [shown, setShown] = useState(PAGE);

  const sessions = Array.from(new Set(items.map((r) => r.session).filter(Boolean))).sort().reverse().map((s) => ({ value: s, label: s }));
  const rows = items.filter((r) => r.status === tab && (!dept || r.dept === dept) && (!lvl || r.level === lvl) && (!type || r.type === type) && (!ses || r.session === ses) &&
    `${r.code} ${r.title}`.toLowerCase().includes(q.toLowerCase()));
  const dupes = rows.filter((r) => findDuplicate(r, items)).length;
  const count = (s: PubStatus) => items.filter((r) => r.status === s).length;

  function setStatus(r: Resource, status: PubStatus, msg: string) {
    if (status === "published" && !r.fileName) return toast("Upload a file before publishing.", "bad");
    update(r.id, { status, updatedAt: nowISO().slice(0, 10) });
    audit(`${msg} ${r.code} ${r.title}`); toast(`${msg} ${r.code}.`);
  }

  return (
    <>
      <PageHeader title="Academic resources" sub="Past questions, lecture materials and other resources for all 10 departments, 100L to 500L.">
        <Link href="/admin/resources/new" className="adm-btn"><Icon name="upl" size={16} /> Add resource</Link>
      </PageHeader>
      <Tabs value={tab} onChange={(t) => { setTab(t); setShown(PAGE); }} items={[{ id: "published", label: "Published", count: count("published") }, { id: "draft", label: "Drafts", count: count("draft") }, { id: "archived", label: "Archived", count: count("archived") }]} />
      <div className="adm-filters">
        <SearchBox value={q} onChange={setQ} placeholder="Search by course code, title or topic" />
        <FilterSelect label="All departments" value={dept} onChange={setDept} options={DEPARTMENTS.map((d) => ({ value: d.name, label: d.name }))} />
        <FilterSelect label="All levels" value={lvl} onChange={setLvl} options={LEVELS.map((l) => ({ value: l, label: l }))} />
        <FilterSelect label="All types" value={type} onChange={setType} options={RESOURCE_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
        <FilterSelect label="Any session" value={ses} onChange={setSes} options={sessions} />
      </div>
      <section className="adm-card">
        {rows.length ? (<>
          <div className="adm-tw"><table>
            <thead><tr><th>Resource</th><th>Department</th><th>Level</th><th>Type</th><th>Session</th><th>Status</th><th>Updated</th><th /></tr></thead>
            <tbody>{rows.slice(0, shown).map((r) => (
              <tr key={r.id}>
                <td><div style={{ display: "flex", gap: 12, alignItems: "center" }}><div className="adm-th"><Icon name="file" size={20} /></div>
                  <div><div className="adm-t">{r.code} — {r.title}</div><div className="adm-m">{r.fileName ? `${r.fileName} · ${r.fileSize}` : "No file yet"}</div>
                    {findDuplicate(r, items) && <div style={{ marginTop: 4 }}><Badge kind="warn">Possible duplicate</Badge></div>}</div></div></td>
                <td>{r.dept}</td><td>{r.level}</td><td>{typeLabel(r.type)}</td><td>{r.session || "—"}</td>
                <td><StatusBadge status={r.status} /></td><td>{fmtDate(r.updatedAt)}</td>
                <td><div className="adm-actions">
                  <Link href={`/admin/resources/${r.id}`} className="adm-btn2 adm-sm">Edit</Link>
                  <Link href={`/admin/resources/${r.id}`} className="adm-btn2 adm-sm">Replace file</Link>
                  {r.status === "draft" && <button className="adm-btn adm-sm" onClick={() => setStatus(r, "published", "Published")}>Publish</button>}
                  {r.status === "published" && <button className="adm-btn2 adm-sm" onClick={() => setStatus(r, "archived", "Archived")}>Archive</button>}
                  {r.status === "archived" && <button className="adm-btn2 adm-sm" onClick={() => setStatus(r, "draft", "Restored")}>Restore</button>}
                </div></td>
              </tr>))}</tbody></table></div>
          <div className="adm-pager"><span>Showing {Math.min(shown, rows.length)} of {rows.length}{dupes ? ` · ${dupes} possible duplicate${dupes > 1 ? "s" : ""} to review` : ""}</span>
            {shown < rows.length && <button className="adm-btn2 adm-sm" onClick={() => setShown((s) => s + PAGE)}>Load more</button>}</div>
        </>) : <EmptyState title="No resources match" text="Try removing a filter, or add a new resource." action={<button className="adm-btn2" onClick={() => { setQ(""); setDept(""); setLvl(""); setType(""); setSes(""); }}>Clear filters</button>} />}
      </section>
    </>
  );
}
