import * as d3 from "d3";
import { mapBy } from "utils/common";

export const SCENARIO_KEY_STRING = "scens";
export const MAX_OBJ_DELIV_KEY_STRING = "max_deliv";
export const DELIV_KEY_STRING = "delivs";
export const DELIV_KEY_STRING_UNORD = "delivs_unord";
export const BASELINE_SCENARIO = "expl0000";

export const [objectivesData] = await (async function () {
  const objs = await (await fetch("./objectives_faceted_search.json")).json();

  for (const obj of objs) {
    let max = -1;
    for (const scen of obj[SCENARIO_KEY_STRING]) {
      scen[DELIV_KEY_STRING_UNORD] = Array.from(scen[DELIV_KEY_STRING]);
      delete scen[DELIV_KEY_STRING];
      max = d3.max([max, d3.max(scen[DELIV_KEY_STRING_UNORD])]);
    }
    obj[SCENARIO_KEY_STRING] = mapBy(
      obj[SCENARIO_KEY_STRING],
      ({ name }) => name
    );
    obj[MAX_OBJ_DELIV_KEY_STRING] = max;
  }

  console.log("DATA: loading objectives faceted search data");

  return [mapBy(objs, ({ obj }) => obj)];
})();

export const objectiveIDs = Object.keys(objectivesData);
export const scenarioIDs = Object.keys(
  Object.values(objectivesData)[0][SCENARIO_KEY_STRING]
);

export const displayNames = {
  DEL_NOD_AG_TOTAL: "north of delta agriculture",
  DEL_SJV_AG_TOTAL: "San Joaquin Valley agriculture",
  DEL_NOD_MI_TOTAL: "north of delta municipality and industry",
  DEL_SJV_MI_TOTAL: "San Joaquin Valley municipality and industry",
  DEL_SOCAL_MI_TOTAL: "south California municipality and industry",
  CVP_SWP_EXPORTS: "Central Valley Project and State Water Project",
  NDO: "net delta outflow",
  SAC_IN: "Sacramento inflow",
  SJR_IN: "San Joaquin River inflow",
  STO_NOD_TOTAL: "north of delta storage",
  STO_SOD_TOTAL: "south of delta storage",

  expl0000: "baseline",
  expl0004: "allowing natural flows",
  expl0015: "reducing delta regulations",
  expl0320: "prioritizing carryovers",
  expl0360: "prioritizing municipal",
  expl0261: "rebalancing",
};
