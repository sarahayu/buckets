import React, {
  createContext,
  useContext,
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
} from "data/objectivesData";
import { ticksExact } from "bucket-lib/utils";
import BucketGlyph from "bucket-lib/BucketGlyph";
import DotHistogram from "utils/main/DotHistogram";
import DotHistogramSmall from "utils/main/DotHistogramSmall";
import classNames from "classnames";
import { criteriaSort } from "utils/common";

const DEFAULT_GOAL = 200;
const DEFAULT_OBJECTIVE_NAME = "DEL_CVP_PAG_N";
const DEFAULT_SCEN_NAME = "expl0000";
const DEFAULT_SORT_MODE = "median";

const AppContext = createContext({});

export default function MainApp({ data = objectivesData }) {
  const { current: objectiveNames } = useRef(Object.keys(data));

  const {
    goal,
    showScens,
    sortMode,
    curObjectiveName,
    curScenName,
    curScenNamePreview,

    setGoal,
    setShowScens,
    setSortMode,
    setCurObjectiveName,
    setCurScenName,
    setCurScenNamePreview,
  } = useInterface();

  // calculating these often is laggy. cache.
  const { curDelivInterps, curOrderedScenNames } = useCaches(
    data,
    objectiveNames,
    curObjectiveName,
    curScenName,
    curScenNamePreview,
    sortMode
  );

  // gotta memoize so bucket animations trigger
  const curMainInterp = useMemo(
    () => curDelivInterps[curObjectiveName],
    [curObjectiveName, curDelivInterps]
  );

  const curScenNameDisplayed = curScenNamePreview || curScenName;

  return (
    <AppContext.Provider
      value={{
        data,
        goal,
        curObjectiveName,
        curScenName,
        curScenNamePreview,
        curOrderedScenNames,
      }}
    >
      <div className="dashboard">
        <div className="scen-input">
          <button
            onClick={() => {
              setCurScenName(
                curOrderedScenNames[
                  Math.max(curOrderedScenNames.indexOf(curScenName) - 1, 0)
                ]
              );
            }}
          >
            ⟨
          </button>
          <button
            className="scen-picker"
            onClick={() => {
              setShowScens((s) => !s);
            }}
          >
            <span>Scenario</span>
            <span>{curScenNameDisplayed}</span>
            <span>{sortMode} →</span>
          </button>
          <button
            onClick={() => {
              setCurScenName(
                curOrderedScenNames[
                  Math.min(
                    curOrderedScenNames.indexOf(curScenName) + 1,
                    curOrderedScenNames.length - 1
                  )
                ]
              );
            }}
          >
            ⟩
          </button>
        </div>
        <MainBucket levelInterp={curMainInterp} />
        <div className="pdf-container">
          <DotHistogram
            data={
              data[curObjectiveName][SCENARIO_KEY_STRING][curScenNameDisplayed][
                DELIV_KEY_STRING
              ]
            }
            goal={goal}
            setGoal={setGoal}
          />
        </div>
        <div className="other-buckets-container">
          {objectiveNames.map((objectiveName) => (
            <SmallBucketTile
              key={objectiveName}
              label={objectiveName}
              active={objectiveName !== curObjectiveName}
              onClick={() => {
                setCurObjectiveName(objectiveName);
              }}
            >
              <BucketGlyph
                levelInterp={curDelivInterps[objectiveName]}
                width={50}
                height={50}
              />
            </SmallBucketTile>
          ))}
        </div>
      </div>
      {showScens && (
        <Overlay
          sortMode={sortMode}
          setSortMode={setSortMode}
          setCurScenName={setCurScenName}
          setCurScenNamePreview={setCurScenNamePreview}
          exitFn={() => void setShowScens(false)}
        />
      )}
    </AppContext.Provider>
  );
}

//
// custom hooks
//

function useInterface() {
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [showScens, setShowScens] = useState(false);
  const [sortMode, setSortMode] = useState(DEFAULT_SORT_MODE);

  const [curObjectiveName, setCurObjectiveName] = useState(
    DEFAULT_OBJECTIVE_NAME
  );

  const [curScenName, setCurScenName] = useState(DEFAULT_SCEN_NAME);
  const [curScenNamePreview, setCurScenNamePreview] = useState(null);

  return {
    goal,
    setGoal,
    showScens,
    setShowScens,
    sortMode,
    setSortMode,
    curObjectiveName,
    setCurObjectiveName,
    curScenName,
    setCurScenName,
    curScenNamePreview,
    setCurScenNamePreview,
  };
}

function useCaches(
  data,
  objectiveNames,
  curObjectiveName,
  curScenName,
  curScenNamePreview,
  sortMode
) {
  const curOrderedScenNames = useMemo(
    () => criteriaSort(sortMode, data, curObjectiveName),
    [sortMode, curObjectiveName]
  );

  const curDelivInterps = useMemo(
    () =>
      createInterps(data, objectiveNames, curScenNamePreview || curScenName),
    [curScenName, curScenNamePreview]
  );

  return {
    curDelivInterps,
    curOrderedScenNames,
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
      title={label}
    >
      <span>{label}</span>
      {children}
    </div>
  );
}

function MainBucket({ levelInterp }) {
  const { curObjectiveName, goal } = useContext(AppContext);
  return (
    <div className="bucket-viz">
      <div className="bucket-viz-container">
        <span className="main-bucket-label">{curObjectiveName}</span>
        <BucketGlyph levelInterp={levelInterp} width={200} height={200} />
        <div
          className="bucket-razor"
          style={{
            top:
              d3.scaleLinear().domain([0, MAX_DELIVS]).range([200, 0])(goal) +
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

function Overlay({
  sortMode,
  setSortMode,
  setCurScenName,
  setCurScenNamePreview,
  exitFn,
}) {
  const {
    data,
    curObjectiveName,
    curScenName,
    curScenNamePreview,
    curOrderedScenNames,
    goal,
  } = useContext(AppContext);

  const curPercentileScens = useMemo(() => {
    return Array.from(curOrderedScenNames).reverse();
  }, [curOrderedScenNames]);

  const asdf = useRef();

  useLayoutEffect(() => {
    // console.log(asdf.current);
    asdf.current.scrollTo(
      0,
      asdf.current.querySelector(`#${curScenName}`).getBoundingClientRect()
        .top - 100
    );
  }, []);

  return (
    <div className={"ridgeline-overlay"}>
      <div className="ridgeline-overlay-container">
        <button className="overlay-exit-btn" onClick={exitFn}>
          ×
        </button>
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
          <input
            type="radio"
            name="sort-type"
            value="alphabetical"
            id="alphabetical"
            checked={sortMode === "alphabetical"}
            onChange={() => void setSortMode("alphabetical")}
          />
          <label htmlFor="alphabetical">Alphabetical</label>
        </div>
        <div
          className="overlay-container"
          onMouseLeave={() => setCurScenNamePreview(null)}
          ref={asdf}
        >
          <div
            className={classNames("overlay-container-2", {
              previewing: curScenNamePreview !== null,
            })}
          >
            <AnimateList keyList={curPercentileScens}>
              {curPercentileScens.map((scenID) => (
                <div
                  key={scenID}
                  className={classNames({
                    previewing: scenID === curScenNamePreview,
                    "current-scene": scenID === curScenName,
                  })}
                  id={scenID}
                  onMouseEnter={() => setCurScenNamePreview(scenID)}
                  onClick={() => {
                    setCurScenName(scenID);
                  }}
                >
                  <DotHistogramSmall
                    data={
                      data[curObjectiveName][SCENARIO_KEY_STRING][scenID][
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
                  d3.scaleLinear().domain([0, MAX_DELIVS]).range([0, 300])(
                    goal
                  ) + "px",
              }}
            ></div>
          </div>
        </div>
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
      currBBoxes.current[k] =
        domRefs.current[k].getBoundingClientRect().top +
        domRefs.current[k].parentNode.scrollTop;
    }

    const hasPrevBoundingBox = Object.keys(prevBBoxes.current).length;

    if (hasPrevBoundingBox) {
      React.Children.forEach(children, (child) => {
        const firstBox = currBBoxes.current[child.key];
        const lastBox = prevBBoxes.current[child.key];

        if (lastBox === undefined || firstBox === undefined) return;
        const changeInX = firstBox - lastBox;

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
