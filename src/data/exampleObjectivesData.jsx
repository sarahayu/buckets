import * as d3 from "d3";
import { mapBy } from "utils/common";

export const MAX_DELIVS = 1200;
export const SCENARIO_KEY_STRING = "scens";
export const DELIV_KEY_STRING = "delivs";
export const DELIV_KEY_STRING_UNORD = "delivs_unord";

export const objectivesData = await (async function () {
  const numYears = 50;

  const objs = [
    {
      obj: "exampleObj",
      scens: [
        {
          name: "always_100_perc",
          delivs: d3.range(numYears).map(() => MAX_DELIVS),
        },
        {
          name: "always_0_perc",
          delivs: d3.range(numYears).map(() => 0),
        },
        {
          name: "always_50_perc",
          delivs: d3.range(numYears).map(() => MAX_DELIVS / 2),
        },
        {
          name: "uniform_50_perc",
          delivs: d3.range(numYears).map((_, i) => (i / numYears) * MAX_DELIVS),
        },
      ],
    },
  ];

  for (const obj of objs) {
    for (const scen of obj[SCENARIO_KEY_STRING]) {
      scen[DELIV_KEY_STRING_UNORD] = Array.from(scen[DELIV_KEY_STRING]);
      scen[DELIV_KEY_STRING] = Array.from(scen[DELIV_KEY_STRING]).sort(
        (a, b) => b - a
      );
    }
    obj[SCENARIO_KEY_STRING] = mapBy(
      obj[SCENARIO_KEY_STRING],
      ({ name }) => name
    );
  }

  console.log("DATA: loading example objectives data");

  return mapBy(objs, ({ obj }) => obj);
})();

export const objectiveIDs = Object.keys(objectivesData);
export const scenarioIDs = Object.keys(
  Object.values(objectivesData)[0][SCENARIO_KEY_STRING]
);
