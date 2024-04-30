import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { bucketPath, ticksExact } from "./utils";

const DEGREE_SWAY = 10;
const LEVELS = 10;

export default function BucketViz({
  bucketId,
  levelInterp,
  width = 200,
  height = 400,
}) {
  const svgElem = useRef();
  const { current: prevWaterLevels } = useRef(d3.local());
  const waters = useRef();

  useEffect(() => {
    const realwidth = width;
    const realheight = height;
    width = width - 2;
    height = height - 1;

    const svg = d3
      .select(svgElem.current)
      .attr("width", realwidth)
      .attr("height", realheight)
      .append("g")
      .attr("transform", `translate(${1}, ${0})`);
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "bucket-mask-" + bucketId)
      .append("path")
      .attr("d", bucketPath(width, height));

    svg
      .append("g")
      .attr("class", "graph-area")
      .attr("clip-path", `url(#bucket-mask-${bucketId})`);
    svg
      .append("g")
      .append("path")
      .attr("d", bucketPath(width, height).split("z")[0])
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill", "none");

    waters.current = svg
      .select(".graph-area")
      .selectAll(".bucketBox")
      .data(
        ticksExact(0, 1, LEVELS + 1).map((d) => levelInterp(d)),
        (_, i) => i
      )
      .enter()
      .append("rect")
      .attr("class", "bucketBox")
      .attr("width", width * 2)
      .attr("height", height * 2)
      .attr("fill", (_, i) => d3.interpolateBlues(i / LEVELS))
      .attr("x", -width / 2);
  }, []);

  useEffect(() => {
    waters.current.data(
      ticksExact(0, 1, LEVELS + 1).map((d) => levelInterp(d)),
      (_, i) => i
    );

    waters.current
      .transition("waterLevel")
      .ease(d3.easeElasticOut.period(0.6))
      .delay((_, i) => i * (100 / LEVELS))
      .duration(1000)
      .attr("y", (d) => height - d * height);

    waters.current
      .transition("waterSway")
      .duration(2000)
      .delay((_, i) => i * 10)
      .ease(d3.easeQuad)
      .attrTween("transform", function (d) {
        let diff = Math.abs(prevWaterLevels.get(this) - d);
        prevWaterLevels.set(this, d);

        return (t) =>
          `rotate(${
            Math.sin(
              Math.min((Math.PI * 4 * t) / (0.5 * diff + 0.5), Math.PI * 4)
            ) *
            diff *
            DEGREE_SWAY *
            (1 - t)
          }, ${width / 2}, ${0})`;
      });
  }, [levelInterp]);

  return (
    <div className="bucket-wrapper">
      <svg ref={svgElem}></svg>
    </div>
  );
}
