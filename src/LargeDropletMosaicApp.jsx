import * as d3 from "d3";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";
import {
  DELIV_KEY_STRING,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "./data/objectivesData";
import {
  createInterps,
  criteriaSort,
  percentToRatioFilled,
  placeDropsUsingPhysics,
} from "./utils";

const LEVELS = 5;
const RAD_PX = 2.5;
const DROPLET_SHAPE = "M0,-10L5,-5A7.071,7.071,0,1,1,-5,-5L0,-10Z";
const SVG_DROPLET_WIDTH_DONT_CHANGE = 4;

export default function LargeDropletMosaicApp({ watercolor = false }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const winDim = useRef();
  const [normalize, setNormalize] = useState(false);

  const bucketSvgSelector = useRef();

  const orderedObjToScens = useMemo(() => {
    const unorderedObjToScens = {};
    const mapSorted = {};

    const partialScens = Object.keys(
      objectivesData[objectiveIDs[0]][SCENARIO_KEY_STRING]
    ).filter((_, i) => i % 14 == 0);

    objectiveIDs.forEach(
      (obj) =>
        (unorderedObjToScens[obj] = criteriaSort("median", objectivesData, obj)
          .filter((s) => partialScens.includes(s))
          .reverse())
    );

    const mid = Math.floor(unorderedObjToScens[objectiveIDs[0]].length / 2);
    const sortedObjs = objectiveIDs.sort((a, b) => {
      return (
        d3.median(
          objectivesData[a][SCENARIO_KEY_STRING][unorderedObjToScens[a][mid]][
            DELIV_KEY_STRING
          ]
        ) -
        d3.median(
          objectivesData[b][SCENARIO_KEY_STRING][unorderedObjToScens[b][mid]][
            DELIV_KEY_STRING
          ]
        )
      );
    });

    sortedObjs.forEach(
      (obj) => void (mapSorted[obj] = unorderedObjToScens[obj])
    );
    return mapSorted;
  }, []);

  const objToWaterLevels = useMemo(() => {
    const retVal = {};

    objectiveIDs.forEach((obj) => {
      retVal[obj] = orderedObjToScens[obj].map((s) => {
        const i = createInterps(obj, s, objectivesData, MAX_DELIVS);
        return ticksExact(0, 1, LEVELS + 1).map((d, j) => i(d));
      });
    });

    return retVal;
  }, []);

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

    const nodesArr = Object.keys(objToWaterLevels)
      .map((obj) => {
        const scale = 1;

        const nodesPos = placeDropsUsingPhysics(
          0,
          0,
          objToWaterLevels[obj].map((levs, idx) => ({
            r: Math.max(
              2,
              (normalize ? 1 : Math.max(levs[0], 0.1)) * scale * RAD_PX * 1.5
            ),
            id: idx,
          }))
        );

        const nodes = nodesPos.map(({ id: idx, x, y }) => ({
          levs: objToWaterLevels[obj][idx].map(
            (w, i) =>
              Math.max(w, i == 0 ? 0.1 : 0) *
              scale *
              (normalize
                ? 1 / Math.max(objToWaterLevels[obj][idx][0], 0.1)
                : 1) *
              RAD_PX
          ),
          maxLev:
            (normalize
              ? 1
              : Math.max(objToWaterLevels[obj][idx][0], 0.1) * scale) * RAD_PX,
          tilt: Math.random() * 50 - 25,
          dur: Math.random() * 100 + 400,
          startX: x,
          startY: y,
          obj,
        }));

        return nodes;
      })
      .reverse();

    const largeNodesRads = {};

    const largeNodesPos = placeDropsUsingPhysics(
      0,
      0,
      nodesArr.map((largeDrop, idx) => ({
        r: (largeNodesRads[idx] = Math.max(
          1,
          Math.sqrt(d3.sum(largeDrop.map((d) => d.maxLev)) / Math.PI) * 8
        )),
        id: idx,
      }))
    ).map(({ x, y }, i) => ({
      x,
      y,
      tilt: Math.random() * 50 - 25,
      r: largeNodesRads[i],
    }));

    bucketSvgSelector.current
      .selectAll(".largeDrop")
      .data(nodesArr, (_, i) => i)
      .join((enter) =>
        enter.append("g").call((s) => {
          s.append("text").attr("dominant-baseline", "middle");
          s.append("g").attr("class", "rotateClass");

          s.append("rect")
            // .attr('class', 'click-capture')
            .style("visibility", "hidden")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 40)
            .attr("height", 40);
        })
      )
      .attr("class", "largeDrop")
      .attr(
        "transform",
        (_, i) =>
          `translate(${largeNodesPos[i].x + width / 2}, ${
            largeNodesPos[i].y + height / 2
          })`
      )
      .each(function (nodes, i1) {
        d3.select(this)
          .select("text")
          .text(nodes[0].obj)
          .style("opacity", 0)
          .attr("transform", `translate(${largeNodesRads[i1] / 4 + 2}, ${0})`);
        d3.select(this)
          .select(".rotateClass")
          .attr("transform", `rotate(${largeNodesPos[i1].tilt})`)
          .selectAll(".smallDrop")
          .data(nodes, (_, i) => i)
          .join((enter) => {
            return enter
              .append("g")
              .attr("class", "smallDrop")
              .each(function ({ levs, obj }, i2) {
                d3.select(this)
                  .append("defs")
                  .append("clipPath")
                  .attr("id", `drop-mask-${i1}-${i2}`)
                  .append("path")
                  .attr("d", DROPLET_SHAPE);
                d3.select(this)
                  .append("g")
                  .attr("clip-path", `url(#drop-mask-${i1}-${i2})`)
                  .selectAll("rect")
                  .data(levs, (_, i) => i)
                  .join("rect")
                  .attr("fill", (_, i) =>
                    interpolateWatercolorBlue(i / LEVELS)
                  );
              });
          })
          .attr(
            "transform",
            ({ startX, startY, tilt }) =>
              `translate(${startX}, ${startY}) rotate(${tilt})`
          )
          .on("mouseover", function () {
            d3.select(this).select("text").style("opacity", 1);
            console.log("asdf");
          })
          .on("mouseout", function () {
            d3.select(this).select("text").style("opacity", 0);
          })
          .each(function ({ levs, maxLev, obj }, i) {
            d3.select(this)
              .selectAll("rect")
              .data(levs, (_, i) => i)
              .attr("width", maxLev * 2)
              .attr("height", maxLev * 2)
              .attr("x", (-maxLev * 2) / 2)
              .attr(
                "y",
                (l) =>
                  (maxLev * 2) / 2 -
                  percentToRatioFilled(l / maxLev) * (maxLev * 2)
              );
            d3.select(this)
              .select("path")
              .attr(
                "transform",
                `scale(${
                  maxLev / 2 / Math.SQRT2 / SVG_DROPLET_WIDTH_DONT_CHANGE
                })`
              );
          });
      });
  }, [objToWaterLevels, normalize]);

  return (
    <div className="bubbles-wrapper">
      <input
        type="checkbox"
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
