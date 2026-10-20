"use client";

import { useState } from "react";
import { useMockCollection } from "@/lib/admin/use-mock";
import { JOINS } from "@/lib/admin/mock-data";
import type { JoinRequest, JoinStatus } from "@/lib/admin/types";
import { DEPARTMENTS, LEVELS } from "@/lib/academic-resources";
import { fmtDate } from "@/lib/admin/format";
import { useAdmin } from "./AdminProvider";
import { Badge, Banner, Card, Chips, EmptyState, FilterSelect, PageHeader, SearchBox, Tabs } from "./ui";

const LABEL: Record<JoinStatus, string> = { new: "New", in_progress: "In progress", resolved: "Resolved" };
const KIND = { new: "new", in_progress: "warn", resolved: "done" } as const;
const FROM = (l: string) => (Object.keys(LABEL) as JoinStatus[]).find((k) => LABEL[k] === l) as JoinStatus;

export default function JoinInbox() {
  const { items, update } = useMockCollection<JoinRequest>("joins", JOINS);
  const { toast, audit } = useAdmin();
  const [tab, setTab] = useState<JoinStatus>("new");
  const [q, setQ] = useState(""); const [dept, setDept] = useState(""); const [lvl, setLvl] = useState("");
  const [sel, setSel] = useState<string | null>(null);

  const count = (s: JoinStatus) => items.filter((t) => t.status === s).length;
  const rows = items.filter((t) => t.status === tab && (!dept || t.dept === dept) && (!lvl || t.level === lvl) && `${t.name} ${t.email}`.toLowerCase().includes(q.toLowerCase()));
  const cur = items.find((x) => x.id === sel) ?? null;

  return (
    <>
      <PageHeader title="Join requests" sub="People who asked to join the chapter through the public form." />
      <Banner><div><b>Private.</b> Only authorized executives can see these details. Contact messages will appear here once the public contact form is live.</div></Banner>
      <Tabs value={tab} onChange={(t) => { setTab(t); setSel(null); }} items={(["new", "in_progress", "resolved"] as const).map((s) => ({ id: s, label: LABEL[s], count: count(s) }))} />
      <div className="adm-filters">
        <SearchBox value={q} onChange={setQ} placeholder="Search by name or email" />
        <FilterSelect label="All departments" value={dept} onChange={setDept} options={DEPARTMENTS.map((d) => ({ value: d.name, label: d.name }))} />
        <FilterSelect label="All levels" value={lvl} onChange={setLvl} options={LEVELS.map((l) => ({ value: l, label: l }))} />
      </div>
      <div className="adm-grid adm-main-side-w">
        <Card>{rows.length ? <div className="adm-tw"><table>
          <thead><tr><th>Submitted</th><th>Person</th><th>Department</th><th>Level</th><th>Interests</th><th>Status</th><th /></tr></thead>
          <tbody>{rows.map((t) => (
            <tr key={t.id} style={sel === t.id ? { background: "var(--bg)" } : undefined}>
              <td>{fmtDate(t.submittedAt)}</td><td><div className="adm-t">{t.name}</div><div className="adm-m">{t.email}</div></td>
              <td>{t.dept}</td><td>{t.level}</td><td>{t.interests.join(", ") || "—"}</td><td><Badge kind={KIND[t.status]}>{LABEL[t.status]}</Badge></td>
              <td><button className="adm-btn2 adm-sm" onClick={() => setSel(t.id)}>Open</button></td>
            </tr>))}</tbody></table></div> : <EmptyState title="No requests here" text="Nothing matches this tab and these filters." />}</Card>
        {cur && (
          <Card className="adm-cp"><h2>Request details</h2>
            <div className="adm-fg">
              <div><div className="adm-t" style={{ fontSize: 16 }}>{cur.name}</div><div className="adm-note">Submitted {fmtDate(cur.submittedAt)}</div></div>
              <dl className="adm-kv"><dt>Email</dt><dd>{cur.email}</dd><dt>Department</dt><dd>{cur.dept}</dd><dt>Level</dt><dd>{cur.level}</dd><dt>Phone</dt><dd>{cur.phone ?? "Not provided"}</dd><dt>Interested in</dt><dd>{cur.interests.join(", ") || "Not specified"}</dd></dl>
              <Chips label="Status" options={Object.values(LABEL)} value={LABEL[cur.status]} onChange={(l) => { update(cur.id, { status: FROM(l) }); audit(`Marked a join request as ${l}`); toast(`Marked as ${l}.`); }} />
            </div>
          </Card>)}
      </div>
    </>
  );
}
