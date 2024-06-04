import * as d3 from "d3";

// when fn is `({ name }) => name`, turns
//
//  [
//    { name: "Zeta", age: 30 },
//    { name: "Aloy", age: 40 },
//  ];
//
// to
//
//  {
//    "Zeta": { name: "Zeta", age: 30 },
//    "Aloy": { name: "Aloy", age: 40 },
//  };
export function mapBy(objs, fn) {
  const newObjs = Object.groupBy(objs, fn);

  for (const key of Object.keys(newObjs)) {
    newObjs[key] = newObjs[key][0];
  }

  return newObjs;
}

export const WATERDROP_ICON = {
  draw: function (context, size) {
    context.moveTo(0, -size / 2);
    context.lineTo(size / 4, -size / 4);

    context.arc(0, 0, size / Math.sqrt(2) / 2, -Math.PI / 4, (Math.PI * 5) / 4);
    context.lineTo(0, -size / 2);
    context.closePath();
  },
};

export function percentToRatioFilled(p) {
  return Math.min(
    1,
    Math.max(0, 3.1304 * p ** 3 - 4.2384 * p ** 2 + 3.3471 * p + 0.0298)
  );
}

export function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [
        x,
        d3.mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });
  };
}

export function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

// inner diameter of 1
export const WATERDROP_CAGE_COORDS = (function () {
  const outer = [];
  const inner = [];

  const partitions = 20;
  const delta = (Math.PI * 3) / 2 / partitions;

  outer.push(
    ...[
      {
        x: Math.cos((Math.PI * 5) / 4) * 0.7,
        y: Math.sin((Math.PI * 5) / 4) * 0.7,
      },
      {
        x: 0,
        y: -Math.SQRT2 * 0.7,
      },
      // {
      //   x: Math.cos((Math.PI * -1) / 4) * 0.7,
      //   y: Math.sin((Math.PI * -1) / 4) * 0.7,
      // },
    ]
  );

  for (let i = 0; i <= partitions; i++) {
    outer.push({
      x: Math.cos(i * delta - Math.PI / 4) * 0.7,
      y: Math.sin(i * delta - Math.PI / 4) * 0.7,
    });
  }

  inner.push(
    ...[
      {
        x: Math.cos((Math.PI * 5) / 4) * 0.5,
        y: Math.sin((Math.PI * 5) / 4) * 0.5,
      },
      {
        x: 0,
        y: -Math.SQRT2 * 0.5,
      },
      // {
      //   x: Math.cos((Math.PI * -1) / 4) * 0.5,
      //   y: Math.sin((Math.PI * -1) / 4) * 0.5,
      // },
    ]
  );

  for (let i = 0; i <= partitions; i++) {
    inner.push({
      x: Math.cos(i * delta - Math.PI / 4) * 0.5,
      y: Math.sin(i * delta - Math.PI / 4) * 0.5,
    });
  }

  const coords = [];

  for (let i = 0; i < outer.length - 1; i++) {
    coords.push([outer[i], outer[i + 1], inner[i + 1], inner[i]]);
  }

  return coords;
})();
