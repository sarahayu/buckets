import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { objectivesData } from "./data";
import { ticksExact } from "./utils";
import BucketViz from "./BucketViz";
import DotPDF from "./DotPDF";
import RidgelineViz from "./RidgelineViz";

const MAX_DELIVS = 1200;

export default function App({ data = objectivesData }) {
  const { current: OBJ_NAMES } = useRef(Object.keys(data));
  const [scenNames, setScenNames] = useState(
    data[OBJ_NAMES[0]]["least_to_most"]
  );

  const [curObjective, setCurObjective] = useState(OBJ_NAMES[0]);
  const [curScenIdx, setCurScenIdx] = useState(0);
  const [curScen, setCurScen] = useState(scenNames[curScenIdx]);
  const [goal, setGoal] = useState(200);
  const [showScens, setShowScens] = useState(false);

  useEffect(() => {
    setScenNames(data[curObjective]["least_to_most"]);
    setCurScenIdx(data[curObjective]["least_to_most"].indexOf(curScen));
  }, [curObjective]);

  useEffect(() => {
    setCurScen(scenNames[curScenIdx]);
  }, [curScenIdx]);

  const len = scenNames.length;
  const delivs = data[curObjective]["scens"][curScen]["delivs"];

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
            <span>{curScen}</span>
            <button onClick={() => void setShowScens((d) => !d)}>
              See All
            </button>
          </div>
        </div>
        <div className="bucket-map-container">
          <div className="bucket-viz">
            <div className="bucket-viz-container">
              <span className="main-bucket-label">{curObjective}</span>
              <BucketViz
                bucketId={"mainbucket"}
                levelInterp={d3
                  .scaleLinear()
                  .domain(ticksExact(0, 1, delivs.length))
                  .range(delivs.map((v) => Math.min(1, v / MAX_DELIVS) || 0))
                  .clamp(true)}
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
                  levelInterp={d3
                    .scaleLinear()
                    .domain(
                      ticksExact(
                        0,
                        1,
                        data[name]["scens"][curScen]["delivs"].length
                      )
                    )
                    .range(
                      data[name]["scens"][curScen]["delivs"].map(
                        (v) => Math.min(1, v / MAX_DELIVS) || 0
                      )
                    )
                    .clamp(true)}
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
        <div className="ridgeline-overlay">
          {Array.from(scenNames)
            .reverse()
            .filter((_, i) =>
              ticksExact(0, 0.9, 10)
                .map((d) => Math.floor((d + 0.05) * scenNames.length))
                .includes(i)
            )
            .map((scenName) => (
              <div key={scenName}>
                <RidgelineViz
                  data={data[curObjective]["scens"][scenName]["delivs"]}
                  maxVal={MAX_DELIVS}
                  height={50}
                />
                <span>{scenName}</span>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
