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
    const realheight = height;
    const realwidth = width;
    width = width - 20;
    height = height - 10;
    const svg = d3
      .select(svgElem.current)
      .attr("width", realwidth)
      .attr("height", realheight)
      .append("g")
      .attr("transform", `translate(${10},${5})`);

    const x = d3.scaleLinear().domain([0, maxVal]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 0.01]).range([height, 0]).clamp(true);

    const kde = kernelDensityEstimator(
      kernelEpanechnikov(2),
      x.ticks(maxVal / 8)
    );

    let density = kde(data.map((d) => Math.max(0, Math.min(d, maxVal))));

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
