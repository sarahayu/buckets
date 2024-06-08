import { useEffect, useState } from "react";
import { mapBy } from "./utils";

export const MAX_DELIVS = 1200;
export const SCENARIO_KEY_STRING = "scens";
export const DELIV_KEY_STRING = "delivs";

export function useData(fn, init) {
  const [data, setData] = useState(init);

  useEffect(() => {
    fn().then((ret) => void setData(ret));
  }, []);

  return data;
}

let _objectivesData;

export async function objectivesData() {
  if (_objectivesData) return _objectivesData;

  console.log("DATA: loading objectives data");

  const objs = await (await fetch("./all_objectives.json")).json();

  for (const obj of objs) {
    for (const scen of obj[SCENARIO_KEY_STRING]) {
      scen[DELIV_KEY_STRING] = scen[DELIV_KEY_STRING].map((v) =>
        Math.min(Math.max(0, v), MAX_DELIVS)
      ).sort((a, b) => b - a);
    }
    // obj[SCENARIO_KEY_STRING] = obj[SCENARIO_KEY_STRING].slice(0, 100);
    obj[SCENARIO_KEY_STRING] = mapBy(
      obj[SCENARIO_KEY_STRING],
      ({ name }) => name
    );
  }

  return (_objectivesData = mapBy(objs, ({ obj }) => obj));
}

let _factorsData;

export async function factorsData() {
  if (_factorsData) return _factorsData;

  console.log("DATA: loading factors data");

  const objs = await (await fetch("./factors.json")).json();

  return (_factorsData = objs);
}
