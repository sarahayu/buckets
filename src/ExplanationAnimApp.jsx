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

const DEFAULT_SCENARIO = "expl0595";
const DEFAULT_OBJECTIVE = "C_STANGDWN_MIF";
const DATE_START = 1930;

export default function ExplanationAnimApp() {
  const [curObjective, setCurObjective] = useState(DEFAULT_OBJECTIVE);

  const [slide, setSlide] = useState(-1);
  const lastSlide = useRef();
  const slideFns = useRef([]);

  const svgElement = useRef();
  const [bucketInterper, setBucketInterper] = useState(() => d3.scaleLinear());

  const width = 800,
    height = 400;

  const margin = { top: 30, right: 30, bottom: 30, left: 60 };

  useLayoutEffect(() => {
    const svgContainer = d3.select(svgElement.current);

    svgContainer.selectAll("*").remove();
    document.querySelector(".bucket-wrapper").style.display = "none";

    const svgGroup = svgContainer
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "rgb(251, 251, 255)")
      .attr("opacity", 1)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const dataDescending = objectivesData[curObjective][SCENARIO_KEY_STRING][
      DEFAULT_SCENARIO
    ][DELIV_KEY_STRING_UNORD].map((val, placeFromLeft) => ({
      val,
      placeFromLeft,
      year: placeFromLeft + DATE_START,
    })).sort((a, b) => b.val - a.val);

    setBucketInterper(() =>
      d3
        .scaleLinear()
        .domain(ticksExact(0, 1, dataDescending.length))
        .range(
          objectivesData[curObjective][SCENARIO_KEY_STRING][DEFAULT_SCENARIO][
            DELIV_KEY_STRING
          ].map((v) => v / MAX_DELIVS)
        )
        .clamp(true)
    );

    const x = d3
      .scaleBand()
      .domain(dataDescending.map(({ year }) => year).sort())
      .range([0, width])
      .padding(0.4);
    const y = d3.scaleLinear().domain([0, MAX_DELIVS]).range([height, 0]);

    const xaxis = d3
      .axisBottom(x)
      .tickSize(0)
      .tickValues(x.domain().filter((_, i) => i % 10 === 0));

    svgGroup
      .append("g")
      .attr("class", "anim-xaxis")
      .attr("opacity", 1)
      .attr("transform", `translate(0, ${height})`)
      .call(xaxis)
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    svgGroup.append("g").call(d3.axisLeft(y));

    slideFns.current[0] = () => {
      svgGroup
        .selectAll(".bars")
        .data(dataDescending, (d) => d.placeFromLeft)
        .join("rect")
        .attr("class", "bars")
        .attr("x", (d) => x(d.year))
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("opacity", 1)
        .attr("fill", "steelblue")
        .transition()
        .duration(500)
        .delay((d) => d.placeFromLeft * 10)
        .attr("y", (d) => y(d.val))
        .attr("height", (d) => height - y(d.val));
    };

    slideFns.current[1] = async () => {
      const finalWidth = width / 8;

      svgGroup.select(".anim-xaxis").call(xaxis.tickFormat(""));

      const bars = svgGroup.selectAll(".bars");

      await bars
        .style("mix-blend-mode", "multiply")
        .transition()
        .duration(500)
        .attr("opacity", 0.05)
        .transition()
        .delay(
          (d) =>
            100 +
            (1 - (1 - d.placeFromLeft / dataDescending.length) ** 4) * 1000
        )
        .duration(500)
        .attr("width", finalWidth)
        .attr("x", (d) => width / 2 - finalWidth / 2)
        .end();

      svgGroup
        .select(".anim-xaxis")
        .transition()
        .transition(500)
        .attr("transform", `translate(0, ${height + 50})`)
        .attr("opacity", 0);

      bars.transition().delay(500).attr("x", 0);

      svgGroup
        .transition()
        .delay(500)
        .attr(
          "transform",
          `translate(${margin.left + width / 2 - finalWidth / 2},${margin.top})`
        );
    };

    slideFns.current[2] = () => {
      svgGroup
        .selectAll(".bars")
        .style("mix-blend-mode", "normal")
        .attr("fill", (_, i) =>
          interpolateWatercolorBlue(i / (dataDescending.length - 1))
        )
        .transition()
        .attr("opacity", 1);
    };

    slideFns.current[3] = () => {
      document.querySelector(".bucket-wrapper").style.display = "initial";
      svgContainer.transition().duration(500).attr("opacity", 0);
    };

    const handleClick = () => {
      setSlide((p) => p + 1);
    };

    svgContainer.node().addEventListener("click", handleClick);

    return () => {
      svgContainer.node().removeEventListener("click", handleClick);

      setSlide(-1);
    };
  }, [curObjective]);

  useEffect(() => {
    if (slide === -1) {
      setSlide(0);
      lastSlide.current = -1;
      return;
    }

    if (lastSlide.current < slide && slide < slideFns.current.length) {
      slideFns.current[slide]();
      lastSlide.current = slide;
    }
  }, [slide]);

  return (
    <div className="explanation-anim-wrapper">
      <select
        value={curObjective}
        onChange={(e) => setCurObjective(e.target.value)}
      >
        {objectiveIDs.map((objectiveID) => (
          <option value={objectiveID} key={objectiveID}>
            {objectiveID}
          </option>
        ))}
      </select>
      <svg ref={svgElement}></svg>
      <BucketGlyph levelInterp={bucketInterper} width={300} height={height} />
      <p>
        We turn yearly water delivery quantities into a heatmap-like
        representation, where darker blue indicates ranges of likely quantities
        and lighter blue indicates ranges of less likely quantities. This works
        well with the metaphor of a water bucket, since we can imagine water
        deliveries as levels of water filled in a bucket; darker blue water
        levels represent how much water we can expect AT LEAST, with lighter
        blue water levels represent various less likely, but still plausible,
        water delivery quantities.
      </p>
    </div>
  );
}
