import React, { useMemo, useState } from "react";
import "./index.css";
import "./reset.css";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ticksExact } from "./utils";
import { objectivesData } from "./data";

import { bucketPath, usePrevious } from "./utils";

const DEGREE_SWAY = 40;
const LEVELS = 10;

function createInterps(name, curScen) {
  const delivs = objectivesData[name]["scens"][curScen]["delivs"];
  return d3
    .scaleLinear()
    .domain(ticksExact(0, 1, delivs.length))
    .range(delivs.map((v) => Math.min(1, v / 1200) || 0))
    .clamp(true);
}

function criteriaSort(criteria, data, objective) {
  if (criteria === "median") {
    return Object.keys(data[objective]["scens"]).sort(
      (a, b) =>
        d3.mean(data[objective]["scens"][a]["delivs"]) -
        d3.mean(data[objective]["scens"][b]["delivs"])
    );
  }
  if (criteria === "deliveries") {
    return Object.keys(data[objective]["scens"]).sort(
      (a, b) =>
        d3.max(data[objective]["scens"][a]["delivs"]) -
        d3.max(data[objective]["scens"][b]["delivs"])
    );
  }
}

export default function BigBucketApp({
  bucketId = "bigbucket",
  width = 600,
  height = 600,
}) {
  const { current: OBJ_NAMES } = useRef(Object.keys(objectivesData));
  const svgElem = useRef();
  const waters = useRef();
  const [objectiveIdx, setObjectiveIdx] = useState(0);

  const orderedScenNames = useMemo(
    () => criteriaSort("median", objectivesData, OBJ_NAMES[objectiveIdx]),
    [objectiveIdx]
  );

  const scenList = useMemo(() => {
    return Array.from(orderedScenNames).filter((_, i) =>
      ticksExact(0, 0.9, 20)
        .map((d) => Math.floor((d + 0.05) * orderedScenNames.length))
        .includes(i)
    );
  }, [orderedScenNames]);

  const levelInterp = useMemo(() => {
    return createInterps(OBJ_NAMES[objectiveIdx], "expl0000");
  }, [objectiveIdx]);

  const waterLevels = useMemo(
    () =>
      ticksExact(0, 1, LEVELS + 1).map((d) =>
        scenList.map((s) => createInterps(OBJ_NAMES[objectiveIdx], s)(d))
      ),
    [scenList, objectiveIdx]
  );

  const prevWaterLevels = usePrevious(waterLevels);

  useEffect(() => {
    console.log("in init");
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
      .attr("stroke", "lightgray")
      .attr("stroke-width", 3)
      .attr("fill", "none");

    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]).clamp(true);

    waters.current = svg
      .select(".graph-area")
      .selectAll("path")
      .data(waterLevels)
      .join("path")
      .attr("fill", (_, i) => d3.interpolateBlues(i / waterLevels.length))
      .attr("d", (dd) => {
        const ddd = [dd[0]];

        for (let i = 1; i < dd.length; i++) {
          ddd.push(dd[i - 1]);
          ddd.push(dd[i]);
        }

        return (
          d3
            .area()
            // .curve(d3.curveBasis)
            .x(function (_, i) {
              return x(Math.ceil(i / 2) / (dd.length - 1));
            })
            .y1(function (d) {
              return y(d);
            })
            .y0(function () {
              return y(0);
            })(ddd)
        );
      });
  }, []);

  useEffect(() => {
    const diffMap = {};
    const realwidth = width;
    const realheight = height;
    width = width - 2;
    height = height - 1;

    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]).clamp(true);
    waters.current
      .data(waterLevels)
      .join("path")
      .attr("fill", (_, i) => d3.interpolateBlues(i / waterLevels.length))
      .transition()
      .duration(500)
      .attr("d", (dd) => {
        const ddd = [dd[0]];

        for (let i = 1; i < dd.length; i++) {
          ddd.push(dd[i - 1]);
          ddd.push(dd[i]);
        }

        return (
          d3
            .area()
            // .curve(d3.curveBasis)
            .x(function (_, i) {
              return x(Math.ceil(i / 2) / (dd.length - 1));
            })
            .y1(function (d) {
              return y(d);
            })
            .y0(function () {
              return y(0);
            })(ddd)
        );
      });
  }, [levelInterp]);

  return (
    <div className="big-bucket-wrapper">
      <select
        value={objectiveIdx}
        onChange={(e) => setObjectiveIdx(parseInt(e.target.value))}
      >
        {OBJ_NAMES.map((o, i) => (
          <option name={i} value={i}>
            {o}
          </option>
        ))}
      </select>
      <svg ref={svgElem}></svg>
    </div>
  );
}
