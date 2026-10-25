import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { getPublicLeaders } from "@/lib/admin/actions";
import type { Leader } from "@/lib/admin/types";
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default async function LeadershipPage() {
  await connection();
  const leaders = await getPublicLeaders();
  const president = leaders[0];
  const executives = leaders.slice(1);
  const presidentImageSrc = normalizeImageSrc(president?.portrait);

  return (
    <div className="ld-page">
      <section className="ld-intro">
        <div className="container ld-intro__grid">
          <div>
            <p className="eyebrow">Chapter Leadership</p>
            <h1 className="ld-title">Executive Committee</h1>
          </div>
          <p className="ld-lead">
            Meet the student engineers directing academic excellence, leadership development, and technical innovation across the University of Ilorin.
          </p>
        </div>
      </section>

      <div className="container ld-content">
        {president ? (
          <section className="ld-featured" aria-labelledby="ld-president-heading">
            <article className="ld-president">
              <div className="ld-president__image">
                {presidentImageSrc ? (
                  <Image
                    src={presidentImageSrc}
                    alt={president.name}
                    fill
                    sizes="(max-width: 760px) 100vw, 42vw"
                    className="ld-photo"
                    unoptimized
                  />
                ) : (
                  <div className="ld-placeholder" aria-hidden="true">
                    <span>{getInitials(president.name)}</span>
                  </div>
                )}
              </div>
              <div className="ld-president__details">
                <p className="ld-president__role">{president.role}</p>
                <h2 id="ld-president-heading" className="ld-president__name">{president.name}</h2>
                {president.bio && !president.bio.trim().startsWith("{") && !president.bio.includes("linkedin.com") && !president.bio.includes("@") && (
                  <p className="ld-president__bio">{president.bio}</p>
                )}
                {president.termStart && president.termEnd && (
                  <p className="ld-president__term">Term {president.termStart}–{president.termEnd}</p>
                )}
                <LeaderSocials leader={president} />
              </div>
            </article>
          </section>
        ) : (
          <p className="ld-empty">
            Leadership details are currently being updated by the chapter executives.
          </p>
        )}

        {executives.length > 0 && (
          <section className="ld-executives" aria-labelledby="ld-executives-heading">
            <div className="ld-executives__heading">
              <p className="ld-section-label">Chapter leadership</p>
              <h2 id="ld-executives-heading">Executive team</h2>
            </div>
            <div className="ld-grid" role="list" aria-label="Other executive members">
              {executives.map((leader) => {
                const imageSrc = normalizeImageSrc(leader.portrait);
                return (
                  <article key={leader.id} className="ld-card" role="listitem">
                    <div className="ld-card__image">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={leader.name}
                          fill
                          sizes="(max-width: 640px) 96px, (max-width: 1024px) 45vw, 28vw"
                          className="ld-photo"
                          unoptimized
                        />
                      ) : (
                        <div className="ld-placeholder" aria-hidden="true">
                          <span>{getInitials(leader.name)}</span>
                        </div>
                      )}
                    </div>
                    <div className="ld-card__content">
                      <p className="ld-card__role">{leader.role}</p>
                      <h3 className="ld-card__name">{leader.name}</h3>
                      {leader.termStart && leader.termEnd && (
                        <p className="ld-card__term">Term {leader.termStart}–{leader.termEnd}</p>
                      )}
                      <LeaderSocials leader={leader} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <div className="ld-cta">
          <div>
            <h2>
              Want to take on a leadership role?
            </h2>
            <p>
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

function LeaderSocials({ leader }: { leader: Leader }) {
  const socials = parseSocials(leader.bio);
  if (!socials.linkedin && !socials.twitter && !socials.email) return null;

  return (
    <div className="ld-socials" aria-label={`${leader.name} contact links`}>
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
  );
}
