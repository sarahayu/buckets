export const deltaData = await (async function () {
  const scens = await (await fetch("./delta_ag_n.json")).json();

  const keys = Object.keys(scens);
  const newScens = {};

  for (const key of keys) {
    newScens[key] = [];
    for (let i = 0; i < 80; i++) {
      let sum = 0;
      for (let m = 0; m < 12; m++) {
        sum += scens[key][i * 12 + m];
      }
      const avg = (sum / 12) * 0.724;
      newScens[key].push(avg);
    }
    newScens[key].sort((a, b) => b - a);
  }
  return newScens;
})();
