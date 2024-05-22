import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import { objectivesData } from "./data";
import { ticksExact, usePrevious } from "./utils";
import BucketViz from "./BucketViz";
import DotPDF from "./DotPDF";
import DotPDFLite from "./DotPDFLite";
import classNames from "classnames";

const MAX_DELIVS = 1200;

export default function App({ data = objectivesData }) {
  const { current: OBJECTIVE_NAMES } = useRef(Object.keys(data));
  const { current: FIRST_OBJECTIVE } = useRef(OBJECTIVE_NAMES[13]);

  const [sortMode, setSortMode] = useState("median");
  const [curObjective, setCurObjective] = useState(FIRST_OBJECTIVE);
  const [curScenIdx, setCurScenIdx] = useState(0);
  const [curScenPreviewIdx, setCurScenPreviewIdx] = useState(null);

  const [goal, setGoal] = useState(200);
  const [showScens, setShowScens] = useState(false);

  const orderedScenNames = useMemo(
    () => criteriaSort(sortMode, data, curObjective),
    [sortMode, curObjective]
  );
  const prevOrderedScenNames = usePrevious(orderedScenNames);

  const curScenActual = orderedScenNames[curScenIdx];
  const curScenPreview =
    curScenPreviewIdx !== null ? orderedScenNames[curScenPreviewIdx] : null;
  const curScen = curScenPreview || curScenActual;

  useEffect(() => {
    if (prevOrderedScenNames)
      setCurScenIdx(orderedScenNames.indexOf(prevOrderedScenNames[curScenIdx]));
  }, [sortMode, curObjective]);

  const delivInterps = useMemo(() => {
    return createInterps(data, OBJECTIVE_NAMES, curScen);
  }, [curScenIdx, curScenPreviewIdx]);

  const delivsMap = useMemo(() => {
    const map = {};

    for (const scenName of orderedScenNames) {
      map[scenName] = data[curObjective]["scens"][scenName]["delivs"].map((d) =>
        Math.min(Math.max(0, d), MAX_DELIVS)
      );
    }

    return map;
  }, [curObjective]);

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
  }, [curScenIdx]);

  const levelInterp = useMemo(
    () => delivInterps[curObjective],
    [curScenIdx, curScenPreviewIdx]
  );

  return (
    <>
      <div className="dashboard">
        <div className="slider-container">
          <Inputter
            {...{
              curScenPreviewIdx,
              curScenIdx,
              orderedScenNames,
              setCurScenIdx,
              curScen,
              setShowScens,
            }}
          />
        </div>
        <div className="bucket-map-container">
          <MainBucket {...{ curObjective, levelInterp, goal }} />

          <div className="other-buckets-container">
            {OBJECTIVE_NAMES.map((name) => (
              <OtherBucketViz
                key={name}
                {...{ name, curObjective, setCurObjective, delivInterps }}
              />
            ))}
          </div>
        </div>
        <div className="pdf-container">
          <DotPDF data={delivsMap[curScen]} goal={goal} setGoal={setGoal} />
        </div>
      </div>
      {showScens && (
        <Overlay
          {...{
            sortMode,
            setSortMode,
            curScenPreviewIdx,
            setCurScenIdx,
            setCurScenPreviewIdx,
            curScenPreview,
            curScenActual,
            orderedScenNames,
            delivsMap,
            goal,
            scenList,
          }}
        />
      )}
    </>
  );
}

function createInterps(data, objectives, scenName) {
  const mapFunc = {};
  objectives.forEach((name) => {
    const delivs = data[name]["scens"][scenName]["delivs"];
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

function OtherBucketViz({ name, curObjective, setCurObjective, delivInterps }) {
  return (
    <div
      key={name}
      className={classNames("bucket-and-label", {
        "cur-obj": name === curObjective,
      })}
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
  );
}

function Inputter({
  curScenPreviewIdx,
  curScenIdx,
  orderedScenNames,
  setCurScenIdx,
  curScen,
  setShowScens,
}) {
  return (
    <>
      <input
        className="input-range"
        orient="vertical"
        type="range"
        value={curScenPreviewIdx === null ? curScenIdx : curScenPreviewIdx}
        min="0"
        max={orderedScenNames.length - 1}
        onChange={(e) => void setCurScenIdx(e.target.value)}
      />
      <div className="scen-name">
        <span>Current Scenario</span>
        <span>{curScen}</span>
        <span
          className={classNames("preview-indic", {
            visible: curScenPreviewIdx !== null,
          })}
        >
          Previewing
        </span>
        <button onClick={() => void setShowScens((d) => !d)}>
          See Overview
        </button>
      </div>
    </>
  );
}

function MainBucket({ curObjective, levelInterp, goal }) {
  return (
    <div className="bucket-viz">
      <div className="bucket-viz-container">
        <span className="main-bucket-label">{curObjective}</span>
        <BucketViz
          bucketId={"mainbucket"}
          levelInterp={levelInterp}
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
  );
}

function Overlay({
  sortMode,
  setSortMode,
  curScenPreviewIdx,
  setCurScenIdx,
  setCurScenPreviewIdx,
  curScenPreview,
  curScenActual,
  orderedScenNames,
  delivsMap,
  goal,
  scenList,
}) {
  return (
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
        className={classNames("overlay-container", {
          previewing: curScenPreviewIdx !== null,
        })}
        onMouseLeave={() => setCurScenPreviewIdx(null)}
      >
        <AnimateList keyList={scenList}>
          {scenList.map((scenName) => (
            <div
              key={scenName}
              className={classNames({
                previewing: scenName === curScenPreview,
                "current-scene": scenName === curScenActual,
              })}
              onMouseEnter={() =>
                setCurScenPreviewIdx(orderedScenNames.indexOf(scenName))
              }
              onClick={() => {
                setCurScenIdx(orderedScenNames.indexOf(scenName));
              }}
            >
              <DotPDFLite
                data={delivsMap[scenName]}
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
