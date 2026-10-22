"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Resource } from "@/lib/admin/types";
import { DEPARTMENTS, LEVELS, RESOURCE_TYPES } from "@/lib/academic-resources";
import { nowISO, uid } from "@/lib/admin/format";
import { saveAdminResource, deleteAdminResource } from "@/lib/admin/actions";
import { useAdmin } from "./AdminProvider";
import { AreaField, Banner, Card, Check, Chips, ConfirmDialog, EmptyState, FieldError, PageHeader, SelectField, StatusBadge, TextField } from "./ui";
import { typeLabel } from "./ResourcesManager";
import Icon from "./Icon";

const MAX_MB = 25;
const blank = (): Resource => ({
  id: uid("rs"),
  code: "",
  title: "",
  dept: "",
  level: "",
  type: "past-question",
  session: "",
  status: "draft",
  updatedAt: nowISO().slice(0, 10),
});

type Upload = { name: string; size: number; progress: number; error?: string };

export default function ResourceEditor({
  initialResource,
  idParam,
}: {
  initialResource?: Resource | null;
  idParam?: string;
}) {
  const router = useRouter();
  const isNew = idParam === "new";
  const { toast, audit } = useAdmin();
  const [f, setF] = useState<Resource | null>(initialResource ?? (isNew ? blank() : null));
  const [up, setUp] = useState<Upload | null>(null);
  const [show, setShow] = useState(false);
  const [del, setDel] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialResource) {
      setF({ ...initialResource });
    } else if (isNew) {
      setF(blank());
    }
  }, [initialResource, isNew]);

  if (!isNew && !initialResource && !f) {
    return (
      <EmptyState
        title="Resource not found"
        text="It may have been removed or deleted."
        action={<Link href="/admin/resources" className="adm-btn">Back to resources</Link>}
      />
    );
  }

  if (!f) return <p className="adm-m">Loading resource…</p>;

  const needsSession = f.type === "past-question";
  const errs = {
    file: !f.fileName && !uploadedUrl ? "Upload the file before publishing." : "",
    dept: !f.dept ? "Select a department." : "",
    level: !f.level ? "Select an academic level." : "",
    code: !f.code.trim() ? "Enter the course code, for example CPE 311." : "",
    title: !f.title.trim() ? "Enter the course title." : "",
    session: needsSession && !f.session.trim() ? "Add the session for past questions, for example 2023/2024." : "",
  };
  const clean = Object.values(errs).every((v) => !v);
  const saved = Boolean(initialResource);
  const S = <K extends keyof Resource>(k: K, v: Resource[K]) => setF({ ...f, [k]: v });

  async function pick(file?: File) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      return setUp({ name: file.name, size: file.size, progress: 0, error: "Only PDF files are accepted." });
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return setUp({
        name: file.name,
        size: file.size,
        progress: 0,
        error: `This file is ${(file.size / 1048576).toFixed(0)} MB. Files must be ${MAX_MB} MB or smaller.`,
      });
    }

    setUp({ name: file.name, size: file.size, progress: 20 });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("dept", f?.dept || "general");
    formData.append("level", f?.level || "all");

    try {
      const res = await fetch("/api/admin/resources/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        setUp({ name: file.name, size: file.size, progress: 100 });
        setF((cur) => cur && { ...cur, fileName: data.fileName, fileSize: data.fileSize });
        setUploadedUrl(data.url);
        toast("File uploaded successfully to cloud.");
      } else {
        setUp({ name: file.name, size: file.size, progress: 0, error: data.error || "Upload failed." });
      }
    } catch {
      setUp({ name: file.name, size: file.size, progress: 0, error: "Upload failed." });
    }
  }

  async function save(status: Resource["status"], msg: string) {
    const rec = { ...f!, status, updatedAt: nowISO().slice(0, 10) };
    setF(rec);
    audit(`${msg} ${rec.code} ${rec.title}`.trim());
    toast(status === "published" ? "Published. It now appears on the public Academic Hub." : "Saved draft.");
    const res = await saveAdminResource(rec, uploadedUrl || undefined);
    if (res?.ok) {
      router.push("/admin/resources");
    }
  }

  const uploading = !!up && !up.error && up.progress < 100;
  const list: [string, boolean][] = [
    ["File uploaded", !errs.file],
    ["Department, level and type chosen", !errs.dept && !errs.level],
    ["Course code and title", !errs.code && !errs.title],
    ["Session added", !errs.session],
  ];

  return (
    <>
      <PageHeader
        title={saved ? `Edit ${f.code || "resource"}` : "Add resource"}
        sub="Upload the past question or material PDF, then add details students will search by."
      >
        <StatusBadge status={f.status} />
      </PageHeader>
      <div className="adm-grid adm-main-side">
        <Card className="adm-cp">
          <div className="adm-fg">
            <div className="adm-f">
              <span className="adm-lb">PDF File</span>
              <div
                className="adm-dz"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  pick(e.dataTransfer.files[0]);
                }}
              >
                <Icon name="upl" size={24} />
                <b>{f.fileName ? `${f.fileName} · ${f.fileSize}` : "Drag a PDF here, or choose a file"}</b>
                <span>PDF only, up to {MAX_MB} MB. Uploaded directly to cloud storage.</span>
                <button type="button" className="adm-btn2 adm-sm" onClick={() => input.current?.click()}>
                  {f.fileName ? "Replace PDF file" : "Choose PDF file"}
                </button>
                <input
                  ref={input}
                  type="file"
                  accept="application/pdf"
                  className="adm-sr"
                  onChange={(e) => pick(e.target.files?.[0])}
                />
              </div>
              {up && !up.error && (
                <div className="adm-card adm-cp" style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b>{up.name}</b>
                    <span className="adm-note">{(up.size / 1048576).toFixed(1)} MB · {up.progress}%</span>
                  </div>
                  <div className="adm-pbar" role="progressbar" aria-valuenow={up.progress} aria-valuemin={0} aria-valuemax={100}>
                    <i style={{ width: `${up.progress}%` }} />
                  </div>
                  <span className="adm-note">{up.progress < 100 ? "Uploading to cloud…" : "Uploaded to cloud"}</span>
                </div>
              )}
              {up?.error && <Banner kind="danger"><b>{up.name}</b>: {up.error}</Banner>}
              {show && errs.file && !up?.error && <FieldError text={errs.file} />}
            </div>

            <div className="adm-r2">
              <SelectField
                label="Department"
                placeholder="Select a department"
                value={f.dept}
                onChange={(e) => S("dept", e.target.value)}
                options={DEPARTMENTS.map((d) => ({ value: d.slug, label: d.name }))}
                error={show ? errs.dept : ""}
              />
              <Chips
                label="Academic level"
                options={LEVELS}
                value={f.level}
                onChange={(v) => S("level", v)}
                error={show ? errs.level : ""}
              />
            </div>
            <div className="adm-r2">
              <TextField
                label="Course code"
                placeholder="e.g. CPE 311"
                value={f.code}
                onChange={(e) => S("code", e.target.value)}
                error={show ? errs.code : ""}
              />
              <TextField
                label="Course title"
                placeholder="e.g. Data Structures & Algorithms"
                value={f.title}
                onChange={(e) => S("title", e.target.value)}
                error={show ? errs.title : ""}
              />
            </div>
            <div className="adm-r2">
              <SelectField
                label="Resource type"
                value={f.type}
                onChange={(e) => S("type", e.target.value as Resource["type"])}
                options={RESOURCE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              />
              <TextField
                label={needsSession ? "Session or year" : "Session or year (optional)"}
                placeholder="e.g. 2023/2024"
                value={f.session}
                onChange={(e) => S("session", e.target.value)}
                error={show ? errs.session : ""}
              />
            </div>
            <AreaField
              label="Notes for students (optional)"
              optional
              placeholder="e.g. Covers semester exams from 2020 to 2024."
              value={f.notes ?? ""}
              onChange={(e) => S("notes", e.target.value)}
            />
          </div>
        </Card>

        <div className="adm-stack">
          <Card className="adm-cp">
            <h2>Publish</h2>
            <div className="adm-actions" style={{ marginBottom: 14 }}>
              <button
                className="adm-btn2"
                disabled={uploading}
                onClick={() => {
                  if (!f.code.trim() && !f.title.trim()) {
                    setShow(true);
                    return toast("Add a course code or title to save.", "bad");
                  }
                  save(f.status === "published" ? "published" : "draft", f.status === "published" ? "Updated" : "Saved draft of");
                }}
              >
                {f.status === "published" ? "Save changes" : "Save draft"}
              </button>
              {f.status === "published" && (
                <button className="adm-btn2" onClick={() => save("draft", "Unpublished")}>
                  Unpublish
                </button>
              )}
              {f.status === "archived" && (
                <button className="adm-btn2" onClick={() => save("draft", "Restored")}>
                  Restore
                </button>
              )}
            </div>
            {f.status !== "published" && (
              <button
                className="adm-btn adm-wide"
                disabled={uploading}
                aria-disabled={!clean}
                onClick={() => {
                  setShow(true);
                  if (!clean) return toast("Complete the checklist before publishing.", "bad");
                  save("published", "Published");
                }}
              >
                Publish resource
              </button>
            )}
            {uploading && <p className="adm-note" style={{ marginTop: 8 }}>Wait for the upload to finish.</p>}
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
            <h2>Preview for students</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <div className="adm-t">{f.code || "Course code"} — {f.title || "Course title"}</div>
                <div className="adm-note">{typeLabel(f.type)} · {f.level || "Level"} · {f.session || "Session"} · PDF</div>
              </div>
              <span className="adm-btn2 adm-sm">{f.fileName ? "Open PDF" : "Pending file"}</span>
            </div>
          </Card>
          {saved && (
            <Card className="adm-cp adm-danger">
              <h2 style={{ color: "var(--err)" }}>Delete resource</h2>
              <p className="adm-note" style={{ marginBottom: 12 }}>
                Permanently delete this resource from the library and public Academic Hub.
              </p>
              <button className="adm-btnd" onClick={() => setDel(true)}>Delete resource…</button>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={del}
        danger
        title={`Delete “${f.code}”?`}
        confirmLabel="Delete permanently"
        onCancel={() => setDel(false)}
        onConfirm={async () => {
          audit(`Deleted resource ${f.code}`);
          toast("Resource deleted.");
          await deleteAdminResource(f.id);
          router.push("/admin/resources");
        }}
      >
        This permanently removes this academic resource from both the admin and the public Academic Hub. It cannot be undone.
      </ConfirmDialog>
    </>
  );
}
