"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "../lib/theme";

export type Theme = "light" | "dark";

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getThemeSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/** `null` on the server / during hydration, then the live `data-theme` value. */
export function useThemeValue(): Theme | null {
  return useSyncExternalStore<Theme | null>(subscribeTheme, getThemeSnapshot, () => null);
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage may be blocked; the theme still applies for this visit.
  }
}

export function toggleTheme() {
  setTheme(getThemeSnapshot() === "dark" ? "light" : "dark");
}
