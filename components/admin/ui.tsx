"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import Link from "next/link";
import type { PubStatus } from "@/lib/admin/types";
import Icon from "./Icon";

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="adm-ph">
      <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {children && <div className="adm-actions">{children}</div>}
    </div>
  );
}

type Kind = "pub" | "draft" | "arch" | "past" | "warn" | "new" | "done" | "bad";
export function Badge({ kind, children }: { kind: Kind; children: ReactNode }) {
  return <span className={`adm-badge adm-badge--${kind}`}>{children}</span>;
}
export function StatusBadge({ status }: { status: PubStatus }) {
  const map = { published: ["pub", "Published"], draft: ["draft", "Draft"], archived: ["arch", "Archived"] } as const;
  return <Badge kind={map[status][0]}>{map[status][1]}</Badge>;
}

export function Tabs<T extends string>({ items, value, onChange }: { items: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="adm-tabs" role="tablist">
      {items.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className="adm-tab" onClick={() => onChange(t.id)}>
          {t.label}{t.count !== undefined && <b>{t.count}</b>}
        </button>
      ))}
    </div>
  );
}

export function Banner({ kind = "info", children }: { kind?: "info" | "warn" | "danger"; children: ReactNode }) {
  return <div className={`adm-banner adm-banner--${kind}`}><Icon name={kind === "info" ? "shield" : "warn"} /><div>{children}</div></div>;
}

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => <section className={`adm-card ${className}`}>{children}</section>;
export const CardHead = ({ title, children }: { title: string; children?: ReactNode }) => <div className="adm-chd"><h2>{title}</h2>{children}</div>;

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <label className="adm-swl">
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="adm-sw" /> {label}
    </label>
  );
}

export function Check({ checked, onChange, children, error }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string }) {
  return (
    <div className="adm-f">
      <label className="adm-ck"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span>{children}</span></label>
      {error && <FieldError text={error} />}
    </div>
  );
}

export const FieldError = ({ text }: { text: string }) => <span className="adm-ferr"><Icon name="warn" size={14} />{text}</span>;

function Field({ label, optional, help, error, id, children }: { label: string; optional?: boolean; help?: string; error?: string; id: string; children: ReactNode }) {
  return (
    <div className="adm-f">
      <label htmlFor={id}>{label}{optional && <span className="adm-opt"> (optional)</span>}</label>
      {children}
      {help && <span className="adm-help" id={`${id}-h`}>{help}</span>}
      {error && <FieldError text={error} />}
    </div>
  );
}
type Meta = { label: string; optional?: boolean; help?: string; error?: string };
export function TextField({ label, optional, help, error, ...p }: Meta & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return <Field id={id} label={label} optional={optional} help={help} error={error}><input id={id} className="adm-in" aria-invalid={!!error} aria-describedby={help ? `${id}-h` : undefined} {...p} /></Field>;
}
export function AreaField({ label, optional, help, error, ...p }: Meta & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return <Field id={id} label={label} optional={optional} help={help} error={error}><textarea id={id} rows={4} className="adm-in adm-area" aria-invalid={!!error} {...p} /></Field>;
}
export function SelectField({ label, optional, help, error, options, placeholder, ...p }: Meta & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder?: string }) {
  const id = useId();
  return (
    <Field id={id} label={label} optional={optional} help={help} error={error}>
      <select id={id} className="adm-in adm-sel" aria-invalid={!!error} {...p}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}
export function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select aria-label={label} className="adm-in adm-sel adm-fsel" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{label}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="adm-search"><Icon name="srch" size={16} />
      <input className="adm-in" type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
export function Chips({ label, options, value, onChange, error }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset className="adm-f adm-fs">
      <legend>{label}</legend>
      <div className="adm-chips">
        {options.map((o) => (
          <label key={o} className="adm-chip"><input type="radio" name={label} checked={value === o} onChange={() => onChange(o)} /><span>{o}</span></label>
        ))}
      </div>
      {error && <FieldError text={error} />}
    </fieldset>
  );
}

export function Dialog({ open, title, onClose, children, footer }: { open: boolean; title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="adm-dialog" aria-labelledby={id} onClose={onClose}>
      <h2 id={id}>{title}</h2>
      <div className="adm-dialog__body">{children}</div>
      {footer && <div className="adm-actions">{footer}</div>}
    </dialog>
  );
}

export function ConfirmDialog({ open, title, children, confirmLabel, danger, onConfirm, onCancel, extra }: {
  open: boolean; title: string; children: ReactNode; confirmLabel: string; danger?: boolean;
  onConfirm: () => void; onCancel: () => void; extra?: ReactNode;
}) {
  return (
    <Dialog open={open} title={title} onClose={onCancel} footer={<>
      <button className="adm-btn2" onClick={onCancel}>Cancel</button>
      {extra}
      <button className={danger ? "adm-btnd" : "adm-btn"} onClick={onConfirm}>{confirmLabel}</button>
    </>}>{children}</Dialog>
  );
}

export function ImageDrop({ label, value, onChange, maxMB = 5, hint }: { label: string; value?: string; onChange: (name?: string) => void; maxMB?: number; hint?: string }) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  async function pick(f?: File) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return setErr("Choose a JPG, PNG or WebP image.");
    if (f.size > maxMB * 1024 * 1024) return setErr(`That image is over ${maxMB} MB. Choose a smaller one.`);
    setErr("");
    setBusy(true);

    const tempUrl = URL.createObjectURL(f);
    setPreview(tempUrl);

    const formData = new FormData();
    formData.append("file", f);
    formData.append("folder", "leaders");

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        setPreview(data.url);
        onChange(data.url);
      } else {
        setErr(data.error || "Upload failed.");
      }
    } catch {
      setErr("Network error while uploading image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-f">
      <span className="adm-lb">{label}</span>
      <div className="adm-dz" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}>
        {preview ? <img src={preview} alt="" className="adm-dz__img" /> : <Icon name="upl" size={22} />}
        <b>{busy ? "Uploading photo to cloud…" : value ? (value.startsWith("http") ? "Photo uploaded" : value) : "Drag an image here, or choose a file"}</b>
        <span>{hint ?? `JPG, PNG or WebP, up to ${maxMB} MB. Use approved images only.`}</span>
        <div className="adm-actions" style={{ justifyContent: "center" }}>
          <button type="button" className="adm-btn2 adm-sm" disabled={busy} onClick={() => input.current?.click()}>{value ? "Replace" : "Choose file"}</button>
          {value && <button type="button" className="adm-btn2 adm-sm" disabled={busy} onClick={() => { setPreview(undefined); onChange(undefined); }}>Remove</button>}
        </div>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="adm-sr" onChange={(e) => pick(e.target.files?.[0])} />
      </div>
      {err && <FieldError text={err} />}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="adm-empty"><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export function LinkButton({ href, children, kind = "btn" }: { href: string; children: ReactNode; kind?: "btn" | "btn2" }) {
  return <Link href={href} className={kind === "btn" ? "adm-btn" : "adm-btn2"}>{children}</Link>;
}
