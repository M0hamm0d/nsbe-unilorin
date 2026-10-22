import type { Metadata } from "next";
import Link from "next/link";
import { FACTS, MISSION, PILLARS, VISION, WHAT_WE_DO } from "@/lib/about";
import "./about.css"
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | NSBE Unilorin",
  description:
    "NSBE Unilorin is the University of Ilorin chapter of the National Society of Black Engineers. Our mission, vision and what we do.",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Intro */}
      <section className="ab-intro">
        <div className="container ab-intro__grid">
          <div className="ab-reveal">
            <p className="eyebrow">About the chapter</p>
            <h1 className="ab-title">
              Building a community of engineers who lead, innovate, and inspire.
            </h1>
            <p className="lead ab-lead">
              NSBE Unilorin connects engineering students through shared experiences, learning opportunities, professional development, and a commitment to excellence.
            </p>
          </div>
          <div className="ab-photo ab-photo--hero ab-reveal">
            {/* Replace src with an approved campus or member photo */}
            <Image
              src="/about-1.jpg"
              alt="NSBE Unilorin members on the University of Ilorin campus"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Story, mission and vision */}
      <section className="ab-mv">
        <div className="container">
          <div className="ab-bento">
            <article className="ab-story ab-reveal">
              {/* Replace src with an approved chapter photo */}
              <Image
                width={500}
                height={300}
                src="/what-we-do.jpg"
                alt="NSBE Unilorin members working together"
                className="ab-story__img"
              />
              <h2>What We Do</h2>
              <p>{WHAT_WE_DO}</p>
            </article>

            <article className="ab-tile ab-tile--mission ab-reveal">
              <h2>Our Mission</h2>
              <p>{MISSION}</p>
            </article>

            <article className="ab-tile ab-tile--vision ab-reveal">
              <h2>Our Vision</h2>
              <p>{VISION}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Pillars */}
      {/* <section className="ab-do">
        <div className="container">
          <div className="ab-pillars">
            {PILLARS.map((p) => (
              <div className="ab-pillar ab-reveal" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <p className="note">Describe only what the chapter has confirmed it does. Plans and goals go in a separate, clearly labelled section.</p>
        </div>
      </section> */}

      {/* At a glance */}
      <section className="ab-glance">
        <div className="container ab-glance__grid">
          <div className="ab-photo ab-photo--chapter ab-reveal">
            {/* Replace src with an approved chapter event or member photo */}
            <Image src="/glance.jpg" alt="NSBE Unilorin members at a chapter event" width={500} height={300} />
          </div>
          <div className="ab-glance__content ab-reveal">
            <p className="eyebrow">NSBE Unilorin today</p>
            <h2 className="ab-h2">The chapter at a glance</h2>
            <dl className="ab-facts">
              {FACTS.map((f) => (
                <div className="ab-fact ab-reveal" key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Next step */}
      <section className="ab-cta-wrap">
        <div className="container">
          <div className="join ab-cta ab-reveal">
            <div>
              <h2>Be part of NSBE Unilorin.</h2>
              <p>Join the chapter, come to an upcoming event, or start with the resources in the Academic Hub.</p>
            </div>
            <div className="ab-cta__actions">
              <Link href="/join" className="btn">Join the chapter</Link>
              <div className="ab-cta__links">
                <Link href="/leadership" className="link">Meet Chapter Executives <span aria-hidden="true">↗</span></Link>
                <Link href="/events" className="link">See upcoming events</Link>
                <Link href="/academic-hub" className="link">Open the Academic Hub</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
