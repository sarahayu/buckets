import * as d3 from "d3";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";
import {
  DELIV_KEY_STRING,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectiveIDs,
  objectivesData,
} from "./data/objectivesData";
import {
  DROPLET_SHAPE,
  createInterps,
  criteriaSort,
  placeDropsUsingPhysics,
} from "./utils";
import { useNavigate } from "react-router-dom";

const LEVELS = 5;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 20;
const SMALL_DROP_PAD_FACTOR = 1.5;

export default function LargeDropletApp({ watercolor = false }) {
  const navigate = useNavigate();
  const winDim = useRef();
  const [normalize, setNormalize] = useState(false);

  const bucketSvgSelector = useRef();
  const zoomRef = useRef();

  const objToWaterLevels = useMemo(() => {
    const objToLevels = {};
    const orderedObjToScens = {};

    const unorderedObjToScens = {};

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
      (obj) => void (orderedObjToScens[obj] = unorderedObjToScens[obj])
    );

    objectiveIDs.forEach((obj) => {
      objToLevels[obj] = orderedObjToScens[obj].map((s) => {
        const i = createInterps(obj, s, objectivesData, MAX_DELIVS);
        return ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      });
    });

    return objToLevels;
  }, []);

  useLayoutEffect(() => {
    winDim.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const width = winDim.current.width,
      height = winDim.current.height;

    zoomRef.current = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [-width / 2, -height / 2],
        [width * 1.5, height * 1.5],
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
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "grab")
      .call((s) => s.append("g").attr("class", "svg-trans"))
      .call(zoomRef.current);
  }, []);

  useLayoutEffect(() => {
    const width = winDim.current.width,
      height = winDim.current.height;

    bucketSvgSelector.current.call(zoomRef.current.transform, d3.zoomIdentity);

    const largeNodes = initNodes(objToWaterLevels, normalize);

    bucketSvgSelector.current
      .select(".svg-trans")
      .selectAll(".largeDrop")
      .data(largeNodes, (n) => n.obj)
      .join((enter) =>
        enter.append("g").each(function (_, i) {
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
        ({ x, y }) => `translate(${x + width / 2}, ${y + height / 2})`
      )
      .each(function (nodes, i1) {
        const s = d3.select(this);

        d3.select(`#drop-${i1}`)
          .style("opacity", 0)
          .select("text")
          .text(nodes.obj);
        d3.select(this)
          .select(".rotateClass")
          .attr("transform", `rotate(${nodes.tilt})`)
          .selectAll(".smallDrop")
          .data(nodes, (_, i) => i)
          .join((enter) => {
            return enter
              .append("g")
              .attr("class", "smallDrop")
              .each(function ({ levs }, i2) {
                const stops = d3
                  .select(this)
                  .append("defs")
                  .append("linearGradient")
                  .attr("id", `drop-fill-${i1}-${i2}`)
                  .attr("x1", "0%")
                  .attr("x2", "0%")
                  .attr("y1", "0%")
                  .attr("y2", "100%");
                stops.append("stop").attr("stop-color", "transparent");
                stops.append("stop").attr("stop-color", "transparent");

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
                  .attr("class", "outline")
                  .attr("fill", "none")
                  .attr("stroke", "lightgray")
                  .attr("stroke-width", 0.05);

                d3.select(this)
                  .append("path")
                  .attr("class", "fill")
                  .attr("d", DROPLET_SHAPE)
                  .attr("fill", `url(#drop-fill-${i1}-${i2})`);
              });
          })
          .attr(
            "transform",
            ({ x, y, tilt }) => `translate(${x}, ${y}) rotate(${tilt})`
          )
          .each(function ({ levs, maxLev }) {
            d3.select(this)
              .select(".outline")
              .attr("transform", `scale(${maxLev * 0.95})`);
            d3.select(this)
              .select(".fill")
              .attr("transform", `scale(${maxLev})`);

            if (normalize)
              d3.select(this).select(".outline").style("display", "block");
            else d3.select(this).select(".outline").style("display", "none");

            d3.select(this)
              .selectAll("stop")
              .each(function (_, i) {
                let actI = Math.floor((i - 1) / 2);

                if (actI === -1) {
                  d3.select(this).attr("offset", `${0}%`);
                } else if (actI === levs.length) {
                  d3.select(this).attr("offset", `${100}%`);
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
            `/ScenarioDropletsApp?obj=${nodes.obj}&norm=${
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

function initNodes(objToWaterLevels, normalize) {
  const largeNodes = Object.keys(objToWaterLevels)
    .map((obj) => {
      const smallNodesPos = placeDropsUsingPhysics(
        0,
        0,
        objToWaterLevels[obj].map((levs, id) => ({
          r: Math.max(
            2,
            (normalize ? 1 : Math.max(levs[0], MIN_LEV_VAL)) *
              RAD_PX *
              SMALL_DROP_PAD_FACTOR
          ),
          id,
        }))
      );

      const smallNodes = smallNodesPos.map(({ id: idx, x, y }) => ({
        levs: objToWaterLevels[obj][idx].map(
          (w, i) => Math.max(w, i == 0 ? MIN_LEV_VAL : 0) * RAD_PX
        ),
        maxLev:
          (normalize
            ? 1
            : Math.max(objToWaterLevels[obj][idx][0], MIN_LEV_VAL)) * RAD_PX,
        tilt: Math.random() * 50 - 25,
        dur: Math.random() * 100 + 400,
        x,
        y,
      }));

      smallNodes.height = smallNodesPos.height;
      smallNodes.obj = obj;

      return smallNodes;
    })
    .reverse();

  placeDropsUsingPhysics(
    0,
    0,
    largeNodes.map((innerNodes, id) => ({
      r: Math.max(
        1,
        Math.sqrt(d3.sum(innerNodes.map((d) => d.maxLev)) / Math.PI) * 8
      ),
      id,
    }))
  ).forEach(({ x, y }, i) => {
    largeNodes[i].x = x;
    largeNodes[i].y = y;
    largeNodes[i].tilt = Math.random() * 50 - 25;
    largeNodes[i].r =
      (largeNodes[i].height / (1 + Math.SQRT1_2)) * Math.SQRT1_2;
  });
  return largeNodes;
}
