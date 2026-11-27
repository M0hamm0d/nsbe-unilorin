import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import './programs.css'
import {
  PACKET, PARTNER_STEPS, PROGRAMS,
} from "@/lib/programs";
import { getPublicSponsors } from "@/lib/admin/actions";
import { SponsorGrid } from "@/components/Sponsors";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Programs & Scholarships | NSBE Unilorin",
  description:
    "NSBE Unilorin programs, scholarships, and how organisations can partner with the chapter.",
};

export const instant = false;

// export const revalidate = 3600; // keep open/closed scholarship status fresh

export default async function ProgramsPage() {
  await connection(); // ensure DB connection is established before rendering page
  const sponsors = await getPublicSponsors();
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
              Programs and opportunities that help Unilorin students learn, build skills and grow across STEM.
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
            <p className="pr-head__note">New scholarships are announced here as soon as they open. Check back soon.</p>
          </div>

          <div className="pr-sc-empty">
            <div className="pr-sc-empty__icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="8" r="6" />
                <path d="M8.2 13.2 6 22l6-3 6 3-2.2-8.8" />
              </svg>
            </div>
            <div>
              <h3>No scholarship is currently open.</h3>
              <p>
                There are no scholarships available at the moment. When a new opportunity opens, its deadline
                and eligibility will be listed right here.
              </p>
              <div className="pr-sc-empty__actions">
                <Link href="/contact" className="link">Ask about upcoming scholarships</Link>
                <Link href="/join" className="link">Get involved with the chapter</Link>
              </div>
            </div>
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

          {sponsors.length > 0 && (
            <div className="pr-partners">
              <p className="eyebrow">Our partners</p>
              <h3 className="pr-partners__title">Organisations that support the chapter.</h3>
              <SponsorGrid items={sponsors} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
