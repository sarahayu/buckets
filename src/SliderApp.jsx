import React, { useMemo, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import BucketGlyph from "./bucket-lib/BucketGlyph";

import {
  DELIV_KEY_STRING,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "./data/objectivesData";
import { factorsData } from "./data/factorsData";
import { ticksExact } from "./bucket-lib/utils";
import { useStickyScale } from "./utils";

const DEFAULT_SCENARIO = "expl0000";
const DEFAULT_OBJECTIVE_ID = "DEL_CVP_PAG_N";
const DEFAULT_VAL = 0.25;
const LEVELS = 10;

const D_KEY = "demand",
  C_KEY = "carryover",
  P_KEY = "priority",
  R_KEY = "regs",
  M_KEY = "minflow";

const NUM_OPTS = {
  [D_KEY]: 4,
  [C_KEY]: 3,
  [P_KEY]: 2,
  [R_KEY]: 4,
  [M_KEY]: 4,
};

const THRESHOLDS = {};

Object.keys(NUM_OPTS).forEach(
  (variable) =>
    (THRESHOLDS[variable] = d3.scaleQuantize(
      ticksExact(0, 1, NUM_OPTS[variable])
    ))
);

export default function SliderApp() {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));

  const [curScenID, setCurScenID] = useState(DEFAULT_SCENARIO);
  const [curObjectiveID, setCurObjectiveID] = useState(DEFAULT_OBJECTIVE_ID);

  const [demand, setDemand] = useStickyScale(DEFAULT_VAL, THRESHOLDS[D_KEY]);
  const [carryover, setCarryover] = useStickyScale(
    DEFAULT_VAL,
    THRESHOLDS[C_KEY]
  );
  const [priority, setPriority] = useStickyScale(
    DEFAULT_VAL,
    THRESHOLDS[P_KEY]
  );
  const [regs, setRegs] = useStickyScale(DEFAULT_VAL, THRESHOLDS[R_KEY]);
  const [minflow, setMinflow] = useStickyScale(DEFAULT_VAL, THRESHOLDS[M_KEY]);

  const curInterp = useMemo(
    () => createInterps(curObjectiveID, curScenID),
    [curScenID, curObjectiveID]
  );

  useEffect(
    () =>
      void setCurScenID(
        factorsData[serialize(demand, carryover, priority, regs, minflow)]
      ),
    [demand, carryover, priority, regs, minflow]
  );

  const variables = [
    {
      label: "demand [1, 0.9, 0.8, 0.7]",
      controlVar: D_KEY,
      val: demand,
      setter: setDemand,
    },
    {
      label: "carryover [1.0, 1.1, 1.2]",
      controlVar: C_KEY,
      val: carryover,
      setter: setCarryover,
    },
    {
      label: "priority [0, 1]",
      controlVar: P_KEY,
      val: priority,
      setter: setPriority,
    },
    {
      label: "regs [1, 2, 3, 4]",
      controlVar: R_KEY,
      val: regs,
      setter: setRegs,
    },
    {
      label: "minflow [0, 0.4, 0.6, 0.8]",
      controlVar: M_KEY,
      val: minflow,
      setter: setMinflow,
    },
  ];

  return (
    <>
      <div className="editor">
        <div className="sliders">
          <select
            value={curObjectiveID}
            onChange={(e) => setCurObjectiveID(e.target.value)}
          >
            {objectiveIDs.map((objectiveID) => (
              <option key={objectiveID} name={objectiveID} value={objectiveID}>
                {objectiveID}
              </option>
            ))}
          </select>
          {variables.map(({ label, controlVar, val, setter }) => (
            <div key={controlVar}>
              <span>{label}</span>
              <LineSlider
                data={getLocalProbs(
                  { demand, carryover, priority, regs, minflow },
                  controlVar,
                  curObjectiveID
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

function LineSlider({ data, val, setVal }) {
  const MARGIN = { top: 5, right: 5, bottom: 0, left: 5 },
    WIDTH = 400,
    HEIGHT = 50,
    RAZOR_WIDTH = 5;

  const svgElem = useRef();
  const x = d3.scaleLinear().range([0, WIDTH]);
  const y = d3.scaleLinear().range([HEIGHT, 0]);

  useEffect(() => {
    svgElem.current
      .attr("width", WIDTH + MARGIN.left + MARGIN.right)
      .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
      .call((s) =>
        s.node().addEventListener("mousedown", (e) =>
          setVal(
            d3
              .scaleLinear()
              .domain([MARGIN.left, WIDTH + MARGIN.left])
              .clamp(true)(e.offsetX)
          )
        )
      )
      .call((s) => {
        s.append("g")
          .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`)
          .call(
            d3
              .axisTop(d3.scalePoint(d3.range(data[0].length), [0, WIDTH]))
              .tickFormat("")
          )
          .selectAll("path")
          .style("stroke", "lightgrey");
        // ticks can stay color black for clarity
      })
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
      .call((s) =>
        s
          .append("rect")
          .attr("width", WIDTH)
          .attr("height", HEIGHT)
          .attr("fill", "none")
          .attr("stroke", "lightgrey")
      )
      .append("rect")
      .attr("class", "razor")
      .attr("fill", "red")
      .attr("width", RAZOR_WIDTH)
      .attr("height", HEIGHT);
  }, []);

  useEffect(() => {
    svgElem.current
      .select(".graph-area")
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
    svgElem.current
      .select(".graph-area")
      .select(".razor")
      .attr("x", x(val) - RAZOR_WIDTH / 2);
  }, [val]);

  return (
    <svg
      className="line-slider"
      ref={(e) => void (svgElem.current = d3.select(e))}
    ></svg>
  );
}

function serialize(demand, carryover, priority, regs, minflow) {
  const interp = (v, k) => d3.scaleQuantize(d3.range(1, NUM_OPTS[k] + 1))(v);

  return `${interp(demand, D_KEY)}${interp(carryover, C_KEY)}${interp(
    priority,
    P_KEY
  )}${interp(regs, R_KEY)}${interp(minflow, M_KEY)}`;
}

function createInterps(name, curScen) {
  const delivs =
    objectivesData[name][SCENARIO_KEY_STRING][curScen][DELIV_KEY_STRING];
  return d3
    .scaleLinear()
    .domain(ticksExact(0, 1, delivs.length))
    .range(delivs.map((v) => v / MAX_DELIVS))
    .clamp(true);
}

function getLocalProbs(
  { demand: d, carryover: c, priority: p, regs: r, minflow: m },
  controlVar,
  objective
) {
  const combinations = [];

  const dVals = controlVar !== D_KEY ? [d] : THRESHOLDS[D_KEY].range();
  const cVals = controlVar !== C_KEY ? [c] : THRESHOLDS[C_KEY].range();
  const pVals = controlVar !== P_KEY ? [p] : THRESHOLDS[P_KEY].range();
  const rVals = controlVar !== R_KEY ? [r] : THRESHOLDS[R_KEY].range();
  const mVals = controlVar !== M_KEY ? [m] : THRESHOLDS[M_KEY].range();

  for (const d of dVals) {
    for (const c of cVals) {
      for (const p of pVals) {
        for (const r of rVals) {
          for (const m of mVals) {
            combinations.push([d, c, p, r, m]);
          }
        }
      }
    }
  }

  const interps = combinations.map((vals) =>
    createInterps(objective, factorsData[serialize(...vals)])
  );

  return ticksExact(0, 1, LEVELS + 1).map((t) => interps.map((d) => d(t)));
}
