import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ticksExact } from "bucket-lib/utils";
import { MAX_DELIVS, objectivesData } from "data/objectivesData";

import { bucketPath } from "bucket-lib/utils";
import { createInterps, criteriaSort } from "utils/common";

const LEVELS = 10;
const LINE_WIDTH = 3;
const DEFAULT_OBJECTIVE_IDX = 0;

export default function BigBucketApp({ width = 600, height = 600 }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const [curObjectiveIdx, setCurObjectiveIdx] = useState(DEFAULT_OBJECTIVE_IDX);

  const bucketSvgSelector = useRef();

  const orderedScenIDs = useMemo(
    () => criteriaSort("median", objectivesData, objectiveIDs[curObjectiveIdx]),
    [curObjectiveIdx]
  );

  const curPercentileScens = useMemo(() => {
    return Array.from(orderedScenIDs).filter((_, i) =>
      ticksExact(0, 0.9, 20)
        .map((d) => Math.floor((d + 0.05) * orderedScenIDs.length))
        .includes(i)
    );
  }, [orderedScenIDs]);

  const waterLevels = useMemo(
    () =>
      ticksExact(0, 1, LEVELS + 1).map((d) =>
        curPercentileScens.map((s) =>
          createInterps(
            objectiveIDs[curObjectiveIdx],
            s,
            objectivesData,
            MAX_DELIVS
          )(d)
        )
      ),
    [curPercentileScens, curObjectiveIdx]
  );

  const innerWidth = width - LINE_WIDTH * 2;
  const innerHeight = height - LINE_WIDTH;

  const x = d3.scaleLinear().range([0, innerWidth]);
  const y = d3.scaleLinear().range([innerHeight, 0]);

  useEffect(() => {
    const svgContainer = bucketSvgSelector.current
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "svg-container")
      .attr("transform", `translate(${LINE_WIDTH}, ${LINE_WIDTH / 2})`);

    svgContainer
      .append("defs")
      .append("clipPath")
      .attr("id", "bucket-mask")
      .append("path")
      .attr("d", bucketPath(innerWidth, innerHeight));

    svgContainer
      .append("g")
      .attr("class", "graph-area")
      .attr("clip-path", `url(#bucket-mask)`);

    svgContainer
      .append("path")
      .attr("d", bucketPath(innerWidth, innerHeight).split("z")[0])
      .attr("stroke", "lightgray")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", LINE_WIDTH)
      .attr("fill", "none");
  }, []);

  useEffect(() => {
    bucketSvgSelector.current
      .select(".graph-area")
      .selectAll("path")
      .data(waterLevels)
      .join("path")
      .attr("fill", (_, i) => d3.interpolateBlues(i / waterLevels.length))
      .transition()
      .duration(500)
      .attr("d", (dd) => {
        const ddd = [dd[0]];

        for (let i = 1; i < dd.length; i++) {
          ddd.push(dd[i - 1]);
          ddd.push(dd[i]);
        }

        return (
          d3
            .area()
            // .curve(d3.curveBasis)
            .x(function (_, i) {
              return x(Math.ceil(i / 2) / (dd.length - 1));
            })
            .y1((d) => y(d))
            .y0(() => y(0))(ddd)
        );
      });
  }, [waterLevels]);

  return (
    <div className="big-bucket-wrapper">
      <select
        value={curObjectiveIdx}
        onChange={(e) => setCurObjectiveIdx(parseInt(e.target.value))}
      >
        {objectiveIDs.map((objectiveID, i) => (
          <option name={i} value={i}>
            {objectiveID}
          </option>
        ))}
      </select>
      <svg ref={(e) => void (bucketSvgSelector.current = d3.select(e))}></svg>
    </div>
  );
}
