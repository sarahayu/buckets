import * as d3 from "d3";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";
import { MAX_DELIVS, objectivesData } from "./data/objectivesData";
import {
  createInterps,
  criteriaSort,
  percentToRatioFilled,
  placeDropsUsingPhysics,
} from "./utils";

const LEVELS = 5;
const DEFAULT_OBJECTIVE_IDX = 2;
const RAD_PX = 7;
const DROPLET_SHAPE = "M0,-10L5,-5A7.071,7.071,0,1,1,-5,-5L0,-10Z";
const SVG_DROPLET_WIDTH_DONT_CHANGE = 4;

export default function RecursiveDropletsBasicApp({ watercolor = false }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const winDim = useRef();
  const [curObjectiveIdx, setCurObjectiveIdx] = useState(DEFAULT_OBJECTIVE_IDX);
  const [normalize, setNormalize] = useState(false);

  const bucketSvgSelector = useRef();

  const orderedScenIDs = useMemo(
    () =>
      criteriaSort(
        "median",
        objectivesData,
        objectiveIDs[curObjectiveIdx]
      ).reverse(),
    [curObjectiveIdx]
  );

  const waterLevels = useMemo(
    () =>
      orderedScenIDs.map((s) => {
        const i = createInterps(
          objectiveIDs[curObjectiveIdx],
          s,
          objectivesData,
          MAX_DELIVS
        );
        return ticksExact(0, 1, LEVELS + 1).map((d, j) => i(d));
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

    const scale = 1;

    const nodes_pos = placeDropsUsingPhysics(
      width / 2,
      height / 2,
      waterLevels.map((levs, idx) => ({
        r: (normalize ? 1 : levs[0]) * scale * RAD_PX * 2.5,
        id: idx,
      }))
    );

    const nodes = nodes_pos.map(({ id: idx, x, y }) => ({
      levs: waterLevels[idx].map(
        (w) => w * scale * (normalize ? 1 / waterLevels[idx][0] : 1)
      ),
      maxLev: normalize ? 1 : Math.max(waterLevels[idx][0], 0.1) * scale,
      tilt: Math.random() * 50 - 25,
      dur: Math.random() * 100 + 400,
      startX: x,
      startY: y - RAD_PX * 4 * Math.random(),
      endX: x,
      endY: y,
    }));

    bucketSvgSelector.current
      .selectAll(".smallDrop")
      .data(nodes, (_, i) => i)
      .join((enter) => {
        return enter
          .append("g")
          .attr("class", "smallDrop")
          .each(function ({ levs, maxLev }, i) {
            d3.select(this)
              .append("defs")
              .append("clipPath")
              .attr("id", "drop-mask-" + i)
              .append("path")
              .attr("d", DROPLET_SHAPE);
            d3.select(this)
              .append("g")
              .attr("clip-path", `url(#drop-mask-${i})`)
              .selectAll("rect")
              .data(levs, (_, i) => i)
              .join("rect")
              .attr("fill", (_, i) => interpolateWatercolorBlue(i / LEVELS));
          });
      })
      .attr(
        "transform",
        ({ startX, startY, tilt }) =>
          `translate(${startX}, ${startY}) rotate(${tilt})`
      )
      .style("opacity", 0)
      .each(function ({ levs, maxLev }) {
        d3.select(this)
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
          .select("path")
          .attr(
            "transform",
            `scale(${
              (maxLev * RAD_PX) / 2 / Math.SQRT2 / SVG_DROPLET_WIDTH_DONT_CHANGE
            })`
          );
      })
      .call((s) => {
        s.transition()
          .duration(({ dur }) => dur)
          .ease(d3.easeLinear)
          .attr(
            "transform",
            ({ endX, endY, tilt }) =>
              `translate(${endX}, ${endY}) rotate(${tilt})`
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
        value={"norm"}
        checked={normalize}
        onChange={() => void setNormalize((e) => !e)}
      />
      <label htmlFor="norm">normalize</label>
      <div className={"bubbles-svg-wrapper" + (watercolor ? "-painter" : "")}>
        <svg
          className={"bubbles-svg" + (watercolor ? "-painter" : "")}
          ref={(e) => void (bucketSvgSelector.current = d3.select(e))}
        ></svg>
      </div>
    </div>
  );
}
