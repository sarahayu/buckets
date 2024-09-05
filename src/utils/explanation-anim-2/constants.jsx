import { interpolateWatercolorBlue } from "../../bucket-lib/utils";

function initConstants() {
  const BAR_CHART_WIDTH = 500,
    BAR_CHART_HEIGHT = 400;

  const INTERP_COLOR = interpolateWatercolorBlue;

  const DEFAULT_OBJECTIVE = "exampleObj";
  const BASELINE_SCENARIO = "expl0000";

  const _VARIATIONS = [
    {
      scen_str: "always_100_perc",
    },
    {
      scen_str: "always_0_perc",
    },
    {
      scen_str: "always_50_perc",
    },
    {
      scen_str: "uniform_50_perc",
    },
  ];

  const VARIATIONS = _VARIATIONS.map(extendVarObj);

  return {
    BAR_CHART_WIDTH,
    BAR_CHART_HEIGHT,
    INTERP_COLOR,
    DEFAULT_OBJECTIVE,
    BASELINE_SCENARIO,
    VARIATIONS,
  };
}

function extendVarObj({ scen_str, desc }, idx) {
  return {
    idx,
    scen_str,
    desc,
    clas: `drop${idx + 1}`,
  };
}

export const constants = initConstants();
