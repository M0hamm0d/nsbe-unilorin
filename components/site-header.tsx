"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/*
  Site header (guide §8): simple, consistent, responsive; shows the
  active page; accessible mobile menu with a clear open/close state.
  Temporary text-only wordmark (approved decision 1): the official NSBE
  logo is not yet available, and the guide forbids recreating it (§5.1).
*/

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/programs", label: "Programs" },
  { href: "/academic-hub", label: "Academic Hub" },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__wordmark" onClick={closeMenu}>
          <span className="site-header__wordmark-title">NSBE Unilorin</span>
          <span className="site-header__wordmark-sub">
            National Society of Black Engineers · University of Ilorin
          </span>
        </Link>

        <div className="site-header__actions">
          {/* Primary nav (guide §6: About, Events, Programs, Academic Hub;
              Join NSBE as the visually distinct action) */}
          <nav className="site-nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-nav__link"
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/contact" className="btn btn-primary">
            Join NSBE
          </Link>

          {/* Mobile menu toggle (small screens only) */}
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* Accessible mobile menu (guide §8) */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Primary, mobile"
        >
          <Link
            href="/"
            className="mobile-menu__link"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={closeMenu}
          >
            Home
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-menu__link"
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="mobile-menu__link" onClick={closeMenu}>
            Join NSBE
          </Link>
        </nav>
      )}
    </header>
  );
}
