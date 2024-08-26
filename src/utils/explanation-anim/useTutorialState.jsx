import * as d3 from "d3";
import { useEffect, useState } from "react";

import { ticksExact } from "../../bucket-lib/utils";
import {
  DELIV_KEY_STRING,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "../../data/completeObjectivesData";
import { constants } from "./constants";

export default function useTutorialState(objective) {
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
      ({ scen_str }) =>
        objectivesData[objective][SCENARIO_KEY_STRING][scen_str][
          DELIV_KEY_STRING
        ]
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
    setObjectiveVariationInterpers(() => objVars);
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
    objectiveVariationInterpers,
  };
}
