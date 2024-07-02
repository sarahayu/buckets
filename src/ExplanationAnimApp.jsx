import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import {
  DELIV_KEY_STRING,
  DELIV_KEY_STRING_UNORD,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "./data/objectivesData";
import BucketGlyph from "./bucket-lib/BucketGlyph";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";

const DEFAULT_SCENARIO_1 = "expl0595";
const DEFAULT_SCENARIO_2 = "expl0531";
const DEFAULT_OBJECTIVE = "C_STANGDWN_MIF";

export default function ExplanationAnimApp() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const lastScrollPosition = useRef(-1);
  const svgContainer = useRef();
  const [interp, setInterp] = useState(() => () => 0);

  const slide0 = useRef();
  const slide1 = useRef();
  const slide2 = useRef();
  const slide3 = useRef();
  const width = 800,
    height = 400;

  useLayoutEffect(() => {
    const handleScroll = (e) => {
      setScrollPosition((p) => Math.max(0, p + e.deltaY));
    };

    window.addEventListener("wheel", handleScroll);
    document.querySelector(".bucket-wrapper").style.display = "none";

    const margin = { top: 30, right: 30, bottom: 70, left: 60 };

    const svgGroup = svgContainer.current
      .attr("opacity", 1)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    let vals = objectivesData[DEFAULT_OBJECTIVE][SCENARIO_KEY_STRING][
      DEFAULT_SCENARIO_1
    ][DELIV_KEY_STRING_UNORD].map((val, id) => ({
      val,
      id,
      year: id + 1930,
    })).sort((a, b) => b.val - a.val);

    setInterp(() =>
      d3
        .scaleLinear()
        .domain(ticksExact(0, 1, vals.length))
        .range(
          objectivesData[DEFAULT_OBJECTIVE][SCENARIO_KEY_STRING][
            DEFAULT_SCENARIO_1
          ][DELIV_KEY_STRING].map((v) => Math.min(1, v / MAX_DELIVS))
        )
        .clamp(true)
    );

    const xByYear = d3
      .scaleBand()
      .domain(vals.map(({ year }) => year).sort())
      .range([0, width])
      .padding(0.4);
    const xByIndex = d3
      .scaleBand()
      .domain(d3.range(vals.length))
      .range([0, width])
      .padding(0.4);
    const xaxis = d3
      .axisBottom(xByYear)
      .tickSize(0)
      .tickValues(xByYear.domain().filter((_, i) => i % 10 === 0));
    const svgAxis = svgGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xaxis);
    svgAxis
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    const y = d3.scaleLinear().domain([0, MAX_DELIVS]).range([height, 0]);
    svgGroup.append("g").call(d3.axisLeft(y));

    slide0.current = () => {
      svgGroup
        .selectAll(".bars")
        .data(vals, (d) => d.id)
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
        .delay((d) => d.id * 10)
        .attr("y", (d) => y(d.val))
        .attr("height", (d) => height - y(d.val));
    };

    slide1.current = () => {
      xaxis.tickFormat("");
      svgAxis.call(xaxis);
      const b = svgGroup
        .selectAll(".bars")
        .data(vals, (d) => d.id)
        .style("mix-blend-mode", "multiply");
      b.transition("a")
        .duration(5 * vals.length)
        // .ease((t) => 1 - 0.5 ** (t * Math.log2(vals.length)))
        .ease(d3.easeCubicInOut)
        .attr("opacity", 0.05);
      b.transition("b")
        .delay((d, i) => d.id * 5)
        .duration((d, i) => (vals.length - 1 - d.id) * 5)
        // .ease(d3.easeLinear)
        .ease(d3.easeCubicInOut)
        // .delay((d, i) => (vals.length - i) * 5)
        .attr("width", (d) => width - xByYear(d.year))
        .transition()
        .delay((d, i) => (vals.length - d.id) * 5)
        .duration((d, i) => d.id * 5)
        .attr("x", 0)
        .attr("width", width);
    };

    slide2.current = () => {
      svgGroup
        .selectAll(".bars")
        .data(vals, (d) => d.id)
        .style("mix-blend-mode", "normal")
        .attr("fill", (_, i) =>
          interpolateWatercolorBlue(i / (vals.length - 1))
        )
        .transition()
        .attr("opacity", 1);
    };

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  useEffect(() => {
    const slide = Math.floor(scrollPosition / 1000);

    if (lastScrollPosition.current < slide) {
      if (slide === 0) {
        slide0.current();
      } else if (slide === 1) {
        slide1.current();
      } else if (slide === 2) {
        slide2.current();
      }
    }

    lastScrollPosition.current = slide;
  }, [scrollPosition]);

  return (
    <div className="explanation-anim-wrapper">
      <svg ref={(e) => (svgContainer.current = d3.select(e))}></svg>
      {interp && (
        <BucketGlyph levelInterp={interp} width={300} height={height} />
      )}
    </div>
  );
}
