"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useChartPalette, usePrefersReducedMotion } from "./hooks";

export type DonutSlice = { label: string; value: number };

const SIZE = 300;
const OUTER = SIZE / 2 - 10;
const INNER = OUTER * 0.64;

export function ServiceDonut({ data, centerLabel }: { data: DonutSlice[]; centerLabel: string }) {
  const palette = useChartPalette();
  const reducedMotion = usePrefersReducedMotion();
  const groupRef = useRef<SVGGElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = useMemo(() => d3.sum(data, (d) => d.value), [data]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const pie = d3
      .pie<DonutSlice>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.025);
    const arc = d3.arc<d3.PieArcDatum<DonutSlice>>().innerRadius(INNER).outerRadius(OUTER).cornerRadius(6);
    const arcs = pie(data);

    const paths = d3
      .select(group)
      .selectAll<SVGPathElement, d3.PieArcDatum<DonutSlice>>("path")
      .data(arcs)
      .join("path")
      .attr("fill", (_, i) => palette.series[i % 5])
      .attr("stroke", palette.surface)
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d) => `${d.data.label}: ${Math.round((d.data.value / total) * 100)} درصد`)
      .on("mouseenter focus", (_, d) => setActiveIndex(d.index))
      .on("mouseleave blur", () => setActiveIndex(null));

    if (reducedMotion) {
      paths.attr("d", arc);
      return;
    }

    paths
      .transition()
      .duration(1100)
      .delay((_, i) => i * 120)
      .ease(d3.easeCubicOut)
      .attrTween("d", (d) => {
        const interpolate = d3.interpolate({ ...d, endAngle: d.startAngle }, d);
        return (t) => arc(interpolate(t)) ?? "";
      });

    return () => {
      paths.interrupt();
    };
  }, [data, palette, reducedMotion, total]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const grow = d3.arc<d3.PieArcDatum<DonutSlice>>().innerRadius(INNER).outerRadius(OUTER + 8).cornerRadius(6);
    const base = d3.arc<d3.PieArcDatum<DonutSlice>>().innerRadius(INNER).outerRadius(OUTER).cornerRadius(6);
    d3.select(group)
      .selectAll<SVGPathElement, d3.PieArcDatum<DonutSlice>>("path")
      .transition("hover")
      .duration(220)
      .attr("opacity", (d) => (activeIndex === null || d.index === activeIndex ? 1 : 0.35))
      .attr("d", (d) => (d.index === activeIndex ? grow(d) : base(d)) ?? "");
  }, [activeIndex]);

  const active = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
      <div className="relative w-full max-w-[280px] shrink-0">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full overflow-visible" role="img" aria-label="سهم هر خدمت از پروژه‌های پویان هاب">
          <g ref={groupRef} transform={`translate(${SIZE / 2},${SIZE / 2})`} />
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-3xl font-black text-foreground">
              {active ? `${Math.round((active.value / total) * 100).toLocaleString("fa-IR")}٪` : total.toLocaleString("fa-IR")}
            </div>
            <div className="mt-1 text-xs text-muted">{active ? active.label : centerLabel}</div>
          </div>
        </div>
      </div>

      <ul className="grid w-full gap-2">
        {data.map((slice, index) => (
          <li key={slice.label}>
            <button
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                activeIndex === index ? "border-border-strong bg-surface-2" : "border-transparent"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: palette.series[index % 5] }} />
                <span className="font-medium text-foreground">{slice.label}</span>
              </span>
              <span className="tabular-nums text-muted">{slice.value.toLocaleString("fa-IR")} پروژه</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
