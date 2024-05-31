import React, { useLayoutEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ticksExact } from "./bucket-lib/utils";
import { DELIV_KEY_STRING, SCENARIO_KEY_STRING, objectivesData } from "./data";

const LEVELS = 5;
const DEFAULT_OBJECTIVE_IDX = 0;

export default function BubblesApp({ width = 800, height = 600 }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const simulation = useRef();
  const winDim = useRef();
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

  useLayoutEffect(() => {
    winDim.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    width = winDim.current.width;
    height = winDim.current.height;
    bucketSvgSelector.current.attr("width", width).attr("height", height);
  }, []);

  useLayoutEffect(() => {
    const RAD_SCALE = 20;
    const nodes = waterLevels
      .reverse()
      .map((w) => ({ l: w, t: Math.random() * 50 - 25 }));

    if (simulation.current) simulation.current.stop();

    width = winDim.current.width;
    height = winDim.current.height;

    simulation.current = d3
      .forceSimulation(nodes)
      // .alphaTarget(0.3)
      // .velocityDecay(0.1)
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => d.l[0] * RAD_SCALE + 1)
          .iterations(3)
      )
      .force("charge", d3.forceManyBody().strength(0))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", function ticked() {
        bucketSvgSelector.current
          .selectAll("g")
          .data(nodes, (_, i) => i)
          .join((enter) => {
            return enter.append("g").each(function (dd) {
              d3.select(this)
                .selectAll("path")
                .data(dd.l, (_, i) => i)
                .enter()
                .append("path")
                .attr("class", "stroked-paths")
                .attr("d", "M0,-10L5,-5A7.071,7.071,0,1,1,-5,-5L0,-10Z")
                .attr("fill", (_, i) => d3.interpolateBlues(i / LEVELS))
                .attr("stroke", (_, i) => d3.interpolateBlues((i + 2) / LEVELS))
                .attr("stroke-width", 0.1);
            });
          })
          .attr("opacity", 0.9)
          .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(${d.t})`)
          .each(function (dd) {
            d3.select(this)
              .selectAll("path")
              .data(dd.l, (_, i) => i)
              .attr("transform", (d) => `scale(${((d * RAD_SCALE) / 20) * 2})`);
          });
      });
  }, [waterLevels]);

  return (
    <div className="bubbles-wrapper">
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
      <div className="bubbles-svg-wrapper">
        <svg
          className="bubbles-svg"
          ref={(e) => void (bucketSvgSelector.current = d3.select(e))}
        ></svg>
      </div>
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
