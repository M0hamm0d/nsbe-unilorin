"use client";

import Link from "next/link";
import { useAdmin } from "./AdminProvider";
import { Badge, Card, CardHead, PageHeader } from "./ui";
import Icon from "./Icon";
import { useMockCollection, resetMockData } from "@/lib/admin/use-mock";
import { AUDIT, EVENTS, PROGRAMS, PROJECTS, RESOURCES, TUTORIALS } from "@/lib/admin/mock-data";
import { can } from "@/lib/admin/permissions";
import { fmtDate, fmtTime, isPast } from "@/lib/admin/format";
import type { AdminEvent, AuditEntry, Program, Project, Resource, TutorialInterest } from "@/lib/admin/types";

const regLabel = (e: AdminEvent) =>
  !e.registrationUrl ? "No link set" : e.registrationDeadline && e.registrationDeadline < new Date().toISOString().slice(0, 10) ? "Closed" : e.registrationDeadline ? `Open · closes ${fmtDate(e.registrationDeadline)}` : "Open";

export default function Dashboard() {
  const { user } = useAdmin();
  const ev = useMockCollection<AdminEvent>("events", EVENTS).items;
  const pg = useMockCollection<Program>("programs", PROGRAMS).items;
  const rs = useMockCollection<Resource>("resources", RESOURCES).items;
  const pj = useMockCollection<Project>("projects", PROJECTS).items;
  const ti = useMockCollection<TutorialInterest>("tutorials", TUTORIALS).items;
  const au = useMockCollection<AuditEntry>("audit", AUDIT).items;
  const r = user.role;

  const upcoming = ev.filter((e) => e.status === "published" && !isPast(e.date)).sort((a, b) => a.date.localeCompare(b.date));
  const recent = [
    ...ev.filter((x) => x.status === "published").map((x) => ({ t: x.title, k: "Event", d: x.updatedAt })),
    ...pg.filter((x) => x.status === "published").map((x) => ({ t: x.title, k: "Program", d: x.updatedAt })),
    ...rs.filter((x) => x.status === "published").map((x) => ({ t: `${x.code} ${x.title}`, k: "Academic resource", d: x.updatedAt })),
    ...pj.filter((x) => x.status === "published").map((x) => ({ t: x.title, k: "Final-year project", d: x.updatedAt })),
  ].sort((a, b) => b.d.localeCompare(a.d)).slice(0, 4);

  const drafts = [
    ...ev.filter((x) => x.status === "draft").map((x) => ({ t: x.title, k: "Event", href: `/admin/events/${x.id}`, why: !x.date ? "Missing date" : !x.venue ? "Missing venue" : "Needs confirming" })),
    ...pg.filter((x) => x.status === "draft").map((x) => ({ t: x.title, k: "Program", href: "/admin/programs", why: !x.image ? "Missing image" : "Ready to review" })),
    ...rs.filter((x) => x.status === "draft").map((x) => ({ t: `${x.code} ${x.title}`, k: "Resource", href: `/admin/resources/${x.id}`, why: !x.fileName ? "File not uploaded" : "Ready to review" })),
    ...pj.filter((x) => x.status === "draft").map((x) => ({ t: x.title, k: "Project", href: "/admin/projects", why: !x.abstract ? "Missing abstract" : "Review needed" })),
  ].filter((d) => (d.k === "Event" || d.k === "Program" ? can(r, d.k === "Event" ? "events" : "programs") : true));
  const newTut = ti.filter((x) => x.status === "new");

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} sub="Here is what needs your attention today.">
        <Link href="/" target="_blank" className="adm-btn2"><Icon name="up" size={16} /> Preview public site</Link>
      </PageHeader>

      <div className="adm-actions">
        {can(r, "events") && <Link href="/admin/events/new" className="adm-btn"><Icon name="cal" size={16} /> Create event</Link>}
        {can(r, "resources") && <Link href="/admin/resources/new" className="adm-btn"><Icon name="book" size={16} /> Add resource</Link>}
        {can(r, "programs") && <Link href="/admin/programs?new=1" className="adm-btn"><Icon name="spark" size={16} /> Publish program</Link>}
      </div>

      <div className="adm-grid adm-g3">
        {can(r, "events") && <Card className="adm-cp"><div className="adm-m">Upcoming events</div><div className="adm-stat">{upcoming.length}</div></Card>}
        <Card className="adm-cp"><div className="adm-m">Drafts to finish</div><div className="adm-stat">{drafts.length}</div></Card>
        {can(r, "tutorials") && <Card className="adm-cp"><div className="adm-m">New tutorial requests</div><div className="adm-stat">{newTut.length}</div></Card>}
      </div>

      <div className="adm-grid adm-main-side">
        <div className="adm-stack">
          {can(r, "events") && (
            <Card>
              <CardHead title="Upcoming events"><Link className="adm-link" href="/admin/events">Manage events</Link></CardHead>
              {upcoming.length ? (
                <div className="adm-tw"><table><thead><tr><th>Event</th><th>Date</th><th>Registration</th></tr></thead><tbody>
                  {upcoming.slice(0, 3).map((e) => (
                    <tr key={e.id}><td><div className="adm-t">{e.title}</div><div className="adm-m">{e.organizer}</div></td><td>{fmtDate(e.date)} · {fmtTime(e.startTime)}</td><td>{regLabel(e)}</td></tr>
                  ))}
                </tbody></table></div>
              ) : <div className="adm-li"><span className="adm-m">No upcoming events. Create one to show it on the public Events page.</span></div>}
            </Card>
          )}
          <Card>
            <CardHead title="Recently published" />
            {recent.map((x) => (
              <div className="adm-li" key={x.k + x.t}><div><div className="adm-t">{x.t}</div><div className="adm-note">{x.k} · {fmtDate(x.d)}</div></div><Badge kind="pub">Published</Badge></div>
            ))}
          </Card>
        </div>
        <div className="adm-stack">
          <Card>
            <CardHead title="Drafts waiting"><span className="adm-note">{drafts.length}</span></CardHead>
            {drafts.length ? drafts.slice(0, 5).map((d) => (
              <div className="adm-li" key={d.k + d.t}><div><div className="adm-t">{d.t}</div><div className="adm-note">{d.k} · {d.why}</div></div><Link href={d.href} className="adm-link">Continue</Link></div>
            )) : <div className="adm-li"><span className="adm-m">No drafts. Nice work.</span></div>}
          </Card>
          {can(r, "tutorials") && (
            <Card>
              <CardHead title="Tutorial interest needing attention" />
              {newTut.length ? newTut.slice(0, 3).map((t) => (
                <div className="adm-li" key={t.id}><div><div className="adm-t">{t.name}</div><div className="adm-note">{t.dept} · {t.level} · {t.subjects}</div></div><Badge kind="new">New</Badge></div>
              )) : <div className="adm-li"><span className="adm-m">No new requests.</span></div>}
              <div className="adm-li"><Link href="/admin/tutorial-interests" className="adm-link">Review all new requests</Link></div>
            </Card>
          )}
          <Card>
            <CardHead title="Recent activity" />
            {au.slice(0, 5).map((a) => (
              <div className="adm-li" key={a.id}><div><span className="adm-t">{a.actor}</span> {a.text.charAt(0).toLowerCase() + a.text.slice(1)}<div className="adm-note">{a.at}</div></div></div>
            ))}
          </Card>
          <button type="button" className="adm-link" style={{ justifySelf: "start" }} onClick={resetMockData}>Reset demo data</button>
        </div>
      </div>
    </>
  );
}
