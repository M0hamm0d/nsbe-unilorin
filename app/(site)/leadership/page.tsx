import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { getPublicLeaders } from "@/lib/admin/actions";
import "./leadership.css";

export const metadata: Metadata = {
  title: "Leadership | NSBE Unilorin",
  description:
    "Meet the executive board and student leaders directing the University of Ilorin chapter of the National Society of Black Engineers.",
};

export const instant = false;

function normalizeImageSrc(src?: string | null): string | null {
  if (!src || typeof src !== "string") return null;
  const s = src.trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) {
    return s;
  }
  return `/${s}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default async function LeadershipPage() {
  await connection();
  const leaders = await getPublicLeaders();

  return (
    <div className="ld-page">
      {/* Intro Header */}
      <section className="ld-intro">
        <div className="container ld-intro__grid">
          <div>
            <p className="eyebrow">Chapter Leadership</p>
            <h1 className="ld-title">Executive Committee</h1>
          </div>
          <div>
            <p className="ld-lead">
              Meet the student engineers dedicated to academic excellence, leadership development, and technical innovation across the University of Ilorin.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Grid */}
      <div className="container">
        {leaders.length > 0 ? (
          <div className="ld-grid">
            {leaders.map((leader) => {
              const imageSrc = normalizeImageSrc(leader.portrait);
              return (
                <article key={leader.id} className="ld-card">
                  <div className="ld-avatar">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={leader.name}
                        width={72}
                        height={72}
                        unoptimized
                      />
                    ) : (
                      <span>{getInitials(leader.name)}</span>
                    )}
                  </div>
                  <h2 className="ld-name">{leader.name}</h2>
                  <span className="ld-role">{leader.role}</span>
                  {leader.bio && <p className="ld-bio">{leader.bio}</p>}
                  <div className="ld-meta">
                    {leader.termStart || leader.termEnd
                      ? `Term: ${leader.termStart || ""}–${leader.termEnd || "present"}`
                      : "Current executive"}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="adm-note" style={{ padding: "48px 0", textAlign: "center" }}>
            Leadership details are currently being updated by the chapter executives.
          </p>
        )}

        {/* Join Leadership CTA */}
        <div className="ld-cta">
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "4px" }}>
              Want to take on a leadership role?
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
              Active members can join chapter committees, coordinate peer tutorials, or run for executive positions.
            </p>
          </div>
          <Link href="/join" className="btn">
            Get involved
          </Link>
        </div>
      </div>
    </div>
  );
}
