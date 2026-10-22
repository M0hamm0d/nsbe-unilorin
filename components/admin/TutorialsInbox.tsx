"use client";

import { useState } from "react";
import { TUTORIALS } from "@/lib/admin/mock-data";
import type { TutorialInterest, TutorialStatus } from "@/lib/admin/types";
import { DEPARTMENTS, LEVELS } from "@/lib/academic-resources";
import { fmtDate } from "@/lib/admin/format";
import { updateTutorialStatus } from "@/lib/admin/actions";
import { useAdmin } from "./AdminProvider";
import { Badge, Banner, Card, EmptyState, FilterSelect, PageHeader, SearchBox, Tabs } from "./ui";

const LABEL: Record<TutorialStatus, string> = { new: "New", contacted: "Contacted", resolved: "Resolved" };
const KIND = { new: "new", contacted: "warn", resolved: "done" } as const;
const mask = (p?: string) => (p ? p.replace(/\d(?=(?:\D*\d){2})/g, "•") : "");

export default function TutorialsInbox({ initialItems }: { initialItems?: TutorialInterest[] }) {
  const [items, setItems] = useState<TutorialInterest[]>(initialItems ?? TUTORIALS);
  const { toast, audit } = useAdmin();
  const [tab, setTab] = useState<TutorialStatus>("new");
  const [q, setQ] = useState(""); const [dept, setDept] = useState(""); const [lvl, setLvl] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);

  const count = (s: TutorialStatus) => items.filter((t) => t.status === s).length;
  const rows = items.filter((t) => t.status === tab && (!dept || t.dept === dept) && (!lvl || t.level === lvl) &&
    `${t.name} ${t.email} ${t.subjects}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  async function change(t: TutorialInterest, status: TutorialStatus) {
    setItems((prev) => prev.map((item) => (item.id === t.id ? { ...item, status } : item)));
    audit(`Marked a tutorial request as ${LABEL[status]}`); // no personal details in the audit log
    toast(`Marked as ${LABEL[status]}.`);
    await updateTutorialStatus(t.id, status);
  }

  return (
    <>
      <PageHeader title="Tutorial interests" sub="Students who asked for tutorials. Use this to plan and follow up." />
      <Banner><div><b>Private.</b> This list holds personal information. It is only visible to authorized executives and is never shown on public pages.</div></Banner>
      <Tabs value={tab} onChange={setTab} items={(["new", "contacted", "resolved"] as const).map((s) => ({ id: s, label: LABEL[s], count: count(s) }))} />
      <div className="adm-filters">
        <SearchBox value={q} onChange={setQ} placeholder="Search by name, email or subject" />
        <FilterSelect label="All departments" value={dept} onChange={setDept} options={DEPARTMENTS.map((d) => ({ value: d.name, label: d.name }))} />
        <FilterSelect label="All levels" value={lvl} onChange={setLvl} options={LEVELS.map((l) => ({ value: l, label: l }))} />
      </div>
      <Card>
        {rows.length ? <div className="adm-tw"><table>
          <thead><tr><th>Submitted</th><th>Student</th><th>Department</th><th>Level</th><th>Subjects of interest</th><th>Phone (optional)</th><th>Status</th></tr></thead>
          <tbody>{rows.map((t) => (
            <tr key={t.id}>
              <td>{fmtDate(t.submittedAt)}</td>
              <td><div className="adm-t">{t.name}</div><div className="adm-m">{t.email}</div></td>
              <td>{t.dept}</td><td>{t.level}</td><td>{t.subjects}</td>
              <td>{t.phone ? (revealed.includes(t.id) ? t.phone : <>{mask(t.phone)} <button className="adm-link" onClick={() => { setRevealed([...revealed, t.id]); audit("Viewed a student’s phone number in Tutorial interests"); }}>Show</button></>) : <span className="adm-m">Not provided</span>}</td>
              <td><div style={{ display: "grid", gap: 6, justifyItems: "start" }}><Badge kind={KIND[t.status]}>{LABEL[t.status]}</Badge>
                <select aria-label={`Change status for ${t.name}`} className="adm-in adm-sel adm-fsel" style={{ height: 32, minWidth: 130 }} value={t.status} onChange={(e) => change(t, e.target.value as TutorialStatus)}>
                  {(["new", "contacted", "resolved"] as const).map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}</select></div></td>
            </tr>))}</tbody></table></div>
          : <EmptyState title={`No ${LABEL[tab].toLowerCase()} requests`} text="Nothing matches this tab and these filters." />}
      </Card>
    </>
  );
}
