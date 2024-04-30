import * as d3 from "d3";

export function ticksExact(start, stop, count) {
  return d3.range(count).map((i) => (i / (count - 1)) * (stop - start) + start);
}

export function bucketPath(width, height, filled = 1.0, taper = 0.8) {
  let bottomRight = width * taper + (width * (1 - taper)) / 2,
    bottomLeft = (width * (1 - taper)) / 2;
  let data = [
    {
      x: d3.interpolate(bottomRight, width)(filled),
      y: d3.interpolate(height, 0)(filled),
    },
    { x: bottomRight, y: height },
    { x: bottomLeft, y: height },
    {
      x: d3.interpolate(bottomLeft, 0)(filled),
      y: d3.interpolate(height, 0)(filled),
    },
  ];
  let lineFunc = d3
    .line()
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    });
  return lineFunc(data) + "z";
}

export function quantileBins(numericBins, unitsPerQuantile, maxQuantiles) {
  let quantileBins = numericBins.map((bin) =>
    Math.round(bin.length / unitsPerQuantile)
  );
  let sum = d3.sum(quantileBins);

  while (sum > maxQuantiles) {
    quantileBins[
      d3.minIndex(numericBins, (d, i) =>
        d.length !== 0
          ? d.length / unitsPerQuantile - quantileBins[i]
          : Infinity
      )
    ] -= 1;

    sum = d3.sum(quantileBins);
  }

  while (sum < maxQuantiles) {
    quantileBins[
      d3.maxIndex(numericBins, (d, i) =>
        d.length !== 0
          ? d.length / unitsPerQuantile - quantileBins[i]
          : -Infinity
      )
    ] += 1;

    sum = d3.sum(quantileBins);
  }

  return quantileBins;
}

export function flatGroupBy(objs, fn) {
  const newObjs = Object.groupBy(objs, fn);

  for (const key of Object.keys(newObjs)) {
    newObjs[key] = newObjs[key][0];
  }

  return newObjs;
}
