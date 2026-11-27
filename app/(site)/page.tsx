import Link from "next/link";
import AcademicHubPreview from "@/components/AcademicHubPreview";
import Image from "next/image";
import { connection } from "next/server";
import Leadership from "@/app/files/Leadership";
import Sponsors from "@/components/Sponsors";
import { getPublicLeaders } from "@/lib/admin/actions";
import { getPublicSponsors } from "@/lib/admin/actions";
import { getPublicAcademicResources } from "@/lib/admin/actions";
import { getPublicEvents } from "@/lib/admin/actions";
import { dateParts, splitEvents } from "@/lib/events";

export const instant = false;

const quickLinks = [
  { href: "/academic-hub", title: "Academic Hub", text: "Past questions and materials by department and level." },
  { href: "/events", title: "Events", text: "What is coming up, and what we have done." },
  { href: "/programs", title: "Programs", text: "Initiatives and ways to take part." },
  { href: "/join", title: "Get involved", text: "Join the chapter or register tutorial interest." },
];

const programs = [
  { cls: "pcard--1", img: "/group-study.jpg", category: "Academic", name: "Peer Tutorial Series", text: "Helping students learn and grow together through peer-led tutorials." },
  { cls: "pcard--1", img: "/mentorship.jpg", category: "Career", name: "Industry Mentorship", text: "Get paired with a practising engineer for guidance on internships, skills and career paths." },
  { cls: "pcard--3", img: "/lab-nsbe.jpg", category: "Technical", name: "Build Lab", text: "Hands-on workshops where members design and build real engineering projects together." },
];


export default async function Home() {
  const sponsors = await getPublicSponsors();
  await connection();
  const leaders = await getPublicLeaders();
  const academicResources = await getPublicAcademicResources();
  const allEvents = await getPublicEvents();
  const { upcoming: upcomingEvents } = splitEvents(allEvents);
  const events = upcomingEvents.slice(0, 3);
  const leadershipItems = leaders.map((leader) => ({
    slug: `leader-${leader.id}`,
    name: leader.name,
    role: leader.role,
    term: [leader.termStart, leader.termEnd].filter(Boolean).join("–") || undefined,
    bio: leader.bio.trim().startsWith("{") || !leader.bio.trim() ? [] : [leader.bio],
    photo: leader.portrait,
    photoAlt: `Portrait of ${leader.name}`,
  }));
  const currentSession = leaders.find((leader) => leader.termStart || leader.termEnd);
  const leadershipSession = currentSession
    ? [currentSession.termStart, currentSession.termEnd].filter(Boolean).join("–")
    : undefined;

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__copy home-reveal">
              <p className="eyebrow">University of Ilorin · STEM community</p>
              <h1>
                We grow stronger when we <span className="u">build together.</span>
              </h1>
              <p className="lead hero__lead">
                NSBE Unilorin brings students together to learn, lead and create impact across STEM.
              </p>
              <div className="hero__actions">
                <Link href="/join" className="btn">Become a member</Link>
                <Link href="/events" className="link">Explore our events <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <div className="hero__media home-reveal">
              <Image src="/nsbe-hero.jpeg" alt="Students at an NSBE Unilorin chapter event on campus" width={600} height={400} />
              {/* <Image src="/nsbe-hero.png" alt="Students at an NSBE Unilorin chapter event on campus" width={600} height={400} /> */}
              {/* <Image src="/hero-image.jpg" alt="Students at an NSBE Unilorin chapter event on campus" width={600} height={400} /> */}
              <div className="hero__image-note">
                <span className="hero__image-note-dot" aria-hidden="true" />
                A community moving STEM forward
              </div>
            </div>
          </div>

          <nav className="quick home-reveal" aria-label="Explore NSBE Unilorin">
            {quickLinks.map((l) => (
              <Link key={l.href} href={l.href}>
                <strong>{l.title}<span aria-hidden="true">↗</span></strong>
                <span>{l.text}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* About */}
      <section className="section about">
        <div className="container about__grid home-reveal">
          <div className="about__media">
            <Image src="/about-nsbe.jpg" alt="NSBE Unilorin members on campus" width={600} height={400} />
          </div>
          <div>
            <p className="eyebrow">About the chapter</p>
            <h2>NSBE Unilorin is the University of Ilorin chapter of the National Society of Black Engineers.</h2>
            <p className="lead">
              We support Unilorin students with academic resources, hands-on learning and room to grow across STEM.
            </p>
            <Link href="/about" className="link">Read more about us</Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section events-section">
        <div className="container">
          <p className="eyebrow home-reveal">Connect, learn and lead</p>
          <div className="section-head">
            <h2 className="h2">Make room for what’s next.</h2>
            <Link href="/events" className="link">View all events</Link>
          </div>
          <div className="events">
            {events.length > 0 ? (
              events.map((event) => {
                const date = dateParts(event.date);
                return (
                  <article className="event home-reveal" key={event.id}>
                    <div className="event__date">
                      {date.day}
                      <small>{date.month}</small>
                    </div>
                    <div>
                      <span className="badge">Upcoming</span>
                      <h3 className="event__title">{event.name}</h3>
                      <p className="event__meta">
                        {[event.time, event.venue, event.organizer].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {event.registerUrl ? (
                      <Link href={event.registerUrl} className="link">
                        Register
                      </Link>
                    ) : (
                      <Link href="/events" className="link">
                        Event details
                      </Link>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="event home-reveal">
                <div />
                <div>
                  <span className="badge">Upcoming</span>
                  <h3 className="event__title">No events scheduled right now</h3>
                  <p className="event__meta">Check back soon or follow our channels for updates.</p>
                </div>
                <Link href="/events" className="link">View events</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section programs">
        <div className="container">
          <p className="eyebrow eyebrow--light home-reveal">Learn by doing</p>
          <h2 className="h2">Ways to grow beyond the classroom.</h2>
          <p className="programs__intro">Build your skills, find your people and get ready for what comes next.</p>
          <div className="programs__grid">
            {programs.map((p) => (
              <article key={p.name} className={`pcard ${p.cls} home-reveal`}>
                <Image src={p.img} alt="" width={600} height={400} />
                <div className="pcard__overlay" />
                <div className="pcard__body">
                  <span className="badge">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <Leadership items={leadershipItems} session={leadershipSession} />

      {/* Academic Hub */}
      <section className="section hub">
        <div className="container hub__grid home-reveal">
          <div>
            <p className="eyebrow">Academic Hub</p>
            <h2>Find the past question you need, fast.</h2>
            <p className="lead">
              Browse approved past questions, lecture materials and final-year project work across all 10 engineering departments, from 100L to 500L. Every resource is checked by chapter executives before it is published.
            </p>
            <Link href="/academic-hub" className="link">Open the Academic Hub</Link>
          </div>
          <AcademicHubPreview initialResources={academicResources} />
        </div>
      </section>

      {/* Join */}
      <section className="section join-section">
        <div className="container">
          <div className="join home-reveal">
            <h2>Join NSBE Unilorin.</h2>
            <p>Find your community, grow your skills and help shape what STEM can do.</p>
            <div className="join__actions">
              <Link href="/join" className="btn">Join the chapter</Link>
              <Link href="/tutorial-interest" className="link">Register tutorial interest</Link>
            </div>
          </div>
        </div>
      </section>

      <Sponsors items={sponsors} />
    </div>
  );
}
