import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import { quantileBins } from "bucket-lib/quantile-bins";
import { WATERDROP_ICON } from "utils/common";
import { MAX_DELIVS } from "data/objectivesData";

const NUM_CIRCLES = 20;
const MARGIN = { top: 10, right: 30, bottom: 50, left: 50 };
const DOMAIN = [0, MAX_DELIVS];

export default function DotHistogram({
  data,
  goal,
  setGoal,
  width = 600,
  height = 400,
}) {
  const svgSelector = useRef();
  const circles = useMemo(
    () => quantileBins(width, height, data.length / NUM_CIRCLES, DOMAIN)(data),
    [data]
  );

  const dataRange = [0, data.length];
  const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
  const y = d3.scaleLinear().domain(dataRange).range([height, 0]);
  const count = circles.filter((d) => d[0] > goal).length;

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

    const razor = document.querySelector("#pdf-razor");
    razor.style.transform = `translateX(${d3
      .scaleLinear()
      .domain(DOMAIN)
      .range([MARGIN.left, width + MARGIN.left])
      .clamp(true)(goal)}px)`;

    const ignoreFn = (e) => e.preventDefault();
    let dragging = false;

    document.querySelector("#pdf-razor").addEventListener("mousedown", () => {
      dragging = true;
      window.addEventListener("selectstart", ignoreFn);
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
      window.removeEventListener("selectstart", ignoreFn);
    });

    document
      .querySelector("#pdf-wrapper")
      .addEventListener("mousemove", (e) => {
        if (dragging && e.target.id === "pdf-wrapper") {
          razor.style.transform = `translateX(${Math.min(
            Math.max(e.offsetX, MARGIN.left),
            MARGIN.left + width
          )}px)
            `;

          setGoal(
            d3
              .scaleLinear()
              .domain([MARGIN.left, width + MARGIN.left])
              .range(DOMAIN)
              .clamp(true)(e.offsetX)
          );
        }
      });
  }, []);

  useEffect(() => {
    const svgCircles = svgSelector.current
      .select(".graph-area")
      .selectAll(".icons")
      .data(circles)
      .join((enter) => enter.append("g").call((s) => s.append("path")))
      .attr("class", "icons")
      .call((s) => {
        s.selectAll("path").attr(
          "d",
          d3.symbol(WATERDROP_ICON, height / NUM_CIRCLES)
        );
      });

    svgCircles
      .transition("position")
      .delay((d) => d3.scaleLinear(dataRange).invert(d[1]) * 100)
      .duration(500)
      .attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`);

    svgCircles
      .transition("color")
      .delay((d) => d3.scaleLinear(dataRange).invert(d[1]) * 100)
      .duration(0)
      .attr("fill", (d) => (d[0] > goal ? "steelblue" : "black"));
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
      <svg ref={(e) => void (svgSelector.current = d3.select(e))}></svg>
    </div>
  );
}
