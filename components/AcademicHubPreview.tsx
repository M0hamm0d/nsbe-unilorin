"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DEPARTMENTS,
  LEVELS,
  RESOURCE_TYPES,
  type Resource,
  type ResourceType,
} from "@/lib/academic-resources";

const TABS = RESOURCE_TYPES.map((resourceType) => resourceType.tab);

export default function AcademicHubPreview({ initialResources = [] }: { initialResources?: Resource[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Past questions");
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [level, setLevel] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const activeType = RESOURCE_TYPES.find((resourceType) => resourceType.tab === tab)?.value as ResourceType;

  const deptName = (value: string) =>
    DEPARTMENTS.find((department) =>
      department.slug === value.toLowerCase() ||
      department.name.toLowerCase() === value.toLowerCase()
    )?.name ?? value;

  const suggestions = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return initialResources
      .filter((resource) =>
        `${resource.code} ${resource.title} ${deptName(resource.dept)} ${resource.detail}`
          .toLowerCase()
          .includes(query)
      )
      .sort((a, b) => a.code.localeCompare(b.code))
      .slice(0, 6);
  }, [initialResources, q]);

  const results = useMemo(
    () =>
      initialResources.filter(
        (resource) =>
          resource.type === activeType &&
          (!dept || deptName(resource.dept) === dept) &&
          (!level || resource.level === level) &&
          `${resource.code} ${resource.title} ${resource.detail}`.toLowerCase().includes(q.toLowerCase())
      ),
    [activeType, initialResources, q, dept, level]
  );

  return (
    <div className="panel">
      <div className="field home-hub-search">
        <label htmlFor="hub-search">Search</label>
        <input
          id="hub-search"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={suggestionsOpen && suggestions.length > 0}
          aria-controls="hub-search-suggestions"
          placeholder="Course code, course name or topic"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSuggestionsOpen(true);
          }}
          onFocus={() => setSuggestionsOpen(true)}
          onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 150)}
        />
        {suggestionsOpen && suggestions.length > 0 && (
          <ul className="home-hub-suggestions" id="hub-search-suggestions" role="listbox">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} role="option" aria-selected="false">
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setQ(`${suggestion.code} ${suggestion.title}`);
                    setSuggestionsOpen(false);
                  }}
                >
                  <b>{suggestion.code}</b>
                  <span>{suggestion.title}</span>
                  <small>{deptName(suggestion.dept)} · {suggestion.level}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="fields-row">
        <div className="field">
          <label htmlFor="hub-dept">Department</label>
          <select id="hub-dept" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((department) => <option key={department.slug}>{department.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="hub-level">Level</label>
          <select id="hub-level" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">All levels</option>
            {LEVELS.map((level) => <option key={level}>{level}</option>)}
          </select>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((tabName) => (
          <button key={tabName} className="tab" aria-pressed={tab === tabName} onClick={() => setTab(tabName)}>{tabName}</button>
        ))}
      </div>

      {results.length ? (
        results.slice(0, 3).map((r) => (
          <div className="resource" key={r.id}>
            <div>
              <div className="resource__title">{r.code} — {r.title}</div>
              <div className="resource__meta">{r.type} · {r.level} · {r.detail} · PDF</div>
            </div>
            {r.available && r.href && r.href !== "#" && r.href.startsWith("http") ? (
              <a href={r.href} target="_blank" rel="noopener noreferrer" className="link">
                Open PDF<span className="sr-only"> {r.title}</span>
              </a>
            ) : (
              <Link href="/academic-hub" className="link">
                Open<span className="sr-only"> {r.title} in the Academic Hub</span>
              </Link>
            )}
          </div>
        ))
      ) : (
        <p className="empty">No resources match your filters yet.</p>
      )}
    </div>
  );
}
