import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { getQuantileBins } from "./bucket-lib/quantile-histogram";
import {
  WATERDROP_ICON,
  kernelDensityEstimator,
  kernelEpanechnikov,
} from "./utils";
import { MAX_DELIVS } from "./data";

const NUM_CIRCLES = 20;
const MARGIN = { top: 10, right: 10, bottom: 3, left: 0 };
const DOMAIN = [0, MAX_DELIVS];

export default function DotHistogramSmall({
  data,
  goal,
  width = 600,
  height = 400,
}) {
  const svgSelector = useRef();
  const circles = useMemo(
    () =>
      getQuantileBins(data, DOMAIN, data.length / NUM_CIRCLES, width, height),
    [data]
  );

  useEffect(() => {
    const svgContainer = svgSelector.current
      .attr("width", width + MARGIN.left + MARGIN.right)
      .attr("height", height + MARGIN.top + MARGIN.bottom)
      .style("pointer-events", "none")
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    svgContainer
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call((s) => {
        s.selectAll("line").attr("stroke", "gray");
        s.selectAll("path").attr("stroke", "gray");
      });

    svgContainer
      .append("path")
      .attr("class", "ridgeline")
      .attr("fill", "none")
      .attr("stroke", "steelblue");
  }, []);

  useEffect(() => {
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain([0, 0.05]).range([height, 0]).clamp(true);

    const kde = kernelDensityEstimator(
      kernelEpanechnikov(20),
      x.ticks(MAX_DELIVS / 4)
    );

    svgSelector.current
      .select(".graph-area")
      .select(".ridgeline")
      .datum(kde(data))
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
      );
  }, [data]);

  useEffect(() => {
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain([0, data.length]).range([height, 0]);

    svgSelector.current
      .select(".graph-area")
      .selectAll(".icons")
      .data(circles)
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "icons")
          .call((s) => s.append("path"))
      )
      .call((s) => {
        s.select("path").attr(
          "d",
          d3.symbol(WATERDROP_ICON, height / NUM_CIRCLES)
        );
      })
      .attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`)
      .attr("fill", (d) => (d[0] > goal ? "steelblue" : "black"));
  }, [goal, circles]);

  return (
    <svg
      className="dot-pdf-shadowed"
      ref={(e) => void (svgSelector.current = d3.select(e))}
    ></svg>
  );
}
