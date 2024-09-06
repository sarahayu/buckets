import * as d3 from "d3";
import { useEffect, useState } from "react";

import { ticksExact } from "../../bucket-lib/utils";
import {
  DELIV_KEY_STRING,
  DELIV_KEY_STRING_UNORD,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "../../data/exampleObjectivesData";
import { constants } from "./constants";
import { percentToRatioFilled } from "../utils";

export default function useDataStoryVars(objective) {
  const [bucketInterper, setBucketInterper] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );
  const [dropInterper, setDropInterper] = useState(() =>
    d3.scaleLinear().range([0, 0])
  );

  const [variationDropInterpers, setVariationDropInterpers] = useState(() =>
    constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
  );

  const [variationBucketInterpers, setVariationBucketInterpers] = useState(() =>
    constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
  );

  const [objectiveDelivs, setObjectiveDelivs] = useState(() => []);
  const [objectiveVariationDelivs, setObjectiveVariationDelivs] = useState(() =>
    constants.VARIATIONS.map(() => [])
  );
  const [objectiveVariationDelivsUnord, setObjectiveVariationDelivsUnord] =
    useState(() => constants.VARIATIONS.map(() => []));
  const [
    objectiveVariationBucketInterpers,
    setObjectiveVariationBucketInterpers,
  ] = useState(() =>
    constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
  );
  const [objectiveVariationDropInterpers, setObjectiveVariationDropInterpers] =
    useState(() =>
      constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
    );

  useEffect(() => {
    setBucketInterper(() => d3.scaleLinear().range([0, 0]));
    setDropInterper(() => d3.scaleLinear().range([0, 0]));
    setVariationBucketInterpers(() =>
      constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
    );
    setVariationDropInterpers(() =>
      constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
    );

    const objDelivs =
      objectivesData[objective][SCENARIO_KEY_STRING]["uniform_50_perc"][
        DELIV_KEY_STRING
      ];
    const baselineMaxDelivs = d3.max(objDelivs);

    setObjectiveDelivs(() => objDelivs);

    const varDelivsArr = constants.VARIATIONS.map(
      ({ scen_str }) =>
        objectivesData[objective][SCENARIO_KEY_STRING][scen_str][
          DELIV_KEY_STRING
        ]
    );

    const varDelivsArrUnord = constants.VARIATIONS.map(
      ({ scen_str }) =>
        objectivesData[objective][SCENARIO_KEY_STRING][scen_str][
          DELIV_KEY_STRING_UNORD
        ]
    );

    const objVarBucketInterps = varDelivsArr.map(
      (varDelivs) => (val) =>
        d3
          .scaleLinear()
          .domain(ticksExact(0, 1, varDelivs.length))
          .range(
            varDelivs
              .map((v) => v / baselineMaxDelivs)
              .sort()
              .reverse()
          )
          .clamp(true)(val)
    );

    const objVarDropInterps = varDelivsArr.map(
      (varDelivs) => (val) =>
        percentToRatioFilled(
          d3
            .scaleLinear()
            .domain(ticksExact(0, 1, varDelivs.length))
            .range(
              varDelivs
                .map((v) => v / baselineMaxDelivs)
                .sort()
                .reverse()
            )
            .clamp(true)(val)
        )
    );

    setObjectiveVariationDelivs(() => varDelivsArr);
    setObjectiveVariationDelivsUnord(() => varDelivsArrUnord);
    setObjectiveVariationBucketInterpers(() => objVarBucketInterps);
    setObjectiveVariationDropInterpers(() => objVarDropInterps);
  }, [objective]);

  return {
    bucketInterper,
    setBucketInterper,
    dropInterper,
    setDropInterper,
    variationDropInterpers,
    setVariationDropInterpers,
    variationBucketInterpers,
    setVariationBucketInterpers,
    objectiveDelivs,
    objectiveVariationDelivs,
    objectiveVariationDelivsUnord,
    objectiveVariationBucketInterpers,
    objectiveVariationDropInterpers,
  };
}
