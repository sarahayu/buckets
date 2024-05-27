import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getQuantileBins } from "./bucket-lib/quantile-histogram";
import { WATERDROP_ICON } from "./utils";

const NUM_CIRCLES = 20;
const MARGIN = { top: 10, right: 30, bottom: 50, left: 50 };
const DOMAIN = [0, 1200];

export default function DotHistogram({
  data,
  goal,
  setGoal,
  width = 600,
  height = 400,
}) {
  const svgElem = useRef();
  const razorElem = useRef();
  const dragging = useRef(false);

  const [count, setCount] = useState(0);
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    const svg = d3
      .select(svgElem.current)
      .attr("width", width + MARGIN.left + MARGIN.right)
      .attr("height", height + MARGIN.top + MARGIN.bottom)
      .style("pointer-events", "none")
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3.axisBottom().scale(d3.scaleLinear().domain(DOMAIN).range([0, width]))
      )
      .call((s) => {
        s.selectAll("line").attr("stroke", "gray");
        s.selectAll("path").attr("stroke", "gray");
        s.selectAll("text").attr("fill", "gray");
      })
      .append("text")
      .attr("fill", "black")
      .attr("transform", `translate(${width / 2}, ${30})`)
      .text("Delivery (TAF)");

    razorElem.current = document.querySelector("#pdf-razor");
    razorElem.current.style.left =
      d3
        .scaleLinear()
        .domain(DOMAIN)
        .range([MARGIN.left, width + MARGIN.left])
        .clamp(true)(goal) + "px";

    let ignoreFn = (e) => e.preventDefault();

    document.querySelector("#pdf-razor").addEventListener("mousedown", (e) => {
      dragging.current = true;
      window.addEventListener("selectstart", ignoreFn);
    });

    document.addEventListener("mouseup", (e) => {
      dragging.current = false;
      window.removeEventListener("selectstart", ignoreFn);
    });

    document
      .querySelector("#pdf-wrapper")
      .addEventListener("mousemove", (e) => {
        if (dragging.current === true && e.target.id === "pdf-wrapper") {
          razorElem.current.style.left =
            Math.min(Math.max(e.offsetX, MARGIN.left), MARGIN.left + width) +
            "px";
          const goal = d3
            .scaleLinear()
            .domain([MARGIN.left, width + MARGIN.left])
            .range(DOMAIN)
            .clamp(true)(e.offsetX);
          setGoal(goal);
        }
      });
  }, []);

  useEffect(() => {
    const dataRange = [0, data.length];
    const svg = d3.select(svgElem.current).select(".graph-area");
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain(dataRange).range([height, 0]);

    const circData = getQuantileBins(
      data,
      DOMAIN,
      data.length / NUM_CIRCLES,
      width,
      height
    );
    setCircles(circData);
    svg
      .selectAll(".icons")
      .data(circData, (_, i) => i)
      .join(
        function enter(s) {
          return s
            .append("g")
            .call(
              (s) =>
                void s
                  .append("path")
                  .attr("d", d3.symbol(WATERDROP_ICON, height / NUM_CIRCLES))
            );
        },
        function update(s) {
          return s.call(
            (s) =>
              void s
                .selectAll("path")
                .attr("d", d3.symbol(WATERDROP_ICON, height / NUM_CIRCLES))
          );
        }
      )
      .attr("class", "icons")
      .transition("one")
      .delay((d) => d3.scaleLinear(dataRange).invert(d[1]) * 100)
      .duration(500)
      .attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`)
      .transition("two")
      .delay((d) => d3.scaleLinear(dataRange).invert(d[1]) * 100)
      .duration(0)
      .attr("fill", (d) => (d[0] > goal ? "steelblue" : "black"));
  }, [data]);

  useEffect(() => {
    const dataRange = [0, data.length];
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain(dataRange).range([height, 0]);
    const a = d3
      .select(svgElem.current)
      .select(".graph-area")
      .selectAll(".icons")
      .data(circles, (_, i) => i)
      .call((s) => {
        s.selectAll("path").attr(
          "d",
          d3.symbol(WATERDROP_ICON, height / NUM_CIRCLES)
        );
      });
    a.transition("one")
      .delay((d) => d3.scaleLinear(dataRange).invert(d[1]) * 100)
      .duration(500)
      .attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`);
    a.transition("two")
      .delay((d) => d3.scaleLinear(dataRange).invert(d[1]) * 100)
      .duration(0)
      .attr("fill", (d) => (d[0] > goal ? "steelblue" : "black"));
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
