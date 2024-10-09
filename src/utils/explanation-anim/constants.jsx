import * as d3 from "d3";
import { interpolateWatercolorBlue } from "bucket-lib/utils";

function initConstants() {
  const BAR_CHART_WIDTH = 500,
    BAR_CHART_HEIGHT = 400;

  const BUCKET_RES = 4;

  // const INTERP_COLOR = d3.interpolateRgbBasis([
  //   "#F2F5FB",
  //   "#D0DDEB",
  //   "#7B9BC0",
  //   "#4F739F",
  //   "#112A57",
  // ]);
  const INTERP_COLOR = interpolateWatercolorBlue;

  const DEFAULT_OBJECTIVE = "DEL_NOD_AG_TOTAL";
  const BASELINE_SCENARIO = "expl0000";

  const _VARIATIONS = [
    {
      scen_num_str: "0004",
      desc: "natural flows",
    },
    {
      scen_num_str: "0015",
      desc: "reduce delta regs.",
    },
    {
      scen_num_str: "0320",
      desc: "prioritize carryover",
    },
    {
      scen_num_str: "0360",
      desc: "municipal priority",
    },
    {
      scen_num_str: "0261",
      desc: "rebalancing",
    },
  ];

  const VARIATIONS = _VARIATIONS.map(extendVarObj);

  const SELECTED_OBJS = {
    DEL_NOD_AG_TOTAL: "DEL_NOD_AG_TOTAL",
    DEL_SJV_AG_TOTAL: "DEL_SJV_AG_TOTAL",
    DEL_NOD_MI_TOTAL: "DEL_NOD_MI_TOTAL",
    DEL_SJV_MI_TOTAL: "DEL_SJV_MI_TOTAL",
    DEL_SOCAL_MI_TOTAL: "DEL_SOCAL_MI_TOTAL",
    CVP_SWP_EXPORTS: "CVP_SWP_EXPORTS",
    NDO: "NDO",
    SAC_IN: "SAC_IN",
    SJR_IN: "SJR_IN",
    STO_NOD_TOTAL: "STO_NOD_TOTAL",
    STO_SOD_TOTAL: "STO_SOD_TOTAL",
  };

  return {
    BAR_CHART_WIDTH,
    BAR_CHART_HEIGHT,
    BUCKET_RES,
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
