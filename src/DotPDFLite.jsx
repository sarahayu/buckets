import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { quantileBins, ticksExact } from "./utils";

const DOMAIN = [0, 1200];
const RANGE = [0, 80];
const NUM_CIRCLES = 20;
const UNITS_PER_CIRC = (RANGE[1] - RANGE[0]) / NUM_CIRCLES;

// This is what I need to compute kernel density estimation
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

const waterdrop = {
  draw: function (context, size) {
    context.moveTo(0, -size / 2);
    context.lineTo(size / 4, -size / 4);

    context.arc(0, 0, size / Math.sqrt(2) / 2, -Math.PI / 4, (Math.PI * 5) / 4);
    context.lineTo(0, -size / 2);
    context.closePath();
  },
};

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

  const margin = { top: 10, right: 10, bottom: 10, left: 0 };

  useEffect(() => {
    const svg = d3
      .select(svgElem.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("pointer-events", "none")
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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
      // .call(
      //   d3
      //     .axisBottom()
      //     .scale(d3.scaleLinear().domain(DOMAIN).range([0, width]))
      //     .ticks(0, "")
      // )
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
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return x(d[0]);
          })
          .y(function (d) {
            // console.log(y(d[1]));
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
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return x(d[0]);
          })
          .y(function (d) {
            // console.log(y(d[1]));
            return y(d[1]);
          })
      );

    x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    y = d3.scaleLinear().domain(RANGE).range([height, 0]);

    const circData = getQuantileBins(data, DOMAIN, RANGE, width, height);
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
                  .attr("d", d3.symbol(waterdrop, height / NUM_CIRCLES))
            );
        },
        function update(s) {
          return s.call(
            (s) =>
              void s
                .selectAll("path")
                .attr("d", d3.symbol(waterdrop, height / NUM_CIRCLES))
          );
        }
      )
      .attr("class", "icons");
    setCircles(circData);
  }, [data]);

  useEffect(() => {
    const x = d3.scaleLinear().domain(DOMAIN).range([0, width]);
    const y = d3.scaleLinear().domain(RANGE).range([height, 0]);
    d3.select(svgElem.current)
      .select(".graph-area")
      .selectAll(".icons")
      .data(circles, (_, i) => i)
      .call((s) => {
        s.selectAll("path").attr(
          "d",
          d3.symbol(waterdrop, height / NUM_CIRCLES)
        );
      })
      .attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`)
      .attr("fill", (d) => (d[0] > goal ? "steelblue" : "black"));
    setCount(circles.filter((d) => d[0] > goal).length);
  }, [goal, circles]);

  return <svg className="dot-pdf-shadowed" ref={svgElem}></svg>;
}
