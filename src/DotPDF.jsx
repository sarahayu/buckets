import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { deltaData } from "./data";

export default function DotPDF({ curScen }) {
  const svgElem = useRef();

  const margin = { top: 10, right: 30, bottom: 30, left: 750 },
    width = 450 * 1.2,
    height = 400 * 1.2;

  useEffect(() => {
    const svg = d3
      .select(svgElem.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 400]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 80]).range([height, 0]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom().scale(x));
    const y_axis = svg.append("g");
    y_axis.transition().duration(500).call(d3.axisLeft().scale(y));

    svg
      .append("path")
      .attr(
        "d",
        d3.line(
          (d) => x(d[0]),
          (d) => y(d[1])
        )([
          [200, 0],
          [200, 80],
        ])
      )
      .attr("stroke", "black");
  }, []);

  useEffect(() => {
    const data = deltaData[curScen];
    const svg = d3.select(svgElem.current).select(".graph-area");
    const x = d3.scaleLinear().domain([0, 400]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 80]).range([height, 0]);

    const histogram = d3
      .histogram()
      .value((d) => d)
      .domain(x.domain())
      .thresholds(
        d3.range(25).map((i) => d3.scaleLinear().range(x.domain())(i / 24))
      );

    const bins = histogram(data);
    // console.log(bins);

    const u = svg.selectAll("rect").data(bins);

    u.join("rect")
      .transition()
      .duration(500)
      .attr("x", 1)
      .attr("transform", function (d) {
        return `translate(${x(d.x0)}, ${y(Math.round(d.length))})`;
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function (d) {
        return height - y(Math.round(d.length));
      })
      .style("fill", "gray")
      .attr("opacity", 0.2);

    function minusLeast(arr) {
      let indMost = -1;
      let most = -1;

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] != 0 && arr[i] - bins[i].length / 4 > most) {
          indMost = i;
          most = arr[i] - bins[i].length / 4;
        }
      }

      arr[indMost] -= 1;
      return arr;
    }

    function addMost(arr) {
      let indMost = -1;
      let most = -1;

      for (let i = 0; i < arr.length; i++) {
        if (bins[i].length / 4 - arr[i] > most) {
          indMost = i;
          most = bins[i].length / 4 - arr[i];
        }
      }

      arr[indMost] += 1;
      return arr;
    }

    let rad = 10;

    function getCircs(bbins) {
      let circBins = [];
      let sum = 0;
      for (let bin of bbins) {
        let rounded = Math.round(bin.length / 4);
        circBins.push(rounded);
        sum += rounded;
      }

      while (sum > 20) {
        circBins = minusLeast(circBins);

        sum = 0;
        for (let bin of circBins) {
          let rounded = bin;
          sum += rounded;
        }
      }

      while (sum < 20) {
        circBins = addMost(circBins);

        sum = 0;
        for (let bin of circBins) {
          let rounded = bin;
          sum += rounded;
        }
      }

      let circs = [];
      for (let x = 0; x < circBins.length; x++) {
        for (let y = 0; y < circBins[x]; y++) {
          circs.push([(bins[x].x1 + bins[x].x0) / 2, ((y + 0.5) * 80) / 20]);
        }
      }

      return circs;
    }

    const v = svg.selectAll("circle").data(getCircs(bins), (d, i) => i);

    v.join("circle")
      .transition()
      .duration(500)
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("r", rad)
      .attr("fill", (d) =>
        d[0] < 200 ? d3.interpolateReds((200 - d[0]) / 400 + 0.5) : "steelblue"
      );
  }, [curScen]);

  return <svg ref={svgElem}></svg>;
}
