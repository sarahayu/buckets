import * as d3 from "d3";
import React, { forwardRef } from "react";
import { Scrollama, Step } from "react-scrollama";

import BucketGlyph from "bucket-lib/BucketGlyph";

import DotHistogram from "utils/explanation-anim/DotHistogram";
import WaterdropGlyph from "utils/explanation-anim/WaterdropGlyph";

import { constants } from "utils/explanation-anim-2/constants";
import { useDataStory } from "utils/explanation-anim-2/useDataStory";

export default function ExplanationAnim2App() {
  const { slides, storyVars } = useDataStory(constants.DEFAULT_OBJECTIVE);

  return (
    <div className="tutorial-view">
      <div className="scrollama scrollama-1">
        <DataStoryGraphics storyVars={storyVars} />
        <DataStoryTexts slides={slides} />
      </div>
    </div>
  );
}

function DataStoryGraphics({ storyVars }) {
  return (
    <div className="tut-panel-wrapper">
      {d3.range(4).map((i) => (
        <VariationPanels
          key={i}
          label={constants.VARIATIONS[i].scen_str}
          bucketInterper={storyVars.curBucketInterpers[i]}
          dropInterper={storyVars.curDropInterpers[i]}
          histData={storyVars.variationDelivsUnord[i]}
        />
      ))}
    </div>
  );
}

function DataStoryTexts({ slides }) {
  return (
    <DataStoryScrollama
      cleanupFn={() => {
        for (let i = slides.length - 1; i >= 0; i--) {
          slides[i].animHandler?.undo();
        }
      }}
    >
      {slides.map((slide, i) => (
        <Step key={i} data={slide}>
          <Slide slide={slide} />
        </Step>
      ))}
    </DataStoryScrollama>
  );
}

function DataStoryScrollama({ cleanupFn, children }) {
  const onStepEnter = async ({ data, direction }) => {
    if (direction === "up") return;
    data.animHandler?.do();
  };

  const onStepExit = async ({ data, direction }) => {
    if (direction === "down") return;
    data.animHandler?.undo();
  };
  return (
    <Scrollama offset={0.9} onStepEnter={onStepEnter} onStepExit={onStepExit}>
      {children}
      <Step key={"last"} data={{}}>
        <ReturnToTop cleanupFn={cleanupFn} />
      </Step>
    </Scrollama>
  );
}

function VariationPanels({ label, bucketInterper, dropInterper, histData }) {
  return (
    <div className="tut-panel">
      <div className="tut-graph-wrapper">
        <div className="tut-graph">
          <svg id="bar-graph"></svg>
          <BucketGlyph
            levelInterp={bucketInterper}
            width={300}
            height={constants.BAR_CHART_HEIGHT}
            colorInterp={constants.INTERP_COLOR}
          />
          <p className="fancy-font objective-label">{label}</p>
        </div>
      </div>

      <div className="tut-drop-graphics-wrapper">
        <div className="main-waterdrop">
          <WaterdropGlyph
            levelInterp={dropInterper}
            width={400}
            height={constants.BAR_CHART_HEIGHT}
            colorInterp={constants.INTERP_COLOR}
          />
        </div>
        <div className="main-histogram example-drops-hg">
          <DotHistogram
            width={600}
            height={400}
            data={histData}
            domain={[0, 1200]}
          />
        </div>
        <p className="fancy-font objective-label">{label}</p>
      </div>
    </div>
  );
}

const Slide = forwardRef(function Slide({ slide }, ref) {
  return (
    <div ref={ref} className="tut-text-card">
      {slide.text}
    </div>
  );
});

const ReturnToTop = forwardRef(function ReturnToTop({ cleanupFn }, ref) {
  return (
    <div ref={ref} className="tut-text-card" style={{ marginBottom: "40vh" }}>
      <button
        onClick={() => {
          window.scrollTo(0, 0);
          cleanupFn();
        }}
      >
        Back to Top
      </button>
    </div>
  );
});
