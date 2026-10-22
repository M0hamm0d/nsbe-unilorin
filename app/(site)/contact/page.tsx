import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | NSBE Unilorin",
  description:
    "Get in touch with the University of Ilorin chapter of the National Society of Black Engineers for partnerships, inquiries, or student support.",
};

export default function ContactPage() {
  return (
    <div style={{ paddingBottom: "80px" }}>
      <section style={{ padding: "64px 0 40px", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <p className="eyebrow">Get In Touch</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.15, marginTop: "8px" }}>
            Contact NSBE Unilorin
          </h1>
          <p className="lead" style={{ marginTop: "16px", color: "var(--muted)" }}>
            Have questions about chapter membership, tutorial sessions, corporate sponsorships, or collaborative events? We would love to hear from you.
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: "800px", marginTop: "48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {/* Email Card */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "8px" }}>Direct Email</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "16px" }}>
              For general inquiries, chapter communications, or academic matters:
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn"
              style={{ display: "inline-block", fontSize: "0.9375rem" }}
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Location Card */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "8px" }}>Chapter Location</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
              Faculty of Engineering & Technology<br />
              University of Ilorin, Main Campus<br />
              PMB 1515, Ilorin, Kwara State, Nigeria
            </p>
          </div>
        </div>

        {/* Social Channels */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", marginTop: "24px" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "8px" }}>Social Channels</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "16px" }}>
            Follow our official handles for real-time event announcements, workshop dates, and chapter news:
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="btn2"
                style={{ padding: "8px 16px", borderRadius: "6px", textDecoration: "none" }}
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Action card */}
        <div style={{ marginTop: "40px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "32px", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>Looking to join the chapter?</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "20px" }}>
            Engineering students across 100L to 500L can register membership interest online in under 2 minutes.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/join" className="btn">
              Join NSBE Unilorin
            </Link>
            <Link href="/tutorial-interest" className="btn2">
              Request a Tutorial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
