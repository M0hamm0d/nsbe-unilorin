import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import './programs.css'
import {
  APPLY_STEPS, PACKET, PARTNERS, PARTNER_STEPS, PROGRAMS, SCHOLARSHIPS, formatDate, isOpen,
} from "@/lib/programs";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Programs & Scholarships | NSBE Unilorin",
  description:
    "NSBE Unilorin programs, scholarships for engineering students, and how organisations can partner with the chapter.",
};

export const instant = false;

// export const revalidate = 3600; // keep open/closed scholarship status fresh

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export default async function ProgramsPage() {
  await connection(); // ensure DB connection is established before rendering page
  return (
    <>
      {/* Intro */}
      <section className="pr-intro">
        <div className="container pr-intro__grid">
          <div>
            <p className="eyebrow">Programs and scholarships</p>
            <h1 className="pr-title">Ways to grow beyond the classroom.</h1>
          </div>
          <div>
            <p className="lead pr-lead">
              Programs, scholarships and partnerships that help Unilorin engineering students learn, build and succeed.
            </p>
            <nav className="pr-jumps" aria-label="On this page">
              <a href="#programs" className="pr-jump pr-jump--on">Programs</a>
              <a href="#scholarships" className="pr-jump">Scholarships</a>
              <a href="#partner" className="pr-jump">Partner with us</a>
            </nav>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="pr-section">
        <div className="container">
          <div className="pr-head">
            <div>
              <p className="eyebrow">Programs</p>
              <h2 className="pr-h2">What members can take part in</h2>
            </div>
            <p className="pr-head__note">Each program has a short description and a clear way to get involved.</p>
          </div>

          <div className="pr-bento">
            {PROGRAMS.map((p, i) => (
              <article key={p.id} className={`pr-card pr-card--${p.tone}${i === 0 ? " pr-card--big" : ""}`}>
                {/* Replace src with real program photography */}
                <Image src={p.image} alt="" width={600} height={400} className="pr-card__img" />
                <div className="pr-card__panel">
                  <span className="pr-pill">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                  <Link href={p.href} className="pr-more">
                    More information <span aria-hidden="true">→</span>
                    <span className="sr-only"> about {p.name}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section id="scholarships" className="pr-band">
        <div className="container">
          <div className="pr-head">
            <div>
              <p className="eyebrow">Scholarships</p>
              <h2 className="pr-h2">Scholarships for Unilorin engineering students.</h2>
            </div>
            <p className="pr-head__note">Support for students at every level. Check each scholarship’s deadline and eligibility before you apply.</p>
          </div>

          <div className="pr-sc-grid">
            {SCHOLARSHIPS.map((s) => {
              const open = isOpen(s.deadline, new Date().toISOString().slice(0, 10));
              return (
                <article className="pr-sc" key={s.id}>
                  <div className="pr-sc__top">
                    <span className={`pr-status ${open ? "pr-status--open" : "pr-status--closed"}`}>
                      <CalendarIcon /> {open ? "Applications open" : "Applications closed"}
                    </span>
                    <span className="pr-sc__funder">Funded by {s.funder}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <p className="pr-sc__desc">{s.description}</p>
                  <dl className="pr-kv">
                    <dt>Amount</dt><dd>{s.amount}</dd>
                    <dt>Deadline</dt><dd>{formatDate(s.deadline)}</dd>
                    <dt>Open to</dt><dd>{s.eligibility}</dd>
                  </dl>
                  <div className="pr-sc__actions">
                    {open ? (
                      <Link href={`${s.href}/apply`} className="btn">
                        Apply now<span className="sr-only"> for {s.name}</span>
                      </Link>
                    ) : (
                      <span className="pr-na">Applications closed</span>
                    )}
                    <Link href={s.href} className="link">View details</Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="pr-apply">
            <div className="pr-apply__intro">
              <p className="eyebrow">How to apply</p>
              <h3>Three steps to a complete application.</h3>
            </div>
            <ol className="pr-apply__steps">
              {APPLY_STEPS.map((s, i) => (
                <li className="pr-step" key={s.title}>
                  <span className="pr-num">{i + 1}</span>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="pr-apply__cta">
            <Link href="/scholarships/guidelines" className="btn">Open scholarship guidelines</Link>
            <Link href="/contact" className="link">Ask a scholarship question</Link>
          </div>
        </div>
      </section>

      {/* Partner with us */}
      <section id="partner" className="pr-section pr-partner">
        <div className="container">
          <div className="pr-partner__grid">
            <div>
              <p className="eyebrow">Sponsors and partners</p>
              <h2 className="pr-h2">How to partner with NSBE Unilorin.</h2>
              <p className="lead pr-partner__lead">
                Organisations that support the chapter help students access learning, mentoring and opportunities. Here is how to get involved.
              </p>
              <ol className="pr-steps">
                {PARTNER_STEPS.map((s, i) => (
                  <li className="pr-step" key={s.title}>
                    <span className="pr-num">{i + 1}</span>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="pr-packet">
              <div className="pr-packet__icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
              </div>
              <div>
                <p className="eyebrow eyebrow--light">Sponsorship packet</p>
                <h3>Our sponsorship packet.</h3>
              </div>
              <p>Everything a prospective partner needs: the chapter’s work, ways to support, and who to contact.</p>
              <p className="pr-packet__meta">{PACKET.meta}</p>
              <div className="pr-packet__actions">
                <a href={PACKET.href} className="btn" download>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
                  Download the sponsorship packet
                </a>
                <Link href="/contact" className="link">Contact the chapter about partnering</Link>
              </div>
            </aside>
          </div>

          <ul className="pr-logos">
            {PARTNERS.map((p) => (
              <li key={p.name}>
                {/* Replace with confirmed partner logos */}
                <Image src={p.src} alt={p.name} width={100} height={50} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
