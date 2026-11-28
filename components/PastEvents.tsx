"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { eventDateLabel, type ChapterEvent } from "@/lib/events";
import { CalendarIcon, PinIcon } from "@/components/EventIcons";

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
            const tags = ["Past event"];
            const location = [e.venue, e.organizer].filter(Boolean).join(" · ");

            return (
              <article className="ev-card" key={e.id}>
                <div className="ev-card__media">
                  {e.image ? (
                    <Image
                      src={e.image}
                      alt={`Flyer for ${e.name}`}
                      width={640}
                      height={400}
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 360px"
                      unoptimized
                    />
                  ) : (
                    <span className="ev-card__media-empty">No image</span>
                  )}
                </div>

                <div className="ev-tags">
                  {tags.map((tag, i) => (
                    <span key={tag} className={`ev-tag ev-tag--${(i % 4) + 1}`}>{tag}</span>
                  ))}
                </div>

                <h3 className="ev-card__title">{e.name}</h3>

                <div className="ev-card__meta">
                  <p>
                    <CalendarIcon />
                    <span>{eventDateLabel(e.date, e.time)}</span>
                  </p>
                  {location && (
                    <p>
                      <PinIcon />
                      <span>{location}</span>
                    </p>
                  )}
                </div>

                <Link href={`/events/${e.slug}`} className="ev-card__cta">
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
