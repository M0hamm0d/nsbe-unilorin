import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getPublicEvents } from "@/lib/admin/actions";
import { dateParts } from "@/lib/events";
import "./event-recap.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Event recap | NSBE Unilorin",
  description: "Event details and recaps from NSBE Unilorin.",
};

export const instant = false;

export default async function EventRecapPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const events = await getPublicEvents();
  const event = events.find((item) => item.slug === slug);

  if (!event) notFound();

  const date = dateParts(event.date);
  const isPast = event.date < new Date().toISOString().slice(0, 10);

  return (
    <div className="event-recap-page">
      <section className="event-recap-intro">
        <div className="container">
          <Link href="/events#past" className="event-recap-back">
            <span aria-hidden="true">←</span> Back to events
          </Link>

          <div className="event-recap-heading">
            <p className="eyebrow">{isPast ? "Event recap" : "Event details"} · NSBE Unilorin</p>
            <h1>{event.name}</h1>
            <p className="event-recap-date">
              <time dateTime={event.date}>{date.day} {date.month} {date.year}</time>
            </p>
          </div>
        </div>
      </section>

      <section className="event-recap-content">
        <div className="container event-recap-grid">
          <article className="event-recap-story">
            {event.image && (
              <div className="event-recap-image">
                <Image
                  src={event.image}
                  alt={`Image for ${event.name}`}
                  fill
                  sizes="(max-width: 760px) 100vw, 65vw"
                  unoptimized
                  priority
                />
              </div>
            )}

            <div className="event-recap-copy">
              <p className="eyebrow">{isPast ? "Looking back" : "About this event"}</p>
              <h2>{isPast ? "A moment from the chapter" : "What to know"}</h2>
              {event.summary ? (
                <p className="event-recap-summary">{event.summary}</p>
              ) : (
                <p className="event-recap-summary event-recap-pending">
                  {isPast
                    ? "A recap for this event hasn’t been added yet. Here are the event details."
                    : "More information about this event will be shared by the chapter."}
                </p>
              )}
            </div>
          </article>

          <aside className="event-recap-details" aria-labelledby="event-recap-details-heading">
            <p className="eyebrow">The details</p>
            <h2 id="event-recap-details-heading">Event information</h2>
            <dl>
              <div>
                <dt>Date</dt>
                <dd>{date.day} {date.month} {date.year}</dd>
              </div>
              {event.time && (
                <div>
                  <dt>Time</dt>
                  <dd>{event.time}</dd>
                </div>
              )}
              {event.venue && (
                <div>
                  <dt>Venue</dt>
                  <dd>{event.venue}</dd>
                </div>
              )}
              <div>
                <dt>Organised by</dt>
                <dd>{event.organizer}</dd>
              </div>
            </dl>
            {event.registerUrl && !isPast && (
              <Link href={event.registerUrl} className="btn">
                Register for this event
              </Link>
            )}
          </aside>
        </div>
      </section>

      <section className="event-recap-next">
        <div className="container">
          <p>Keep learning, connecting and showing up.</p>
          <Link href="/events" className="link">Explore more NSBE Unilorin events <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
