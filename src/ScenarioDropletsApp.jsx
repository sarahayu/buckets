import * as d3 from "d3";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { interpolateWatercolorBlue, ticksExact } from "bucket-lib/utils";
import { MAX_DELIVS, objectivesData } from "data/objectivesData";
import {
  DROPLET_SHAPE,
  createInterps,
  criteriaSort,
  placeDropsUsingPhysics,
} from "utils/common";

const LEVELS = 5;
const DEFAULT_OBJECTIVE_IDX = 2;
const RAD_PX = 8;
const MIN_LEV_VAL = 0.1;
const DROPLET_PAD_FACTOR = 2.5;

export default function ScenarioDropletsApp({ watercolor = false }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const winDim = useRef();
  const [curObjectiveIdx, setCurObjectiveIdx] = useState(DEFAULT_OBJECTIVE_IDX);
  const [normalize, setNormalize] = useState(false);
  const [searchParams] = useSearchParams();

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

  const zoomRef = useRef();

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

    if (
      searchParams.get("obj") &&
      objectiveIDs.includes(searchParams.get("obj"))
    ) {
      setCurObjectiveIdx(objectiveIDs.indexOf(searchParams.get("obj")));
      setNormalize(searchParams.get("norm") == "true");
    }
  }, []);

  useLayoutEffect(() => {
    const width = winDim.current.width,
      height = winDim.current.height;

    bucketSvgSelector.current.call(zoomRef.current.transform, d3.zoomIdentity);

    const nodes_pos = placeDropsUsingPhysics(
      width / 2,
      (height / 2) * 1.1,
      waterLevels.map((levs, idx) => ({
        r:
          (normalize ? 1 : Math.max(levs[0], MIN_LEV_VAL)) *
          RAD_PX *
          DROPLET_PAD_FACTOR,
        id: idx,
      }))
    );

    const nodes = nodes_pos.map(({ id: idx, x, y }) => ({
      levs: waterLevels[idx].map(
        (w, i) => Math.max(w, i == 0 ? MIN_LEV_VAL : 0) * RAD_PX
      ),
      maxLev:
        (normalize ? 1 : Math.max(waterLevels[idx][0], MIN_LEV_VAL)) * RAD_PX,
      tilt: Math.random() * 50 - 25,
      dur: Math.random() * 100 + 400,
      startX: x,
      startY: y - RAD_PX * 4 * Math.random(),
      endX: x,
      endY: y,
      scen: orderedScenIDs[idx],
    }));

    bucketSvgSelector.current
      .select(".svg-trans")
      .selectAll(".smallDrop")
      .data(nodes, (_, i) => i)
      .join((enter) => {
        return enter
          .append("g")
          .attr("class", "smallDrop")
          .each(function ({ levs }, i) {
            d3.select(this.parentNode)
              .append("g")
              .attr("id", `drop-${i}`)
              .append("g")
              .attr("class", "text-scale")
              .append("text")
              .style("font-size", 1)
              .attr("text-anchor", "middle");

            const s = d3.select(this);
            s.append("rect")
              .attr("class", "bbox")
              .style("visibility", "hidden");

            s.on("mouseover", function () {
              bucketSvgSelector.current
                .selectAll(".smallDrop")
                .style("opacity", 0.5);
              s.style("opacity", 1);
              bucketSvgSelector.current
                .select(`#drop-${i}`)
                .style("opacity", 1);
            }).on("mouseout", function () {
              bucketSvgSelector.current
                .selectAll(".smallDrop")
                .style("opacity", 1);
              bucketSvgSelector.current
                .select(`#drop-${i}`)
                .style("opacity", 0);
            });

            const stops = d3
              .select(this)
              .append("defs")
              .append("linearGradient")
              .attr("id", `drop-fill-${i}`)
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
              .attr("fill", `url(#drop-fill-${i})`);
          });
      })
      .attr(
        "transform",
        ({ startX, startY, tilt }) =>
          `translate(${startX}, ${startY}) rotate(${tilt})`
      )
      .style("opacity", 0)
      .each(function ({ levs, maxLev, scen }, i) {
        const s = d3.select(this);

        d3.select(`#drop-${i}`).style("opacity", 0).select("text").text(scen);

        s.select(".outline").attr("transform", `scale(${maxLev * 0.95})`);
        s.select(".fill").attr("transform", `scale(${maxLev})`);

        if (normalize) s.select(".outline").style("display", "initial");
        else s.select(".outline").style("display", "none");

        s.selectAll("stop").each(function (_, i) {
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

        s.transition()
          .duration(({ dur }) => dur)
          .ease(d3.easeLinear)
          .attr(
            "transform",
            ({ endX, endY, tilt }) =>
              `translate(${endX}, ${endY}) rotate(${tilt})`
          )
          .style("opacity", 1)
          .on("end", () => {
            const d = s.select(".fill");

            s.select(".bbox")
              .attr("x", d.node().getBBox().x)
              .attr("y", d.node().getBBox().y)
              .attr("width", d.node().getBBox().width)
              .attr("height", d.node().getBBox().height);

            bucketSvgSelector.current
              .select(`#drop-${i}`)
              .attr(
                "transform",
                `translate(${
                  d.node().getBoundingClientRect().x +
                  d.node().getBoundingClientRect().width / 2
                }, ${d.node().getBoundingClientRect().y})`
              );
          });
      });
  }, [waterLevels, normalize]);

  return (
    <div className="bubbles-wrapper">
      <div className="bubbles-input-area">
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
