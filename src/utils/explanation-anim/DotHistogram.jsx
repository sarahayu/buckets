import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import { quantileBins } from "bucket-lib/quantile-bins";

const NUM_CIRCLES = 20;
const MARGIN = { top: 10, right: 10, bottom: 40, left: 10 };

const WATERDROP_ICON = {
  draw: function (context, size) {
    context.moveTo(0, -size / 2);
    context.lineTo(size / 4, -size / 4);

    context.arc(0, 0, size / Math.SQRT2 / 2, -Math.PI / 4, (Math.PI * 5) / 4);
    context.lineTo(0, -size / 2);
    context.closePath();
  },
};

export default function DotHistogram({
  data,
  domain = [0, d3.max(data)],
  width = 600,
  height = 400,
}) {
  const svgSelector = useRef();
  const circles = useMemo(
    () => quantileBins(width, height, data.length / NUM_CIRCLES, domain)(data),
    [data, domain]
  );

  const dataRange = [0, data.length];
  const x = d3.scaleLinear().domain(domain).range([0, width]);
  const y = d3.scaleLinear().domain(dataRange).range([height, 0]);

  useEffect(() => {
    svgSelector.current.selectAll("*").remove();
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
      .call(d3.axisBottom().scale(x).tickFormat(d3.format(".2s")))
      .call((s) => {
        s.selectAll("line").attr("stroke", "gray");
        s.selectAll("path").attr("stroke", "gray");
        s.selectAll("text").attr("fill", "gray");
      })
      .append("text")
      .attr("fill", "black")
      .attr("font-size", "2em")
      .attr("transform", `translate(${width / 2}, ${30})`)
      .text("Deliveries (TAF)");
  }, [data, domain]);

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

    svgCircles.attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`);

    svgCircles.attr("fill", "steelblue");
  }, [circles]);

  return (
    <div className={`dot-histogram-wrapper`}>
      <svg ref={(e) => void (svgSelector.current = d3.select(e))}></svg>
    </div>
  );
}
