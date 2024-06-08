export const factorsData = await (async function () {
  const objs = await (await fetch("./factors.json")).json();

  console.log("DATA: loading factors data");

  return objs;
})();
