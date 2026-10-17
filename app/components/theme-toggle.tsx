"use client";

import { toggleTheme } from "./theme-store";

/**
 * The knob position and the icon are driven purely by CSS from `data-theme`, so
 * the server-rendered markup is identical in both themes and hydration is safe.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تغییر تم روشن و تاریک"
      title="تغییر تم"
      className={`theme-toggle relative inline-flex h-10 w-[4.6rem] shrink-0 items-center rounded-full border border-border-strong bg-surface-2/70 px-1.5 transition-colors hover:border-brand-1 ${className}`}
    >
      <span aria-hidden className="theme-toggle-icon theme-toggle-sun">
        <SunIcon />
      </span>
      <span aria-hidden className="theme-toggle-icon theme-toggle-moon">
        <MoonIcon />
      </span>
      <span aria-hidden className="theme-toggle-knob" />
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" strokeLinecap="round" />
      <path
        d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path
        d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
