import Link from "next/link";

/*
  Next.js 16 (cacheComponents) treats `new Date()` as an unstable value
  during prerendering of static pages, so the year is a constant here.
  Update it at year end, or make it data-driven in a later Supabase phase.
*/
const COPYRIGHT_YEAR = 2026;

/*
  Shared footer (guide §8): consistent site navigation, identity, and
  relevant policy/contact information. Placeholder contact links are
  clearly marked pending (guide §5, §7.9, §12) — no fabricated channels.
*/
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__columns">
          <div>
            <Link href="/" className="site-footer__wordmark">
              NSBE Unilorin
            </Link>
            <p className="site-footer__note">
              National Society of Black Engineers — University of Ilorin
              student chapter.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3>Explore</h3>
            <ul className="site-footer__nav">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/programs">Programs</Link>
              </li>
              <li>
                <Link href="/academic-hub">Academic Hub</Link>
              </li>
              <li>
                <Link href="/contact">Contact / Join</Link>
              </li>
              <li>
                <Link href="/tutorial-interest">Tutorial interest form</Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3>Contact</h3>
            <ul className="site-footer__nav">
              <li>
                <span className="pending">Email — pending verification</span>
              </li>
              <li>
                <span className="pending">Social links — pending verification</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal line: honest attribution; official brand wording will be
            confirmed with the chapter before launch (guide §5.2). */}
        <p className="site-footer__legal">
          © {COPYRIGHT_YEAR} NSBE Unilorin. The National Society of Black
          Engineers name and logo belong to their respective owners; official
          brand assets will replace this text-only wordmark once approved.
        </p>
      </div>
    </footer>
  );
}
