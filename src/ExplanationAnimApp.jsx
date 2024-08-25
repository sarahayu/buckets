import * as d3 from "d3";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Scrollama, Step } from "react-scrollama";

import BucketGlyph from "./bucket-lib/BucketGlyph";

import WaterdropGlyph from "./utils/explanation-anim/WaterdropGlyph";
import DotHistogram from "./utils/explanation-anim/DotHistogram";
import { useDataStory } from "./utils/explanation-anim/useDataStory";
import { constants } from "./utils/explanation-anim/constants";
import { hideElems, showElems } from "./utils/explanation-anim/render-utils";
import {
  DELIV_KEY_STRING,
  SCENARIO_KEY_STRING,
  objectiveIDs,
  objectivesData,
  scenarioIDs,
} from "./data/completeObjectivesData";
import { ticksExact } from "./bucket-lib/utils";

const BASELINE_SCENARIO = "expl0000";

export default function ExaplanationAnimApp() {
  const [curObjective, setCurObjective] = useState(constants.DEFAULT_OBJECTIVE);

  const tutorialState = useTutorialState(curObjective);
  const getSlidesInRange = useDataStory(tutorialState, curObjective);

  useEffect(
    function changeObjective() {
      hideElems(
        ".bucket-wrapper, .vardrop, .var-scen-label, .vardrop .dot-histogram-wrapper, .main-histogram, .tut-drop-graphics-wrapper"
      );

      console.log("obj change in effect");
      tutorialState.setReadyHash((rh) => rh + 1);
    },
    [curObjective]
  );

  const onStepEnter = async ({ data, direction }) => {
    if (direction === "up") return;
    data.animHandler?.do();
  };

  const onStepExit = async ({ data, direction }) => {
    if (direction === "down") return;
    data.animHandler?.undo();
  };

  const allSlides = getSlidesInRange("barsAppear", "ifChangeReality");

  const selectedObjs = [
    "SWPTOTALDEL",
    "DEL_CVP_TOTAL",
    "DEL_SWP_PMI",
    "DEL_CVP_PAG",
    "DEL_CVP_PSC_PEX",
    "S_NOD",
    "S_SHSTA",
    "S_OROVL",
  ];

  return (
    <div className="tutorial-view">
      <select
        value={curObjective}
        onChange={(e) => setCurObjective(e.target.value)}
      >
        {selectedObjs.map((objectiveID) => (
          <option value={objectiveID} key={objectiveID}>
            {objectiveID}
          </option>
        ))}
      </select>
      <div className="scrollama scrollama-1">
        <div className="tut-graph-wrapper">
          <div className="tut-graph">
            <svg id="pag-bar-graph"></svg>
            <BucketGlyph
              levelInterp={tutorialState.bucketInterper}
              width={300}
              height={constants.BAR_CHART_HEIGHT}
              colorInterp={constants.INTERP_COLOR}
            />
            <p className="fancy-font objective-label">{curObjective}</p>
          </div>
        </div>

        <div className="tut-drop-graphics-wrapper">
          <div className="main-waterdrop">
            <WaterdropGlyph
              levelInterp={tutorialState.dropInterper}
              width={400}
              height={constants.BAR_CHART_HEIGHT}
              colorInterp={constants.INTERP_COLOR}
            />
          </div>
          <div className="main-histogram">
            <DotHistogram
              width={210}
              height={140}
              data={tutorialState.objectiveDelivs}
              domain={[0, d3.max(tutorialState.objectiveDelivs)]}
            />
          </div>
          {constants.DROP_VARIATIONS.map(({ idx, scen, clas, desc }) => (
            <div className={`vardrop ${clas}`} key={idx} desc={desc}>
              <div>
                <WaterdropGlyph
                  levelInterp={tutorialState.variationInterpers[idx]}
                  width={200}
                  height={(constants.BAR_CHART_HEIGHT * 2) / 3 / 2}
                  colorInterp={constants.INTERP_COLOR}
                />
                <DotHistogram
                  width={210}
                  height={140}
                  data={tutorialState.objectiveVariationDelivs[idx]}
                  domain={[0, d3.max(tutorialState.objectiveDelivs)]}
                />
              </div>
              <p className="var-scen-label">
                scenario <span className="scen-number">{scen}</span>
              </p>
            </div>
          ))}
          <p className="fancy-font objective-label">{curObjective}</p>
        </div>
        <Scrollama
          offset={0.9}
          onStepEnter={onStepEnter}
          onStepExit={onStepExit}
        >
          {allSlides.map((slide, i) => (
            <Step key={i} data={slide}>
              <div className="tut-text-card">{slide.text}</div>
            </Step>
          ))}
          <Step key={"last"} data={{}}>
            <div className="tut-text-card" style={{ marginBottom: "40vh" }}>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  for (let i = allSlides.length - 1; i >= 0; i--) {
                    allSlides[i].animHandler?.undo();
                  }
                }}
              >
                Back to Top
              </button>
            </div>
          </Step>
        </Scrollama>
      </div>
    </div>
  );
}

function useTutorialState(objective) {
  const [readyHash, setReadyHash] = useState(0);

  const [bucketInterper, setBucketInterper] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );
  const [dropInterper, setDropInterper] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );
  const [variationInterpers, setVariationInterpers] = useState(() =>
    constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
  );

  const [objectiveDelivs, setObjectiveDelivs] = useState(() => []);
  const [objectiveInterper, setObjectiveInterper] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );
  const [objectiveVariationDelivs, setObjectiveVariationDelivs] = useState(() =>
    constants.VARIATIONS.map(() => [])
  );
  const [objectiveVariations, setObjectiveVariations] = useState(() =>
    constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
  );

  useEffect(() => {
    setBucketInterper(() => d3.scaleLinear().range([0, 0]));
    setDropInterper(() => d3.scaleLinear().range([0, 0]));
    setVariationInterpers(() =>
      constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
    );

    const objDelivs =
      objectivesData[objective][SCENARIO_KEY_STRING][BASELINE_SCENARIO][
        DELIV_KEY_STRING
      ];
    const maxDelivs = d3.max(objDelivs);
    const objInterper = d3
      .scaleLinear()
      .domain(ticksExact(0, 1, objDelivs.length))
      .range(
        objDelivs
          .map((v) => v / maxDelivs)
          .sort()
          .reverse()
      )
      .clamp(true);

    setObjectiveDelivs(() => objDelivs);
    setObjectiveInterper(() => objInterper);

    const varDelivsArr = constants.VARIATIONS.map(
      (vars) =>
        objectivesData[objective][SCENARIO_KEY_STRING][vars][DELIV_KEY_STRING]
    );

    const objVars = varDelivsArr.map((varDelivs) =>
      d3
        .scaleLinear()
        .domain(ticksExact(0, 1, varDelivs.length))
        .range(
          varDelivs
            .map((v) => v / maxDelivs)
            .sort()
            .reverse()
        )
        .clamp(true)
    );

    setObjectiveVariationDelivs(() => varDelivsArr);
    setObjectiveVariations(() => objVars);
    console.log("obj change in usestate");
  }, [objective]);

  return {
    readyHash,
    setReadyHash,
    bucketInterper,
    setBucketInterper,
    dropInterper,
    setDropInterper,
    variationInterpers,
    setVariationInterpers,
    objectiveDelivs,
    objectiveInterper,
    objectiveVariationDelivs,
    objectiveVariations,
  };
}
