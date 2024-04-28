import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { deltaData } from "./data";
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

export default function DotPDF({ data, setGoal }) {
  const svgElem = useRef();
  const razorElem = useRef();
  const dragging = useRef(false);

  const margin = { top: 10, right: 30, bottom: 50, left: 50 },
    width = 600,
    height = 400;

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
        d3.axisBottom().scale(d3.scaleLinear().domain(DOMAIN).range([0, width]))
      )
      .append("text")
      .attr("fill", "black")
      .attr("transform", `translate(${width / 2}, ${30})`)
      .text("Delivery (TAF)");
    svg
      .append("text")
      .text("test")
      .style("font-size", 11)
      .attr("class", "left-text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${100},${50})`);

    svg
      .append("text")
      .text("test2")
      .style("font-size", 11)
      .attr("class", "right-text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${300},${50})`);

    razorElem.current = document.querySelector("#pdf-razor");
    razorElem.current.style.left = margin.left + "px";
    setGoal(0);

    document.querySelector("#pdf-razor").addEventListener("mousedown", (e) => {
      dragging.current = true;
    });

    document.addEventListener("mouseup", (e) => {
      dragging.current = false;
    });

    document
      .querySelector("#pdf-wrapper")
      .addEventListener("mousemove", (e) => {
        if (dragging.current === true && e.target.id === "pdf-wrapper") {
          razorElem.current.style.left = e.offsetX + "px";
          const goal = d3
            .scaleLinear()
            .domain([margin.left, width + margin.left])
            .range(DOMAIN)(e.offsetX);
          setGoal(goal);
        }
      });
  }, []);

  useEffect(() => {
    const svg = d3.select(svgElem.current).select(".graph-area");
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain(RANGE).range([height, 0]);

    const circData = getQuantileBins(data, DOMAIN, RANGE, width, height);
    svg
      .selectAll("circle")
      .data(circData, (_, i) => i)
      .join("circle")
      .transition()
      .delay((d) => d3.scaleLinear(RANGE).invert(d[1]) * 100)
      .duration(500)
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("r", height / NUM_CIRCLES / 2);
  }, [data]);

  return (
    <div className="dot-pdf-wrapper" id="pdf-wrapper">
      <div className="pdf-razor" id="pdf-razor"></div>
      <svg ref={svgElem}></svg>
    </div>
  );
}
