import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { deltaData } from "./data";

export default function BucketViz({ curScen }) {
  const svgElem = useRef();

  const margin = { top: 0, right: 0, bottom: 0, left: 0 },
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
  }, []);

  useEffect(() => {
    const data = deltaData[curScen];
    const grad = d3.select(svgElem.current).select(".graph-area");

    const y = d3.scaleLinear().domain([0, 400]).range([0, height]);

    const line = grad.selectAll(".bucketBox").data(
      d3.range(10).map((i) => i / 10),
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

  return (
    <div
      className="bucket"
      style={{
        margin: "30px",
        marginTop: "10px",
        display: "inline-block",
        verticalAlign: "top",
        background: "black",
        clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
      }}
    >
      <svg
        style={{
          clipPath:
            "polygon(1px 1px, calc(100% - 1px) 1px, calc(90% - 1px) calc(100% - 1px), calc(10% + 1px) calc(100% - 1px))",
          background: "white",
          display: "block",
        }}
        ref={svgElem}
      ></svg>
    </div>
  );
}
