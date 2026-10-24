import type { Metadata } from "next";
import Link from "next/link";
import ResourceRequestForm from "@/components/forms/ResourceRequestForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a resource | NSBE Unilorin",
  description: "Request a past question, lecture material or final-year project from the NSBE Unilorin Academic Hub.",
};

const REQUEST_STEPS = [
  { label: "What we collect", value: "Your name, email, department, level and the course or project resource you are looking for." },
  { label: "Why we collect it", value: "To help the chapter review and respond to your resource request." },
  { label: "Who can see it", value: "Authorized NSBE Unilorin executives." },
  { label: "Questions", value: CONTACT_EMAIL },
];

export default function RequestResourcePage() {
  return (
    <>
      <section className="fm-tut-intro">
        <div className="container fm-tut-intro__grid">
          <div>
            <p className="eyebrow">Academic Hub</p>
            <h1 className="fm-title">Request a resource.</h1>
          </div>
          <div>
            <p className="lead fm-lead">
              Can’t find the past question, lecture material or project you need? Tell us what you’re looking for and the chapter will review your request.
            </p>
            <Link href="/academic-hub" className="link">← Back to the Academic Hub</Link>
          </div>
        </div>
      </section>

      <section className="fm-tut-body">
        <div className="container fm-tut">
          <ResourceRequestForm />

          <aside className="fm-privacy" aria-labelledby="resource-privacy-title">
            <p className="eyebrow eyebrow--light">Your request</p>
            <h2 id="resource-privacy-title">What happens next?</h2>
            <dl>
              {REQUEST_STEPS.map((step) => (
                <div className="fm-privacy__row" key={step.label}>
                  <dt>{step.label}</dt>
                  <dd>{step.value}</dd>
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
