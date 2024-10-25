import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import {
  objectivesData,
  objectiveIDs,
  scenarioIDs,
  MAX_OBJ_DELIV_KEY_STRING,
  DELIV_KEY_STRING_UNORD,
  SCENARIO_KEY_STRING,
  BASELINE_SCENARIO,
  displayNames,
} from "data/objectivesFacetedSearchData";
import { ticksExact } from "bucket-lib/utils";
import { percentToRatioFilled } from "utils/common";
import DotHistogramVert from "utils/faceted-search/DotHistogramVert";
import DropletGlyph from "utils/faceted-search/DropletGlyph";
import _BarGraph from "utils/faceted-search/BarGraph";

const graphHeights = 360;

export default function FacetedSearchApp() {
  const [objective, setObjective] = useState(objectiveIDs[0]);
  const [scenario, setScenario] = useState(scenarioIDs[1]);

  const comparerInterper = useMemo(
    function () {
      const delivs =
        objectivesData[objective][SCENARIO_KEY_STRING][scenario][
          DELIV_KEY_STRING_UNORD
        ];
      const max = objectivesData[objective][MAX_OBJ_DELIV_KEY_STRING];
      return (val) =>
        percentToRatioFilled(
          d3
            .scaleLinear()
            .domain(ticksExact(0, 1, delivs.length))
            .range(
              delivs
                .map((v) => v / max)
                .sort((a, b) => a - b)
                .reverse()
            )
            .clamp(true)(val)
        );
    },
    [objective, scenario]
  );

  const baselineInterper = useMemo(
    function () {
      const delivs =
        objectivesData[objective][SCENARIO_KEY_STRING][BASELINE_SCENARIO][
          DELIV_KEY_STRING_UNORD
        ];
      const max = objectivesData[objective][MAX_OBJ_DELIV_KEY_STRING];
      return (val) =>
        percentToRatioFilled(
          d3
            .scaleLinear()
            .domain(ticksExact(0, 1, delivs.length))
            .range(
              delivs
                .map((v) => v / max)
                .sort((a, b) => a - b)
                .reverse()
            )
            .clamp(true)(val)
        );
    },
    [objective]
  );

  return (
    <div className="faceted-main">
      <div className="faceted-container">
        <div className="faceted-question">
          I'm interested in{" "}
          <select
            name="cars"
            id="cars"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          >
            {objectiveIDs.map((id) => (
              <option value={id}>{displayNames[id]}</option>
            ))}
          </select>
          . What happens if we try{" "}
          <select
            name="cars"
            id="cars"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            {scenarioIDs.slice(1).map((id) => (
              <option value={id}>{displayNames[id]}</option>
            ))}
          </select>
          ?
        </div>
        <div className="faceted-graphics">
          <div className="baseline-graphics">
            <h3>Baseline</h3>
            <DropletGlyph
              levelInterp={baselineInterper}
              width={graphHeights}
              height={graphHeights}
              resolution={4}
            />
            <Histogram
              data={
                objectivesData[objective][SCENARIO_KEY_STRING][
                  BASELINE_SCENARIO
                ][DELIV_KEY_STRING_UNORD]
              }
              range={[0, objectivesData[objective][MAX_OBJ_DELIV_KEY_STRING]]}
              width={(graphHeights * 2) / 3}
              height={graphHeights}
            />
            <BarGraph
              data={
                objectivesData[objective][SCENARIO_KEY_STRING][
                  BASELINE_SCENARIO
                ][DELIV_KEY_STRING_UNORD]
              }
              range={[0, objectivesData[objective][MAX_OBJ_DELIV_KEY_STRING]]}
              width={500}
              height={200}
            />
          </div>
          <div className="comparer-graphics">
            <h3>Proposed Plan</h3>
            <DropletGlyph
              levelInterp={comparerInterper}
              width={graphHeights}
              height={graphHeights}
              resolution={4}
            />
            <Histogram
              data={
                objectivesData[objective][SCENARIO_KEY_STRING][scenario][
                  DELIV_KEY_STRING_UNORD
                ]
              }
              range={[0, objectivesData[objective][MAX_OBJ_DELIV_KEY_STRING]]}
              width={(graphHeights * 2) / 3}
              height={graphHeights}
            />
            <BarGraph
              data={
                objectivesData[objective][SCENARIO_KEY_STRING][scenario][
                  DELIV_KEY_STRING_UNORD
                ]
              }
              range={[0, objectivesData[objective][MAX_OBJ_DELIV_KEY_STRING]]}
              width={500}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Histogram(props) {
  return (
    <div className="hist-wrapper">
      <DotHistogramVert {...props} />
    </div>
  );
}

function BarGraph(props) {
  return (
    <div className="bar-wrapper">
      <_BarGraph {...props} />
    </div>
  );
}
