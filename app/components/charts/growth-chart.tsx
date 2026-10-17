"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useChartPalette, useMeasuredWidth, usePrefersReducedMotion } from "./hooks";

export type GrowthPoint = { month: string; before: number; after: number };

const faNumber = (value: number) => Math.round(value).toLocaleString("fa-IR");

/**
 * Two-series area chart comparing organic reach before and after working with
 * the studio. Animates on first view and shows a crosshair tooltip on hover/touch.
 */
export function GrowthChart({ data }: { data: GrowthPoint[] }) {
  const { ref: wrapperRef, width } = useMeasuredWidth<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const palette = useChartPalette();
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState<{ index: number; x: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [wrapperRef]);

  const height = width < 520 ? 260 : 320;
  const margin = { top: 20, right: 16, bottom: 34, left: 44 };

  useEffect(() => {
    const svgNode = svgRef.current;
    if (!svgNode || width === 0 || !visible) return;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // RTL reading order: the first month sits on the right.
    const x = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.month))
      .range([innerWidth, 0]);
    const maxValue = d3.max(data, (d) => Math.max(d.before, d.after)) ?? 100;
    const y = d3.scaleLinear().domain([0, maxValue * 1.12]).nice().range([innerHeight, 0]);

    const svg = d3.select(svgNode).attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    const makeGradient = (id: string, color: string, opacity: number) => {
      const gradient = defs.append("linearGradient").attr("id", id).attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 1);
      gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", opacity);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0);
    };
    makeGradient("growth-after", palette.series[0], 0.38);
    makeGradient("growth-before", palette.muted, 0.14);

    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    root
      .append("g")
      .selectAll("line")
      .data(y.ticks(4))
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", palette.grid);

    root
      .append("g")
      .selectAll("text")
      .data(y.ticks(4))
      .join("text")
      .attr("x", -10)
      .attr("y", (d) => y(d))
      .attr("dy", "0.32em")
      .attr("text-anchor", "end")
      .attr("fill", palette.muted)
      .attr("font-size", 11)
      .text((d) => `${faNumber(d)}k`);

    const step = width < 520 ? 2 : 1;
    root
      .append("g")
      .selectAll("text")
      .data(data.filter((_, i) => i % step === 0))
      .join("text")
      .attr("x", (d) => x(d.month) ?? 0)
      .attr("y", innerHeight + 24)
      .attr("text-anchor", "middle")
      .attr("fill", palette.muted)
      .attr("font-size", 11)
      .text((d) => d.month);

    const area = (key: "before" | "after") =>
      d3
        .area<GrowthPoint>()
        .x((d) => x(d.month) ?? 0)
        .y0(innerHeight)
        .y1((d) => y(d[key]))
        .curve(d3.curveMonotoneX);
    const line = (key: "before" | "after") =>
      d3
        .line<GrowthPoint>()
        .x((d) => x(d.month) ?? 0)
        .y((d) => y(d[key]))
        .curve(d3.curveMonotoneX);

    const series: { key: "before" | "after"; fill: string; stroke: string; dash?: string; width: number }[] = [
      { key: "before", fill: "url(#growth-before)", stroke: palette.muted, dash: "5 5", width: 1.8 },
      { key: "after", fill: "url(#growth-after)", stroke: palette.series[0], width: 3 },
    ];

    series.forEach((s) => {
      const areaPath = root.append("path").datum(data).attr("fill", s.fill).attr("d", area(s.key));
      const linePath = root
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", s.stroke)
        .attr("stroke-width", s.width)
        .attr("stroke-linecap", "round")
        .attr("d", line(s.key));

      if (reducedMotion) return;

      const length = linePath.node()?.getTotalLength() ?? 0;
      linePath
        .attr("stroke-dasharray", `${length} ${length}`)
        .attr("stroke-dashoffset", -length)
        .transition()
        .duration(1600)
        .ease(d3.easeCubicInOut)
        .attr("stroke-dashoffset", 0)
        .on("end", function () {
          d3.select(this).attr("stroke-dasharray", s.dash ?? null);
        });
      areaPath.attr("opacity", 0).transition().delay(500).duration(1200).attr("opacity", 1);
    });

    if (reducedMotion) {
      root.selectAll<SVGPathElement, unknown>("path").filter(function () {
        return this.getAttribute("stroke") === palette.muted;
      }).attr("stroke-dasharray", "5 5");
    }

    const last = data[data.length - 1];
    const endDot = root
      .append("g")
      .attr("transform", `translate(${x(last.month) ?? 0},${y(last.after)})`)
      .attr("opacity", reducedMotion ? 1 : 0);
    endDot.append("circle").attr("r", 10).attr("fill", palette.series[0]).attr("opacity", 0.2);
    endDot.append("circle").attr("r", 5).attr("fill", palette.series[0]).attr("stroke", palette.surface).attr("stroke-width", 2);
    if (!reducedMotion) endDot.transition().delay(1500).duration(400).attr("opacity", 1);

    const cursor = root
      .append("line")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", palette.foreground)
      .attr("stroke-opacity", 0.25)
      .attr("stroke-dasharray", "3 3")
      .attr("opacity", 0);

    const focus = root.append("g").attr("opacity", 0);
    focus.append("circle").attr("class", "f-before").attr("r", 4).attr("fill", palette.muted);
    focus.append("circle").attr("class", "f-after").attr("r", 5.5).attr("fill", palette.series[0]).attr("stroke", palette.surface).attr("stroke-width", 2);

    const positions = data.map((d) => x(d.month) ?? 0);

    root
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .style("touch-action", "pan-y")
      .on("pointermove pointerdown", (event: PointerEvent) => {
        const [px] = d3.pointer(event);
        let index = 0;
        let best = Infinity;
        positions.forEach((p, i) => {
          const distance = Math.abs(p - px);
          if (distance < best) {
            best = distance;
            index = i;
          }
        });
        const d = data[index];
        const cx = positions[index];
        cursor.attr("x1", cx).attr("x2", cx).attr("opacity", 1);
        focus.attr("opacity", 1);
        focus.select(".f-before").attr("cx", cx).attr("cy", y(d.before));
        focus.select(".f-after").attr("cx", cx).attr("cy", y(d.after));
        setActive({ index, x: cx + margin.left });
      })
      .on("pointerleave", () => {
        cursor.attr("opacity", 0);
        focus.attr("opacity", 0);
        setActive(null);
      });
    // margin is a constant literal; listing it would re-run on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width, height, palette, reducedMotion, visible]);

  const activePoint = active ? data[active.index] : null;
  const lift = activePoint ? Math.round(((activePoint.after - activePoint.before) / activePoint.before) * 100) : 0;

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ minHeight: height }}>
      <svg
        ref={svgRef}
        className="h-auto w-full"
        role="img"
        aria-label="نمودار مقایسه دسترسی ارگانیک ماهانه، پیش و پس از همکاری با پویان هاب"
      />
      {activePoint && active ? (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-40 -translate-x-1/2 rounded-xl border border-border bg-surface/95 px-3 py-2 text-xs shadow-lg backdrop-blur"
          style={{ left: Math.min(Math.max(active.x, 90), width - 90) }}
        >
          <div className="mb-1 font-bold text-foreground">{activePoint.month}</div>
          <div className="flex items-center justify-between gap-4 text-muted">
            <span>پیش از همکاری</span>
            <span className="font-semibold text-foreground">{faNumber(activePoint.before)}k</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-muted">
            <span>با پویان هاب</span>
            <span className="font-semibold text-brand-1">{faNumber(activePoint.after)}k</span>
          </div>
          <div className="mt-1 border-t border-border pt-1 text-brand-5">
            {lift >= 0 ? "+" : ""}
            {faNumber(lift)}٪ رشد
          </div>
        </div>
      ) : null}
    </div>
  );
}
