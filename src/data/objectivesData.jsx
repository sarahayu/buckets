import { mapBy } from "../utils";

export const MAX_DELIVS = 1200;
export const SCENARIO_KEY_STRING = "scens";
export const DELIV_KEY_STRING = "delivs";

export const objectivesData = await (async function () {
  const objs = await (await fetch("./all_objectives.json")).json();

  for (const obj of objs) {
    obj[SCENARIO_KEY_STRING] = obj[SCENARIO_KEY_STRING];
    for (const scen of obj[SCENARIO_KEY_STRING]) {
      scen[DELIV_KEY_STRING] = scen[DELIV_KEY_STRING].map((v) =>
        Math.min(Math.max(0, v), MAX_DELIVS)
      ).sort((a, b) => b - a);
    }
    obj[SCENARIO_KEY_STRING] = mapBy(
      obj[SCENARIO_KEY_STRING],
      ({ name }) => name
    );
  }

  console.log("DATA: loading objectives data");

  return mapBy(objs, ({ obj }) => obj);
})();
