import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [orderedScenNames, setOrderedScenNames] = useState(
    criteriaSort(sortMode, data, OBJ_NAMES[13])
  );

  const [curObjective, setCurObjective] = useState(OBJ_NAMES[13]);
  const [curScenIdx, setCurScenIdx] = useState(0);
  const [curScen, setCurScen] = useState(orderedScenNames[curScenIdx]);
  const [curScenPreview, setCurScenPreview] = useState(null);
  const [goal, setGoal] = useState(200);
  const [showScens, setShowScens] = useState(false);
  const [delivInterps, setDelivInterps] = useState(
    createInterps(data, OBJ_NAMES, curScenPreview, curScen)
  );

  useEffect(() => {
    const newOrderedScenNames = criteriaSort(sortMode, data, curObjective);

    setOrderedScenNames(newOrderedScenNames);
    setCurScenIdx(newOrderedScenNames.indexOf(curScen));
  }, [curObjective, sortMode]);

  useEffect(() => {
    if (orderedScenNames[curScenIdx] !== curScen)
      setCurScen(orderedScenNames[curScenIdx]);
  }, [curScenIdx]);

  useEffect(() => {
    if (orderedScenNames.indexOf(curScen) !== curScenIdx)
      setCurScenIdx(orderedScenNames.indexOf(curScen));
  }, [curScen]);

  useEffect(() => {
    setDelivInterps(createInterps(data, OBJ_NAMES, curScenPreview, curScen));
  }, [curScenPreview, curScen]);

  const len = orderedScenNames.length;
  const delivs =
    data[curObjective]["scens"][curScenPreview || curScen]["delivs"];

  const scenList = useMemo(() => {
    return Array.from(orderedScenNames)
      .reverse()
      .filter(
        (scenName, i) =>
          scenName === curScen ||
          ticksExact(0, 0.9, 20)
            .map((d) => Math.floor((d + 0.05) * orderedScenNames.length))
            .includes(i)
      );
  }, [orderedScenNames, curScen]);

  return (
    <>
      <div className="dashboard">
        <div className="slider-container">
          <input
            className="input-range"
            orient="vertical"
            type="range"
            value={
              curScenPreview
                ? orderedScenNames.indexOf(curScenPreview)
                : curScenIdx
            }
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
          <div className="sort-types">
            <input
              type="radio"
              name="sort-type"
              value="median"
              id="median"
              checked={sortMode === "median"}
              onChange={() => void setSortMode("median")}
            />
            <label htmlFor="median">Median</label>

            <input
              type="radio"
              name="sort-type"
              value="deliveries"
              id="deliveries"
              checked={sortMode === "deliveries"}
              onChange={() => void setSortMode("deliveries")}
            />
            <label htmlFor="deliveries">Max. Deliveries</label>
          </div>
          <div
            className={
              "overlay-container" + (curScenPreview ? " previewing" : "")
            }
            onMouseLeave={() => setCurScenPreview(null)}
          >
            <AnimateList keyList={scenList}>
              {scenList.map((scenName) => (
                <div
                  key={scenName}
                  className={
                    (curScenPreview === scenName ? "previewing " : "") +
                    (scenName === curScen ? " current-scene" : "")
                  }
                  onMouseEnter={() => setCurScenPreview(scenName)}
                  onClick={() => {
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
            </AnimateList>
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

function AnimateList({ keyList, children }) {
  const currBBoxes = useRef({});

  const prevBBoxes = useRef({});
  const domRefs = useRef({});

  useLayoutEffect(() => {
    prevBBoxes.current = {};

    for (const k in currBBoxes.current) {
      prevBBoxes.current[k] = currBBoxes.current[k];
    }

    currBBoxes.current = {};

    for (const k in domRefs.current) {
      currBBoxes.current[k] = domRefs.current[k].getBoundingClientRect();
    }

    const hasPrevBoundingBox = Object.keys(prevBBoxes.current).length;

    if (hasPrevBoundingBox) {
      React.Children.forEach(children, (child) => {
        const firstBox = currBBoxes.current[child.key];
        const lastBox = prevBBoxes.current[child.key];

        if (lastBox === undefined || firstBox === undefined) return;
        const changeInX = firstBox.top - lastBox.top;

        if (changeInX) {
          requestAnimationFrame(() => {
            domRefs.current[
              child.key
            ].style.transform = `translateY(${-changeInX}px)`;
            domRefs.current[child.key].style.transition = "transform 0s";

            requestAnimationFrame(() => {
              domRefs.current[child.key].style.transform = "";
              domRefs.current[child.key].style.transition = "transform 500ms";
            });
          });
        }
      });
    }
  }, [keyList]);

  domRefs.current = {};

  return React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      ref: (el) => {
        if (el) {
          domRefs.current[child.key] = el;
        }
      },
    });
  });
}
