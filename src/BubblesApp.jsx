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

function bounce(h) {
  if (!arguments.length) h = 0.25;
  var b0 = 1 - h,
    b1 = b0 * (1 - b0) + b0,
    b2 = b0 * (1 - b1) + b1,
    x0 = 2 * Math.sqrt(h),
    x1 = x0 * Math.sqrt(h),
    x2 = x1 * Math.sqrt(h),
    t0 = 1 / (1 + x0 + x1 + x2),
    t1 = t0 + t0 * x0,
    t2 = t1 + t0 * x1,
    m0 = t0 + (t0 * x0) / 2,
    m1 = t1 + (t0 * x1) / 2,
    m2 = t2 + (t0 * x2) / 2,
    a = 1 / (t0 * t0);
  return function (t) {
    return t >= 1
      ? 1
      : t < t0
      ? a * t * t
      : t < t1
      ? a * (t -= m0) * t + b0
      : t < t2
      ? a * (t -= m1) * t + b1
      : a * (t -= m2) * t + b2;
  };
}

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

    const nodes = waterLevels.reverse().map((levs, i) => ({
      levs: levs,
      maxLev: levs[0],
      tilt: Math.random() * 50 - 25,
      dur: Math.random() * 500 + 1000,
      active: false,
      startX: d3.scaleLinear([width / 2 - RAD_PX * 3, width / 2 + RAD_PX * 3])(
        Math.random()
      ),
      startY: d3.scaleLinear([-RAD_PX * 4 - RAD_PX * 3, -RAD_PX * 4])(
        Math.random()
      ),
      endX: d3.scaleLinear([width / 2 - RAD_PX * 8, width / 2 + RAD_PX * 8])(
        Math.random()
      ),
      endY: height - (height * i) / waterLevels.length,
    }));

    var b1 = 3 / 4,
      b2 = 9 / 11,
      b3 = 10 / 11,
      b4 = 15 / 16,
      b5 = 21 / 22,
      b6 = 63 / 64,
      b0 = 1 / b1 / b1;

    bucketSvgSelector.current
      .selectAll(".dropY")
      .data(nodes, (_, i) => i)
      .join((enter) => {
        return enter
          .append("g")
          .attr("class", "dropY")
          .call((s) => {
            s.append("g")
              .attr("class", "dropTrans")
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
          });
      })
      .attr("transform", (wd) => `translate(0, ${wd.startY})`)
      .each(function (wd) {
        d3.select(this)
          .select(".dropTrans")
          .attr(
            "transform",
            (wd) => `translate(${wd.startX}, 0) rotate(${wd.tilt})`
          );
        d3.select(this)
          .select(".dropTrans")
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
          .select(".dropTrans")
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
      })
      .call((s) => {
        s.transition("y")
          .duration((wd) => wd.dur)
          .delay((_, i) => i * 10)
          .ease(bounce(0.05))
          .attr("transform", (wd) => `translate(0, ${wd.endY})`);
      })
      .call((s) => {
        s.transition("trans")
          .duration((wd) => wd.dur)
          .delay((_, i) => i * 10)
          .ease(d3.easeLinear)
          .select(".dropTrans")
          .attr(
            "transform",
            (wd) => `translate(${wd.endX}, 0) rotate(${wd.tilt})`
          );
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
