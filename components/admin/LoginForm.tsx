"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FieldError } from "./ui";

export default function LoginForm({ showDemo }: { showDemo: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!email.trim() || !password) return setError("Enter your email and password.");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.message ?? "We couldn’t sign you in. Try again.");
        setBusy(false);
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      const safe = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin"; // never redirect off-site
      router.replace(safe);
      router.refresh();
    } catch {
      setError("We couldn’t reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="adm-login__form">
      <div className="adm-f">
        <label htmlFor="adm-email">Email address</label>
        <input id="adm-email" className="adm-in" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} />
      </div>
      <div className="adm-f">
        <label htmlFor="adm-pass">Password</label>
        <input id="adm-pass" className="adm-in" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!error} />
        {error && <FieldError text={error} />}
      </div>
      <button className="adm-btn adm-wide" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      {/* {showDemo && (
        <div className="adm-demo">
          <b>Demo accounts</b> (password <code>nsbe-demo</code> unless you set ADMIN_DEMO_PASSWORD)
          <ul>
            <li><button type="button" onClick={() => setEmail("admin@nsbe.test")}>admin@nsbe.test</button> · Admin</li>
            <li><button type="button" onClick={() => setEmail("editor@nsbe.test")}>editor@nsbe.test</button> · Editor</li>
            <li><button type="button" onClick={() => setEmail("resources@nsbe.test")}>resources@nsbe.test</button> · Resource manager</li>
          </ul>
        </div>
      )} */}
    </form>
  );
}
