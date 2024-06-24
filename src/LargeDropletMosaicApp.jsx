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
  DROPLET_SHAPE,
  createInterps,
  criteriaSort,
  percentToRatioFilled,
  placeDropsUsingPhysics,
} from "./utils";
import { useNavigate } from "react-router-dom";

const LEVELS = 5;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 20;
const LARGE_DROPLET_PAD_FACTOR = 1.5;
const PX_BIAS = 1;

export default function LargeDropletMosaicApp({ watercolor = false }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const navigate = useNavigate();
  const winDim = useRef();
  const [normalize, setNormalize] = useState(false);

  const bucketSvgSelector = useRef();

  const orderedObjToScens = useMemo(() => {
    const unorderedObjToScens = {};
    const mapSorted = {};

    // don't process all scenes, too many small drops causes lag
    objectiveIDs.forEach(
      (obj) =>
        (unorderedObjToScens[obj] = criteriaSort("median", objectivesData, obj)
          .filter((_, i) => i % SCEN_DIVISOR == 0)
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
        return ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      });
    });

    return retVal;
  }, []);

  const zoomRef = useRef();

  useLayoutEffect(() => {
    winDim.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    zoomRef.current = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [-winDim.current.width / 2, -winDim.current.height / 2],
        [winDim.current.width * 1.5, winDim.current.height * 1.5],
      ])
      .on("zoom", function (e) {
        bucketSvgSelector.current
          .select(".svg-trans")
          .attr("transform", e.transform);

        bucketSvgSelector.current
          .selectAll(".text-scale")
          .attr("transform", `scale(${1 / e.transform.k})`);
      })
      .on(
        "start",
        (e) =>
          (e.sourceEvent || {}).type !== "wheel" &&
          bucketSvgSelector.current.style("cursor", "grabbing")
      )
      .on("end", () => bucketSvgSelector.current.style("cursor", "grab"));

    bucketSvgSelector.current
      .attr("width", winDim.current.width)
      .attr("height", winDim.current.height)
      .style("cursor", "grab")
      .call((s) => s.append("g").attr("class", "svg-trans"))
      .call(zoomRef.current);
  }, []);

  useLayoutEffect(() => {
    const width = winDim.current.width,
      height = winDim.current.height;
    bucketSvgSelector.current.call(zoomRef.current.transform, d3.zoomIdentity);

    const nodesArr = Object.keys(objToWaterLevels)
      .map((obj) => {
        const scale = 1;

        const nodesPos = placeDropsUsingPhysics(
          0,
          0,
          objToWaterLevels[obj].map((levs, idx) => ({
            r: Math.max(
              2,
              (normalize ? 1 : Math.max(levs[0], MIN_LEV_VAL)) *
                scale *
                RAD_PX *
                LARGE_DROPLET_PAD_FACTOR
            ),
            id: idx,
          }))
        );

        const nodes = nodesPos.map(({ id: idx, x, y }) => ({
          levs: objToWaterLevels[obj][idx].map(
            (w, i) =>
              Math.max(w, i == 0 ? MIN_LEV_VAL : 0) *
              scale *
              (normalize
                ? 1 / Math.max(objToWaterLevels[obj][idx][0], MIN_LEV_VAL)
                : 1) *
              RAD_PX
          ),
          maxLev:
            (normalize
              ? 1
              : Math.max(objToWaterLevels[obj][idx][0], MIN_LEV_VAL) * scale) *
            RAD_PX,
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
      .select(".svg-trans")
      .selectAll(".largeDrop")
      .data(nodesArr, (n, i) => n[0].obj)
      .join((enter) =>
        enter.append("g").each(function (d, i) {
          const s = d3.select(this);

          d3.select(this.parentNode)
            .append("g")
            .attr("id", `drop-${i}`)
            .append("g")
            .attr("class", "text-scale")
            .append("text")
            .style("font-size", 16)
            .attr("text-anchor", "middle");
          s.append("g").attr("class", "rotateClass");

          s.append("rect").attr("class", "bbox").style("visibility", "hidden");

          s.on("mouseover", function () {
            bucketSvgSelector.current
              .selectAll(".largeDrop")
              .style("opacity", 0.5);
            s.style("opacity", 1);
            bucketSvgSelector.current.select(`#drop-${i}`).style("opacity", 1);
          }).on("mouseout", function () {
            bucketSvgSelector.current
              .selectAll(".largeDrop")
              .style("opacity", 1);
            bucketSvgSelector.current.select(`#drop-${i}`).style("opacity", 0);
          });
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
        const s = d3.select(this);

        d3.select(`#drop-${i1}`)
          .style("opacity", 0)
          .select("text")
          .text(nodes[0].obj);
        d3.select(this)
          .select(".rotateClass")
          .attr("transform", `rotate(${largeNodesPos[i1].tilt})`)
          .selectAll(".smallDrop")
          .data(nodes, (_, i) => i)
          .join((enter) => {
            return enter
              .append("g")
              .attr("class", "smallDrop")
              .each(function ({ levs, maxLev }, i2) {
                const stops = d3
                  .select(this)
                  .append("defs")
                  .append("linearGradient")
                  .attr("id", `drop-fill-${i1}-${i2}`)
                  .attr("x1", "0%")
                  .attr("x2", "0%")
                  .attr("y1", "0%")
                  .attr("y2", "100%");

                console.log(...levs.map((l) => l / maxLev));

                levs.forEach((_, i) => {
                  stops
                    .append("stop")
                    .attr("stop-color", interpolateWatercolorBlue(i / LEVELS));
                  stops
                    .append("stop")
                    .attr("stop-color", interpolateWatercolorBlue(i / LEVELS));
                });

                d3.select(this)
                  .append("path")
                  .attr("d", DROPLET_SHAPE)
                  .attr("fill", `url(#drop-fill-${i1}-${i2})`);
              });
          })
          .attr(
            "transform",
            ({ startX, startY, tilt }) =>
              `translate(${startX}, ${startY}) rotate(${tilt})`
          )
          .each(function ({ levs, maxLev }) {
            d3.select(this)
              .selectAll("path")
              .attr("transform", `scale(${maxLev})`);

            d3.select(this)
              .selectAll("stop")
              .each(function (_, i) {
                let actI = Math.floor(i / 2);
                const isEnd = i % 2;

                if (isEnd === 0) actI -= 1;

                if (actI === -1) {
                  d3.select(this).attr("offset", `${0}%`);
                } else {
                  d3.select(this).attr(
                    "offset",
                    `${(1 - levs[actI] / maxLev) * 100}%`
                  );
                }
              });
          });

        const d = s.select(".rotateClass");

        s.on("click", function () {
          navigate(
            `/RecursiveDropletsBasicApp?obj=${nodes[0].obj}&norm=${
              normalize ? "true" : "false"
            }`
          );
        });

        s.select(".bbox")
          .attr("x", d.node().getBBox().x)
          .attr("y", d.node().getBBox().y)
          .attr("width", d.node().getBBox().width)
          .attr("height", d.node().getBBox().height);

        bucketSvgSelector.current
          .select(`#drop-${i1}`)
          .attr(
            "transform",
            `translate(${
              d.node().getBoundingClientRect().x +
              d.node().getBoundingClientRect().width / 2
            }, ${d.node().getBoundingClientRect().y})`
          );
      });
  }, [objToWaterLevels, normalize]);

  return (
    <div className="bubbles-wrapper">
      <div className="bubbles-input-area">
        <input
          type="checkbox"
          id="norm"
          checked={normalize}
          onChange={() => void setNormalize((e) => !e)}
        />
        <label htmlFor="norm">normalize</label>
      </div>
      <div className={"bubbles-svg-wrapper" + (watercolor ? "-painter" : "")}>
        <svg
          className={"bubbles-svg" + (watercolor ? "-painter" : "")}
          ref={(e) => void (bucketSvgSelector.current = d3.select(e))}
        ></svg>
      </div>
    </div>
  );
}
