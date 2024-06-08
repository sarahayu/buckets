import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import {
  DELIV_KEY_STRING,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "./data/objectivesData";
import { ticksExact, usePrevious } from "./bucket-lib/utils";
import BucketGlyph from "./bucket-lib/BucketGlyph";
import DotHistogram from "./DotHistogram";
import DotHistogramSmall from "./DotHistogramSmall";
import classNames from "classnames";

const DEFAULT_GOAL = 200;
const DEFAULT_OBJECTIVE_IDX = 13;
const DEFAULT_SORT_MODE = "median";

const AppContext = createContext({});

export default function MainApp({ data = objectivesData }) {
  const { current: objectiveIDs } = useRef(Object.keys(data));

  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [showScens, setShowScens] = useState(false);
  const [sortMode, setSortMode] = useState(DEFAULT_SORT_MODE);

  const [curObjectiveID, setCurObjectiveID] = useState(
    objectiveIDs[DEFAULT_OBJECTIVE_IDX]
  );
  const [curScenIdx, setCurScenIdx] = useState(0);
  const [curScenPreviewIdx, setCurScenPreviewIdx] = useState(null);

  const { curDelivInterps, curPercentileScens, curOrderedScenIDs } = useCaches(
    data,
    objectiveIDs,
    curObjectiveID,
    curScenIdx,
    curScenPreviewIdx,
    sortMode
  );

  // TODO: fix? gotta memoize so bucket animations trigger
  const curMainInterp = useMemo(
    () => curDelivInterps[curObjectiveID],
    [curScenIdx, curScenPreviewIdx]
  );

  const prevScenID = usePrevious(curOrderedScenIDs[curScenIdx]);

  const curScenIDActual = curOrderedScenIDs[curScenIdx];
  const curScenIDPreview =
    curScenPreviewIdx !== null ? curOrderedScenIDs[curScenPreviewIdx] : null;
  const curScenID = curScenIDPreview || curScenIDActual;

  useEffect(() => {
    if (prevScenID) setCurScenIdx(curOrderedScenIDs.indexOf(prevScenID));
  }, [sortMode, curObjectiveID]);

  return (
    <AppContext.Provider
      value={{
        data,
        objectiveIDs,
        sortMode,
        curObjectiveID,
        curScenIdx,
        curScenPreviewIdx,
        curScenID,
        curScenIDPreview,
        curScenIDActual,
        curPercentileScens,
        goal,
        showScens,
        curOrderedScenIDs,
      }}
    >
      <div className="dashboard">
        <div className="slider-container">
          <InputArea
            setCurScenIdx={setCurScenIdx}
            setShowScens={setShowScens}
          />
        </div>
        <div className="bucket-map-container">
          <MainBucket levelInterp={curMainInterp} />

          <div className="other-buckets-container">
            {objectiveIDs.map((objectiveID) => (
              <SmallBucketTile
                key={objectiveID}
                label={objectiveID}
                active={objectiveID !== curObjectiveID}
                onClick={() => setCurObjectiveID(objectiveID)}
              >
                <BucketGlyph
                  levelInterp={curDelivInterps[objectiveID]}
                  width={50}
                  height={50}
                />
              </SmallBucketTile>
            ))}
          </div>
        </div>
        <div className="pdf-container">
          <DotHistogram
            data={
              data[curObjectiveID][SCENARIO_KEY_STRING][curScenID][
                DELIV_KEY_STRING
              ]
            }
            goal={goal}
            setGoal={setGoal}
          />
        </div>
      </div>
      {showScens && (
        <Overlay
          setSortMode={setSortMode}
          setCurScenIdx={setCurScenIdx}
          setCurScenPreviewIdx={setCurScenPreviewIdx}
        />
      )}
    </AppContext.Provider>
  );
}

//
// custom hook
//

function useCaches(
  data,
  objectiveIDs,
  curObjectiveID,
  curScenIdx,
  curScenPreviewIdx,
  sortMode
) {
  const curOrderedScenIDs = useMemo(
    () => criteriaSort(sortMode, data, curObjectiveID),
    [sortMode, curObjectiveID]
  );

  const curScenIDActual = curOrderedScenIDs[curScenIdx];
  const curScenIDPreview =
    curScenPreviewIdx !== null ? curOrderedScenIDs[curScenPreviewIdx] : null;
  const curScenID = curScenIDPreview || curScenIDActual;

  const curDelivInterps = useMemo(() => {
    return createInterps(data, objectiveIDs, curScenID);
  }, [curScenIdx, curScenPreviewIdx]);

  const curPercentileScens = useMemo(() => {
    return Array.from(curOrderedScenIDs)
      .reverse()
      .filter(
        (scenID, i) =>
          scenID === curScenID ||
          ticksExact(0, 0.9, 20)
            .map((d) => Math.floor((d + 0.05) * curOrderedScenIDs.length))
            .includes(i)
      );
  }, [curScenIdx]);

  return {
    curDelivInterps,
    curPercentileScens,
    curOrderedScenIDs,
  };
}

//
// some components
//

function SmallBucketTile({ label, active, onClick, children }) {
  return (
    <div
      className={classNames("bucket-and-label", {
        "cur-obj": !active,
      })}
      onClick={onClick}
    >
      <span>{label}</span>
      {children}
    </div>
  );
}

function InputArea({ setCurScenIdx, setShowScens }) {
  const { curScenPreviewIdx, curScenIdx, curOrderedScenIDs, curScenID } =
    useContext(AppContext);
  return (
    <>
      <input
        className="input-range"
        orient="vertical"
        type="range"
        value={curScenPreviewIdx === null ? curScenIdx : curScenPreviewIdx}
        min="0"
        max={curOrderedScenIDs.length - 1}
        onChange={(e) => void setCurScenIdx(e.target.value)}
      />
      <div className="scen-name">
        <span>Current Scenario</span>
        <span>{curScenID}</span>
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

function MainBucket({ levelInterp }) {
  const { curObjectiveID, goal } = useContext(AppContext);
  return (
    <div className="bucket-viz">
      <div className="bucket-viz-container">
        <span className="main-bucket-label">{curObjectiveID}</span>
        <BucketGlyph levelInterp={levelInterp} width={100} height={100} />
        <div
          className="bucket-razor"
          style={{
            top:
              d3.scaleLinear().domain([0, MAX_DELIVS]).range([100, 0])(goal) +
              "px",
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

function Overlay({ setSortMode, setCurScenIdx, setCurScenPreviewIdx }) {
  const {
    data,
    sortMode,
    curObjectiveID,
    curScenPreviewIdx,
    curScenIDPreview,
    curScenIDActual,
    curOrderedScenIDs,
    goal,
    curPercentileScens,
  } = useContext(AppContext);
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
        <AnimateList keyList={curPercentileScens}>
          {curPercentileScens.map((scenID) => (
            <div
              key={scenID}
              className={classNames({
                previewing: scenID === curScenIDPreview,
                "current-scene": scenID === curScenIDActual,
              })}
              onMouseEnter={() =>
                setCurScenPreviewIdx(curOrderedScenIDs.indexOf(scenID))
              }
              onClick={() => {
                setCurScenIdx(curOrderedScenIDs.indexOf(scenID));
              }}
            >
              <DotHistogramSmall
                data={
                  data[curObjectiveID][SCENARIO_KEY_STRING][scenID][
                    DELIV_KEY_STRING
                  ]
                }
                goal={goal}
                width={300}
                height={200}
              />
              <span>{scenID}</span>
            </div>
          ))}
        </AnimateList>
        <div
          className="dot-overlay-razor"
          style={{
            left:
              d3.scaleLinear().domain([0, MAX_DELIVS]).range([0, 300])(goal) +
              "px",
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

//
// some util functions
//

function createInterps(data, objectives, scenID) {
  const mapFunc = {};
  objectives.forEach((name) => {
    const delivs = data[name][SCENARIO_KEY_STRING][scenID][DELIV_KEY_STRING];
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
    return Object.keys(data[objective][SCENARIO_KEY_STRING]).sort(
      (a, b) =>
        d3.mean(data[objective][SCENARIO_KEY_STRING][a][DELIV_KEY_STRING]) -
        d3.mean(data[objective][SCENARIO_KEY_STRING][b][DELIV_KEY_STRING])
    );
  }
  if (criteria === "deliveries") {
    return Object.keys(data[objective][SCENARIO_KEY_STRING]).sort(
      (a, b) =>
        d3.max(data[objective][SCENARIO_KEY_STRING][a][DELIV_KEY_STRING]) -
        d3.max(data[objective][SCENARIO_KEY_STRING][b][DELIV_KEY_STRING])
    );
  }
}
