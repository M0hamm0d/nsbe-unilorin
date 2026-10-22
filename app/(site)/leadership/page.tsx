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

function parseSocials(raw?: string | null): { linkedin?: string; twitter?: string; email?: string } {
  if (!raw) return {};
  try {
    if (raw.trim().startsWith("{")) {
      const parsed = JSON.parse(raw);
      return {
        linkedin: parsed.linkedin || undefined,
        twitter: parsed.twitter || undefined,
        email: parsed.email || undefined,
      };
    }
  } catch {}
  if (raw.includes("linkedin.com")) return { linkedin: raw.trim() };
  if (raw.includes("@")) return { email: raw.trim() };
  return {};
}

function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
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
              Meet the student engineers directing academic excellence, leadership development, and technical innovation across the University of Ilorin.
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
              const socials = parseSocials(leader.bio);
              const hasSocials = Boolean(socials.linkedin || socials.twitter || socials.email);

              return (
                <article key={leader.id} className="ld-card">
                  <div className="ld-image-wrap">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={leader.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="ld-photo"
                        unoptimized
                      />
                    ) : (
                      <div className="ld-placeholder">
                        <span>{getInitials(leader.name)}</span>
                      </div>
                    )}
                  </div>
                  <div className="ld-content">
                    <h2 className="ld-name">{leader.name}</h2>
                    <span className="ld-role">{leader.role}</span>
                    {hasSocials && (
                      <div className="ld-socials">
                        {socials.linkedin && (
                          <a
                            href={socials.linkedin.startsWith("http") ? socials.linkedin : `https://${socials.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ld-social-link"
                            aria-label={`${leader.name} on LinkedIn`}
                            title="LinkedIn"
                          >
                            <LinkedInIcon />
                          </a>
                        )}
                        {socials.twitter && (
                          <a
                            href={socials.twitter.startsWith("http") ? socials.twitter : `https://${socials.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ld-social-link"
                            aria-label={`${leader.name} on X / Twitter`}
                            title="X (Twitter)"
                          >
                            <TwitterIcon />
                          </a>
                        )}
                        {socials.email && (
                          <a
                            href={socials.email.startsWith("mailto:") ? socials.email : `mailto:${socials.email}`}
                            className="ld-social-link"
                            aria-label={`Email ${leader.name}`}
                            title="Email"
                          >
                            <EmailIcon />
                          </a>
                        )}
                      </div>
                    )}
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
