import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { Scrollama, Step } from "react-scrollama";

import BucketGlyph from "./bucket-lib/BucketGlyph";

import DotHistogram from "./utils/explanation-anim/DotHistogram";
import WaterdropGlyph from "./utils/explanation-anim/WaterdropGlyph";
import { constants } from "./utils/explanation-anim/constants";
import { hideElems } from "./utils/explanation-anim/render-utils";
import { useDataStory } from "./utils/explanation-anim/useDataStory";
import useTutorialState from "./utils/explanation-anim/useTutorialState";

export default function ExplanationAnimApp() {
  const [curObjective, setCurObjective] = useState(constants.DEFAULT_OBJECTIVE);

  const tutorialState = useTutorialState(curObjective);
  const slides = useDataStory(tutorialState, curObjective);

  useEffect(
    function changeObjective() {
      hideElems(
        ".bucket-wrapper, .vardrop, .var-scen-label, .vardrop .dot-histogram-wrapper, .main-histogram, .tut-drop-graphics-wrapper"
      );

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

  return (
    <div className="tutorial-view">
      <select
        value={curObjective}
        onChange={(e) => setCurObjective(e.target.value)}
      >
        {Object.keys(constants.SELECTED_OBJS).map((objectiveID) => (
          <option value={objectiveID} key={objectiveID}>
            {constants.SELECTED_OBJS[objectiveID]}
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
            <p className="fancy-font objective-label">
              {constants.SELECTED_OBJS[curObjective]}
            </p>
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
              width={330}
              height={220}
              data={tutorialState.objectiveDelivs}
              domain={[0, d3.max(tutorialState.objectiveDelivs)]}
            />
          </div>
          {constants.VARIATIONS.map(({ idx, clas, desc }) => (
            <div className={`vardrop ${clas}`} key={idx} desc={desc}>
              <div>
                <WaterdropGlyph
                  levelInterp={tutorialState.variationInterpers[idx]}
                  width={200}
                  height={(constants.BAR_CHART_HEIGHT * 2) / 3 / 2}
                  colorInterp={constants.INTERP_COLOR}
                />
                <DotHistogram
                  width={330}
                  height={220}
                  data={tutorialState.objectiveVariationDelivs[idx]}
                  domain={[0, d3.max(tutorialState.objectiveDelivs)]}
                />
              </div>
              <p className="var-scen-label">{desc}</p>
            </div>
          ))}
          <p className="fancy-font objective-label">
            {constants.SELECTED_OBJS[curObjective]}
          </p>
        </div>
        <Scrollama
          offset={0.9}
          onStepEnter={onStepEnter}
          onStepExit={onStepExit}
        >
          {slides.map((slide, i) => (
            <Step key={i} data={slide}>
              <div className="tut-text-card">{slide.text}</div>
            </Step>
          ))}
          <Step key={"last"} data={{}}>
            <div className="tut-text-card" style={{ marginBottom: "40vh" }}>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  for (let i = slides.length - 1; i >= 0; i--) {
                    slides[i].animHandler?.undo();
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
