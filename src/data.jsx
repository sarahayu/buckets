import { flatGroupBy } from "./utils";

export const objectivesData = await (async function () {
  const objs = await (await fetch("./all_objectives.json")).json();

  for (const obj of objs) {
    for (const scen of obj["scens"]) {
      scen["delivs"] = scen["delivs"].sort((a, b) => b - a);
    }
    obj["scens"] = flatGroupBy(obj["scens"], ({ name }) => name);

    // obj["least_to_most"] = Object.keys(obj["scens"]).sort(
    //   (a, b) =>
    //     d3.mean(obj["scens"][a]["delivs"]) - d3.mean(obj["scens"][b]["delivs"])
    // );
  }

  // // convert array to map
  // let scen_map = {};
  // for (const scen of objs[0]["scens"]) {
  //   scen_map[scen["name"]] = scen["delivs"].sort((a, b) => b - a);
  // }

  return flatGroupBy(objs, ({ obj }) => obj);
})();

export const factorsData = await (async function () {
  const objs = await (await fetch("./factors.json")).json();

  return objs;
})();
