import Image from "next/image";
import Link from "next/link";
import type { Sponsor } from "@/lib/admin/types";
import "./sponsors.css";

function Logo({ sponsor }: { sponsor: Sponsor }) {
  if (!sponsor.logo) {
    return <span className="home-sponsors__pending">Logo coming soon</span>;
  }

  return (
    <Image
      src={sponsor.logo}
      alt={`${sponsor.name} logo`}
      fill
      sizes="(min-width: 64em) 260px, (min-width: 40em) 40vw, 80vw"
      className="home-sponsors__logo-image"
      unoptimized={sponsor.logo.startsWith("http") || sponsor.logo.endsWith(".svg")}
    />
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const contents = (
    <>
      <span className="home-sponsors__bar" aria-hidden="true" />
      <span className="home-sponsors__logo">
        <Logo sponsor={sponsor} />
      </span>
      <span className="home-sponsors__name">{sponsor.name}</span>
      {sponsor.description && (
        <span className="home-sponsors__description">{sponsor.description}</span>
      )}
      {sponsor.website && (
        <span className="home-sponsors__visit">
          Visit partner <span aria-hidden="true">↗</span>
        </span>
      )}
    </>
  );

  if (sponsor.website) {
    const href = /^https?:\/\//i.test(sponsor.website)
      ? sponsor.website
      : `https://${sponsor.website}`;

    return (
      <a
        className="home-sponsors__card home-sponsors__card--link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${sponsor.name} (opens in a new tab)`}
      >
        {contents}
      </a>
    );
  }

  return <div className="home-sponsors__card">{contents}</div>;
}

export default function Sponsors({ items }: { items: Sponsor[] }) {
  if (items.length === 0) return null;

  return (
    <section className="section home-sponsors" aria-labelledby="home-sponsors-heading">
      <div className="container">
        <p className="eyebrow">Sponsors &amp; partners</p>
        <h2 className="h2 home-sponsors__heading" id="home-sponsors-heading">
          Organisations that support the chapter.
        </h2>
        <p className="home-sponsors__intro">
          Thank you to the organisations investing in our members, programs and engineering community.
        </p>

        <ul className={`home-sponsors__grid${items.length === 1 ? " home-sponsors__grid--single" : ""}`}>
          {items.map((sponsor) => (
            <li key={sponsor.id} className="home-sponsors__item">
              <SponsorCard sponsor={sponsor} />
            </li>
          ))}
        </ul>

        <p className="home-sponsors__cta">
          Interested in supporting the chapter?{" "}
          <Link href="/contact" className="home-sponsors__link">
            Get in touch about partnering
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
