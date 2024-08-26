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
  const BASELINE_SCENARIO = "expl0000";

  const _VARIATIONS = [
    {
      scen_num_str: "0015",
      desc: "no delta reg.",
    },
    {
      scen_num_str: "0129",
      desc: "natural flows",
    },
    {
      scen_num_str: "0512",
      desc: "shifting priorities",
    },
    {
      scen_num_str: "0003",
      desc: "functional flows",
    },
    {
      scen_num_str: "0320",
      desc: "prioritize carryovers",
    },
  ];

  const VARIATIONS = _VARIATIONS.map(extendVarObj);

  const SELECTED_OBJS = {
    SWPTOTALDEL: "SWP Total Del.",
    DEL_CVP_TOTAL: "CVP Total Del.",
    DEL_SWP_PMI: "SWP MI Delivery Mean",
    DEL_CVP_PAG: "CVP Ag. Delivery Mean",
    DEL_CVP_PSC_PEX: "CVP SC+EX Delivery Mean",
    S_NOD: "Agg. NOD Storage April Mean",
    S_SHSTA: "April Shasta Mean",
    S_OROVL: "April Orovile Mean",
  };

  return {
    BAR_CHART_WIDTH,
    BAR_CHART_HEIGHT,
    INTERP_COLOR,
    DEFAULT_OBJECTIVE,
    BASELINE_SCENARIO,
    VARIATIONS,
    SELECTED_OBJS,
  };
}

function extendVarObj({ scen_num_str, desc }, idx) {
  return {
    idx,
    scen_num_str,
    desc,
    scen_str: `expl${scen_num_str}`,
    clas: `drop${idx + 1}`,
  };
}

export const constants = initConstants();
