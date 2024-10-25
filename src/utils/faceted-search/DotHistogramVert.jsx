import * as d3 from "d3";
import React, { useLayoutEffect, useRef } from "react";
import { quantileBins } from "bucket-lib/quantile-bins";
import { WATERDROP_ICON } from "bucket-lib/utils";

export default function DotHistogramVert({
  data,
  range,
  width,
  height,
  numCircles = 25,
}) {
  const CHART_MARGIN = { top: 5, right: 10, bottom: 5, left: 60 };

  const svgElement = useRef();

  useLayoutEffect(function initialize() {
    const svgContainer = svgElement.current
      .attr("width", width + CHART_MARGIN.left + CHART_MARGIN.right)
      .attr("height", height + CHART_MARGIN.top + CHART_MARGIN.bottom)
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`);

    svgContainer
      .append("g")
      .attr("class", "axis-y")
      .append("text")
      .attr("class", "axis-y-label")
      .attr(
        "transform",
        `translate(${-CHART_MARGIN.left + 5}, ${height / 2}) rotate(-90)`
      )
      .text("Deliveries (TAF)");
  }, []);

  useLayoutEffect(
    function onDataChange() {
      const domain = [0, data.length];
      const x = d3.scaleLinear().domain(domain).range([0, width]);
      const y = d3.scaleLinear().domain(range).range([height, 0]);

      const svgContainer = svgElement.current
        .select(".graph-area")
        .attr(
          "transform",
          `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`
        );

      svgContainer
        .select(".axis-y")
        .call(d3.axisLeft().scale(y).tickFormat(d3.format(".2s")));

      const qbins = quantileBins(
        height,
        width,
        data.length / numCircles,
        range
      );

      const svgCircles = svgElement.current
        .select(".graph-area")
        .selectAll(".icons")
        .data(qbins(data))
        .join((enter) => enter.append("g").call((s) => s.append("path")))
        .attr("class", "icons")
        .call((s) => {
          s.selectAll("path").attr(
            "d",
            d3.symbol(WATERDROP_ICON, width / numCircles)
          );
        });

      svgCircles
        .transition()
        .delay((_, i) => i * 10)
        .attr("transform", (d) => `translate(${x(d[1])},${y(d[0])})`);

      svgCircles.attr("fill", "steelblue");
    },
    [data]
  );

  return <svg ref={(e) => void (svgElement.current = d3.select(e))}></svg>;
}
