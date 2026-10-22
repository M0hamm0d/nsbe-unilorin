"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminEvent } from "@/lib/admin/types";
import { nowISO, uid } from "@/lib/admin/format";
import { saveAdminEvent, deleteAdminEvent } from "@/lib/admin/actions";
import { useAdmin } from "./AdminProvider";
import { AreaField, Banner, Card, Check, ConfirmDialog, EmptyState, ImageDrop, PageHeader, StatusBadge, TextField } from "./ui";
import { EventPreview } from "./EventsManager";
import Icon from "./Icon";

const blank = (): AdminEvent => ({
  id: uid("ev"),
  title: "",
  description: "",
  date: "",
  startTime: "",
  venue: "",
  organizer: "NSBE Unilorin",
  status: "draft",
  confirmed: false,
  updatedAt: nowISO().slice(0, 10),
});

function problems(f: AdminEvent) {
  const e: Partial<Record<keyof AdminEvent, string>> = {};
  if (!f.title.trim()) e.title = "Add a title before publishing.";
  if (!f.date) e.date = "Choose the event date.";
  if (!f.startTime) e.startTime = "Add a start time.";
  if (f.endTime && f.startTime && f.endTime <= f.startTime) e.endTime = "End time must be after the start time.";
  if (!f.venue.trim()) e.venue = "Add the venue before publishing.";
  if (!f.organizer.trim()) e.organizer = "Add the organizer.";
  if (f.registrationUrl && !/^https?:\/\//i.test(f.registrationUrl)) e.registrationUrl = "Enter a full link starting with https://";
  if (!f.confirmed) e.confirmed = "Confirm the details are accurate to publish.";
  return e;
}

export default function EventEditor({
  initialEvent,
  idParam,
}: {
  initialEvent?: AdminEvent | null;
  idParam?: string;
}) {
  const router = useRouter();
  const isNew = idParam === "new";
  const { toast, audit } = useAdmin();
  const [f, setF] = useState<AdminEvent | null>(initialEvent ?? (isNew ? blank() : null));
  const [show, setShow] = useState(false);
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setF({ ...initialEvent });
    } else if (isNew) {
      setF(blank());
    }
  }, [initialEvent, isNew]);

  if (!isNew && !initialEvent && !f) {
    return (
      <EmptyState
        title="Event not found"
        text="It may have been deleted or removed."
        action={<Link href="/admin/events" className="adm-btn">Back to events</Link>}
      />
    );
  }

  if (!f) return <p className="adm-m">Loading event…</p>;

  const errs = problems(f);
  const err = (k: keyof AdminEvent) => (show ? errs[k] : undefined);
  const set = <K extends keyof AdminEvent>(k: K, v: AdminEvent[K]) => setF({ ...f, [k]: v });
  const saved = Boolean(initialEvent);

  async function save(next: AdminEvent, msg: string) {
    const rec = { ...next, updatedAt: nowISO().slice(0, 10) };
    setF(rec);
    audit(`${msg} ${rec.title || "an event"}`);
    toast(msg === "Published" ? "Published. It now appears on the public Events page." : "Saved.");
    const res = await saveAdminEvent(rec);
    if (res?.ok) {
      router.push("/admin/events");
    }
  }

  function saveDraft() {
    if (!f!.title.trim()) {
      setShow(true);
      return toast("Add a title to save this event.", "bad");
    }
    save(f!, f!.status === "published" ? "Updated" : "Saved draft of");
  }

  function publish() {
    setShow(true);
    if (Object.keys(errs).length) return toast("Complete the checklist before publishing.", "bad");
    save({ ...f!, status: "published" }, "Published");
  }

  const list: [string, boolean][] = [
    ["Title", !errs.title],
    ["Date and start time", !errs.date && !errs.startTime],
    ["Venue", !errs.venue],
    ["Organizer", !errs.organizer],
    ["Accuracy confirmed", !errs.confirmed],
  ];

  return (
    <>
      <PageHeader
        title={isNew && !saved ? "Create event" : "Edit event"}
        sub={saved ? `Last saved ${f.updatedAt}` : "Not saved yet"}
      >
        <StatusBadge status={f.status} />
      </PageHeader>
      <div className="adm-grid adm-main-side">
        <Card className="adm-cp">
          <div className="adm-fg">
            <TextField
              label="Event title"
              placeholder="e.g. Engineering Career Night"
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
              error={err("title")}
            />
            <AreaField
              label="Description"
              help="Shown on the event page. Keep it factual."
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
            />
            <div className="adm-r3">
              <TextField
                label="Date"
                type="date"
                value={f.date}
                onChange={(e) => set("date", e.target.value)}
                error={err("date")}
              />
              <TextField
                label="Start time"
                type="time"
                value={f.startTime}
                onChange={(e) => set("startTime", e.target.value)}
                error={err("startTime")}
              />
              <TextField
                label="End time"
                optional
                type="time"
                value={f.endTime ?? ""}
                onChange={(e) => set("endTime", e.target.value || undefined)}
                error={err("endTime")}
              />
            </div>
            <div className="adm-r2">
              <TextField
                label="Venue"
                placeholder="Where is it happening?"
                value={f.venue}
                onChange={(e) => set("venue", e.target.value)}
                error={err("venue")}
              />
              <TextField
                label="Organizer"
                value={f.organizer}
                onChange={(e) => set("organizer", e.target.value)}
                error={err("organizer")}
              />
            </div>
            <ImageDrop
              label="Event image (optional)"
              value={f.image}
              onChange={(n) => set("image", n)}
            />
            <TextField
              label="Image description"
              optional
              placeholder="Describe the image for people using screen readers"
              value={f.imageAlt ?? ""}
              onChange={(e) => set("imageAlt", e.target.value)}
            />
            <div className="adm-r2">
              <TextField
                label="Registration link"
                optional
                placeholder="https://"
                value={f.registrationUrl ?? ""}
                onChange={(e) => set("registrationUrl", e.target.value || undefined)}
                error={err("registrationUrl")}
                help="Leave empty if registration isn’t open yet. The public page will say so."
              />
              <TextField
                label="Registration deadline"
                optional
                type="date"
                value={f.registrationDeadline ?? ""}
                onChange={(e) => set("registrationDeadline", e.target.value || undefined)}
              />
            </div>
            <Check checked={f.confirmed} onChange={(v) => set("confirmed", v)} error={err("confirmed")}>
              I have confirmed the date, time, venue and organizer are accurate.
            </Check>
          </div>
        </Card>

        <div className="adm-stack">
          <Card className="adm-cp">
            <h2>Publish</h2>
            <div className="adm-actions" style={{ marginBottom: 14 }}>
              <button className="adm-btn2" onClick={saveDraft}>
                {f.status === "published" ? "Save changes" : "Save draft"}
              </button>
              {f.status === "published" && (
                <button
                  className="adm-btn2"
                  onClick={() => {
                    save({ ...f, status: "draft" }, "Unpublished");
                  }}
                >
                  Unpublish
                </button>
              )}
              {f.status === "archived" && (
                <button
                  className="adm-btn2"
                  onClick={() => save({ ...f, status: "draft" }, "Restored")}
                >
                  Restore as draft
                </button>
              )}
            </div>
            {f.status !== "published" && (
              <button
                className="adm-btn adm-wide"
                onClick={publish}
                aria-disabled={Object.keys(errs).length > 0}
              >
                Publish event
              </button>
            )}
            <div className="adm-checklist" style={{ marginTop: 16 }}>
              {list.map(([t, ok]) => (
                <div key={t} className={ok ? "ok" : "no"}>
                  <Icon name={ok ? "ok" : "x"} size={16} />
                  {t}
                </div>
              ))}
            </div>
          </Card>
          <Card className="adm-cp">
            <h2>How it will look</h2>
            <EventPreview e={f} />
          </Card>
          {saved && (
            <Card className="adm-cp adm-danger">
              <h2 style={{ color: "var(--err)" }}>Delete event</h2>
              <p className="adm-note" style={{ marginBottom: 12 }}>You will be asked to confirm.</p>
              <button className="adm-btnd" onClick={() => setDel(true)}>Delete event…</button>
            </Card>
          )}
        </div>
      </div>
      {f.status === "published" && (
        <Banner kind="info">This event is live. Saving changes updates the public Events page.</Banner>
      )}
      <ConfirmDialog
        open={del}
        danger
        title={`Delete “${f.title}”?`}
        confirmLabel="Delete permanently"
        onCancel={() => setDel(false)}
        extra={
          <button
            className="adm-btn2"
            onClick={async () => {
              const next = { ...f, status: "archived" as const };
              audit(`Archived ${f.title}`);
              await saveAdminEvent(next);
              router.push("/admin/events");
            }}
          >
            Archive instead
          </button>
        }
        onConfirm={async () => {
          audit(`Deleted event ${f.title}`);
          toast("Event deleted.");
          await deleteAdminEvent(f.id);
          router.push("/admin/events");
        }}
      >
        This permanently removes the event from the admin and the public Events page. It cannot be undone. Archive it instead to keep a record.
      </ConfirmDialog>
    </>
  );
}
