import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ticksExact } from "./bucket-lib/utils";
import { DELIV_KEY_STRING, SCENARIO_KEY_STRING, objectivesData } from "./data";

const LEVELS = 10;
const DEFAULT_OBJECTIVE_IDX = 0;

export default function BubblesApp({ width = 800, height = 600 }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const simulation = useRef();
  const [curObjectiveIdx, setCurObjectiveIdx] = useState(DEFAULT_OBJECTIVE_IDX);

  const bucketSvgSelector = useRef();

  const orderedScenIDs = useMemo(
    () => criteriaSort("median", objectivesData, objectiveIDs[curObjectiveIdx]),
    [curObjectiveIdx]
  );

  const waterLevels = useMemo(
    () =>
      orderedScenIDs.map((s) => {
        const i = createInterps(objectiveIDs[curObjectiveIdx], s);
        return ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      }),
    [curObjectiveIdx]
  );

  useEffect(() => {
    bucketSvgSelector.current
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "lightgray");
  }, []);

  useEffect(() => {
    const RAD_SCALE = width / 40;
    const nodes = waterLevels.reverse();

    if (simulation.current) simulation.current.stop();

    simulation.current = d3
      .forceSimulation(nodes)
      .alphaTarget(0.3)
      .velocityDecay(0.1)
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => d[0] * RAD_SCALE + 1)
          .iterations(3)
      )
      .force("charge", d3.forceManyBody().strength(0))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", function ticked() {
        bucketSvgSelector.current
          .selectAll("g")
          .data(nodes)
          .join((enter) => {
            return enter.append("g").each(function (dd) {
              d3.select(this)
                .selectAll("circle")
                .data(dd)
                .enter()
                .append("circle")
                .attr("fill", (_, i) => d3.interpolateBlues(i / 10));
            });
          })
          .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
          .each(function (dd) {
            d3.select(this)
              .selectAll("circle")
              .data(dd)
              .attr("r", (d) => d * RAD_SCALE);
          });
      });
  }, [waterLevels]);

  return (
    <div className="big-bucket-wrapper">
      <select
        value={curObjectiveIdx}
        onChange={(e) => setCurObjectiveIdx(parseInt(e.target.value))}
      >
        {objectiveIDs.map((objectiveID, i) => (
          <option name={i} value={i} key={i}>
            {objectiveID}
          </option>
        ))}
      </select>
      <svg ref={(e) => void (bucketSvgSelector.current = d3.select(e))}></svg>
    </div>
  );
}

function createInterps(name, curScen) {
  const delivs =
    objectivesData[name][SCENARIO_KEY_STRING][curScen][DELIV_KEY_STRING];
  return d3
    .scaleLinear()
    .domain(ticksExact(0, 1, delivs.length))
    .range(delivs.map((v) => Math.min(1, v / 1200) || 0))
    .clamp(true);
}

function criteriaSort(criteria, data, objective) {
  if (criteria === "median") {
    return Object.keys(data[objective][SCENARIO_KEY_STRING]).sort(
      (a, b) =>
        d3.mean(data[objective][SCENARIO_KEY_STRING][a][DELIV_KEY_STRING]) -
        d3.mean(data[objective][SCENARIO_KEY_STRING][b][DELIV_KEY_STRING])
    );
  }
  if (criteria === "deliveries") {
    return Object.keys(data[objective][SCENARIO_KEY_STRING]).sort(
      (a, b) =>
        d3.max(data[objective][SCENARIO_KEY_STRING][a][DELIV_KEY_STRING]) -
        d3.max(data[objective][SCENARIO_KEY_STRING][b][DELIV_KEY_STRING])
    );
  }
}
