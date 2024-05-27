import React, { useMemo } from "react";
import "./index.css";

import {
  DELIV_KEY_STRING,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "./data";
import { factorsData } from "./data";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import BucketGlyph from "./bucket-lib/BucketGlyph";
import { ticksExact } from "./bucket-lib/utils";

const DEFAULT_SCENARIO = "expl0000";
const DEFAULT_OBJECTIVE_IDX = 0;
const DEFAULT_SLIDER_VALS = 0.25;
const LEVELS = 10;

const DOMAINS = {
  demand: d3.scaleLinear([1, 4]),
  carryover: d3.scaleLinear([1, 3]),
  priority: d3.scaleLinear([1, 2]),
  regs: d3.scaleLinear([1, 4]),
  minflow: d3.scaleLinear([1, 4]),
};

export default function SliderApp() {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));

  const [curScenID, setCurScenID] = useState(DEFAULT_SCENARIO);
  const [objectiveIdx, setObjectiveIdx] = useState(DEFAULT_OBJECTIVE_IDX);

  const [demand, setDemand] = useState(DEFAULT_SLIDER_VALS);
  const [carryover, setCarryover] = useState(DEFAULT_SLIDER_VALS);
  const [priority, setPriority] = useState(DEFAULT_SLIDER_VALS);
  const [regs, setRegs] = useState(DEFAULT_SLIDER_VALS);
  const [minflow, setMinflow] = useState(DEFAULT_SLIDER_VALS);

  const curInterp = useMemo(
    () => createInterps(objectiveIDs[objectiveIdx], curScenID),
    [curScenID, objectiveIdx]
  );

  useEffect(
    () =>
      void setCurScenID(
        factorsData[
          getKey(
            Math.round(DOMAINS["demand"](demand)),
            Math.round(DOMAINS["carryover"](carryover)),
            Math.round(DOMAINS["priority"](priority)),
            Math.round(DOMAINS["regs"](regs)),
            Math.round(DOMAINS["minflow"](minflow))
          )
        ]
      ),
    [demand, carryover, priority, regs, minflow]
  );

  const variables = [
    {
      label: "demand [1, 0.9, 0.8, 0.7]",
      controlVar: "demand",
      val: demand,
      setter: setDemand,
    },
    {
      label: "carryover [1.0, 1.1, 1.2]",
      controlVar: "carryover",
      val: carryover,
      setter: setCarryover,
    },
    {
      label: "priority [0, 1]",
      controlVar: "priority",
      val: priority,
      setter: setPriority,
    },
    {
      label: "regs [1, 2, 3, 4]",
      controlVar: "regs",
      val: regs,
      setter: setRegs,
    },
    {
      label: "minflow [0, 0.4, 0.6, 0.8]",
      controlVar: "minflow",
      val: minflow,
      setter: setMinflow,
    },
  ];

  return (
    <>
      <div className="editor">
        <div className="sliders">
          <select
            value={objectiveIdx}
            onChange={(e) => setObjectiveIdx(parseInt(e.target.value))}
          >
            {objectiveIDs.map((objectiveID, i) => (
              <option name={i} value={i}>
                {objectiveID}
              </option>
            ))}
          </select>
          {variables.map(({ label, controlVar, val, setter }) => (
            <div>
              <span>{label}</span>
              <LineSlider
                data={getLocalProbs(
                  { demand, carryover, priority, regs, minflow },
                  controlVar,
                  objectiveIDs[objectiveIdx]
                )}
                val={val}
                setVal={setter}
              />
            </div>
          ))}
        </div>
        <div>
          <BucketGlyph
            levelInterp={curInterp}
            width={300}
            height={400}
            resolution={LEVELS}
          />
          <span
            style={{
              display: "block",
              textAlign: "center",
            }}
          >
            {curScenID}
          </span>
        </div>
      </div>
    </>
  );
}

const MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };

function LineSlider({ data, val, setVal, width = 400, height = 50 }) {
  const svgElem = useRef();
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  useEffect(() => {
    svgElem.current
      .attr("width", width + MARGIN.left + MARGIN.right)
      .attr("height", height + MARGIN.top + MARGIN.bottom)
      .style("border", "1px solid lightgrey")
      .call((s) =>
        s.node().addEventListener("mousedown", (e) =>
          setVal(
            d3
              .scaleLinear()
              .domain([MARGIN.left, width + MARGIN.left])
              .clamp(true)(e.offsetX)
          )
        )
      )
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`)
      .call((s) =>
        s
          .selectAll("path")
          .data(data)
          .join("path")
          .attr("fill", (_, i) => d3.interpolateBlues(i / data.length))
      )
      .append("rect")
      .attr("fill", "red")
      .attr("width", 5)
      .attr("height", height);
  }, []);

  useEffect(() => {
    svgElem.current
      .selectAll("path")
      .data(data)
      .attr("d", (dd) =>
        d3
          .area()
          .x((_, i) => x(i / (dd.length - 1)))
          .y1((d) => y(d))
          .y0(y(0))(dd)
      );
  }, [data]);

  useEffect(() => {
    svgElem.current.select("rect").attr("x", x(val));
  }, [val]);

  return (
    <svg
      className="line-slider"
      ref={(e) => void (svgElem.current = d3.select(e))}
    ></svg>
  );
}

function getKey(demand, carryover, priority, regs, minflow) {
  return `${demand}${carryover}${priority}${regs}${minflow}`;
}

function createInterps(name, curScen) {
  const delivs =
    objectivesData[name][SCENARIO_KEY_STRING][curScen][DELIV_KEY_STRING];
  return d3
    .scaleLinear()
    .domain(ticksExact(0, 1, delivs.length))
    .range(delivs.map((v) => Math.min(1, v / MAX_DELIVS) || 0))
    .clamp(true);
}

function getLocalProbs(
  { demand, carryover, priority, regs, minflow },
  variable,
  objective
) {
  let localProbs = [];
  for (const _demand of variable !== "demand"
    ? [Math.round(DOMAINS["demand"](demand))]
    : d3.range(
        DOMAINS["demand"].range()[0],
        DOMAINS["demand"].range()[1] + 1
      )) {
    for (const _carryover of variable !== "carryover"
      ? [Math.round(DOMAINS["carryover"](carryover))]
      : d3.range(
          DOMAINS["carryover"].range()[0],
          DOMAINS["carryover"].range()[1] + 1
        )) {
      for (const _priority of variable !== "priority"
        ? [Math.round(DOMAINS["priority"](priority))]
        : d3.range(
            DOMAINS["priority"].range()[0],
            DOMAINS["priority"].range()[1] + 1
          )) {
        for (const _regs of variable !== "regs"
          ? [Math.round(DOMAINS["regs"](regs))]
          : d3.range(
              DOMAINS["regs"].range()[0],
              DOMAINS["regs"].range()[1] + 1
            )) {
          for (const _minflow of variable !== "minflow"
            ? [Math.round(DOMAINS["minflow"](minflow))]
            : d3.range(
                DOMAINS["minflow"].range()[0],
                DOMAINS["minflow"].range()[1] + 1
              )) {
            localProbs.push(
              factorsData[
                getKey(_demand, _carryover, _priority, _regs, _minflow)
              ]
            );
          }
        }
      }
    }
  }

  const interps = [];

  for (const scen of localProbs) {
    interps.push(createInterps(objective, scen));
  }

  return ticksExact(0, 1, LEVELS + 1).map((t) => interps.map((d) => d(t)));
}
