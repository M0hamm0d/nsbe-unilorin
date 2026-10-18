"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { dateParts, type ChapterEvent } from "@/lib/events";

const PAGE_SIZE = 6;

export default function PastEvents({ events }: { events: ChapterEvent[] }) {
  const [year, setYear] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const years = useMemo(
    () => Array.from(new Set(events.map((e) => e.date.slice(0, 4)))).sort((a, b) => b.localeCompare(a)),
    [events]
  );
  const filtered = useMemo(() => events.filter((e) => year === "all" || e.date.startsWith(year)), [events, year]);

  if (!events.length) return null;

  return (
    <section id="past" className="ev-past">
      <div className="container">
        <div className="ev-head">
          <div>
            <p className="eyebrow">Past events</p>
            <h2 className="ev-h2">What we’ve done</h2>
          </div>
          <div className="ev-year">
            <label htmlFor="ev-year">Year</label>
            <select id="ev-year" value={year} onChange={(e) => { setYear(e.target.value); setVisible(PAGE_SIZE); }}>
              <option value="all">All years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="ev-grid">
          {filtered.slice(0, visible).map((e) => {
            const d = dateParts(e.date);
            return (
              <article className="ev-card" key={e.id}>
                <span className="ev-status ev-status--past">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>
                  Past event
                </span>
                <p className="ev-card__date">{d.day} {d.month} {d.year}</p>
                <h3 className="ev-name">{e.name}</h3>
                <p className="ev-meta">{[e.venue, e.organizer].filter(Boolean).join(" · ")}</p>
                <Link href={`/events/${e.slug}`} className="link ev-card__link">
                  View recap<span className="sr-only"> of {e.name}</span>
                </Link>
              </article>
            );
          })}
        </div>

        {visible < filtered.length && (
          <div className="ev-more">
            <button type="button" className="ev-open ev-open--btn" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load more past events
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
