import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { deltaData } from "./data";

export default function LineGraph({ curScen }) {
  const svgElem = useRef();

  const graph_margin = { top: 10, right: 30, bottom: 30, left: 40 },
    graph_width = 400,
    graph_height = 400;

  useEffect(() => {
    const svg = d3
      .select(svgElem.current)
      .attr("width", graph_width + graph_margin.left + graph_margin.right)
      .attr("height", graph_height + graph_margin.top + graph_margin.bottom)
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${graph_margin.left},${graph_margin.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, graph_width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${graph_height})`)
      .call(d3.axisBottom().scale(x));

    const y = d3.scaleLinear().domain([0, 400]).range([graph_height, 0]);
    svg.append("g").call(d3.axisLeft().scale(y));
  }, []);

  useEffect(() => {
    const data = deltaData[curScen];

    const svg = d3.select(svgElem.current).select(".graph-area");
    const x = d3.scaleLinear().domain([0, 100]).range([0, graph_width]);
    const y = d3.scaleLinear().domain([0, 400]).range([graph_height, 0]);
    const line = svg.selectAll(".graphLine").data([data], function (d, i) {
      return i;
    });

    line
      .join("path")
      .attr("class", "graphLine")
      .transition()
      .duration(500)
      .attr(
        "d",
        d3
          .line()
          .x(function (d, i) {
            return x((i / data.length) * 100);
          })
          .y(function (d, i) {
            return y(d);
          })
      )
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5);
  }, [curScen]);

  return <svg ref={svgElem}></svg>;
}
