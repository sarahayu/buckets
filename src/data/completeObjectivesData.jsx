import { mapBy } from "utils/common";

export const MAX_DELIVS = 1200;
export const SCENARIO_KEY_STRING = "scens";
export const DELIV_KEY_STRING = "delivs";
export const DELIV_KEY_STRING_UNORD = "delivs_unord";

export const objectivesData = await (async function () {
  const objs = await (await fetch("./select_complete_objectives.json")).json();

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

  console.log("DATA: loading objectives data");

  return mapBy(objs, ({ obj }) => obj);
})();

export const objectiveIDs = Object.keys(objectivesData);
export const scenarioIDs = Object.keys(
  Object.values(objectivesData)[0][SCENARIO_KEY_STRING]
);
