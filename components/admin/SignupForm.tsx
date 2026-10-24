"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { registerAdminUser } from "@/lib/admin/actions";
import type { Role } from "@/lib/admin/types";
import { FieldError } from "./ui";

const ROLE_OPTIONS: { value: Role; label: string; desc: string }[] = [
  { value: "editor", label: "Editor", desc: "Manage events, programs, and member submissions" },
  { value: "resource_manager", label: "Resource Manager", desc: "Upload and organize academic past questions and materials" },
  { value: "admin", label: "Chapter Admin", desc: "Full control over content, roles, and settings" },
];

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");

    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid university or personal email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters long.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setBusy(true);

    try {
      const res = await registerAdminUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        password,
      });

      if (!res.ok) {
        setError(res.error || "Unable to register account. Please try again.");
        setBusy(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("An unexpected error occurred. Please check your network connection.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="adm-signup-success" style={{ display: "grid", gap: "16px", textAlign: "center", padding: "12px 0" }}>
        <div style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "var(--tint)",
          color: "var(--gt)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          fontSize: 24
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: "1.25rem", color: "var(--ink)", margin: 0 }}>Request Submitted!</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>
          Your account request has been registered and is pending approval by a Chapter Administrator. You will be able to sign in once your access is activated.
        </p>
        <Link href="/admin/login" className="adm-btn adm-wide" style={{ marginTop: 8 }}>
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="adm-login__form">
      <div className="adm-f">
        <label htmlFor="signup-name">Full Name</label>
        <input
          id="signup-name"
          className="adm-in"
          type="text"
          placeholder="e.g. Ibrahim Musa"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="adm-f">
        <label htmlFor="signup-email">Email address</label>
        <input
          id="signup-email"
          className="adm-in"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="adm-f">
        <label htmlFor="signup-role">Requested Role</label>
        <select
          id="signup-role"
          className="adm-in adm-sel"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} — {opt.desc}
            </option>
          ))}
        </select>
      </div>

      <div className="adm-f">
        <label htmlFor="signup-pass">Password</label>
        <input
          id="signup-pass"
          className="adm-in"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="adm-f">
        <label htmlFor="signup-confirm">Confirm Password</label>
        <input
          id="signup-confirm"
          className="adm-in"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <FieldError text={error} />}
      </div>

      <button className="adm-btn adm-wide" disabled={busy} type="submit" style={{ marginTop: 4 }}>
        {busy ? "Submitting request…" : "Submit Access Request"}
      </button>

      <div style={{ textAlign: "center", marginTop: 12, fontSize: "0.875rem", color: "var(--muted)" }}>
        Already have an approved account?{" "}
        <Link href="/admin/login" style={{ color: "var(--gt)", fontWeight: 600, textDecoration: "underline" }}>
          Sign in
        </Link>
      </div>
    </form>
  );
}
