"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

type SubmittedProps = {
  title: string;
  firstName: string;
  body: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

export function SubmittedCard({ title, firstName, body, primary, secondary = { href: "/", label: "Back to home" } }: SubmittedProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []); // move focus so screen readers announce the result

  return (
    <section className="fm-card fm-state" aria-labelledby="fm-state-title">
      <div className="fm-state__icon fm-state__icon--ok" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m5 12 5 5 9-10" /></svg>
      </div>
      <p className="eyebrow fm-state__eyebrow">Submitted</p>
      <h2 id="fm-state-title" ref={heading} tabIndex={-1}>{title}</h2>
      <p className="fm-state__text">Thanks{firstName ? `, ${firstName}` : ""}. {body}</p>
      <div className="fm-state__actions">
        <Link href={primary.href} className="btn">{primary.label}</Link>
        <Link href={secondary.href} className="link">{secondary.label}</Link>
      </div>
    </section>
  );
}

export function ErrorCard({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <section className="fm-card fm-state fm-state--error" aria-labelledby="fm-error-title" role="alert">
      <div className="fm-state__icon fm-state__icon--bad" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" /></svg>
      </div>
      <p className="eyebrow fm-state__eyebrow">Something went wrong</p>
      <h2 id="fm-error-title" ref={heading} tabIndex={-1}>We couldn’t save your response.</h2>
      <p className="fm-state__text">
        Your answers are still in the form, so you don’t need to type them again. Check your connection and try again, or email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="link">{CONTACT_EMAIL}</a> if it keeps happening.
      </p>
      <div className="fm-state__actions">
        <button type="button" className="btn" onClick={onRetry} disabled={retrying}>{retrying ? "Trying again…" : "Try again"}</button>
        <Link href="/contact" className="link">Contact the chapter</Link>
      </div>
    </section>
  );
}
