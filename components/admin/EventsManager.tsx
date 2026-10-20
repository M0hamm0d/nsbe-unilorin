"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMockCollection } from "@/lib/admin/use-mock";
import { EVENTS } from "@/lib/admin/mock-data";
import type { AdminEvent } from "@/lib/admin/types";
import { fmtDate, fmtTime, isPast, nowISO } from "@/lib/admin/format";
import { useAdmin } from "./AdminProvider";
import { Badge, ConfirmDialog, Dialog, EmptyState, FilterSelect, PageHeader, SearchBox, StatusBadge, Tabs } from "./ui";
import Icon from "./Icon";

type Tab = "published" | "drafts" | "past" | "archived";
export const regState = (e: AdminEvent): "open" | "closed" | "none" =>
  !e.registrationUrl ? "none" : isPast(e.date) || (e.registrationDeadline && isPast(e.registrationDeadline)) ? "closed" : "open";

export function EventPreview({ e }: { e: AdminEvent }) {
  const d = e.date ? e.date.split("-") : null;
  const reg = regState(e);
  return (
    <div className="adm-prev">
      <div className="adm-prev__d">{d ? d[2] : "—"}<small>{d ? fmtDate(e.date).split(" ")[1] : "Date"}</small></div>
      <div>
        <Badge kind={e.date && isPast(e.date) ? "past" : "pub"}>{e.date && isPast(e.date) ? "Past event" : "Upcoming"}</Badge>
        <div className="adm-t" style={{ margin: "6px 0 2px" }}>{e.title || "Untitled event"}</div>
        <div className="adm-note">{[fmtTime(e.startTime) || "Time to be confirmed", e.venue || "Venue to be confirmed", e.organizer].join(" · ")}</div>
        <div className="adm-note" style={{ marginTop: 6 }}>{reg === "open" ? "Register link shown" : reg === "closed" ? "Registration closed" : "Registration not open yet"}</div>
      </div>
    </div>
  );
}

export default function EventsManager() {
  const { items, update, remove, ready } = useMockCollection<AdminEvent>("events", EVENTS);
  const { toast, audit } = useAdmin();
  const [tab, setTab] = useState<Tab>("published");
  const [q, setQ] = useState(""); const [org, setOrg] = useState(""); const [reg, setReg] = useState("");
  const [del, setDel] = useState<AdminEvent | null>(null);
  const [prev, setPrev] = useState<AdminEvent | null>(null);

  const inTab = (e: AdminEvent, t: Tab) =>
    t === "published" ? e.status === "published" && !isPast(e.date)
    : t === "past" ? e.status === "published" && isPast(e.date)
    : t === "drafts" ? e.status === "draft" : e.status === "archived";
  const count = (t: Tab) => items.filter((e) => inTab(e, t)).length;
  const organizers = useMemo(() => Array.from(new Set(items.map((e) => e.organizer))).map((o) => ({ value: o, label: o })), [items]);

  const rows = items.filter((e) => inTab(e, tab) &&
    (!org || e.organizer === org) && (!reg || regState(e) === reg) &&
    `${e.title} ${e.venue} ${e.organizer}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (tab === "past" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));

  function setStatus(e: AdminEvent, status: AdminEvent["status"], msg: string) {
    update(e.id, { status, updatedAt: nowISO().slice(0, 10) });
    audit(`${msg} ${e.title}`);
    toast(`${msg} “${e.title}”.`);
  }

  return (
    <>
      <PageHeader title="Events" sub="Create, publish and archive chapter events. Changes appear on the public Events page.">
        <Link href="/admin/events/new" className="adm-btn"><Icon name="cal" size={16} /> Create event</Link>
      </PageHeader>
      <Tabs value={tab} onChange={setTab} items={[
        { id: "published", label: "Published", count: count("published") }, { id: "drafts", label: "Drafts", count: count("drafts") },
        { id: "past", label: "Past", count: count("past") }, { id: "archived", label: "Archived", count: count("archived") }]} />
      <div className="adm-filters">
        <SearchBox value={q} onChange={setQ} placeholder="Search events by title, venue or organizer" />
        <FilterSelect label="All organizers" value={org} onChange={setOrg} options={organizers} />
        <FilterSelect label="All registration states" value={reg} onChange={setReg} options={[{ value: "open", label: "Registration open" }, { value: "closed", label: "Registration closed" }, { value: "none", label: "No link set" }]} />
      </div>

      <section className="adm-card">
        {rows.length ? (
          <div className="adm-tw"><table>
            <thead><tr><th>Event</th><th>Date &amp; time</th><th>Venue</th><th>Status</th><th>Registration</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>{rows.map((e) => {
              const r = regState(e);
              return (
                <tr key={e.id}>
                  <td><div className="adm-t">{e.title}</div><div className="adm-m">{e.organizer}</div></td>
                  <td>{e.date ? `${fmtDate(e.date)} · ${fmtTime(e.startTime)}` : "Not scheduled"}</td>
                  <td>{e.venue || <span className="adm-m">Not set</span>}</td>
                  <td>{e.status === "published" ? <Badge kind={isPast(e.date) ? "past" : "pub"}>{isPast(e.date) ? "Published · Past" : "Published · Upcoming"}</Badge> : <StatusBadge status={e.status} />}</td>
                  <td>{r === "open" ? <span style={{ color: "var(--gt)", fontWeight: 600 }}>Open{e.registrationDeadline ? ` · closes ${fmtDate(e.registrationDeadline)}` : ""}</span> : r === "closed" ? <span className="adm-m">Closed</span> : <span className="adm-m">No link set</span>}</td>
                  <td>{fmtDate(e.updatedAt)}</td>
                  <td><div className="adm-actions">
                    <Link href={`/admin/events/${e.id}`} className="adm-btn2 adm-sm">Edit</Link>
                    <button className="adm-btn2 adm-sm" onClick={() => setPrev(e)}>Preview</button>
                    {e.status === "published" && <button className="adm-btn2 adm-sm" onClick={() => setStatus(e, "draft", "Unpublished")}>Unpublish</button>}
                    {e.status !== "archived" ? <button className="adm-btn2 adm-sm" onClick={() => setStatus(e, "archived", "Archived")}>Archive</button> : <button className="adm-btn2 adm-sm" onClick={() => setStatus(e, "draft", "Restored")}>Restore</button>}
                    <button className="adm-btnd adm-sm" onClick={() => setDel(e)}>Delete</button>
                  </div></td>
                </tr>);
            })}</tbody></table></div>
        ) : <EmptyState title={ready ? "No events here" : "Loading…"} text="Nothing matches this tab and these filters." action={<button className="adm-btn2" onClick={() => { setQ(""); setOrg(""); setReg(""); }}>Clear filters</button>} />}
      </section>
      <p className="adm-note">An event is labelled Past once its date has gone. Registration shows Open, Closed or No link set from the registration link and deadline.</p>

      <Dialog open={!!prev} title="How it looks on the public page" onClose={() => setPrev(null)} footer={<button className="adm-btn2" onClick={() => setPrev(null)}>Close</button>}>
        {prev && <EventPreview e={prev} />}
      </Dialog>
      <ConfirmDialog open={!!del} danger title={`Delete “${del?.title ?? ""}”?`} confirmLabel="Delete permanently" onCancel={() => setDel(null)}
        extra={del && del.status !== "archived" ? <button className="adm-btn2" onClick={() => { setStatus(del, "archived", "Archived"); setDel(null); }}>Archive instead</button> : null}
        onConfirm={() => { if (!del) return; remove(del.id); audit(`Deleted event ${del.title}`); toast(`Deleted “${del.title}”.`); setDel(null); }}>
        This permanently removes the event from the admin and the public Events page. It cannot be undone. Archive it instead to keep a record.
      </ConfirmDialog>
    </>
  );
}
