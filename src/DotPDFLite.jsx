import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { quantileBins, ticksExact } from "./utils";

const DOMAIN = [0, 1200];
const RANGE = [0, 80];
const NUM_CIRCLES = 20;
const UNITS_PER_CIRC = (RANGE[1] - RANGE[0]) / NUM_CIRCLES;

function getQuantileBins(data, dataDomain, dataRange, graphWidth, graphHeight) {
  let histBins = d3
    .histogram()
    .value((d) => d)
    .domain(dataDomain)
    .thresholds(
      ticksExact(
        ...dataDomain,
        Math.ceil(graphWidth / (graphHeight / NUM_CIRCLES))
      )
    )(data);

  let binnedCircs = quantileBins(histBins, UNITS_PER_CIRC, NUM_CIRCLES);

  let circs = [];

  for (let b = 0; b < binnedCircs.length; b++) {
    for (let y = 0; y < binnedCircs[b]; y++) {
      circs.push([
        (histBins[b].x1 + histBins[b].x0) / 2,
        d3.scaleLinear(dataRange)((y + 0.5) / NUM_CIRCLES),
      ]);
    }
  }

  return circs;
}

export default function DotPDFLite({ data, goal, width = 600, height = 400 }) {
  const svgElem = useRef();
  const [count, setCount] = useState(0);
  const [circles, setCircles] = useState([]);

  const margin = { top: 10, right: 10, bottom: 10, left: 10 };

  useEffect(() => {
    const svg = d3
      .select(svgElem.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("pointer-events", "none")
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom()
          .scale(d3.scaleLinear().domain(DOMAIN).range([0, width]))
          .ticks(0, "")
      );
  }, []);

  useEffect(() => {
    const svg = d3.select(svgElem.current).select(".graph-area");
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain(RANGE).range([height, 0]);

    const circData = getQuantileBins(data, DOMAIN, RANGE, width, height);
    setCircles(circData);
    svg
      .selectAll("circle")
      .data(circData, (_, i) => i)
      .join("circle")
      .attr("r", height / NUM_CIRCLES / 2)
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("fill", (d) => (d[0] > goal ? "green" : "black"));
  }, [data]);

  useEffect(() => {
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain(RANGE).range([height, 0]);
    const a = d3
      .select(svgElem.current)
      .select(".graph-area")
      .selectAll("circle")
      .data(circles, (_, i) => i)
      .join("circle")
      .attr("r", height / NUM_CIRCLES / 2)
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("fill", (d) => (d[0] > goal ? "green" : "black"));
    setCount(circles.filter((d) => d[0] > goal).length);
  }, [goal, circles]);

  return <svg className="dot-pdf-shadowed" ref={svgElem}></svg>;
}
