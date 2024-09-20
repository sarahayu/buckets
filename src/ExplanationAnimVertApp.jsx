import * as d3 from "d3";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { Scrollama, Step } from "react-scrollama";

import BucketGlyph from "bucket-lib/BucketGlyph";

import DotHistogram from "utils/explanation-anim-vert/DotHistogram";
import DropletGlyph from "bucket-lib/DropletGlyph";
import { constants } from "utils/explanation-anim/constants";
import { hideElems } from "utils/explanation-anim/render-utils";
import { useDataStory } from "utils/explanation-anim/useDataStory";
import useTutorialState from "utils/explanation-anim/useTutorialState";

export default function ExplanationAnimApp() {
  const [curObjective, setCurObjective] = useState(constants.DEFAULT_OBJECTIVE);
  const [normalized, setNormalized] = useState(false);

  const tutorialState = useTutorialState(curObjective, normalized);
  const slides = useDataStory(tutorialState, curObjective, normalized);

  useEffect(
    function changeObjective() {
      hideElems(
        ".bucket-wrapper, .vardrop, .var-scen-label, .vardrop .dot-histogram-wrapper, .main-histogram, .tut-drop-graphics-wrapper"
      );

      tutorialState.setReadyHash((rh) => rh + 1);
    },
    [curObjective, normalized]
  );

  return (
    <div className="tutorial-view">
      <Selector
        val={curObjective}
        setVal={setCurObjective}
        options={Object.keys(constants.SELECTED_OBJS).map((objId) => ({
          options: objId,
          display_name: constants.SELECTED_OBJS[objId],
        }))}
      />
      <Toggle
        label="normalize across scenarios"
        val={normalized}
        setVal={setNormalized}
      />
      <div className="scrollama scrollama-1">
        <DataStoryGraphics
          curObjective={curObjective}
          normalized={normalized}
          tutorialState={tutorialState}
        />
        <DataStoryTexts slides={slides} />
      </div>
    </div>
  );
}

function DataStoryGraphics({ curObjective, tutorialState }) {
  const { maxDelivs, minDelivs } = tutorialState;

  const mainHistData = useMemo(
    () => ({
      data: tutorialState.objectiveDelivs,
      domain: [minDelivs, maxDelivs],
    }),
    [tutorialState.objectiveDelivs]
  );

  const variations = useMemo(
    () =>
      constants.VARIATIONS.map((variation) => ({
        ...variation,
        interper: tutorialState.variationInterpers[variation.idx],
        histData: {
          data: tutorialState.objectiveVariationDelivs[variation.idx],
          domain: [minDelivs, maxDelivs],
        },
      })),
    [tutorialState.objectiveVariationDelivs, tutorialState.variationInterpers]
  );

  return (
    <>
      <BucketConstructionGraphics
        label={constants.SELECTED_OBJS[curObjective]}
        bucketInterper={tutorialState.bucketInterper}
      />

      <ScenarioComparingGraphics
        label={constants.SELECTED_OBJS[curObjective]}
        mainDropInterper={tutorialState.dropInterper}
        mainHistData={mainHistData}
        variations={variations}
      />
    </>
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

function Selector({ val, setVal, options }) {
  return (
    <select value={val} onChange={(e) => setVal(e.target.value)}>
      {options.map(({ option, display_name }, i) => (
        <option value={option} key={i}>
          {display_name}
        </option>
      ))}
    </select>
  );
}

function Toggle({ label, val, setVal }) {
  return (
    <>
      <label htmlFor="normalize">{label}</label>
      <input
        checked={val}
        onChange={(e) => setVal(e.target.checked)}
        type="checkbox"
        name="normalize"
        id="normalize"
      />
    </>
  );
}

function ScenarioComparingGraphics({
  label,
  mainDropInterper,
  mainHistData,
  variations,
}) {
  return (
    <div className="tut-drop-graphics-wrapper">
      <MainScenarioInfo
        dropInterper={mainDropInterper}
        histData={mainHistData}
        label={label}
      />
      {variations.map((variation, i) => (
        <VariationScenarioPanel key={i} variation={variation} />
      ))}
    </div>
  );
}

function MainScenarioInfo({ dropInterper, histData, label }) {
  return (
    <>
      <div className="main-waterdrop">
        <DropletGlyph
          levelInterp={dropInterper}
          width={400}
          height={constants.BAR_CHART_HEIGHT}
          colorInterp={constants.INTERP_COLOR}
        />
      </div>
      <div className="main-histogram">
        <DotHistogram
          width={167}
          height={200}
          data={histData.data}
          domain={histData.domain}
        />
      </div>
      <p className="fancy-font objective-label">{label}</p>
    </>
  );
}

function VariationScenarioPanel({ variation }) {
  const { idx, clas, desc, interper, histData } = variation;
  return (
    <div className={`vardrop ${clas}`} key={idx} desc={desc}>
      <div>
        <DropletGlyph
          levelInterp={interper}
          width={200}
          height={constants.BAR_CHART_HEIGHT / 2}
          colorInterp={constants.INTERP_COLOR}
        />
        <DotHistogram
          width={167}
          height={200}
          data={histData.data}
          domain={histData.domain}
        />
      </div>
      <p className="var-scen-label">{desc}</p>
    </div>
  );
}

function BucketConstructionGraphics({ label, bucketInterper }) {
  return (
    <div className="tut-graph-wrapper">
      <div className="tut-graph">
        <svg id="pag-bar-graph"></svg>
        <BucketGlyph
          levelInterp={bucketInterper}
          width={300}
          height={constants.BAR_CHART_HEIGHT}
          colorInterp={constants.INTERP_COLOR}
        />
        <p className="fancy-font objective-label">{label}</p>
      </div>
    </div>
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
