import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Notice | NSBE Unilorin",
  description:
    "How NSBE Unilorin collects, uses, and protects student and member information submitted through our forms.",
};

export default function PrivacyPage() {
  return (
    <div style={{ paddingBottom: "80px" }}>
      <section style={{ padding: "64px 0 40px", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <p className="eyebrow">Data & Privacy</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.15, marginTop: "8px" }}>
            Privacy Notice
          </h1>
          <p className="lead" style={{ marginTop: "16px", color: "var(--muted)" }}>
            This notice explains how the National Society of Black Engineers, University of Ilorin Chapter handles your personal data when you use this website and submit inquiries.
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: "800px", marginTop: "48px", lineHeight: 1.7, color: "var(--fg)" }}>
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "12px" }}>1. Information We Collect</h2>
          <p style={{ color: "var(--muted)", marginBottom: "12px" }}>
            When you register your interest in joining NSBE Unilorin or request tutorial assistance, we collect information submitted directly by you through our online forms, including:
          </p>
          <ul style={{ paddingLeft: "24px", color: "var(--muted)", display: "grid", gap: "6px" }}>
            <li>Full name</li>
            <li>Email address (used to contact you regarding chapter activities)</li>
            <li>Faculty department and academic level (100L–500L)</li>
            <li>Optional phone number for urgent WhatsApp or SMS follow-up</li>
            <li>Selected interest areas or requested tutorial topics</li>
            <li>Consent timestamp and agreement records</li>
          </ul>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "12px" }}>2. How We Use Your Information</h2>
          <p style={{ color: "var(--muted)", marginBottom: "12px" }}>
            We use student information solely for legitimate chapter operations:
          </p>
          <ul style={{ paddingLeft: "24px", color: "var(--muted)", display: "grid", gap: "6px" }}>
            <li>Reviewing membership interest applications and guiding prospective members through onboarding</li>
            <li>Pairing students with peer tutors and organizing review sessions for requested course codes</li>
            <li>Sending notices about chapter events, technical workshops, and scholarship opportunities</li>
            <li>Maintaining an internal administrative record of active student inquiries</li>
          </ul>
          <p style={{ color: "var(--muted)", marginTop: "12px" }}>
            <strong>We never sell, rent, or trade your personal information</strong> to third-party commercial organizations or external advertisers.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "12px" }}>3. Data Storage & Security</h2>
          <p style={{ color: "var(--muted)" }}>
            Data submitted via our website is secured within encrypted cloud database storage (Supabase PostgreSQL) with Row-Level Security (RLS) enabled. Only authenticated and authorized chapter executives with administrative privileges can view student submission records.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "12px" }}>4. Your Rights</h2>
          <p style={{ color: "var(--muted)" }}>
            You may request a copy of the information we hold about you or ask us to update or delete your submission at any time by contacting the chapter administration at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="link">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </section>

        <div style={{ marginTop: "48px", borderTop: "1px solid var(--border)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Last updated: October 2026 · NSBE Unilorin</span>
          <Link href="/" className="btn2">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
