import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  DELIV_KEY_STRING,
  DELIV_KEY_STRING_UNORD,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectiveIDs,
  objectivesData,
} from "./data/objectivesData";
import BucketGlyph from "./bucket-lib/BucketGlyph";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";

const DEFAULT_SCENARIO_1 = "expl0595";
const DEFAULT_OBJECTIVE_IDX = objectiveIDs.indexOf("C_STANGDWN_MIF");

export default function ExplanationAnimApp() {
  const [curObjectiveIdx, setCurObjectiveIdx] = useState(DEFAULT_OBJECTIVE_IDX);
  const [slide, setSlide] = useState(-1);
  const lastSlide = useRef(0);
  const slideFns = useRef([]);

  const svgContainer = useRef();
  const [bucketInterper, setBucketInterper] = useState(() => () => 0);

  const width = 800,
    height = 400;

  useLayoutEffect(() => {
    svgContainer.current.selectAll("*").remove();

    const handleClick = () => {
      setSlide((p) => p + 1);
    };

    svgContainer.current.node().addEventListener("click", handleClick);
    document.querySelector(".bucket-wrapper").style.display = "none";

    const margin = { top: 30, right: 30, bottom: 30, left: 60 };

    const svgGroup = svgContainer.current
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "rgb(251, 251, 255)")
      .attr("opacity", 1)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const curObjective = objectiveIDs[curObjectiveIdx];

    const vals = objectivesData[curObjective][SCENARIO_KEY_STRING][
      DEFAULT_SCENARIO_1
    ][DELIV_KEY_STRING_UNORD].map((val, realIdx) => ({
      val,
      realIdx,
      year: realIdx + 1930,
    })).sort((a, b) => b.val - a.val);

    setBucketInterper(() =>
      d3
        .scaleLinear()
        .domain(ticksExact(0, 1, vals.length))
        .range(
          objectivesData[curObjective][SCENARIO_KEY_STRING][DEFAULT_SCENARIO_1][
            DELIV_KEY_STRING
          ].map((v) => Math.min(1, v / MAX_DELIVS))
        )
        .clamp(true)
    );

    const xByYear = d3
      .scaleBand()
      .domain(vals.map(({ year }) => year).sort())
      .range([0, width])
      .padding(0.4);
    const xaxis = d3
      .axisBottom(xByYear)
      .tickSize(0)
      .tickValues(xByYear.domain().filter((_, i) => i % 10 === 0));
    const svgAxis = svgGroup
      .append("g")
      .attr("class", "anim-xaxis")
      .attr("opacity", 1)
      .attr("transform", `translate(0, ${height})`)
      .call(xaxis);
    svgAxis
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    const y = d3.scaleLinear().domain([0, MAX_DELIVS]).range([height, 0]);
    svgGroup.append("g").call(d3.axisLeft(y));

    slideFns.current[0] = () => {
      svgGroup
        .selectAll(".bars")
        .data(vals, (d) => d.realIdx)
        .join("rect")
        .attr("class", "bars")
        .attr("x", (d, i) => xByYear(d.year))
        .attr("y", height)
        .attr("width", xByYear.bandwidth())
        .attr("height", 0)
        .attr("opacity", 1)
        .attr("fill", "steelblue")
        .transition()
        .duration(500)
        .delay((d) => d.realIdx * 10)
        .attr("y", (d) => y(d.val))
        .attr("height", (d) => height - y(d.val));
    };

    slideFns.current[1] = () => {
      const biggerWidth = width / 8;
      const finalWidth = width / 5;

      xaxis.tickFormat("");
      svgAxis.call(xaxis);

      const b = svgGroup.selectAll(".bars").data(vals, (d) => d.realIdx);

      b.style("mix-blend-mode", "multiply")
        .transition()
        .duration(500)
        .attr("opacity", 0.05)
        .transition()
        .delay((d) => 100 + (1 - (1 - d.realIdx / vals.length) ** 4) * 1000)
        .duration(500)
        .attr("width", biggerWidth)
        .attr("x", (d) => width / 2 - biggerWidth / 2)
        .transition()
        .duration(500)
        .delay(100 + vals.length * 100)
        .attr("x", width / 2 - finalWidth / 2)
        .attr("width", finalWidth);

      svgGroup
        .select(".anim-xaxis")
        .transition()
        .delay(2000)
        .transition(500)
        .attr("transform", `translate(0, ${height + 50})`)
        .attr("opacity", 0);

      b.transition()
        .delay(2000 + 500)
        .attr("x", 0);

      svgGroup
        .transition()
        .delay(2000 + 500)
        .attr(
          "transform",
          `translate(${margin.left + width / 2 - finalWidth / 2},${margin.top})`
        );
    };

    slideFns.current[2] = () => {
      svgGroup
        .selectAll(".bars")
        .data(vals, (d) => d.realIdx)
        .style("mix-blend-mode", "normal")
        .attr("fill", (_, i) =>
          interpolateWatercolorBlue(i / (vals.length - 1))
        )
        .transition()
        .attr("opacity", 1);
    };

    slideFns.current[3] = () => {
      document.querySelector(".bucket-wrapper").style.display = "initial";
      svgContainer.current.transition().duration(500).attr("opacity", 0);
    };

    return () => {
      lastSlide.current = -1;
      setSlide(-1);
      svgContainer.current.node().removeEventListener("click", handleClick);
    };
  }, [curObjectiveIdx]);

  useEffect(() => {
    if (slide === -1) {
      setSlide(0);
    }
    if (lastSlide.current < slide && slide < slideFns.current.length) {
      slideFns.current[slide]();
    }

    lastSlide.current = slide;
  }, [slide]);

  return (
    <div className="explanation-anim-wrapper">
      <select
        style={{
          position: "absolute",
          top: 0,
        }}
        value={curObjectiveIdx}
        onChange={(e) => setCurObjectiveIdx(parseInt(e.target.value))}
      >
        {objectiveIDs.map((objectiveID, i) => (
          <option name={i} value={i} key={i}>
            {objectiveID}
          </option>
        ))}
      </select>
      <svg
        ref={(e) => {
          !svgContainer.current && (svgContainer.current = d3.select(e));
        }}
      ></svg>
      {bucketInterper && (
        <BucketGlyph levelInterp={bucketInterper} width={300} height={height} />
      )}
    </div>
  );
}
