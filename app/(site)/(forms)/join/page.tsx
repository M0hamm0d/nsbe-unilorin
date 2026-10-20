import type { Metadata } from "next";
import JoinForm from "@/components/forms/JoinForm";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join NSBE | NSBE Unilorin",
  description:
    "Join NSBE Unilorin. Tell us about yourself and a chapter executive will contact you about next steps.",
};

const STEPS = [
  { title: "We receive your details", text: "Your response goes to the chapter executives only." },
  { title: "An executive contacts you", text: "We email you about next steps." },
  { title: "You start taking part", text: "Come to events, join programs and use the Academic Hub." },
];

export default function JoinPage() {
  return (
    <section className="fm-page">
      <div className="container fm-join">
        <div className="fm-side">
          <p className="eyebrow">Join the chapter</p>
          <h1 className="fm-title">Join NSBE Unilorin.</h1>
          <p className="lead fm-lead">
            For University of Ilorin engineering students who want to learn, build and belong. Tell us a little about yourself and an executive will get in touch.
          </p>

          <div className="fm-block">
            <p className="eyebrow">Who can join</p>
            <p>Students in the University of Ilorin’s engineering departments, from 100L to 500L.</p>
          </div>

          <p className="eyebrow fm-steps-label">What happens after you submit</p>
          <ol className="fm-steps">
            {STEPS.map((s, i) => (
              <li className="fm-step" key={s.title}>
                <span className="fm-num">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="fm-block fm-block--last">
            <p className="eyebrow">Prefer to talk to someone?</p>
            <p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="link">{CONTACT_EMAIL}</a>
              {SOCIAL_LINKS.map((s) => (
                <span key={s.label}> · <a href={s.href} className="link">{s.label}</a></span>
              ))}
            </p>
          </div>
        </div>

        <JoinForm />
      </div>
    </section>
  );
}
