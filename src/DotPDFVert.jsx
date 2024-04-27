import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { deltaData } from "./data";
import { quantileBins, ticksExact } from "./utils";

const DOMAIN = 400;
const RANGE = 80;
const NUM_CIRCLES = 20;
const UNITS_PER_CIRC = RANGE / NUM_CIRCLES;

function getQuantileBins(histBins, dataRange) {
  let binnedCircs = [];

  for (let bin of histBins) {
    binnedCircs.push(Math.round(bin.length / UNITS_PER_CIRC));
  }

  quantileBins(binnedCircs, histBins, UNITS_PER_CIRC, NUM_CIRCLES);

  let circs = [];

  for (let b = 0; b < binnedCircs.length; b++) {
    for (let y = 0; y < binnedCircs[b]; y++) {
      circs.push([
        (histBins[b].x1 + histBins[b].x0) / 2,
        ((y + 0.5) * dataRange) / NUM_CIRCLES,
      ]);
    }
  }

  return circs;
}

export default function DotPDFVert({ curScen }) {
  const svgElem = useRef();

  const margin = { top: 10, right: 30, bottom: 50, left: 50 },
    width = 600,
    height = 400;

  useEffect(() => {
    const svg = d3
      .select(svgElem.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("g")
      .call(
        d3
          .axisLeft()
          .scale(d3.scaleLinear().domain([0, DOMAIN]).range([0, height]))
      )
      .append("text")
      .attr("fill", "black")
      .attr("transform", `translate(${-40}, ${height / 2}) rotate(${-90})`)
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
  }, []);

  useEffect(() => {
    const data = deltaData[curScen];
    const svg = d3.select(svgElem.current).select(".graph-area");
    const x = d3.scaleLinear().domain([0, RANGE]).range([0, width]);
    const y = d3.scaleLinear().domain([0, DOMAIN]).range([0, height]);

    const histogram = d3
      .histogram()
      .value((d) => d)
      .domain([0, DOMAIN])
      .thresholds(
        ticksExact(0, DOMAIN, Math.ceil(height / (width / NUM_CIRCLES)))
      );

    const circData = getQuantileBins(histogram(data), RANGE);
    svg
      .selectAll("circle")
      .data(circData, (_, i) => i)
      .join("circle")
      .transition()
      .delay((d) => (d[1] / RANGE) * 100)
      .duration(500)
      .attr("cx", (d) => x(d[1]))
      .attr("cy", (d) => y(d[0]))
      .attr("r", width / NUM_CIRCLES / 2);
  }, [curScen]);

  return <svg ref={svgElem}></svg>;
}
