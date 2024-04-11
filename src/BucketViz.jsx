import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { deltaData } from "./data";

export default function BucketViz({ curScen }) {
  const svgElem = useRef();

  const margin = { top: 10, right: 30, bottom: 30, left: 500 },
    width = 200,
    height = 400;

  useEffect(() => {
    const svg = d3
      .select(svgElem.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("g").attr("class", "graph-area");
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("stroke", "black")
      .attr("fill", "none");
  }, []);

  useEffect(() => {
    const data = deltaData[curScen];
    const grad = d3.select(svgElem.current).select(".graph-area");

    const y = d3.scaleLinear().domain([0, 400]).range([0, height]);

    const line = grad.selectAll(".bucketBox").data(
      d3.range(11).map((i) => i / 10),
      function (d, i) {
        return i;
      }
    );

    line
      .join("rect")
      .attr("class", "bucketBox")
      .transition()
      .duration(500)
      .attr("x", 0)
      .attr("y", (d) => height - y(data[Math.floor(d * data.length)]))
      .attr("width", width)
      .attr("height", (d) => y(data[Math.floor(d * data.length)]))
      .attr("fill", (d) => d3.interpolateBlues(d));
  }, [curScen]);

  return <svg ref={svgElem}></svg>;
}
