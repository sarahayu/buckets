import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { getQuantileBins } from "./bucket-lib/quantile-histogram";
import { WATERDROP_ICON } from "./utils";
import { MAX_DELIVS } from "./data";

const DOMAIN = [0, MAX_DELIVS];
const NUM_CIRCLES = 20;

function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [
        x,
        d3.mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });
  };
}
function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

const MARGIN = { top: 10, right: 10, bottom: 3, left: 0 };

export default function DotHistogramSmall({
  data,
  goal,
  width = 600,
  height = 400,
}) {
  const svgElem = useRef();
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

    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain([0, 0.05]).range([height, 0]).clamp(true);

    const kde = kernelDensityEstimator(
      kernelEpanechnikov(20),
      x.ticks((DOMAIN[1] - DOMAIN[0]) / 4)
    );

    let density = kde(
      data.map((d) => Math.max(DOMAIN[0], Math.min(d, DOMAIN[1])))
    );

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call((s) => {
        s.selectAll("line").attr("stroke", "gray");
        s.selectAll("path").attr("stroke", "gray");
      });
    svg
      .append("path")
      .attr("class", "ridgeline")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return x(d[0]);
          })
          .y(function (d) {
            return y(d[1]);
          })
      );
  }, []);

  useEffect(() => {
    const svg = d3.select(svgElem.current).select(".graph-area");

    let x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    let y = d3.scaleLinear().domain([0, 0.05]).range([height, 0]).clamp(true);

    const kde = kernelDensityEstimator(
      kernelEpanechnikov(20),
      x.ticks((DOMAIN[1] - DOMAIN[0]) / 4)
    );

    let density = kde(
      data.map((d) => Math.max(DOMAIN[0], Math.min(d, DOMAIN[1])))
    );

    svg
      .select(".ridgeline")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return x(d[0]);
          })
          .y(function (d) {
            return y(d[1]);
          })
      );

    x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    y = d3.scaleLinear().domain([0, data.length]).range([height, 0]);

    const circData = getQuantileBins(
      data,
      DOMAIN,
      data.length / NUM_CIRCLES,
      width,
      height
    );
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
      .attr("class", "icons");
    setCircles(circData);
  }, [data]);

  useEffect(() => {
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain([0, data.length]).range([height, 0]);
    d3.select(svgElem.current)
      .select(".graph-area")
      .selectAll(".icons")
      .data(circles, (_, i) => i)
      .call((s) => {
        s.selectAll("path").attr(
          "d",
          d3.symbol(WATERDROP_ICON, height / NUM_CIRCLES)
        );
      })
      .attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`)
      .attr("fill", (d) => (d[0] > goal ? "steelblue" : "black"));
  }, [goal, circles]);

  return <svg className="dot-pdf-shadowed" ref={svgElem}></svg>;
}
