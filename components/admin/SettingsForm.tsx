"use client";

import { useEffect, useState } from "react";
import { useMockCollection } from "@/lib/admin/use-mock";
import { SETTINGS } from "@/lib/admin/mock-data";
import type { SiteSettings } from "@/lib/admin/types";
import { useAdmin } from "./AdminProvider";
import { AreaField, Banner, Card, PageHeader, Switch, TextField } from "./ui";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SettingsForm() {
  const { items, ready, update } = useMockCollection<SiteSettings>("settings", SETTINGS);
  const { toast, audit } = useAdmin();
  const [f, setF] = useState<SiteSettings | null>(null);
  const [show, setShow] = useState(false);
  const saved = items.find((x) => x.id === "site");
  useEffect(() => { if (ready && saved && !f) setF(structuredClone(saved)); }, [ready, saved, f]);
  if (!f) return <p className="adm-m">Loading…</p>;

  const errs = {
    email: !EMAIL.test(f.email.trim()) ? "Enter a valid email address, for example name@example.com." : "",
    socials: f.socials.map((s) => (s.url && !/^https?:\/\//i.test(s.url) ? "Enter a full link starting with https://" : s.show && !s.url ? "Add the link or turn this off." : "")),
  };
  const bad = !!errs.email || errs.socials.some(Boolean);
  const dirty = JSON.stringify(f) !== JSON.stringify(saved);
  const setSocial = (i: number, patch: Partial<SiteSettings["socials"][number]>) => setF({ ...f, socials: f.socials.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  return (
    <>
      <PageHeader title="Settings" sub="Approved public information that executives keep up to date.">
        <button className="adm-btn2" disabled={!dirty} onClick={() => { setF(structuredClone(saved!)); setShow(false); }}>Discard changes</button>
        <button className="adm-btn" disabled={!dirty} onClick={() => { setShow(true); if (bad) return toast("Fix the highlighted fields.", "bad"); update("site", f); audit("Updated site settings"); toast("Settings saved. The public site will use them."); }}>Save changes</button>
      </PageHeader>
      <div className="adm-grid adm-main-side">
        <div className="adm-stack">
          <Card className="adm-cp"><h2>Public contact details</h2><div className="adm-fg">
            <div className="adm-r2"><TextField label="Official email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={show ? errs.email : ""} />
              <TextField label="Phone" optional value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
            <TextField label="Office or meeting place" optional value={f.office} onChange={(e) => setF({ ...f, office: e.target.value })} /></div></Card>
          <Card className="adm-cp"><h2>Official social links</h2><div className="adm-fg">
            {f.socials.map((s, i) => (
              <div key={s.platform} style={{ display: "grid", gap: 12, gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "end" }}>
                <TextField label={s.platform} placeholder="https://" value={s.url} onChange={(e) => setSocial(i, { url: e.target.value })} error={show ? errs.socials[i] : ""} />
                <div style={{ height: 40, display: "flex", alignItems: "center" }}><Switch label="Show" checked={s.show} onChange={(v) => setSocial(i, { show: v })} /></div>
              </div>))}</div></Card>
          <Card className="adm-cp"><h2>Footer description</h2>
            <AreaField label="Text under the chapter name" help="Shown in the footer of every public page." value={f.footerText} onChange={(e) => setF({ ...f, footerText: e.target.value })} /></Card>
        </div>
        <div className="adm-stack">
          <Card className="adm-cp"><h2>Footer preview</h2>
            <div style={{ background: "var(--deep)", color: "#d5eedc", borderRadius: 10, padding: 20, fontSize: 13 }}>
              <b style={{ color: "#fff", display: "block", marginBottom: 6 }}>NSBE Unilorin</b>{f.footerText}
              <div style={{ marginTop: 12 }}><b style={{ color: "#fff" }}>Contact</b><br />{f.email}{f.phone && <><br />{f.phone}</>}
                {f.socials.filter((s) => s.show && s.url).map((s) => <span key={s.platform}><br />{s.platform}</span>)}</div></div></Card>
          <Banner><div>Database configuration, secrets and hosting are managed outside this dashboard, not here.</div></Banner>
        </div>
      </div>
    </>
  );
}
