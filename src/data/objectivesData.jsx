import { mapBy } from "../utils/utils";

export const MAX_DELIVS = 1200;
export const SCENARIO_KEY_STRING = "scens";
export const DELIV_KEY_STRING = "delivs";
export const DELIV_KEY_STRING_UNORD = "delivs_unord";

export const objectivesData = await (async function () {
  const objs = await (await fetch("./all_objectives.json")).json();

  for (const obj of objs) {
    obj[SCENARIO_KEY_STRING] = obj[SCENARIO_KEY_STRING];
    for (const scen of obj[SCENARIO_KEY_STRING]) {
      // data cleanup, clamping
      const unord = scen[DELIV_KEY_STRING].map((v) =>
        Math.min(Math.max(0, v), MAX_DELIVS)
      );

      scen[DELIV_KEY_STRING_UNORD] = unord;
      scen[DELIV_KEY_STRING] = Array.from(unord).sort((a, b) => b - a);
    }
    obj[SCENARIO_KEY_STRING] = mapBy(
      obj[SCENARIO_KEY_STRING],
      ({ name }) => name
    );
  }

  console.log("DATA: loading objectives data");

  return mapBy(objs, ({ obj }) => obj);
})();

export const objectiveIDs = Object.keys(objectivesData);
export const scenarioIDs = Object.keys(
  Object.values(objectivesData)[0][SCENARIO_KEY_STRING]
);
