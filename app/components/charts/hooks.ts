"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useThemeValue } from "../theme-store";

/** Palette read from the CSS custom properties that both themes define. */
export type ChartPalette = {
  brand: [string, string, string, string, string];
  series: [string, string, string, string, string];
  foreground: string;
  muted: string;
  grid: string;
  surface: string;
};

const FALLBACK_PALETTE: ChartPalette = {
  brand: ["#6d28d9", "#0891b2", "#c2410c", "#be185d", "#15803d"],
  series: ["#6d28d9", "#0891b2", "#ea580c", "#be185d", "#15803d"],
  foreground: "#13131d",
  muted: "#5a5a72",
  grid: "rgba(19,19,29,0.08)",
  surface: "#ffffff",
};

function readPalette(): ChartPalette {
  const styles = getComputedStyle(document.documentElement);
  const value = (name: string) => styles.getPropertyValue(name).trim();
  const five = (prefix: string) =>
    [1, 2, 3, 4, 5].map((i) => value(`${prefix}-${i}`)) as ChartPalette["brand"];

  return {
    brand: five("--brand"),
    series: five("--chart"),
    foreground: value("--foreground"),
    muted: value("--muted"),
    grid: value("--grid"),
    surface: value("--surface"),
  };
}

/**
 * Theme palette for D3 drawings. Server render and hydration use the fallback;
 * afterwards it is re-read from CSS whenever `data-theme` changes.
 */
export function useChartPalette(): ChartPalette {
  const theme = useThemeValue();
  return useMemo(() => (theme === null ? FALLBACK_PALETTE : readPalette()), [theme]);
}

/** Element width measured with a ResizeObserver; 0 until the first measurement. */
export function useMeasuredWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** True when the visitor asked for reduced motion via the OS setting. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}
