import React, { useMemo } from "react";
import "./reset.css";
import "./index.css";

import { objectivesData } from "./data";
import { factorsData } from "./data";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import BucketViz from "./BucketViz";
import { ticksExact } from "./utils";

const domains = {
  demand: d3.scaleLinear([1, 4]),
  carryover: d3.scaleLinear([1, 3]),
  priority: d3.scaleLinear([1, 2]),
  regs: d3.scaleLinear([1, 4]),
  minflow: d3.scaleLinear([1, 4]),
};

function getKey({ demand, carryover, priority, regs, minflow }) {
  return `${demand}${carryover}${priority}${regs}${minflow}`;
}

function createInterps(name, curScen) {
  const delivs = objectivesData[name]["scens"][curScen]["delivs"];
  return d3
    .scaleLinear()
    .domain(ticksExact(0, 1, delivs.length))
    .range(delivs.map((v) => Math.min(1, v / 1200) || 0))
    .clamp(true);
}

function getLocalProbs(
  { demand, carryover, priority, regs, minflow },
  variable,
  objective
) {
  let localProbs = [];
  for (const _demand of variable !== "demand"
    ? [Math.round(domains["demand"](demand))]
    : d3.range(
        domains["demand"].range()[0],
        domains["demand"].range()[1] + 1
      )) {
    for (const _carryover of variable !== "carryover"
      ? [Math.round(domains["carryover"](carryover))]
      : d3.range(
          domains["carryover"].range()[0],
          domains["carryover"].range()[1] + 1
        )) {
      for (const _priority of variable !== "priority"
        ? [Math.round(domains["priority"](priority))]
        : d3.range(
            domains["priority"].range()[0],
            domains["priority"].range()[1] + 1
          )) {
        for (const _regs of variable !== "regs"
          ? [Math.round(domains["regs"](regs))]
          : d3.range(
              domains["regs"].range()[0],
              domains["regs"].range()[1] + 1
            )) {
          for (const _minflow of variable !== "minflow"
            ? [Math.round(domains["minflow"](minflow))]
            : d3.range(
                domains["minflow"].range()[0],
                domains["minflow"].range()[1] + 1
              )) {
            localProbs.push(
              factorsData[
                getKey({
                  demand: _demand,
                  carryover: _carryover,
                  priority: _priority,
                  regs: _regs,
                  minflow: _minflow,
                })
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

  return ticksExact(0, 1, 10 + 1).map((t) => interps.map((d) => d(t)));
}

export default function SliderApp() {
  const [scen, setScen] = useState("expl0000");
  const { current: OBJ_NAMES } = useRef(Object.keys(objectivesData));
  const [objectiveIdx, setObjectiveIdx] = useState(0);

  const [demand, setDemand] = useState(0.25);
  const [carryover, setCarryover] = useState(0.25);
  const [priority, setPriority] = useState(0.25);
  const [regs, setRegs] = useState(0.25);
  const [minflow, setMinflow] = useState(0.25);

  const interps = useMemo(() => {
    return createInterps(OBJ_NAMES[objectiveIdx], scen);
  }, [scen, objectiveIdx]);

  useEffect(() => {
    setScen(
      factorsData[
        getKey({
          demand: Math.round(domains["demand"](demand)),
          carryover: Math.round(domains["carryover"](carryover)),
          priority: Math.round(domains["priority"](priority)),
          regs: Math.round(domains["regs"](regs)),
          minflow: Math.round(domains["minflow"](minflow)),
        })
      ]
    );
  }, [demand, carryover, priority, regs, minflow]);

  return (
    <>
      <div className="editor">
        <div className="sliders">
          <select
            value={objectiveIdx}
            onChange={(e) => setObjectiveIdx(parseInt(e.target.value))}
          >
            {OBJ_NAMES.map((o, i) => (
              <option name={i} value={i}>
                {o}
              </option>
            ))}
          </select>
          <div>
            <span>{"demand [1, 0.9, 0.8, 0.7]"}</span>
            <LineSlider
              data={getLocalProbs(
                { demand, carryover, priority, regs, minflow },
                "demand",
                OBJ_NAMES[objectiveIdx]
              )}
              val={demand}
              setVal={setDemand}
            />
          </div>
          <div>
            <span>{"carryover [1.0, 1.1, 1.2]"}</span>
            <LineSlider
              data={getLocalProbs(
                { demand, carryover, priority, regs, minflow },
                "carryover",
                OBJ_NAMES[objectiveIdx]
              )}
              val={carryover}
              setVal={setCarryover}
            />
          </div>
          <div>
            <span>{"priority [0, 1]"}</span>
            <LineSlider
              data={getLocalProbs(
                { demand, carryover, priority, regs, minflow },
                "priority",
                OBJ_NAMES[objectiveIdx]
              )}
              val={priority}
              setVal={setPriority}
            />
          </div>
          <div>
            <span>{"regs [1, 2, 3, 4]"}</span>
            <LineSlider
              data={getLocalProbs(
                { demand, carryover, priority, regs, minflow },
                "regs",
                OBJ_NAMES[objectiveIdx]
              )}
              val={regs}
              setVal={setRegs}
            />
          </div>
          <div>
            <span>{"minflow [0, 0.4, 0.6, 0.8]"}</span>
            <LineSlider
              data={getLocalProbs(
                { demand, carryover, priority, regs, minflow },
                "minflow",
                OBJ_NAMES[objectiveIdx]
              )}
              val={minflow}
              setVal={setMinflow}
            />
          </div>
        </div>
        <div>
          <BucketViz
            bucketId={1}
            levelInterp={interps}
            width={300}
            height={400}
          />
          <span
            style={{
              display: "block",
              textAlign: "center",
            }}
          >
            {scen}
          </span>
        </div>
      </div>
    </>
  );
}

function LineSlider({
  data = [
    [0.2, 0.8],
    [0.2, 0.5, 0.7],
    [0.1, 0.3, 0.35],
    [0.0, 0.0, 0.1],
  ],
  val,
  setVal,
  width = 400,
  height = 50,
}) {
  const svgElem = useRef();

  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  useEffect(() => {
    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]).clamp(true);

    const svg = d3
      .select(svgElem.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      //   .style("pointer-events", "none")
      .style("border", "1px solid lightgrey")
      .call((ee) => {
        ee.node().addEventListener("mousedown", (e) => {
          //   console.log("yo");
          //   const left =
          //     Math.min(Math.max(e.offsetX, margin.left), margin.left + width) +
          //     "px";

          //   ee.selectAll("rect").attr("x", left);
          const val = d3
            .scaleLinear()
            .domain([margin.left, width + margin.left])
            .range([0, 1])
            .clamp(true)(e.offsetX);
          setVal(val);
        });
      })
      .append("g")
      .attr("class", "graph-area")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call((e) => {
        e.selectAll("path")
          .data(data)
          .join("path")
          .attr("fill", (_, i) => d3.interpolateBlues(i / data.length))
          .attr("d", (dd) =>
            d3
              .area()
              .x(function (_, i) {
                return x(i / (dd.length - 1));
              })
              .y1(function (d) {
                return y(d);
              })
              .y0(function () {
                return y(0);
              })(dd)
          );
      })
      .append("rect");
  }, []);

  useEffect(() => {
    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]).clamp(true);

    d3.select(svgElem.current)
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("fill", (_, i) => d3.interpolateBlues(i / data.length))
      .attr("d", (dd) =>
        d3
          .area()
          .x(function (_, i) {
            return x(i / (dd.length - 1));
          })
          .y1(function (d) {
            return y(d);
          })
          .y0(function () {
            return y(0);
          })(dd)
      );
  }, [data]);

  useEffect(() => {
    const svg = d3.select(svgElem.current);
    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);

    svg
      .select("rect")
      .attr("fill", "red")
      .attr("width", 5)
      .attr("height", height)
      .attr("x", x(val));
  }, [val]);

  return <svg className="line-slider" ref={svgElem}></svg>;
}
