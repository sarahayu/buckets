import React, { useLayoutEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { useRef } from "react";
import { ticksExact } from "./bucket-lib/utils";
import { DELIV_KEY_STRING, SCENARIO_KEY_STRING, objectivesData } from "./data";
import { percentToRatioFilled } from "./utils";

const LEVELS = 5;
const DEFAULT_OBJECTIVE_IDX = 0;
const RAD_PX = 10;
const SVG_DROPLET_WIDTH_DONT_CHANGE = 4;
const distance = ([x1, y1], [x2, y2]) =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

export default function BubblesApp() {
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

    bucketSvgSelector.current
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight);
  }, []);

  useLayoutEffect(() => {
    const width = winDim.current.width,
      height = winDim.current.height;

    const DELTA_Y = 20;
    let curY = -10;

    const PER_ROW = 5;

    const nodes = waterLevels.reverse().map((levs, i) => ({
      levs: levs,
      maxLev: levs[0],
      tilt: Math.random() * 50 - 25,
      active: false,
      fx: d3.scaleLinear([width / 2 - RAD_PX * 3, width / 2 + RAD_PX * 3])(
        Math.random()
      ),
      fy: d3.scaleLinear([
        100 - RAD_PX * 4 - RAD_PX * 3,
        100 - RAD_PX * 4 + RAD_PX * 3,
      ])(Math.random()),
    }));

    if (simulation.current) simulation.current.stop();

    simulation.current = d3
      .forceSimulation(nodes)
      .alphaDecay(0.01)
      .alphaMin(0.05)
      .force("y", d3.forceY(height * 2).strength(0.01))
      // .force(
      //   "center",
      //   d3.forceCenter(width / 2, (height * 2) / 3).strength(0.05)
      // )
      .force("circle", () => {
        nodes.forEach((node) => {
          if (
            node.y > height / 2 &&
            distance([node.x, node.y], [width / 2, height / 2]) > 200
          ) {
            const theta = Math.atan2(node.y - height / 2, node.x - width / 2);
            node.x += (width / 2 + 200 * Math.cos(theta) - node.x) * 1;
            node.y += (height / 2 + 200 * Math.sin(theta) - node.y) * 1;
          }
        });
      })
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((wd) => wd.maxLev * RAD_PX + 1)
          .strength(0.9)
          .iterations(5)
      )
      .on("tick", function ticked() {
        let curActiCounter = 0;
        bucketSvgSelector.current
          .selectAll(".drop")
          .data(nodes, (_, i) => i)
          .join((enter) => {
            return enter
              .append("g")
              .attr("class", "drop")
              .each(function (wd, i) {
                d3.select(this)
                  .append("defs")
                  .append("clipPath")
                  .attr("id", "drop-mask-" + i)
                  .append("path")
                  .attr(
                    "transform",
                    `scale(${
                      (wd.maxLev * RAD_PX) / 2 / SVG_DROPLET_WIDTH_DONT_CHANGE
                    })`
                  )
                  .attr("d", "M0,-10L5,-5A7.071,7.071,0,1,1,-5,-5L0,-10Z");
                d3.select(this)
                  .append("g")
                  .attr("clip-path", `url(#drop-mask-${i})`)
                  .selectAll("rect")
                  .data(wd.levs, (_, i) => i)
                  .join("rect")
                  .attr("width", wd.maxLev * RAD_PX * 2)
                  .attr("height", wd.maxLev * RAD_PX * 2)
                  .attr("x", (-wd.maxLev * RAD_PX * 2) / 2)
                  .attr("y", (-wd.maxLev * RAD_PX * 2) / 2)
                  .attr("fill", (_, i) =>
                    d3.interpolateBlues(d3.scaleLinear([0.2, 1.0])(i / LEVELS))
                  );
              });
          })
          .attr(
            "transform",
            (wd) => `translate(${wd.x}, ${wd.y}) rotate(${wd.tilt})`
          )
          .each(function (wd) {
            d3.select(this)
              .selectAll("rect")
              .data(wd.levs, (_, i) => i)
              .attr("width", wd.maxLev * RAD_PX * 2)
              .attr("height", wd.maxLev * RAD_PX * 2)
              .attr("x", (-wd.maxLev * RAD_PX * 2) / 2)
              .attr(
                "y",
                (l) =>
                  (wd.maxLev * RAD_PX * 2) / 2 -
                  percentToRatioFilled(l / wd.maxLev) * (wd.maxLev * RAD_PX * 2)
              );
            d3.select(this)
              .select("path")
              .attr(
                "transform",
                `scale(${
                  (wd.maxLev * RAD_PX) /
                  2 /
                  Math.sqrt(2) /
                  SVG_DROPLET_WIDTH_DONT_CHANGE
                })`
              );
            if (curActiCounter < 5 && wd.active === false) {
              curActiCounter += 1;
              wd.active = true;

              // wd.x = wd.fx;
              // wd.y = wd.fy;

              wd.fx = null;
              wd.fy = null;
              // wd.vx = 0;
              // wd.vy = 0;
            }
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
