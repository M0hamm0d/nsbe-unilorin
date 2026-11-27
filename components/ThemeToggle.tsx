"use client";

import { useLayoutEffect } from "react";

const STORAGE_KEY = "nsbe-theme";

type Theme = "light" | "dark";

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Re-apply the stored theme after hydration. The inline script in the root
  // layout already does this before first paint; this keeps dev remounts and
  // client-side navigation in sync.
  useLayoutEffect(() => {
    const theme =
      readStoredTheme() ??
      (document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light");
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next: Theme = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or storage disabled: the theme still applies for this page.
    }
  }

  return (
    <button
      type="button"
      className={`theme-toggle${className ? ` ${className}` : ""}`}
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Switch between light and dark mode"
    >
      <svg
        className="theme-toggle__moon"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg
        className="theme-toggle__sun"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.42 1.42" />
      </svg>
    </button>
  );
}
