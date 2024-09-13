import * as d3 from "d3";
import { useEffect, useState } from "react";

import { ticksExact } from "../../bucket-lib/utils";
import {
  DELIV_KEY_STRING,
  DELIV_KEY_STRING_UNORD,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "../../data/exampleObjectivesData";
import { constants } from "./constants";
import { percentToRatioFilled } from "../utils";

export default function useDataStoryVars(objective) {
  const [curDropInterpers, setCurDropInterpers] = useState(
    () => constants.EMPTY_INTERPERS
  );

  const [curBucketInterpers, setCurBucketInterpers] = useState(
    () => constants.EMPTY_INTERPERS
  );

  const [variationDelivsUnord, setVariationDelivsUnord] = useState(() =>
    constants.VARIATIONS.map(() => [])
  );
  const [variationBucketInterpers, setVariationBucketInterpers] = useState(
    () => constants.EMPTY_INTERPERS
  );
  const [variationDropInterpers, setVariationDropInterpers] = useState(
    () => constants.EMPTY_INTERPERS
  );

  useEffect(
    function onObjectiveChange() {
      setCurBucketInterpers(() => constants.EMPTY_INTERPERS);
      setCurDropInterpers(() => constants.EMPTY_INTERPERS);

      const baselineMaxDelivs = MAX_DELIVS;

      const varDelivsArrUnord = constants.VARIATIONS.map(
        ({ scen_str }) =>
          objectivesData[objective][SCENARIO_KEY_STRING][scen_str][
            DELIV_KEY_STRING_UNORD
          ]
      );

      const varDelivsArr = constants.VARIATIONS.map(
        ({ scen_str }) =>
          objectivesData[objective][SCENARIO_KEY_STRING][scen_str][
            DELIV_KEY_STRING
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
                .sort((a, b) => a - b)
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
                  .sort((a, b) => a - b)
                  .reverse()
              )
              .clamp(true)(val)
          )
      );

      setVariationDelivsUnord(() => varDelivsArrUnord);
      setVariationBucketInterpers(() => objVarBucketInterps);
      setVariationDropInterpers(() => objVarDropInterps);
    },
    [objective]
  );

  return {
    curDropInterpers,
    setCurDropInterpers,
    curBucketInterpers,
    setCurBucketInterpers,
    variationDelivsUnord,
    variationBucketInterpers,
    variationDropInterpers,
  };
}
