import * as d3 from "d3";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ticksExact } from "./bucket-lib/utils";
import { objectivesData } from "./data/objectivesData";
import {
  createInterps,
  criteriaSort,
  percentToRatioFilled,
  placeDropsUsingPhysics,
} from "./utils";

const LEVELS = 10;
const DEFAULT_OBJECTIVE_IDX = 0;
const RAD_PX = 15;
const DROPLET_SHAPE = "M0,-10L5,-5A7.071,7.071,0,1,1,-5,-5L0,-10Z";
const SVG_DROPLET_WIDTH_DONT_CHANGE = 4;

export default function RecursiveDropletsBasicApp({ watercolor = false }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const winDim = useRef();
  const [curObjectiveIdx, setCurObjectiveIdx] = useState(DEFAULT_OBJECTIVE_IDX);
  const [normalize, setNormalize] = useState(false);

  const bucketSvgSelector = useRef();

  const orderedScenIDs = useMemo(
    () => criteriaSort("median", objectivesData, objectiveIDs[curObjectiveIdx]),
    [curObjectiveIdx]
  );

  const waterLevels = useMemo(
    () =>
      orderedScenIDs
        .map((s) => {
          const i = createInterps(
            objectiveIDs[curObjectiveIdx],
            s,
            objectivesData
          );
          return ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
        })
        .reverse(),
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

    const scale = 1 / (normalize ? d3.max(waterLevels.map((l) => l[0])) : 1);

    const nodes_pos = placeDropsUsingPhysics(
      width / 2,
      height / 2,
      waterLevels.map((levs, idx) => ({
        r: levs[0] * scale * RAD_PX,
        id: idx,
      }))
    );

    const nodes = nodes_pos.map(({ id: idx, x, y }) => ({
      levs: waterLevels[idx].map((w) => w * scale),
      maxLev: waterLevels[idx][0] * scale,
      tilt: Math.random() * 50 - 25,
      dur: Math.random() * 500 + 1000,
      startX: x,
      startY: d3.scaleLinear([-RAD_PX * 2 - RAD_PX, -RAD_PX * 2])(
        Math.random()
      ),
      endX: x,
      endY: y,
    }));

    bucketSvgSelector.current
      .selectAll(".dropTranslateY")
      .data(nodes, (_, i) => i)
      .join((enter) => {
        return enter
          .append("g")
          .attr("class", "dropTranslateY")
          .call((s) => {
            s.append("g")
              .attr("class", "dropTranslateX")
              .each(function ({ levs, maxLev }, i) {
                d3.select(this)
                  .append("defs")
                  .append("clipPath")
                  .attr("id", "drop-mask-" + i)
                  .append("path")
                  .attr(
                    "transform",
                    `scale(${
                      (maxLev * RAD_PX) / 2 / SVG_DROPLET_WIDTH_DONT_CHANGE
                    })`
                  )
                  .attr("d", DROPLET_SHAPE);
                d3.select(this)
                  .append("g")
                  .attr("clip-path", `url(#drop-mask-${i})`)
                  .selectAll("rect")
                  .data(levs, (_, i) => i)
                  .join("rect")
                  .attr("width", maxLev * RAD_PX * 2)
                  .attr("height", maxLev * RAD_PX * 2)
                  .attr("x", (-maxLev * RAD_PX * 2) / 2)
                  .attr("y", (-maxLev * RAD_PX * 2) / 2)
                  .attr("fill", (_, i) =>
                    d3.interpolateBlues(d3.scaleLinear([0.2, 1.0])(i / LEVELS))
                  );
              });
          });
      })
      .attr("transform", ({ startY }) => `translate(0, ${startY})`)
      .each(function ({ startX, tilt, levs, maxLev }) {
        d3.select(this)
          .select(".dropTranslateX")
          .attr("transform", `translate(${startX}, 0) rotate(${tilt})`)
          .style("opacity", 0.2);
        d3.select(this)
          .select(".dropTranslateX")
          .selectAll("rect")
          .data(levs, (_, i) => i)
          .attr("width", maxLev * RAD_PX * 2)
          .attr("height", maxLev * RAD_PX * 2)
          .attr("x", (-maxLev * RAD_PX * 2) / 2)
          .attr(
            "y",
            (l) =>
              (maxLev * RAD_PX * 2) / 2 -
              percentToRatioFilled(l / maxLev) * (maxLev * RAD_PX * 2)
          );
        d3.select(this)
          .select(".dropTranslateX")
          .select("path")
          .attr(
            "transform",
            `scale(${
              (maxLev * RAD_PX) / 2 / Math.SQRT2 / SVG_DROPLET_WIDTH_DONT_CHANGE
            })`
          );
      })
      .call((s) => {
        s.transition("y")
          .duration(({ dur }) => dur)
          .delay((_, i) => Math.floor(i / 1) * 5)
          .ease(d3.easeExpOut)
          .attr("transform", ({ endY }) => `translate(0, ${endY})`);
      })
      .call((s) => {
        s.transition("trans")
          .duration(({ dur }) => dur * 0.5)
          .delay((_, i) => Math.floor(i / 1) * 5)
          .ease(d3.easeLinear)
          .select(".dropTranslateX")
          .attr(
            "transform",
            ({ endX, tilt }) => `translate(${endX}, 0) rotate(${tilt})`
          )
          .style("opacity", 1);
      });
  }, [waterLevels, normalize]);

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
      <input
        type="checkbox"
        id="html"
        name="fav_language"
        value="HTML"
        checked={normalize}
        onChange={() => void setNormalize((e) => !e)}
      />
      <label htmlFor="html">normalize</label>
      <div className={"bubbles-svg-wrapper" + (watercolor ? "-painter" : "")}>
        <svg
          className={"bubbles-svg" + (watercolor ? "-painter" : "")}
          ref={(e) => void (bucketSvgSelector.current = d3.select(e))}
        ></svg>
      </div>
    </div>
  );
}
