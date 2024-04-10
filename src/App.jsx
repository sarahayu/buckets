import * as d3 from "d3";
import { deltaData } from "./data";
import { useEffect, useRef, useState } from "react";

const scenKeys = Object.keys(deltaData);

// https://stackoverflow.com/a/50073727
function calculateAreaOfPolygon(points) {
  if (points.length < 3) return 0;

  points = [[0, 0], ...points, [points[points.length - 1][0], 0]];

  let area = 0,
    n = points.length;
  for (let i = 0; i < n - 1; i++) {
    area += points[i][0] * points[i + 1][1];
    area -= points[i + 1][0] * points[i][1];
  }
  area += points[n - 1][0] * points[0][1];
  area -= points[0][0] * points[n - 1][1];
  return Math.abs(area) / 2;
}

// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    let a = X.map(function (x) {
      return [
        x,
        d3.mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });

    // a = [[0, 0], ...a, [X[X.length - 1], 0]];
    return a;
  };
}
function kernelEpanechnikov(k) {
  k = 50;
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

export default function App({}) {
  const graphSvg = useRef();
  const bucketSvg = useRef();
  const pdfSvg = useRef();
  const init = useRef(false);

  const scenCounter = useRef(0);
  const [curScen, setCurScen] = useState(0);
  const [updateVis, setUpdateVis] = useState();

  useEffect(() => {
    if (init.current) {
      return;
    }
    init.current = true;

    const graph_margin = { top: 10, right: 30, bottom: 30, left: 40 },
      graph_width = 400,
      graph_height = 400;

    const graph_svg = d3
      .select(graphSvg.current)
      .attr("width", graph_width + graph_margin.left + graph_margin.right)
      .attr("height", graph_height + graph_margin.top + graph_margin.bottom)
      .append("g")
      .attr("transform", `translate(${graph_margin.left},${graph_margin.top})`);

    const graph_x = d3.scaleLinear().domain([0, 100]).range([0, graph_width]);
    graph_svg
      .append("g")
      .attr("transform", `translate(0, ${graph_height})`)
      .call(d3.axisBottom().scale(graph_x));

    const graph_y = d3.scaleLinear().domain([0, 400]).range([graph_height, 0]);
    graph_svg.append("g").call(d3.axisLeft().scale(graph_y));

    const bucket_margin = { top: 10, right: 30, bottom: 30, left: 500 },
      bucket_width = 200,
      bucket_height = 400;

    const bucket_svg = d3
      .select(bucketSvg.current)
      .attr("width", bucket_width + bucket_margin.left + bucket_margin.right)
      .attr("height", bucket_height + bucket_margin.top + bucket_margin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${bucket_margin.left},${bucket_margin.top})`
      );
    const bucket_grad = bucket_svg.append("g");
    bucket_svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", bucket_width)
      .attr("height", bucket_height)
      .attr("stroke", "black")
      .attr("fill", "none");

    const bucket_y = d3
      .scaleLinear()
      .domain([0, 400])
      .range([0, bucket_height]);

    const pdf_margin = { top: 10, right: 30, bottom: 30, left: 750 },
      pdf_width = 450 * 1.2,
      pdf_height = 400 * 1.2;

    const pdf_svg = d3
      .select(pdfSvg.current)
      .attr("width", pdf_width + pdf_margin.left + pdf_margin.right)
      .attr("height", pdf_height + pdf_margin.top + pdf_margin.bottom)
      .append("g")
      .attr("transform", `translate(${pdf_margin.left},${pdf_margin.top})`);
    const pdf_grad = pdf_svg.append("g");

    const pdf_x = d3.scaleLinear().domain([0, 400]).range([0, pdf_width]);
    pdf_svg
      .append("g")
      .attr("transform", `translate(0, ${pdf_height})`)
      .call(d3.axisBottom().scale(pdf_x));

    const pdf_y = d3.scaleLinear().domain([0, 80]).range([pdf_height, 0]);
    const pdf_y_axis = pdf_svg.append("g");

    // // Compute kernel density estimation for the first group called Setosa
    // let kde = kernelDensityEstimator(
    //   kernelEpanechnikov(7),
    //   d3.range(17).map((i) => d3.scaleLinear().range(pdf_x.domain())(i / 16))
    // );
    // let density = kde(deltaData[scenKeys[0]]);

    // // Plot the area
    // const curve = pdf_svg
    //   .append("g")
    //   .append("path")
    //   .attr("class", "mypath")
    //   .datum(density)
    //   .attr("fill", "steelblue")
    //   .attr("opacity", ".8")
    //   // .attr("stroke", "#000")
    //   // .attr("stroke-width", 1)
    //   // .attr("stroke-linejoin", "round")
    //   .attr(
    //     "d",
    //     d3
    //       .area()
    //       // .curve(d3.curveBasis)
    //       .x(function (d) {
    //         return pdf_x(d[0]);
    //       })
    //       .y0(pdf_y(0))
    //       .y1(function (d) {
    //         return pdf_y(d[1]);
    //       })
    //   );

    function update(scenInd) {
      const data = deltaData[scenKeys[scenInd]];
      setCurScen(scenInd);

      const graph_line = graph_svg
        .selectAll(".graphLine")
        .data([data], function (d, i) {
          return i;
        });

      graph_line
        .join("path")
        .attr("class", "graphLine")
        .transition()
        .duration(500)
        .attr(
          "d",
          d3
            .line()
            .x(function (d, i) {
              return graph_x((i / data.length) * 100);
            })
            .y(function (d, i) {
              return graph_y(d);
            })
        )
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5);

      const bucket_line = bucket_grad.selectAll(".bucketBox").data(
        d3.range(11).map((i) => i / 10),
        function (d, i) {
          return i;
        }
      );

      bucket_line
        .join("rect")
        .attr("class", "bucketBox")
        .transition()
        .duration(500)
        .attr("x", 0)
        .attr(
          "y",
          (d) => bucket_height - bucket_y(data[Math.floor(d * data.length)])
        )
        .attr("width", bucket_width)
        .attr("height", (d) => bucket_y(data[Math.floor(d * data.length)]))
        .attr("fill", (d) => d3.interpolateBlues(d));

      // kde = kernelDensityEstimator(
      //   kernelEpanechnikov(7),
      //   d3.range(17).map((i) => d3.scaleLinear().range(pdf_x.domain())(i / 16))
      // );
      // let density = kde(data);
      // let ar = calculateAreaOfPolygon(density);
      // console.log(ar);

      // pdf_y.domain([0, 0.1 * ar]);
      pdf_y_axis.transition().duration(500).call(d3.axisLeft().scale(pdf_y));

      // update the chart
      // curve
      //   .datum(density)
      //   .transition()
      //   .duration(500)
      //   .attr(
      //     "d",
      //     d3
      //       .area()
      //       // .curve(d3.curveBasis)
      //       .x(function (d) {
      //         return pdf_x(d[0]);
      //       })
      //       .y0(pdf_y(0))
      //       .y1(function (d) {
      //         return pdf_y(d[1]);
      //       })
      //   );

      // set the parameters for the histogram
      const histogram = d3
        .histogram()
        .value((d) => d) // I need to give the vector of value
        .domain(pdf_x.domain()) // then the domain of the graphic
        .thresholds(
          d3
            .range(25)
            .map((i) => d3.scaleLinear().range(pdf_x.domain())(i / 24))
        ); // then the numbers of bins

      // And apply this function to data to get the bins
      const bins = histogram(data);

      // Join the rect with the bins data
      const u = pdf_svg.selectAll("rect").data(bins);

      // Manage the existing bars and eventually the new ones:
      u.join("rect") // Add a new rect for each new elements
        .transition() // and apply changes to all of them
        .duration(500)
        .attr("x", 1)
        .attr("transform", function (d) {
          return `translate(${pdf_x(d.x0)}, ${pdf_y(Math.round(d.length))})`;
        })
        .attr("width", function (d) {
          return pdf_x(d.x1) - pdf_x(d.x0) - 1;
        })
        .attr("height", function (d) {
          return pdf_height - pdf_y(Math.round(d.length));
        })
        .style("fill", "gray")
        .attr("opacity", 0.2);

      // console.log(bins);

      function minusMost(arr) {
        let indMost = -1;
        let most = -1;

        for (let i = 0; i < arr.length; i++) {
          if (arr[i] > most) {
            indMost = i;
            most = arr[i];
          }
        }

        arr[indMost] -= 1;
        return arr;
      }

      function addMost(arr) {
        let indMost = -1;
        let most = -1;

        for (let i = 0; i < arr.length; i++) {
          if (arr[i] > most) {
            indMost = i;
            most = arr[i];
          }
        }

        arr[indMost] += 1;
        return arr;
      }

      let rad = 10;

      function getCircs(bbins) {
        let circBins = [];
        let sum = 0;
        for (let bin of bbins) {
          let rounded = Math.round(bin.length / 4);
          circBins.push(rounded);
          sum += rounded;
        }

        while (sum > 20) {
          circBins = minusMost(circBins);

          sum = 0;
          for (let bin of circBins) {
            let rounded = bin;
            sum += rounded;
          }
        }

        while (sum < 20) {
          circBins = addMost(circBins);

          sum = 0;
          for (let bin of circBins) {
            let rounded = bin;
            sum += rounded;
          }
        }

        let circs = [];
        for (let x = 0; x < circBins.length; x++) {
          for (let y = 0; y < circBins[x]; y++) {
            circs.push([(bins[x].x1 + bins[x].x0) / 2, ((y + 0.5) * 80) / 20]);
          }
        }

        return circs;
      }

      const v = pdf_svg.selectAll("circle").data(getCircs(bins), (d, i) => i);

      v.join("circle")
        .transition()
        .duration(500)
        .attr("cx", (d) => pdf_x(d[0]))
        .attr("cy", (d) => pdf_y(d[1]))
        .attr("r", rad)
        // .attr("stroke", "black")
        .attr("fill", "steelblue");
    }
    setUpdateVis(() => update);

    update(0);
  }, [graphSvg]);

  return (
    <>
      <button onClick={() => void updateVis(++scenCounter.current)}>
        {scenKeys[curScen]}
      </button>
      <svg ref={graphSvg}></svg>
      <svg ref={bucketSvg}></svg>
      <svg ref={pdfSvg}></svg>
    </>
  );
}
