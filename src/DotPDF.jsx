import { useEffect, useRef, useState } from "react";
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

export default function DotPDF({
  data,
  goal,
  setGoal,
  width = 600,
  height = 400,
}) {
  const svgElem = useRef();
  const razorElem = useRef();
  const { current: ignoreText } = useRef((e) => e.preventDefault());
  const dragging = useRef(false);
  const [count, setCount] = useState(0);
  const [circles, setCircles] = useState([]);

  const margin = { top: 10, right: 30, bottom: 50, left: 50 };

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

    razorElem.current = document.querySelector("#pdf-razor");
    razorElem.current.style.left =
      d3
        .scaleLinear()
        .domain(DOMAIN)
        .range([margin.left, width + margin.left])
        .clamp(true)(goal) + "px";
    // razorElem.current.style.left = margin.left + "px";
    // setGoal(0);

    document.querySelector("#pdf-razor").addEventListener("mousedown", (e) => {
      dragging.current = true;
      window.addEventListener("selectstart", ignoreText);
    });

    document.addEventListener("mouseup", (e) => {
      dragging.current = false;
      window.removeEventListener("selectstart", ignoreText);
    });

    document
      .querySelector("#pdf-wrapper")
      .addEventListener("mousemove", (e) => {
        if (dragging.current === true && e.target.id === "pdf-wrapper") {
          razorElem.current.style.left =
            Math.min(Math.max(e.offsetX, margin.left), margin.left + width) +
            "px";
          const goal = d3
            .scaleLinear()
            .domain([margin.left, width + margin.left])
            .range(DOMAIN)
            .clamp(true)(e.offsetX);
          setGoal(goal);
        }
      });
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
      .transition("one")
      .delay((d) => d3.scaleLinear(RANGE).invert(d[1]) * 100)
      .duration(500)
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .transition("two")
      .delay((d) => d3.scaleLinear(RANGE).invert(d[1]) * 100)
      .duration(0)
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
      .attr("r", height / NUM_CIRCLES / 2);
    a.transition("one")
      .delay((d) => d3.scaleLinear(RANGE).invert(d[1]) * 100)
      .duration(500)
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]));
    a.transition("two")
      .delay((d) => d3.scaleLinear(RANGE).invert(d[1]) * 100)
      .duration(0)
      .attr("fill", (d) => (d[0] > goal ? "green" : "black"));
    setCount(circles.filter((d) => d[0] > goal).length);
  }, [goal, circles]);

  return (
    <div className="dot-pdf-wrapper" id="pdf-wrapper">
      <div className="pdf-razor" id="pdf-razor">
        <div>
          <span>
            {circles.length - count} out of {NUM_CIRCLES} years WILL NOT meet
            demand
          </span>
          <span>
            {count} out of {NUM_CIRCLES} years WILL meet demand
          </span>
        </div>
      </div>
      <svg ref={svgElem}></svg>
    </div>
  );
}
