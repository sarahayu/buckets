import { mapBy } from "../utils/utils";

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

  // return addAdditionalMetrics(mapBy(objs, ({ obj }) => obj));
  return mapBy(objs, ({ obj }) => obj);
})();

export const objectiveIDs = Object.keys(objectivesData);
export const scenarioIDs = Object.keys(
  Object.values(objectivesData)[0][SCENARIO_KEY_STRING]
);

function addAdditionalMetrics(objsData) {
  const scenarios = Object.keys(
    Object.values(objsData)[0][SCENARIO_KEY_STRING]
  );

  const CVP_TOT_N = objsData["DEL_CVP_TOTAL_N"];
  const CVP_TOT_S = objsData["DEL_CVP_TOTAL_S"];

  const CVP_TOT = deepCopy(CVP_TOT_N);

  for (const scenario of scenarios) {
    {
      const dataArrayN =
        CVP_TOT[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];
      const dataArrayS =
        CVP_TOT_S[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];

      for (let i = 0; i < dataArrayN.length; i++) {
        dataArrayN[i] += dataArrayS[i];
      }
    }
    {
      const dataArrayN =
        CVP_TOT[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];
      const dataArrayS =
        CVP_TOT_S[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];

      for (let i = 0; i < dataArrayN.length; i++) {
        dataArrayN[i] += dataArrayS[i];
      }
    }
  }

  objsData["DEL_CVP_TOTAL"] = CVP_TOT;

  const CVP_PAG_N = objsData["DEL_CVP_PAG_N"];
  const CVP_PAG_S = objsData["DEL_CVP_PAG_S"];

  const CVP_PAG = deepCopy(CVP_PAG_N);

  for (const scenario of scenarios) {
    {
      const dataArrayN =
        CVP_PAG[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];
      const dataArrayS =
        CVP_PAG_S[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];

      for (let i = 0; i < dataArrayN.length; i++) {
        dataArrayN[i] += dataArrayS[i];
      }
    }
    {
      const dataArrayN =
        CVP_PAG[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];
      const dataArrayS =
        CVP_PAG_S[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];

      for (let i = 0; i < dataArrayN.length; i++) {
        dataArrayN[i] += dataArrayS[i];
      }
    }
  }

  objsData["DEL_CVP_PAG"] = CVP_PAG;

  const CVP_PSC = objsData["DEL_CVP_PSC_N"];
  const CVP_PEX = objsData["DEL_CVP_PEX_S"];

  const CVP_PSC_PEX = deepCopy(CVP_PSC);

  for (const scenario of scenarios) {
    {
      const dataArrayN =
        CVP_PSC_PEX[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];
      const dataArrayS =
        CVP_PEX[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];

      for (let i = 0; i < dataArrayN.length; i++) {
        dataArrayN[i] += dataArrayS[i];
      }
    }
    {
      const dataArrayN =
        CVP_PSC_PEX[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];
      const dataArrayS =
        CVP_PEX[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];

      for (let i = 0; i < dataArrayN.length; i++) {
        dataArrayN[i] += dataArrayS[i];
      }
    }
  }

  objsData["DEL_CVP_PSC_PEX"] = CVP_PSC_PEX;

  const S_SHSTA = objsData["S_SHSTA"];
  const S_OROVL = objsData["S_OROVL"];
  const S_TRNTY = objsData["S_TRNTY"];
  const S_FOLSM = objsData["S_FOLSM"];

  const S_NOD = deepCopy(S_SHSTA);

  for (const scenario of scenarios) {
    {
      const dataArrayS = S_NOD[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];
      const dataArrayO =
        S_OROVL[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];
      const dataArrayR =
        S_TRNTY[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];
      const dataArrayF =
        S_FOLSM[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING];

      for (let i = 0; i < dataArrayS.length; i++) {
        dataArrayS[i] += dataArrayO[i] + dataArrayR[i] + dataArrayF[i];
      }
    }
    {
      const dataArrayS =
        S_NOD[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];
      const dataArrayO =
        S_OROVL[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];
      const dataArrayR =
        S_TRNTY[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];
      const dataArrayF =
        S_FOLSM[SCENARIO_KEY_STRING][scenario][DELIV_KEY_STRING_UNORD];

      for (let i = 0; i < dataArrayS.length; i++) {
        dataArrayS[i] += dataArrayO[i] + dataArrayR[i] + dataArrayF[i];
      }
    }
  }

  objsData["S_NOD"] = S_NOD;

  return objsData;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
