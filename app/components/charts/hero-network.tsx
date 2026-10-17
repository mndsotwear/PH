"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useChartPalette, useMeasuredWidth, usePrefersReducedMotion } from "./hooks";

type NodeDatum = d3.SimulationNodeDatum & {
  id: string;
  label?: string;
  group: number;
  r: number;
};

type LinkDatum = d3.SimulationLinkDatum<NodeDatum>;

const HUBS: { id: string; label: string; group: number }[] = [
  { id: "hub", label: "پویان هاب", group: 0 },
  { id: "content", label: "تولید محتوا", group: 1 },
  { id: "web", label: "طراحی سایت", group: 2 },
  { id: "brand", label: "برندینگ", group: 3 },
  { id: "social", label: "شبکه‌های اجتماعی", group: 4 },
];

function buildGraph(satellitesPerHub: number) {
  const nodes: NodeDatum[] = HUBS.map((hub) => ({
    ...hub,
    r: hub.id === "hub" ? 34 : 22,
  }));
  const links: LinkDatum[] = HUBS.slice(1).map((hub) => ({ source: "hub", target: hub.id }));

  const random = d3.randomLcg(7);
  HUBS.slice(1).forEach((hub) => {
    for (let i = 0; i < satellitesPerHub; i += 1) {
      const id = `${hub.id}-${i}`;
      nodes.push({ id, group: hub.group, r: 3 + random() * 5 });
      links.push({ source: hub.id, target: id });
      if (random() > 0.72) {
        const other = HUBS[1 + Math.floor(random() * 4)];
        links.push({ source: id, target: `${other.id}-${Math.floor(random() * satellitesPerHub)}` });
      }
    }
  });

  return { nodes, links };
}

/**
 * Interactive force-directed graph for the hero: the studio hub connected to
 * its four disciplines and their many small outputs. Nodes follow the pointer
 * softly and can be dragged; colors track the active theme.
 */
export function HeroNetwork({ className = "" }: { className?: string }) {
  const { ref: wrapperRef, width } = useMeasuredWidth<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const palette = useChartPalette();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const svgNode = svgRef.current;
    if (!svgNode || width === 0) return;

    const height = Math.max(360, Math.min(560, width * 0.95));
    const compact = width < 480;
    const { nodes, links } = buildGraph(compact ? 7 : 11);
    const color = (group: number) => (group === 0 ? palette.foreground : palette.brand[(group - 1) % 5]);

    const svg = d3.select(svgNode).attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    HUBS.forEach((hub) => {
      const gradient = defs
        .append("radialGradient")
        .attr("id", `hero-glow-${hub.id}`);
      gradient.append("stop").attr("offset", "0%").attr("stop-color", color(hub.group)).attr("stop-opacity", 0.45);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", color(hub.group)).attr("stop-opacity", 0);
    });

    const glow = svg
      .append("g")
      .selectAll("circle")
      .data(nodes.filter((node) => node.label))
      .join("circle")
      .attr("r", (node) => node.r * 2.6)
      .attr("fill", (node) => `url(#hero-glow-${node.id})`);

    const link = svg
      .append("g")
      .attr("stroke", palette.muted)
      .attr("stroke-opacity", 0.28)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => ((d.source as unknown as string) === "hub" ? 1.6 : 0.8));

    const node = svg
      .append("g")
      .selectAll<SVGGElement, NodeDatum>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "grab");

    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => (d.label ? palette.surface : color(d.group)))
      .attr("fill-opacity", (d) => (d.label ? 1 : 0.85))
      .attr("stroke", (d) => color(d.group))
      .attr("stroke-width", (d) => (d.label ? 2.5 : 0));

    node
      .filter((d) => Boolean(d.label))
      .append("text")
      .text((d) => d.label ?? "")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.r + 18)
      .attr("fill", palette.foreground)
      .attr("font-size", (d) => (d.id === "hub" ? 15 : 12.5))
      .attr("font-weight", 700)
      .attr("paint-order", "stroke")
      .attr("stroke", palette.surface)
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");

    node
      .filter((d) => d.id === "hub")
      .append("text")
      .text("P")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", palette.brand[0])
      .attr("font-size", 26)
      .attr("font-weight", 900);

    const simulation = d3
      .forceSimulation<NodeDatum>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, LinkDatum>(links)
          .id((d) => d.id)
          .distance((d) => ((d.source as NodeDatum).id === "hub" ? (compact ? 95 : 130) : compact ? 34 : 46))
          .strength(0.7),
      )
      .force("charge", d3.forceManyBody<NodeDatum>().strength((d) => (d.label ? -420 : -28)))
      .force("collide", d3.forceCollide<NodeDatum>().radius((d) => d.r + (d.label ? 16 : 3)))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.04))
      .force("y", d3.forceY(height / 2).strength(0.06));

    const hub = nodes[0];
    hub.fx = width / 2;
    hub.fy = height / 2;

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const render = () => {
      nodes.forEach((d) => {
        d.x = clamp(d.x ?? 0, d.r + 6, width - d.r - 6);
        d.y = clamp(d.y ?? 0, d.r + 6, height - d.r - 28);
      });
      link
        .attr("x1", (d) => (d.source as NodeDatum).x ?? 0)
        .attr("y1", (d) => (d.source as NodeDatum).y ?? 0)
        .attr("x2", (d) => (d.target as NodeDatum).x ?? 0)
        .attr("y2", (d) => (d.target as NodeDatum).y ?? 0);
      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
      glow.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);
    };

    simulation.on("tick", render);

    if (reducedMotion) {
      simulation.stop();
      for (let i = 0; i < 300; i += 1) simulation.tick();
      render();
      return () => {
        simulation.stop();
      };
    }

    const drag = d3
      .drag<SVGGElement, NodeDatum>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.25).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        if (d.id !== "hub") {
          d.fx = null;
          d.fy = null;
        }
      });

    node.call(drag);

    node
      .on("mouseenter", function (_, d) {
        const related = new Set<string>([d.id]);
        links.forEach((l) => {
          const s = (l.source as NodeDatum).id;
          const t = (l.target as NodeDatum).id;
          if (s === d.id) related.add(t);
          if (t === d.id) related.add(s);
        });
        node.transition().duration(200).style("opacity", (n) => (related.has(n.id) ? 1 : 0.18));
        link
          .transition()
          .duration(200)
          .attr("stroke-opacity", (l) =>
            (l.source as NodeDatum).id === d.id || (l.target as NodeDatum).id === d.id ? 0.75 : 0.06,
          );
      })
      .on("mouseleave", () => {
        node.transition().duration(300).style("opacity", 1);
        link.transition().duration(300).attr("stroke-opacity", 0.28);
      });

    svg.on("pointermove", (event: PointerEvent) => {
      const [px, py] = d3.pointer(event);
      hub.fx = width / 2 + (px - width / 2) * 0.08;
      hub.fy = height / 2 + (py - height / 2) * 0.08;
      simulation.alpha(Math.max(simulation.alpha(), 0.08)).restart();
    });

    const breathe = d3.interval(() => {
      simulation.alpha(Math.max(simulation.alpha(), 0.05)).restart();
    }, 4000);

    return () => {
      breathe.stop();
      simulation.stop();
      svg.on("pointermove", null);
    };
  }, [width, palette, reducedMotion]);

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <svg
        ref={svgRef}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-label="شبکه خدمات پویان هاب: تولید محتوا، طراحی سایت، برندینگ و شبکه‌های اجتماعی که همه به یک هسته متصل‌اند"
      />
    </div>
  );
}
