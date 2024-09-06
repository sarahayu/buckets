import * as d3 from "d3";
import React from "react";
import { Scrollama, Step } from "react-scrollama";

import BucketGlyph from "./bucket-lib/BucketGlyph";

import DotHistogram from "./utils/explanation-anim/DotHistogram";
import WaterdropGlyph from "./utils/explanation-anim/WaterdropGlyph";

import { constants } from "./utils/explanation-anim-2/constants";
import { useDataStory } from "./utils/explanation-anim-2/useDataStory";

export default function ExplanationAnim2App() {
  const { slides, vars } = useDataStory(constants.DEFAULT_OBJECTIVE);

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
      <div className="scrollama scrollama-1">
        <div className="tut-panel-wrapper">
          {d3.range(4).map((i) => {
            return (
              <div className="tut-panel" key={i}>
                <div className="tut-graph-wrapper">
                  <div className="tut-graph">
                    <svg id="pag-bar-graph"></svg>
                    <BucketGlyph
                      levelInterp={vars.variationBucketInterpers[i]}
                      width={300}
                      height={constants.BAR_CHART_HEIGHT}
                      colorInterp={constants.INTERP_COLOR}
                    />
                    <p className="fancy-font objective-label">
                      {constants.VARIATIONS[i].scen_str}
                    </p>
                  </div>
                </div>

                <div className="tut-drop-graphics-wrapper">
                  <div className="main-waterdrop">
                    <WaterdropGlyph
                      levelInterp={vars.variationDropInterpers[i]}
                      width={400}
                      height={constants.BAR_CHART_HEIGHT}
                      colorInterp={constants.INTERP_COLOR}
                    />
                  </div>
                  <div className="main-histogram example-drops-hg">
                    <DotHistogram
                      width={600}
                      height={400}
                      data={vars.objectiveVariationDelivs[i]}
                      domain={[0, 1200]}
                    />
                  </div>
                  <p className="fancy-font objective-label">
                    {constants.VARIATIONS[i].scen_str}
                  </p>
                </div>
              </div>
            );
          })}
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
