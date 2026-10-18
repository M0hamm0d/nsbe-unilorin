import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <strong>NSBE Unilorin</strong>
          <p>University of Ilorin chapter of the<br />National Society of Black Engineers.</p>
        </div>
        <div>
          <strong>Explore</strong>
          <p className="inline">
            <Link href="/about">About</Link> · <Link href="/events">Events</Link> · <Link href="/programs">Programs</Link>
          </p>
          <p className="inline">
            <Link href="/academic-hub">Academic Hub</Link> · <Link href="/leadership">Leadership</Link>
          </p>
        </div>
        <div>
          <strong>Contact</strong>
          <a href="mailto:hello@nsbeunilorin.org">hello@nsbeunilorin.org</a>
          <p className="inline">
            <a href="https://instagram.com">Instagram</a> · <a href="https://x.com">X</a> · <a href="https://linkedin.com">LinkedIn</a>
          </p>
        </div>
        <div>
          <strong>Legal</strong>
          <Link href="/privacy">Privacy notice</Link>
          <p>Part of the National Society of Black Engineers network.</p>
        </div>
      </div>
    </footer>
  );
}
