"use client";

import { useEffect, useId, useRef } from "react";
import * as d3 from "d3";
import { useChartPalette, usePrefersReducedMotion } from "./hooks";

export type RadarDatum = { label: string; value: number };

const LEVELS = [0.25, 0.5, 0.75, 1];

function angleFor(index: number, count: number) {
  return (index / count) * Math.PI * 2 - Math.PI / 2;
}

function pointAt(index: number, count: number, center: number, radius: number, ratio: number) {
  const angle = angleFor(index, count);
  return [center + Math.cos(angle) * radius * ratio, center + Math.sin(angle) * radius * ratio] as const;
}

export function CapabilityRadar({
  data,
  size = 460,
  caption,
}: {
  data: RadarDatum[];
  size?: number;
  caption?: string;
}) {
  const palette = useChartPalette();
  const reducedMotion = usePrefersReducedMotion();
  const polygonRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const gradientId = `radar-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const count = data.length;
  const center = size / 2;
  const radius = center - 70;

  useEffect(() => {
    const path = polygonRef.current;
    const dots = dotsRef.current;
    if (!path || !dots) return;

    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);
    const line = d3
      .lineRadial<RadarDatum>()
      .radius((datum) => rScale(datum.value))
      .angle((_, index) => (index / count) * Math.PI * 2)
      .curve(d3.curveCardinalClosed.tension(0.35));

    const scaled = (factor: number) =>
      line(data.map((datum) => ({ ...datum, value: datum.value * factor }))) ?? "";

    const final = (i: number) => pointAt(i, count, center, radius, data[i].value / 100);

    d3.select(path).attr("transform", `translate(${center},${center})`);

    const dotSelection = d3
      .select(dots)
      .selectAll<SVGCircleElement, RadarDatum>("circle")
      .data(data)
      .join("circle")
      .attr("r", 4.5)
      .attr("fill", palette.surface)
      .attr("stroke", palette.brand[1])
      .attr("stroke-width", 2.5);

    if (reducedMotion) {
      d3.select(path).attr("d", scaled(1));
      dotSelection.attr("cx", (_, i) => final(i)[0]).attr("cy", (_, i) => final(i)[1]);
      return;
    }

    d3.select(path)
      .attr("d", scaled(0))
      .transition()
      .duration(1250)
      .ease(d3.easeCubicOut)
      .attrTween("d", () => (t) => scaled(t));

    dotSelection
      .attr("cx", center)
      .attr("cy", center)
      .transition()
      .delay((_, i) => 500 + i * 70)
      .duration(900)
      .ease(d3.easeBackOut)
      .attr("cx", (_, i) => final(i)[0])
      .attr("cy", (_, i) => final(i)[1]);

    return () => {
      d3.select(path).interrupt();
      dotSelection.interrupt();
    };
  }, [data, palette, radius, center, count, reducedMotion]);

  const ringPoints = (ratio: number) =>
    data.map((_, index) => pointAt(index, count, center, radius, ratio).join(",")).join(" ");

  return (
    <figure className="relative">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={caption ?? "نمودار رادار توانمندی‌های استودیو"}
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={palette.brand[0]} stopOpacity="0.5" />
            <stop offset="100%" stopColor={palette.brand[1]} stopOpacity="0.14" />
          </radialGradient>
        </defs>

        <g className="text-border-strong">
          {LEVELS.map((level) => (
            <polygon
              key={level}
              points={ringPoints(level)}
              fill="none"
              stroke="currentColor"
              strokeWidth={level === 1 ? 1.4 : 0.8}
              opacity={level === 1 ? 1 : 0.55}
            />
          ))}
          {data.map((datum, index) => {
            const [x, y] = pointAt(index, count, center, radius, 1);
            return (
              <line
                key={datum.label}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth={0.8}
                opacity={0.6}
              />
            );
          })}
        </g>

        <path ref={polygonRef} fill={`url(#${gradientId})`} stroke={palette.brand[0]} strokeWidth="2.4" />
        <g ref={dotsRef} />

        {data.map((datum, index) => {
          const angle = angleFor(index, count);
          const [x, y] = pointAt(index, count, center, radius, 1.2);
          const cos = Math.cos(angle);
          return (
            <text
              key={datum.label}
              x={x}
              y={y}
              textAnchor={cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle"}
              dominantBaseline="middle"
              className="fill-muted text-[13px] font-semibold"
            >
              {datum.label}
              <tspan className="fill-foreground font-bold" dx="6">
                {datum.value.toLocaleString("fa-IR")}
              </tspan>
            </text>
          );
        })}
      </svg>
      {caption ? <figcaption className="mt-3 text-center text-xs text-muted">{caption}</figcaption> : null}
    </figure>
  );
}
