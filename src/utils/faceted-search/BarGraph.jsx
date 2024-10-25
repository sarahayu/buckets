import * as d3 from "d3";
import React, { useLayoutEffect, useRef } from "react";

export default function BarGraph({ data, range, width, height }) {
  const CHART_MARGIN = { top: 40, right: 40, bottom: 40, left: 70 };

  const svgElement = useRef();

  useLayoutEffect(function initialize() {
    const svgContainer = svgElement.current
      .attr("width", width + CHART_MARGIN.left + CHART_MARGIN.right)
      .attr("height", height + CHART_MARGIN.top + CHART_MARGIN.bottom)
      .append("g")
      .attr("class", "svg-container")
      .attr("transform", `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`);

    svgContainer.append("g").attr("class", "axis-x");
    svgContainer
      .append("g")
      .attr("class", "axis-y")
      .append("text")
      .attr("class", "axis-y-label")
      .text("Deliveries (TAF)")
      .attr(
        "transform",
        `translate(${-CHART_MARGIN.left + 5}, ${height / 2}) rotate(-90)`
      );
  }, []);

  useLayoutEffect(
    function onDataChange() {
      const svgContainer = svgElement.current.select(".svg-container");

      const x = d3
        .scaleBand()
        .domain(data.map((_, i) => i))
        .range([0, width])
        .padding(0.4);
      const y = d3.scaleLinear().domain(range).range([height, 0]);

      const xaxis = d3
        .axisBottom(x)
        .tickSize(0)
        .tickFormat((d) => `year ${d + 1}`)
        .tickValues(x.domain().filter((_, i) => i === 0 || (i + 1) % 10 === 0));

      svgContainer
        .select(".axis-x")
        .attr("opacity", 1)
        .attr("transform", `translate(0, ${height})`)
        .call(xaxis);
      svgContainer
        .select(".axis-y")
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

      svgContainer
        .selectAll(".bars")
        .data(data)
        .join("rect")
        .attr("class", "bars")
        .attr("fill", "steelblue")
        .attr("x", (d, i) => x(i))
        .attr("width", x.bandwidth())
        .transition()
        .duration(500)
        .delay((d, i) => i * 10)
        .attr("y", (d) => y(d))
        .attr("height", (d) => height - y(d));
    },
    [data]
  );
  return (
    <svg
      className="bar-graph"
      ref={(e) => void (svgElement.current = d3.select(e))}
    ></svg>
  );
}
