import * as d3 from "d3";

import { interpolateWatercolorBlue } from "../../bucket-lib/utils";

function initConstants() {
  const BAR_CHART_WIDTH = 500,
    BAR_CHART_HEIGHT = 400;

  const INTERP_COLOR = interpolateWatercolorBlue;

  const DEFAULT_OBJECTIVE = "exampleObj";

  const VARIATIONS = [
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

  const EMPTY_INTERPER = d3.scaleLinear().range([0, 0]);
  const EMPTY_INTERPERS = VARIATIONS.map(() => EMPTY_INTERPER);

  return {
    BAR_CHART_WIDTH,
    BAR_CHART_HEIGHT,
    INTERP_COLOR,
    DEFAULT_OBJECTIVE,
    VARIATIONS,
    EMPTY_INTERPERS,
  };
}

export const constants = initConstants();
