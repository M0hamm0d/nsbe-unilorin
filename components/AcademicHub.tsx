"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DEPARTMENTS,
  LEVELS,
  RESOURCES,
  RESOURCE_TYPES,
  type Resource,
  type ResourceType,
} from "@/lib/academic-resources";

const PAGE_SIZE = 6;
type Sort = "newest" | "code" | "title";

const typeLabel = (t: ResourceType) => RESOURCE_TYPES.find((x) => x.value === t)!.label;
const deptName = (slug: string) => DEPARTMENTS.find((d) => d.slug === slug)?.name ?? slug;

export default function AcademicHub({ initialResources }: { initialResources?: Resource[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ResourceType>("past-question");
  const [levels, setLevels] = useState<string[]>([]);
  const [depts, setDepts] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Restore state from the URL once on mount
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("type") as ResourceType | null;
    if (t && RESOURCE_TYPES.some((x) => x.value === t)) setType(t);
    setQuery(p.get("q") ?? "");
    setLevels(p.get("level")?.split(",").filter((l) => (LEVELS as readonly string[]).includes(l)) ?? []);
    setDepts(p.get("dept")?.split(",").filter((d) => DEPARTMENTS.some((x) => x.slug === d)) ?? []);
    const s = p.get("sort") as Sort | null;
    if (s === "code" || s === "title") setSort(s);
    setReady(true);
  }, []);

  // Keep the URL in sync so filters survive opening a resource and coming back
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (type !== "past-question") p.set("type", type);
    if (levels.length) p.set("level", levels.join(","));
    if (depts.length) p.set("dept", depts.join(","));
    if (sort !== "newest") p.set("sort", sort);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [ready, query, type, levels, depts, sort]);

  // Reset pagination whenever the filters change
  useEffect(() => setVisible(PAGE_SIZE), [query, type, levels, depts, sort]);

  const sourceData = initialResources && initialResources.length > 0 ? initialResources : RESOURCES;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = sourceData.filter(
      (r) =>
        r.type === type &&
        (!levels.length || levels.includes(r.level)) &&
        (!depts.length || depts.includes(r.dept.toLowerCase())) &&
        (!q || `${r.code} ${r.title} ${deptName(r.dept)} ${r.detail}`.toLowerCase().includes(q))
    );
    return [...list].sort((a, b) =>
      sort === "newest" ? b.year - a.year || a.code.localeCompare(b.code)
      : sort === "code" ? a.code.localeCompare(b.code)
      : a.title.localeCompare(b.title)
    );
  }, [sourceData, query, type, levels, depts, sort]);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const activeCount = levels.length + depts.length + (query ? 1 : 0);
  const clearAll = () => { setQuery(""); setLevels([]); setDepts([]); };

  return (
    <div className="academic-hub-page">
      {/* Intro */}
      <section className="ah-intro">
        <div className="container ah-intro__grid">
          <div>
            <p className="eyebrow">Academic Hub</p>
            <h1 className="ah-title">Find the past question you need, fast.</h1>
          </div>
          <div>
            <p className="lead ah-lead">
              Approved past questions, lecture materials and final-year project work across all 10 engineering departments, 100L to 500L. Every resource is checked by chapter executives before it is published.
            </p>
            <div className="ah-search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
              <label htmlFor="ah-q" className="sr-only">Search resources</label>
              <input id="ah-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Course code, course name or topic, e.g. CPE 311" />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="ah-body">
        <div className="container ah-body__grid">
          {/* Filters */}
          <aside className="ah-side" aria-label="Filters">
            <button
              type="button"
              className="ah-filter-toggle"
              aria-expanded={filtersOpen}
              aria-controls="ah-filters"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <span>Filters{activeCount ? ` (${activeCount})` : ""}</span>
              <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
            </button>

            <div id="ah-filters" className={`ah-panel${filtersOpen ? " is-open" : ""}`}>
              <div className="ah-panel__head">
                <h2>Filters</h2>
                <button type="button" className="ah-clear" onClick={clearAll}>Clear all</button>
              </div>

              <fieldset className="ah-group">
                <legend>Resource type</legend>
                {RESOURCE_TYPES.map((t) => (
                  <label className="ah-opt" key={t.value}>
                    <input type="radio" name="type" checked={type === t.value} onChange={() => setType(t.value)} />
                    {t.tab}
                  </label>
                ))}
              </fieldset>

              <fieldset className="ah-group">
                <legend>Level</legend>
                <div className="ah-levels">
                  {LEVELS.map((l) => (
                    <button key={l} type="button" className="ah-chip" aria-pressed={levels.includes(l)} onClick={() => toggle(levels, setLevels, l)}>
                      {l}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="ah-group">
                <legend>Department</legend>
                {DEPARTMENTS.map((d) => (
                  <label className="ah-opt" key={d.slug}>
                    <input type="checkbox" checked={depts.includes(d.slug)} onChange={() => toggle(depts, setDepts, d.slug)} />
                    {d.name}
                  </label>
                ))}
              </fieldset>

              <p className="ah-fineprint">Department names are placeholders until the chapter confirms the official list.</p>
            </div>
          </aside>

          {/* Results */}
          <div className="ah-main">
            <div className="ah-tabs" role="group" aria-label="Resource type">
              {RESOURCE_TYPES.map((t) => (
                <button key={t.value} type="button" className="ah-tab" aria-pressed={type === t.value} onClick={() => setType(t.value)}>
                  {t.tab}
                </button>
              ))}
            </div>

            <div className="ah-summary">
              <div className="ah-summary__left" aria-live="polite">
                <strong>{results.length} {results.length === 1 ? "resource" : "resources"}</strong>
                {query && <FilterPill label={`“${query}”`} onRemove={() => setQuery("")} />}
                {depts.map((d) => <FilterPill key={d} label={deptName(d)} onRemove={() => toggle(depts, setDepts, d)} />)}
                {levels.map((l) => <FilterPill key={l} label={l} onRemove={() => toggle(levels, setLevels, l)} />)}
              </div>
              <label className="ah-sort">
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                  <option value="newest">Newest session</option>
                  <option value="code">Course code</option>
                  <option value="title">Title A–Z</option>
                </select>
              </label>
            </div>

            {results.length ? (
              <>
                <ul className="ah-list">
                  {results.slice(0, visible).map((r) => <ResourceRow key={r.id} r={r} />)}
                </ul>
                <div className="ah-foot">
                  <p className="note" style={{ margin: 0 }}>
                    Showing {Math.min(visible, results.length)} of {results.length}. This library is still growing and may not cover every course yet.
                  </p>
                  {visible < results.length && (
                    <button type="button" className="ah-btn-outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Load more</button>
                  )}
                </div>
              </>
            ) : (
              <div className="ah-empty">
                <h3>No resources match these filters</h3>
                <p>Try removing a filter or searching by course code. If the material isn’t here yet, you can ask the executives to add it.</p>
                <div className="ah-empty__actions">
                  <button type="button" className="btn" onClick={clearAll}>Clear filters</button>
                  <Link href="/request-resource" className="link">Request a resource</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Request band */}
      <section className="ah-request">
        <div className="container">
          <div className="ah-request__card">
            <div>
              <p className="eyebrow eyebrow--light">Missing something?</p>
              <h2>Can’t find a past question or material?</h2>
              <p>Tell us the course and session. Executives review every request before adding new resources.</p>
            </div>
            <Link href="/request-resource" className="btn">Request a resource</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="ah-pill">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove filter ${label}`}>✕</button>
    </span>
  );
}

function ResourceRow({ r }: { r: Resource }) {
  const isDownloadable = Boolean(r.available && r.href && r.href !== "#" && r.href.startsWith("http"));

  return (
    <li className="ah-row">
      <div className="ah-row__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
      </div>
      <div className="ah-row__body">
        <p className="ah-row__meta">
          <b>{r.code}</b> · {r.level} · <span className="ah-tag">{typeLabel(r.type)}</span> · {r.detail}
        </p>
        <h3 className="ah-row__title">{r.title}</h3>
        {!isDownloadable && <p className="ah-row__warn">This file is being uploaded by the executives. Check back soon.</p>}
      </div>
      <span className="ah-row__fmt">{r.format} · {r.size}</span>
      {isDownloadable ? (
        <a href={r.href} target="_blank" rel="noopener noreferrer" className="ah-open">Open PDF<span className="sr-only"> {r.title}</span></a>
      ) : (
        <span className="ah-open ah-open--off" title="Pending executive upload">Pending upload</span>
      )}
    </li>
  );
}
