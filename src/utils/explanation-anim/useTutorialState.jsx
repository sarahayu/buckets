import * as d3 from "d3";
import { useEffect, useState } from "react";

import { ticksExact } from "../../bucket-lib/utils";
import {
  DELIV_KEY_STRING,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "../../data/completeObjectivesData";
import { constants } from "./constants";
import { percentToRatioFilled } from "../utils";

export default function useTutorialState(objective, normalized) {
  const [readyHash, setReadyHash] = useState(0);
  const [maxDelivs, setMaxDelivs] = useState(0);
  const [minDelivs, setMinDelivs] = useState(0);

  const [bucketInterper, setBucketInterper] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );
  const [dropInterper, setDropInterper] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );
  const [objectiveInterper, setObjectiveInterper] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );
  const [objectiveInterperDrop, setObjectiveInterperDrop] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );

  const [variationInterpers, setVariationInterpers] = useState(() =>
    constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
  );

  const [objectiveDelivs, setObjectiveDelivs] = useState(() => []);
  const [objectiveVariationDelivs, setObjectiveVariationDelivs] = useState(() =>
    constants.VARIATIONS.map(() => [])
  );
  const [objectiveVariationInterpers, setObjectiveVariationInterpers] =
    useState(() =>
      constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
    );

  useEffect(() => {
    setBucketInterper(() => d3.scaleLinear().range([0, 0]));
    setDropInterper(() => d3.scaleLinear().range([0, 0]));
    setVariationInterpers(() =>
      constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
    );

    const objDelivs =
      objectivesData[objective][SCENARIO_KEY_STRING][
        constants.BASELINE_SCENARIO
      ][DELIV_KEY_STRING];
    let maxDelivs, minDelivs;

    maxDelivs =
      objective === "NDO" ? d3.quantile(objDelivs, 0.75) : d3.max(objDelivs);

    if (normalized) {
      const allScenMins = [
        constants.BASELINE_SCENARIO,
        ...constants.VARIATIONS.map(({ scen_str }) => scen_str),
      ].map((scen_str) =>
        d3.min(
          objectivesData[objective][SCENARIO_KEY_STRING][scen_str][
            DELIV_KEY_STRING
          ]
        )
      );
      minDelivs = d3.min(allScenMins);
    } else {
      minDelivs = 0;
    }

    setMaxDelivs(maxDelivs);
    setMinDelivs(minDelivs);

    setObjectiveDelivs(() => objDelivs);

    const objectiveInterperBucket = d3
      .scaleLinear()
      .domain(ticksExact(0, 1, objDelivs.length))
      .range(
        objDelivs
          .map((v) => (v - minDelivs) / (maxDelivs - minDelivs))
          .sort((a, b) => a - b)
          .reverse()
      )
      .clamp(true);

    const objectiveInterperDrop = (val) =>
      percentToRatioFilled(
        d3
          .scaleLinear()
          .domain(ticksExact(0, 1, objDelivs.length))
          .range(
            objDelivs
              .map((v) => (v - minDelivs) / (maxDelivs - minDelivs))
              .sort((a, b) => a - b)
              .reverse()
          )
          .clamp(true)(val)
      );

    setObjectiveInterper(() => objectiveInterperBucket);
    setObjectiveInterperDrop(() => objectiveInterperDrop);

    const varDelivsArr = constants.VARIATIONS.map(
      ({ scen_str }) =>
        objectivesData[objective][SCENARIO_KEY_STRING][scen_str][
          DELIV_KEY_STRING
        ]
    );

    const objVars = varDelivsArr.map(
      (varDelivs) => (val) =>
        percentToRatioFilled(
          d3
            .scaleLinear()
            .domain(ticksExact(0, 1, varDelivs.length))
            .range(
              varDelivs
                .map((v) => (v - minDelivs) / (maxDelivs - minDelivs))
                .sort((a, b) => a - b)
                .reverse()
            )
            .clamp(true)(val)
        )
    );

    setObjectiveVariationDelivs(() => varDelivsArr);
    setObjectiveVariationInterpers(() => objVars);
  }, [objective, normalized]);

  return {
    readyHash,
    setReadyHash,
    maxDelivs,
    minDelivs,
    bucketInterper,
    setBucketInterper,
    dropInterper,
    setDropInterper,
    variationInterpers,
    setVariationInterpers,
    objectiveDelivs,
    objectiveInterper,
    objectiveInterperDrop,
    objectiveVariationDelivs,
    objectiveVariationInterpers,
  };
}
