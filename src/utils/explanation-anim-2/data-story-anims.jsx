import * as d3 from "d3";

import { objectivesData } from "../../data/exampleObjectivesData";

import { constants } from "./constants";
import { hideElems, showElems } from "../explanation-anim/render-utils";
import {
  DELIV_KEY_STRING_UNORD,
  SCENARIO_KEY_STRING,
} from "../../data/exampleObjectivesData";

const BASELINE_SCENARIO = "expl0000";

function initAllAnims() {
  function initChartAnimGroup({ deps, objective }) {
    let _XInterp;
    let _XAxis;
    let _dataDescendings;
    let _maxDelivs;

    const BAR_CHART_MARGIN = { top: 40, right: 30, bottom: 40, left: 60 };

    function prepareSVG() {
      {
        d3.selectAll("#pag-bar-graph > *").remove();

        const svgGroup = d3
          .selectAll("#pag-bar-graph")
          .attr(
            "width",
            constants.BAR_CHART_WIDTH +
              BAR_CHART_MARGIN.left +
              BAR_CHART_MARGIN.right
          )
          .attr(
            "height",
            constants.BAR_CHART_HEIGHT +
              BAR_CHART_MARGIN.top +
              BAR_CHART_MARGIN.bottom
          )
          .attr("opacity", 1)
          .append("g")
          .attr("class", "svg-group")
          .attr(
            "transform",
            `translate(${BAR_CHART_MARGIN.left},${BAR_CHART_MARGIN.top})`
          );

        const allDelivs = constants.VARIATIONS.map(
          ({ scen_str }) =>
            objectivesData[objective][SCENARIO_KEY_STRING][scen_str][
              DELIV_KEY_STRING_UNORD
            ]
        );

        _maxDelivs = d3.max(allDelivs[0]);

        const dataDescendings = allDelivs.map((delivs) =>
          delivs
            .map((val, placeFromLeft) => ({
              val,
              placeFromLeft,
              year: placeFromLeft + 1,
            }))
            .sort((a, b) => b.val - a.val)
        );

        const x = d3
          .scaleBand()
          .domain(
            dataDescendings[0].map(({ year }) => year).sort((a, b) => a - b)
          )
          .range([0, constants.BAR_CHART_WIDTH])
          .padding(0.4);
        const y = d3
          .scaleLinear()
          .domain([0, _maxDelivs])
          .range([constants.BAR_CHART_HEIGHT, 0]);

        const xaxis = d3
          .axisBottom(x)
          .tickSize(0)
          .tickFormat((d) => `year ${d}`)
          .tickValues(
            x.domain().filter((_, i) => i === 0 || (i + 1) % 10 === 0)
          );

        svgGroup.append("g").attr("class", "anim-xaxis");
        svgGroup.append("g").attr("class", "axis-y");
        svgGroup
          .selectAll(".anim-xaxis")
          .attr("opacity", 1)
          .attr("transform", `translate(0, ${constants.BAR_CHART_HEIGHT})`)
          .call(xaxis)
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
        svgGroup
          .selectAll(".axis-y")
          .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))
          .append("text")
          .text("Deliveries (TAF)")
          .attr("fill", "black")
          .attr("font-weight", "bold")
          .attr(
            "transform",
            `translate(-50, ${constants.BAR_CHART_HEIGHT / 2}) rotate(-90)`
          );

        _XInterp = x;
        _XAxis = xaxis;
        _dataDescendings = dataDescendings;
      }
    }

    function barsAppearDo() {
      {
        const y = d3
          .scaleLinear()
          .domain([0, _maxDelivs])
          .range([constants.BAR_CHART_HEIGHT, 0]);

        d3.selectAll("#pag-bar-graph .svg-group").each(function (_, i) {
          const s = d3.select(this);

          s.selectAll(".bars")
            .data(_dataDescendings[i], (d) => d.placeFromLeft)
            .join("rect")
            .attr("class", "bars")
            .attr("x", (d) => _XInterp(d.year))
            .attr("y", constants.BAR_CHART_HEIGHT)
            .attr("width", _XInterp.bandwidth())
            .attr("height", 0)
            .attr("opacity", 1)
            .attr("fill", "steelblue")
            .transition()
            .duration(500)
            .delay((d) => d.placeFromLeft * 10)
            .attr("y", (d) => y(d.val))
            .attr("height", (d) => constants.BAR_CHART_HEIGHT - y(d.val));
        });
      }
    }

    function barsAppearUndo() {
      {
        d3.selectAll("#pag-bar-graph .svg-group")
          .selectAll(".bars")
          // .data(_dataDescendings, (d) => d.placeFromLeft)
          .transition()
          .duration(500)
          .delay((d) => (_dataDescendings[0].length - d.placeFromLeft - 1) * 10)
          .attr("y", constants.BAR_CHART_HEIGHT)
          .attr("height", 0);
      }
    }

    async function barsCondenseDo() {
      {
        const newWidth = constants.BAR_CHART_WIDTH / 8;
        const svgGroup = d3.selectAll("#pag-bar-graph .svg-group");

        svgGroup.selectAll(".anim-xaxis").call(_XAxis.tickFormat(""));

        const bars = svgGroup.selectAll(".bars");

        bars
          .style("mix-blend-mode", "multiply")
          .transition()
          .duration(500)
          .attr("opacity", 0.05)
          .transition()
          .delay(
            (d) =>
              100 +
              (1 - (1 - d.placeFromLeft / _dataDescendings[0].length) ** 4) *
                1000
          )
          .duration(500)
          .attr("width", newWidth)
          .attr("x", constants.BAR_CHART_WIDTH / 2 - newWidth / 2)
          .end()
          .catch(() => {})
          .then(() => {
            svgGroup
              .selectAll(".anim-xaxis")
              .transition()
              .transition(500)
              .attr(
                "transform",
                `translate(0, ${constants.BAR_CHART_HEIGHT + 50})`
              )
              .attr("opacity", 0);

            bars.transition().delay(500).attr("x", 0);

            svgGroup
              .transition()
              .delay(500)
              .attr(
                "transform",
                `translate(${
                  BAR_CHART_MARGIN.left +
                  constants.BAR_CHART_WIDTH / 2 -
                  newWidth / 2
                },${BAR_CHART_MARGIN.top})`
              );
          });
      }
    }

    function barsCondenseUndo() {
      {
        const svgGroup = d3.selectAll("#pag-bar-graph .svg-group");

        const bars = svgGroup.selectAll(".bars");

        svgGroup
          .selectAll(".anim-xaxis")
          .transition()
          .transition(500)
          .attr("transform", `translate(0, ${constants.BAR_CHART_HEIGHT})`)
          .attr("opacity", 1);

        svgGroup
          .selectAll(".anim-xaxis")
          .call(_XAxis.tickFormat((d) => `year ${d}`));

        svgGroup
          .transition()
          .delay(500)
          .attr(
            "transform",
            `translate(${BAR_CHART_MARGIN.left},${BAR_CHART_MARGIN.top})`
          );

        bars
          .transition()
          .delay(
            (d) =>
              100 +
              (1 - (d.placeFromLeft / _dataDescendings[0].length) ** 4) * 1000
          )
          .duration(500)
          .attr("x", (d) => _XInterp(d.year))
          .attr("width", _XInterp.bandwidth())
          .transition()
          .duration(500)
          .attr("opacity", 1)
          .end()
          .catch(() => {})
          .then(() => {
            bars.style("mix-blend-mode", "normal");
          });
      }
    }

    prepareSVG();

    return {
      barsAppear: {
        do: barsAppearDo,
        undo: barsAppearUndo,
      },
      barsCondense: {
        do: barsCondenseDo,
        undo: barsCondenseUndo,
      },
    };
  }

  function initBucketsFillAnim({ deps, objective }) {
    function animDo() {
      d3.selectAll(".tut-graph-wrapper .bucket-wrapper").style(
        "display",
        "initial"
      );
      d3.selectAll("#pag-bar-graph").attr("opacity", 0);

      deps.setVariationBucketInterpers(deps.objectiveVariationBucketInterpers);
    }

    function animUndo() {
      deps.setVariationBucketInterpers(() =>
        constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
      );

      d3.selectAll(".tut-graph-wrapper .bucket-wrapper").style(
        "display",
        "none"
      );
      d3.selectAll("#pag-bar-graph").transition().attr("opacity", 1);
    }

    return {
      do: animDo,
      undo: animUndo,
    };
  }

  function initDropFillAnim({ deps, objective }) {
    function animDo() {
      showElems(".main-waterdrop");
      showElems(".tut-drop-graphics-wrapper", d3, "grid");
      hideElems(".tut-graph-wrapper, .bucket-wrapper");

      deps.setVariationDropInterpers(deps.objectiveVariationDropInterpers);
    }

    function animUndo() {
      hideElems(".tut-drop-graphics-wrapper, .main-waterdrop");
      showElems(".bucket-wrapper");
      showElems(".tut-graph-wrapper", d3, "flex");
      deps.setVariationDropInterpers(() =>
        constants.VARIATIONS.map(() => d3.scaleLinear().range([0, 0]))
      );
    }

    return {
      do: animDo,
      undo: animUndo,
    };
  }

  function initShowVariationsAnim({ deps }) {
    return {
      do: function () {
        // quantiles

        d3.selectAll(".var-scen-label").style("opacity", "1");

        d3.selectAll(".main-waterdrop")
          .transition()
          .style("transform", "translateX(-200px)");

        d3.selectAll(".main-histogram").style("display", "initial");
        d3.selectAll(".vardrop .dot-histogram-wrapper").style(
          "display",
          "initial"
        );
      },
      undo: function () {
        // quantiles
        d3.selectAll(".main-waterdrop").transition().style("transform", "none");
        // undo scaling of label due to shrinking div
        d3.selectAll(".main-waterdrop .var-scen-label")
          .transition()
          .style("transform", "none");

        d3.selectAll(".main-histogram").style("display", "none");
        d3.selectAll(".vardrop .dot-histogram-wrapper").style(
          "display",
          "none"
        );
      },
    };
  }

  return {
    initChartAnimGroup,
    initBucketsFillAnim,
    initDropFillAnim,
    initShowVariationsAnim,
  };
}

export const animations = initAllAnims();
