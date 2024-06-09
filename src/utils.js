import * as d3 from "d3";
import Matter from "matter-js";
import { useCallback, useMemo, useState } from "react";
import { DELIV_KEY_STRING, SCENARIO_KEY_STRING } from "./data/objectivesData";
import { ticksExact } from "./bucket-lib/utils";

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
  return (3.1304 * p ** 3 - 4.2384 * p ** 2 + 3.3471 * p + 0.0298) / 2.4;
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

function generateWaterdrop(width) {
  const rad = width / 2;
  const partitions = 20;
  const delta = (Math.PI * 3) / 2 / partitions;

  const outer = [
    {
      x: Math.cos((Math.PI * 5) / 4) * rad,
      y: Math.sin((Math.PI * 5) / 4) * rad,
    },
    {
      x: 0,
      y: -Math.SQRT2 * rad,
    },
  ];

  for (let i = 0; i <= partitions; i++) {
    outer.push({
      x: Math.cos(i * delta - Math.PI / 4) * rad,
      y: Math.sin(i * delta - Math.PI / 4) * rad,
    });
  }

  return outer;
}

export function generateRandoPoints(shape, count) {
  const bounds = Matter.Bounds.create(shape);

  const minX = bounds.min.x,
    maxX = bounds.max.x,
    minY = bounds.min.y,
    maxY = bounds.max.y;

  const genX = d3.scaleLinear([minX, maxX]);
  const genY = d3.scaleLinear([minY, maxY]);

  const points = [];

  for (let i = 0; i < count; i++) {
    while (true) {
      const x = genX(Math.random());
      const y = genY(Math.random());

      if (Matter.Vertices.contains(shape, { x, y })) {
        points.push([x, y]);
        break;
      }
    }
  }

  return points;
}

// inner diameter of 1
export const WATERDROP_CAGE_COORDS = (function () {
  const outer = generateWaterdrop(1.4);
  const inner = generateWaterdrop(1);

  const coords = [];

  for (let i = 0; i < outer.length - 1; i++) {
    coords.push([outer[i], outer[i + 1], inner[i + 1], inner[i]]);
  }

  return coords;
})();

let RANDO_CACHE;

// assuming nodes is already ordered and first nodes are going to be put on the bottom
export function placeDropsUsingPhysics(x, y, nodes) {
  // first generate random points within water droplet. we can stop here, but points might not be the most uniformly distributed
  RANDO_CACHE =
    RANDO_CACHE || generateRandoPoints(generateWaterdrop(1), nodes.length);

  const DELTA = d3.mean(nodes.map(({ r }) => r * 2));
  const WIDTH_AREA = DELTA * Math.floor(Math.sqrt(nodes.length));

  const randoPoints = RANDO_CACHE.map(([x, y]) => [
    (x * WIDTH_AREA) / 2,
    (y * WIDTH_AREA) / 2,
  ]);

  // thus, we use physics engine to take care of distributing the points evenly and based on radius
  const Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

  const engine = Engine.create();

  const nodePos = randoPoints.sort((a, b) => b[1] - a[1]);

  const node_bodies = nodes.map(({ r, id }, i) => {
    const [nx, ny] = nodePos[i];
    return Bodies.circle(nx + x, ny + y, r * 2, {
      restitution: 0,
      id: id,
    });
  });

  const parts = WATERDROP_CAGE_COORDS.map((quad) =>
    Matter.Body.create({
      position: Matter.Vertices.centre(quad),
      vertices: quad,
      isStatic: true,
    })
  );

  const cage = Matter.Body.create({
    isStatic: true,
  });

  Matter.Body.setParts(cage, parts);
  Matter.Body.scale(cage, WIDTH_AREA * 1.4, WIDTH_AREA * 1.4);
  Matter.Body.translate(cage, { x, y: y + (WIDTH_AREA / 2) * 0.4 });

  Composite.add(engine.world, [...node_bodies, cage]);

  // run engine for 1 second at 60 fps
  for (let i = 0, FPS = 60; i < FPS * 1; i++) Engine.update(engine, 1000 / FPS);

  return node_bodies.map(({ position, id }) => ({
    id,
    x: position.x,
    y: position.y,
  }));
}

// https://gist.github.com/mbostock/5743979
export function bounce(h) {
  if (!arguments.length) h = 0.25;
  var b0 = 1 - h,
    b1 = b0 * (1 - b0) + b0,
    b2 = b0 * (1 - b1) + b1,
    x0 = 2 * Math.sqrt(h),
    x1 = x0 * Math.sqrt(h),
    x2 = x1 * Math.sqrt(h),
    t0 = 1 / (1 + x0 + x1 + x2),
    t1 = t0 + t0 * x0,
    t2 = t1 + t0 * x1,
    m0 = t0 + (t0 * x0) / 2,
    m1 = t1 + (t0 * x1) / 2,
    m2 = t2 + (t0 * x2) / 2,
    a = 1 / (t0 * t0);
  return function (t) {
    return t >= 1
      ? 1
      : t < t0
      ? a * t * t
      : t < t1
      ? a * (t -= m0) * t + b0
      : t < t2
      ? a * (t -= m1) * t + b1
      : a * (t -= m2) * t + b2;
  };
}

export function rangeInclusive(a, b) {
  return d3.range(a, b + 1);
}

export function useStickyScale(defaultVal, scale) {
  const [val, setVal] = useState(defaultVal);

  const valActual = useMemo(() => scale(val), [val]);
  const setValActual = useCallback((v) => void setVal(scale(v)), []);

  return [valActual, setValActual];
}

export function createInterps(name, curScen, data) {
  const delivs = data[name][SCENARIO_KEY_STRING][curScen][DELIV_KEY_STRING];
  return d3
    .scaleLinear()
    .domain(ticksExact(0, 1, delivs.length))
    .range(delivs.map((v) => Math.min(1, v / 1200) || 0))
    .clamp(true);
}

export function criteriaSort(criteria, data, objective) {
  if (criteria === "median") {
    return Object.keys(data[objective][SCENARIO_KEY_STRING]).sort(
      (a, b) =>
        d3.mean(data[objective][SCENARIO_KEY_STRING][a][DELIV_KEY_STRING]) -
        d3.mean(data[objective][SCENARIO_KEY_STRING][b][DELIV_KEY_STRING])
    );
  }
  if (criteria === "deliveries") {
    return Object.keys(data[objective][SCENARIO_KEY_STRING]).sort(
      (a, b) =>
        d3.max(data[objective][SCENARIO_KEY_STRING][a][DELIV_KEY_STRING]) -
        d3.max(data[objective][SCENARIO_KEY_STRING][b][DELIV_KEY_STRING])
    );
  }
}
