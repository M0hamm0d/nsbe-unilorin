"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/programs", label: "Programs & Scholarships" },
  { href: "/academic-hub", label: "Academic Hub" },
];

const aboutSublinks = [
  {
    href: "/about",
    title: "About Chapter",
    desc: "Our story, mission, and vision at Unilorin",
  },
  {
    href: "/leadership",
    title: "Meet Chapter Executives",
    desc: "Executive board, committee leads & officers",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(true);

  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAboutActive = pathname === "/about" || pathname.startsWith("/about/") || pathname === "/leadership" || pathname.startsWith("/leadership/");

  // Close menus on page navigation
  useEffect(() => {
    setDropdownOpen(false);
    setOpen(false);
  }, [pathname]);

  // Click outside & Escape handling
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image src="/nsbe-logo.png" alt="NSBE Unilorin official logo" width={100} height={50} />
          <span>NSBE Unilorin</span>
        </Link>

        <nav className="nav" aria-label="Main">
          {/* About Dropdown (Desktop) */}
          <div
            className="nav-dropdown"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className="nav-dropdown__btn"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              data-active={isAboutActive}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span>About</span>
              <ChevronDownIcon className="nav-dropdown__chevron" />
            </button>

            {dropdownOpen && (
              <div className="nav-dropdown__menu" role="menu">
                {aboutSublinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-dropdown__item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="nav-dropdown__item-title">{item.title}</span>
                    <span className="nav-dropdown__item-desc">{item.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other Nav Links */}
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}

          <Link href="/join" className="btn">
            Join NSBE
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          className="menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
          {/* Mobile About Submenu */}
          <div className="mobile-nav__group">
            <button
              type="button"
              className="mobile-nav__toggle"
              onClick={() => setMobileAboutOpen((v) => !v)}
              aria-expanded={mobileAboutOpen}
            >
              <span>About</span>
              <ChevronDownIcon className={`nav-dropdown__chevron ${mobileAboutOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileAboutOpen && (
              <div className="mobile-nav__sublinks">
                {aboutSublinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="mobile-nav__subitem"
                    onClick={() => setOpen(false)}
                  >
                    <span className="mobile-nav__subitem-title">{sub.title}</span>
                    <span className="mobile-nav__subitem-desc">{sub.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/join" className="btn" onClick={() => setOpen(false)}>
            Join NSBE
          </Link>
        </nav>
      )}
    </header>
  );
}
