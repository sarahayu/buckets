import * as d3 from "d3";

function initConstants() {
  const BAR_CHART_WIDTH = 500,
    BAR_CHART_HEIGHT = 400;

  const INTERP_COLOR = d3.interpolateRgbBasis([
    "#F2F5FB",
    "#D0DDEB",
    "#7B9BC0",
    "#4F739F",
    "#112A57",
  ]);

  const DEFAULT_OBJECTIVE = "SWPTOTALDEL";
  const DEFAULT_SCENARIO = "expl0000";

  const VARIATIONS = [
    "expl0015", // no delta reg
    "expl0129", // natural flows
    "expl0512", // shifting priorities
    "expl0003", // functional flows
    "expl0320", // prioritize carryover
  ];

  const DROP_VARIATIONS = [
    {
      idx: 0,
      scen: "0015",
      clas: "drop1",
      desc: "no delta reg.",
    },
    {
      idx: 1,
      scen: "0129",
      clas: "drop2",
      desc: "natural flows",
    },
    {
      idx: 2,
      scen: "0512",
      clas: "drop3",
      desc: "shifting priorities",
    },
    {
      idx: 3,
      scen: "0003",
      clas: "drop4",
      desc: "functional flows",
    },
    {
      idx: 4,
      scen: "0320",
      clas: "drop5",
      desc: "prioritize carryovers",
    },
  ];

  return {
    BAR_CHART_WIDTH,
    BAR_CHART_HEIGHT,
    INTERP_COLOR,
    DEFAULT_OBJECTIVE,
    DEFAULT_SCENARIO,
    VARIATIONS,
    DROP_VARIATIONS,
  };
}

export const constants = initConstants();
