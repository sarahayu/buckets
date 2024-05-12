import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { objectivesData } from "./data";
import { ticksExact } from "./utils";
import BucketViz from "./BucketViz";
import DotPDF from "./DotPDF";
import DotPDFLite from "./DotPDFLite";

const MAX_DELIVS = 1200;

function createInterps(data, OBJ_NAMES, curScenPreview, curScen) {
  const mapFunc = {};
  OBJ_NAMES.forEach((name) => {
    const delivs = data[name]["scens"][curScenPreview || curScen]["delivs"];
    mapFunc[name] = d3
      .scaleLinear()
      .domain(ticksExact(0, 1, delivs.length))
      .range(delivs.map((v) => Math.min(1, v / MAX_DELIVS) || 0))
      .clamp(true);
  });
  return mapFunc;
}

function criteriaSort(criteria, data, objective) {
  if (criteria === "median") {
    return Object.keys(data[objective]["scens"]).sort(
      (a, b) =>
        d3.mean(data[objective]["scens"][a]["delivs"]) -
        d3.mean(data[objective]["scens"][b]["delivs"])
    );
  }
  if (criteria === "deliveries") {
    return Object.keys(data[objective]["scens"]).sort(
      (a, b) =>
        d3.max(data[objective]["scens"][a]["delivs"]) -
        d3.max(data[objective]["scens"][b]["delivs"])
    );
  }
}

export default function App({ data = objectivesData }) {
  const { current: OBJ_NAMES } = useRef(Object.keys(data));
  const [sortMode, setSortMode] = useState("median");
  const [scenNames, setScenNames] = useState(
    criteriaSort(sortMode, data, OBJ_NAMES[0])
  );

  const [curObjective, setCurObjective] = useState(OBJ_NAMES[0]);
  const [curScenIdx, setCurScenIdx] = useState(0);
  const [curScen, setCurScen] = useState(scenNames[curScenIdx]);
  const [curScenPreview, setCurScenPreview] = useState(null);
  const [goal, setGoal] = useState(200);
  const [showScens, setShowScens] = useState(false);
  const [delivInterps, setDelivInterps] = useState(
    createInterps(data, OBJ_NAMES, curScenPreview, curScen)
  );

  useEffect(() => {
    const a = criteriaSort(sortMode, data, curObjective);
    setScenNames(a);
    setCurScenIdx(a.indexOf(curScen));
  }, [curObjective, sortMode]);

  useEffect(() => {
    if (curScenPreview === null) {
      setCurScen(scenNames[curScenIdx]);
    }
  }, [curScenIdx]);

  useEffect(() => {
    if (curScenPreview === null) {
      setCurScenIdx(scenNames.indexOf(curScen));
    } else {
      setCurScenIdx(scenNames.indexOf(curScenPreview));
    }
  }, [curScenPreview]);

  useEffect(() => {
    setDelivInterps(createInterps(data, OBJ_NAMES, curScenPreview, curScen));
  }, [curScenPreview, curScen]);

  const len = scenNames.length;
  const delivs =
    data[curObjective]["scens"][curScenPreview || curScen]["delivs"];

  return (
    <>
      <div className="dashboard">
        <div className="slider-container">
          <input
            className="input-range"
            orient="vertical"
            type="range"
            value={curScenIdx}
            min="0"
            max={len - 1}
            onChange={(e) => void setCurScenIdx(e.target.value)}
          />
          <div className="scen-name">
            <span>Current Scenario</span>
            <span>{curScenPreview || curScen}</span>
            <span
              className="preview-indic"
              style={{
                visibility: curScenPreview ? "visible" : "",
              }}
            >
              Previewing
            </span>
            <button onClick={() => void setShowScens((d) => !d)}>
              See Overview
            </button>
          </div>
        </div>
        <div className="bucket-map-container">
          <div className="bucket-viz">
            <div className="bucket-viz-container">
              <span className="main-bucket-label">{curObjective}</span>
              <BucketViz
                bucketId={"mainbucket"}
                levelInterp={delivInterps[curObjective]}
                width={100}
                height={100}
              />
              <div
                className="bucket-razor"
                style={{
                  top:
                    d3
                      .scaleLinear()
                      .domain([0, MAX_DELIVS])
                      .range([100, 0])
                      .clamp(true)(goal) + "px",
                }}
              >
                <p>Goal</p>
                <p>
                  {d3.format(".0f")(goal)} <span>TAF</span>
                </p>
              </div>
            </div>
          </div>
          <div className="map"></div>
          <div className="other-buckets-container">
            {OBJ_NAMES.map((name) => (
              <div
                key={name}
                className={
                  "bucket-and-label " + (name === curObjective ? "cur-obj" : "")
                }
                onClick={() => setCurObjective(name)}
              >
                <span>{name}</span>
                <BucketViz
                  bucketId={name}
                  levelInterp={delivInterps[name]}
                  width={50}
                  height={50}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="pdf-container">
          <DotPDF
            data={delivs.map((d) => Math.min(Math.max(0, d), MAX_DELIVS))}
            goal={goal}
            setGoal={setGoal}
          />
        </div>
      </div>
      {showScens && (
        <div className={"ridgeline-overlay"}>
          <div class="sort-types">
            <input
              type="radio"
              name="sort-type"
              value="median"
              id="median"
              checked={sortMode === "median"}
              onChange={() => void setSortMode("median")}
            />
            <label for="median">Median</label>

            <input
              type="radio"
              name="sort-type"
              value="deliveries"
              id="deliveries"
              checked={sortMode === "deliveries"}
              onChange={() => void setSortMode("deliveries")}
            />
            <label for="deliveries">Max. Deliveries</label>
          </div>
          <div
            className={
              "overlay-container" +
              (curScenPreview ? " previewing" : " not-previewing")
            }
            onMouseLeave={() => setCurScenPreview(null)}
          >
            {Array.from(scenNames)
              .reverse()
              .filter(
                (scenName, i) =>
                  scenName === curScen ||
                  ticksExact(0, 0.9, 10)
                    .map((d) => Math.floor((d + 0.05) * scenNames.length))
                    .includes(i)
              )
              .map((scenName) => (
                <div
                  key={scenName}
                  className={
                    (curScenPreview === scenName
                      ? "previewing"
                      : "not-previewing") +
                    (scenName === curScen ? " current-scene" : "")
                  }
                  onMouseEnter={() => setCurScenPreview(scenName)}
                  onClick={() => {
                    // setCurScenPreview(null)
                    setCurScen(scenName);
                  }}
                >
                  <DotPDFLite
                    data={data[curObjective]["scens"][scenName]["delivs"].map(
                      (d) => Math.min(Math.max(0, d), MAX_DELIVS)
                    )}
                    goal={goal}
                    width={300}
                    height={200}
                  />
                  <span>{scenName}</span>
                </div>
              ))}
            <div
              className="dot-overlay-razor"
              style={{
                left:
                  d3
                    .scaleLinear()
                    .domain([0, MAX_DELIVS])
                    .range([0, 300])
                    .clamp(true)(goal) + "px",
              }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
}
