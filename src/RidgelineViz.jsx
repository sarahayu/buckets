import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { bucketPath, ticksExact } from "./utils";

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

export default function RidgelineViz({
  data,
  maxVal,
  width = 700,
  height = 200,
}) {
  const svgElem = useRef();

  useEffect(() => {
    const svg = d3
      .select(svgElem.current)
      .attr("width", width)
      .attr("height", height);

    svg.append("g").attr("class", "ridgeline-area");

    const x = d3.scaleLinear().domain([0, maxVal]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 0.05]).range([height, 0]);

    const kde = kernelDensityEstimator(kernelEpanechnikov(1), x.ticks(100)); // increase this 40 for more accurate density.
    // let key = categories[i];
    let density = kde(data);

    console.log(density);

    svg
      .append("g")
      .append("path")
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
  return (
    <div className="ridgeline-wrapper">
      <svg ref={svgElem}></svg>
    </div>
  );
}
