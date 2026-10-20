import type { Metadata } from "next";
import Link from "next/link";
import TutorialForm from "@/components/forms/TutorialForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tutorial interest | NSBE Unilorin",
  description:
    "Tell NSBE Unilorin which tutorials you need. Registering interest is not a booking; the chapter confirms subjects, schedules and tutors later.",
};

const PRIVACY = [
  { label: "What we collect", value: "Your name, email, department, level, tutorial subjects, and an optional phone number." },
  { label: "Why we collect it", value: "To plan tutorials that match what students ask for." },
  { label: "Who can see it", value: "Authorized NSBE Unilorin executives only." },
  { label: "How long we keep it", value: "[Retention period to be decided before launch]" },
  { label: "Questions", value: CONTACT_EMAIL },
];

export default function TutorialInterestPage() {
  return (
    <>
      <section className="fm-tut-intro">
        <div className="container fm-tut-intro__grid">
          <div>
            <p className="eyebrow">Tutorial interest</p>
            <h1 className="fm-title">Tell us which tutorials you need.</h1>
          </div>
          <p className="lead fm-lead">
            Register your interest so the chapter can plan tutorials around what students ask for. This is not a booking: subjects, schedules and tutors are confirmed later.
          </p>
        </div>
      </section>

      <section className="fm-tut-body">
        <div className="container fm-tut">
          <TutorialForm />

          <aside className="fm-privacy" aria-labelledby="fm-privacy-title">
            <p className="eyebrow eyebrow--light">Your information</p>
            <h2 id="fm-privacy-title">How we use your answers.</h2>
            <dl>
              {PRIVACY.map((p) => (
                <div className="fm-privacy__row" key={p.label}>
                  <dt>{p.label}</dt>
                  <dd>{p.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/privacy" className="link">Read the full privacy notice</Link>
          </aside>
        </div>
      </section>
    </>
  );
}

