import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { dateParts, splitEvents, type ChapterEvent } from "@/lib/events";
import { getPublicEvents } from "@/lib/admin/actions";
import PastEvents from "@/components/PastEvents";
import Image from "next/image";
import "./events.css";

export const metadata: Metadata = {
  title: "Events | NSBE Unilorin",
  description:
    "Upcoming NSBE Unilorin events with date, time, venue, organizer and registration links, plus a record of past events.",
};

export const instant = false;

function RegisterAction({ e }: { e: ChapterEvent }) {
  return e.registerUrl ? (
    <Link href={e.registerUrl} className="ev-open">
      Register<span className="sr-only"> for {e.name}</span>
    </Link>
  ) : (
    <span className="ev-na">Registration not open yet</span>
  );
}

async function getEventsByDate() {
  const events = await getPublicEvents();
  return splitEvents(events);
}

export default async function EventsPage() {
  await connection();
  const { upcoming, past } = await getEventsByDate();
  const [next, ...rest] = upcoming;

  return (
    <div className="events-page">
      {/* Intro */}
      <section className="ev-intro">
        <div className="container ev-intro__grid">
          <div>
            <p className="eyebrow">NSBE Unilorin · Events</p>
            <h1 className="ev-title">Good people. Big ideas. What’s next.</h1>
          </div>
          <div>
            <p className="lead ev-lead">
              Find your next chance to connect, build skills and move engineering forward with our community.
            </p>
            <nav className="ev-jumps" aria-label="On this page">
              <a href="#upcoming" className="ev-jump ev-jump--on">Coming up <b>{upcoming.length}</b></a>
              <a href="#past" className="ev-jump">From the chapter <b>{past.length}</b></a>
            </nav>
          </div>
        </div>
      </section>

      {next ? (
        <>
          {/* Next event */}
          <section id="upcoming" className="ev-next-wrap">
            <div className="container">
              <article className="ev-next">
                <div className="ev-next__body">
                  <p className="ev-next__kicker"><span aria-hidden="true" /> Next up</p>
                  <p className="ev-next__date"><span>{dateParts(next.date).day}</span><span>{dateParts(next.date).month} {dateParts(next.date).year}</span></p>
                  <h2 className="ev-next__name">{next.name}</h2>
                  <dl className="ev-facts">
                    <dt>Time</dt><dd>{next.time ?? "To be confirmed"}</dd>
                    <dt>Venue</dt><dd>{next.venue ?? "To be confirmed"}</dd>
                    <dt>Organizer</dt><dd>{next.organizer}</dd>
                  </dl>
                  <div className="ev-next__actions">
                    {next.registerUrl ? (
                      <Link href={next.registerUrl} className="btn">Register</Link>
                    ) : (
                      <span className="ev-na">Registration not open yet</span>
                    )}
                    <Link href={`/events/${next.slug}`} className="link">Event details</Link>
                  </div>
                </div>
                <div className="ev-next__media">
                  {next.image && (
                    <Image
                      src={next.image}
                      alt={`Event flyer for ${next.name}`}
                      width={600}
                      height={400}
                      priority
                    />
                  )}
                  <span className="ev-next__media-caption">NSBE Unilorin · {dateParts(next.date).month} {dateParts(next.date).day}</span>
                </div>
              </article>
            </div>
          </section>

          {/* Upcoming list */}
          {rest.length > 0 && <section className="ev-section">
            <div className="container">
              <div className="ev-head">
                <div>
                  <p className="eyebrow">Save a date</p>
                  <h2 className="ev-h2">More on the calendar</h2>
                </div>
                <span className="ev-sorted">In date order</span>
              </div>
              <ul className="ev-list">
                {rest.map((e) => {
                  const d = dateParts(e.date);
                  const incomplete = !e.venue || !e.time;
                  return (
                    <li className="ev-row" key={e.id}>
                      <time className="ev-date" dateTime={e.date}><span>{d.day}</span><small>{d.month} {d.year}</small></time>
                      <div className="ev-row__body">
                        {incomplete && <span className="ev-row__note">Some details to be confirmed</span>}
                        <h3 className="ev-name">{e.name}</h3>
                        <p className="ev-meta">
                          {[e.time, e.venue, e.organizer].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <RegisterAction e={e} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>}
        </>
      ) : (
        <section id="upcoming" className="ev-section">
          <div className="container">
            <div className="ev-empty">
              <h2>No events scheduled right now.</h2>
              <p>Check back soon or follow our channels for updates.</p>
              <Link href="/contact" className="link">Follow the chapter</Link>
            </div>
          </div>
        </section>
      )}

      {/* Past events */}
      <PastEvents events={past} />

      {/* Join band */}
      <section className="ev-join-wrap">
        <div className="container">
          <div className="join ev-join">
            <div>
              <h2>Join NSBE Unilorin.</h2>
              <p>Become part of the chapter to hear about events first.</p>
            </div>
            <div className="join__actions" style={{ marginTop: 0 }}>
              <Link href="/join" className="btn">Join the chapter</Link>
              <Link href="/tutorial-interest" className="link">Register tutorial interest</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
