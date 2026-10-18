"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const TABS = ["Past questions", "Lecture materials", "Final-year projects"] as const;
const DEPARTMENTS = [
  "Agricultural & Biosystems", "Biomedical", "Chemical", "Civil", "Computer",
  "Electrical & Electronics", "Food", "Materials & Metallurgical", "Mechanical", "Water Resources",
];
const LEVELS = ["100L", "200L", "300L", "400L", "500L"];

const RESOURCES = [
  { code: "MEE 301", title: "Fluid Mechanics II", type: TABS[0], dept: "Mechanical", level: "300L", meta: "2022/2023 · PDF" },
  { code: "EEE 281", title: "Circuit Theory I", type: TABS[0], dept: "Electrical & Electronics", level: "200L", meta: "2023/2024 · PDF" },
  { code: "CVE 401", title: "Structural Analysis", type: TABS[1], dept: "Civil", level: "400L", meta: "Lecture notes · PDF" },
  { code: "CPE 311", title: "Data Structures & Algorithms", type: TABS[1], dept: "Computer", level: "300L", meta: "Slides · PDF" },
  { code: "FDE 502", title: "Design of a Cassava Flour Processing Plant", type: TABS[2], dept: "Food", level: "500L", meta: "2024 session · PDF" },
  { code: "CHE 201", title: "Material & Energy Balances", type: TABS[0], dept: "Chemical", level: "200L", meta: "2022/2023 · PDF" },
];

export default function AcademicHubPreview() {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [level, setLevel] = useState("");

  const results = useMemo(
    () =>
      RESOURCES.filter(
        (r) =>
          r.type === tab &&
          (!dept || r.dept === dept) &&
          (!level || r.level === level) &&
          `${r.code} ${r.title}`.toLowerCase().includes(q.toLowerCase())
      ),
    [tab, q, dept, level]
  );

  return (
    <div className="panel">
      <div className="field">
        <label htmlFor="hub-search">Search</label>
        <input id="hub-search" type="search" placeholder="Course code, course name or topic" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="fields-row">
        <div className="field">
          <label htmlFor="hub-dept">Department</label>
          <select id="hub-dept" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="hub-level">Level</label>
          <select id="hub-level" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">All levels</option>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className="tab" aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {results.length ? (
        results.slice(0, 3).map((r) => (
          <div className="resource" key={r.code}>
            <div>
              <div className="resource__title">{r.code} — {r.title}</div>
              <div className="resource__meta">{r.type} · {r.level} · {r.meta}</div>
            </div>
            <Link href="/academic-hub" className="link">Open</Link>
          </div>
        ))
      ) : (
        <p className="empty">No resources match your filters yet.</p>
      )}
    </div>
  );
}
