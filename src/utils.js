import * as THREE from "three";
import * as d3 from "d3";
import Matter from "matter-js";
import { useCallback, useMemo, useState } from "react";
import { DELIV_KEY_STRING, SCENARIO_KEY_STRING } from "./data/objectivesData";
import { ticksExact } from "./bucket-lib/utils";

export function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

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

// size is height of waterdrop plus a bit more (1/2 of size is distance from top of drop to center of circle part)
export const WATERDROP_ICON = {
  draw: function (context, size) {
    context.moveTo(0, -size / 2);
    context.lineTo(size / 4, -size / 4);

    context.arc(0, 0, size / Math.SQRT2 / 2, -Math.PI / 4, (Math.PI * 5) / 4);
    context.lineTo(0, -size / 2);
    context.closePath();
  },
};

// path generated when WATERDROP_ICON size = 2
export const DROPLET_SHAPE = "M0,-1L0.5,-0.5A0.707,0.707,0,1,1,-0.5,-0.5L0,-1Z";

export function percentToRatioFilled(p) {
  p -= 0.0088;
  return Math.min(
    1,
    Math.max(
      0,
      (3.1304 * p ** 3 - 4.2384 * p ** 2 + 3.3471 * p + 0.0298) / 2.2326
    )
  );
}

const CIRC_RAD = Math.SQRT1_2;
const DROP_RAD = 1;
const CIRC_HEIGHT = CIRC_RAD + CIRC_RAD;
const DROP_HEIGHT = DROP_RAD + CIRC_RAD;
const HAT_START = 0.75;

// half width at widest is 1
function yToHalfWidth(y) {
  if (y >= HAT_START) {
    const hatHalfWidth = Math.SQRT1_2;

    return (hatHalfWidth * (1 - y)) / (1 - HAT_START);
  }

  const circFrac = fracDropToCirc(y);
  const trigX = (1 - circFrac) * 2 - 1;

  const angle = Math.acos(trigX);
  const trigY = Math.sin(angle);

  return trigY;
}

// fml, here sprite width is 2 (i.e. circ rad is 1) thus drop real height is 1 + sqrt2
function yToSpriteY(y) {
  return (y - CIRC_RAD / DROP_HEIGHT) * (1 + Math.SQRT2);
}

function spriteYToY(sy) {
  return sy / (1 + Math.SQRT2) + CIRC_RAD / DROP_HEIGHT;
}

function fracCircToDrop(v) {
  return v / CIRC_HEIGHT / DROP_HEIGHT;
}

function fracDropToCirc(v) {
  return v / (CIRC_HEIGHT / DROP_HEIGHT);
}

export function waterdropDeltaOutline(yStart, yEnd, size = 2) {
  if (Math.abs(yStart - yEnd) < 0.01) return [];

  const rad = (size / 2 / DROP_RAD) * CIRC_RAD;

  const Y_DELTA = 0.1;

  const rightCoords = [];
  const leftCoords = [];

  let dx1, dy1, dx2, dy2;

  for (let i = 1; i <= Math.ceil(1 / Y_DELTA); i++) {
    dx1 = yToHalfWidth(yStart + (i - 1) * Y_DELTA);
    dy1 = yToSpriteY(yStart + (i - 1) * Y_DELTA);
    dx2 = yToHalfWidth(yStart + i * Y_DELTA);
    dy2 = yToSpriteY(yStart + i * Y_DELTA);

    if (spriteYToY(dy2) >= yEnd) break;

    // CC !
    const v1 = [-dx1 * rad, -dy1 * rad],
      v2 = [dx1 * rad, -dy1 * rad],
      v3 = [dx2 * rad, -dy2 * rad],
      v4 = [-dx2 * rad, -dy2 * rad];

    rightCoords.push(v2, v3);
    leftCoords.push(v1, v4);
  }

  dx2 = yToHalfWidth(yEnd);
  dy2 = yToSpriteY(yEnd);

  // CC !
  const v1 = [-dx1 * rad, -dy1 * rad],
    v2 = [dx1 * rad, -dy1 * rad],
    v3 = [dx2 * rad, -dy2 * rad],
    v4 = [-dx2 * rad, -dy2 * rad];

  rightCoords.push(v2, v3);
  leftCoords.push(v1, v4);

  rightCoords.push(...leftCoords.reverse());

  return rightCoords;
}

export function waterdropDelta(yStart, yEnd, size = 2) {
  if (Math.abs(yStart - yEnd) < 0.01) return [];

  const rad = (size / 2 / DROP_RAD) * CIRC_RAD;

  const Y_DELTA = 0.1;

  const coords = [];

  let dx1, dy1, dx2, dy2;

  for (let i = 1; i <= Math.ceil(1 / Y_DELTA); i++) {
    dx1 = yToHalfWidth(yStart + (i - 1) * Y_DELTA);
    dy1 = yToSpriteY(yStart + (i - 1) * Y_DELTA);
    dx2 = yToHalfWidth(yStart + i * Y_DELTA);
    dy2 = yToSpriteY(yStart + i * Y_DELTA);

    if (spriteYToY(dy2) >= yEnd) break;

    // CC !
    const v1 = [-dx1 * rad, -dy1 * rad],
      v2 = [dx1 * rad, -dy1 * rad],
      v3 = [dx2 * rad, -dy2 * rad],
      v4 = [-dx2 * rad, -dy2 * rad];

    coords.push([v1, v2, v3]);
    coords.push([v1, v3, v4]);
  }

  dx2 = yToHalfWidth(yEnd);
  dy2 = yToSpriteY(yEnd);

  // CC !
  const v1 = [-dx1 * rad, -dy1 * rad],
    v2 = [dx1 * rad, -dy1 * rad],
    v3 = [dx2 * rad, -dy2 * rad],
    v4 = [-dx2 * rad, -dy2 * rad];

  coords.push([v1, v2, v3]);
  coords.push([v1, v3, v4]);

  return coords;
}

export function waterdrop(yFill, size = 2) {
  if (yFill === 0) return [];

  return waterdropDelta(0, yFill, size);
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
  const partitions = 16;
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
  const outer = generateWaterdrop(3);
  const inner = generateWaterdrop(1);

  const coords = [];

  for (let i = 0; i < outer.length - 2; i++) {
    coords.push([
      outer[i],
      outer[i + (i < 2 ? 1 : 2)],
      inner[i + (i < 2 ? 1 : 2)],
      inner[i],
    ]);
  }

  return coords;
})();

let RANDO_CACHE;
let lastNodesLen;

let DET_CACHE;
let lastDetNodesLen;

export function radsToDropWidth(nodes) {
  const AREA = d3.sum(nodes.map((r) => r ** 2 * 3.14));
  return Math.floor((Math.sqrt(AREA / 3.14) * 2) / 2);
}

// assuming nodes is already ordered and first nodes are going to be put on the bottom
export function placeDropsUsingPhysics(x, y, nodes, reuse = false) {
  if (reuse && DET_CACHE && nodes.length === lastDetNodesLen) return DET_CACHE;

  // first generate random points within water droplet. we can stop here, but points might not be the most uniformly distributed

  if (!RANDO_CACHE || nodes.length !== lastNodesLen)
    RANDO_CACHE = d3
      .range(4)
      .map(() =>
        generateRandoPoints(generateWaterdrop(1), (lastNodesLen = nodes.length))
      );

  const WIDTH_AREA = radsToDropWidth(nodes.map(({ r }) => r));

  const randoPoints = RANDO_CACHE[
    Math.floor(Math.random() * RANDO_CACHE.length)
  ].map(([x, y]) => [x * WIDTH_AREA, y * WIDTH_AREA]);

  // thus, we use physics engine to take care of distributing the points evenly and based on radius
  const Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

  const engine = Engine.create();

  const nodePos = randoPoints.sort((a, b) => b[1] - a[1]);

  const node_bodies = nodes.map(({ r, id }, i) => {
    const [nx, ny] = nodePos[i];
    return Bodies.circle(nx, ny, r, {
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

  Matter.Body.setCentre(cage, { x: 0, y: 0 });
  Matter.Body.scale(cage, WIDTH_AREA, WIDTH_AREA);

  Composite.add(engine.world, [...node_bodies, cage]);

  // run engine for SECS second at FPS fps
  for (let i = 0, FPS = 60, SECS = 0.1; i < FPS * SECS; i++)
    Engine.update(engine, 1000 / FPS);

  const retVal = node_bodies.map(({ position, id }) => ({
    id,
    x: position.x + x,
    y: position.y + y,
  }));

  retVal.height = (WIDTH_AREA / 2 / CIRC_RAD) * DROP_HEIGHT;

  if (reuse && (!DET_CACHE || retVal.length !== lastDetNodesLen)) {
    DET_CACHE = retVal;
    lastDetNodesLen = retVal.length;
  }

  return retVal;
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

export function createInterps(name, curScen, data, maxDelivs) {
  const delivs = data[name][SCENARIO_KEY_STRING][curScen][DELIV_KEY_STRING];
  return d3
    .scaleLinear()
    .domain(ticksExact(0, 1, delivs.length))
    .range(delivs.map((v) => Math.min(1, v / maxDelivs)))
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
  if (criteria === "alphabetical") {
    return Object.keys(data[objective][SCENARIO_KEY_STRING]).sort();
  }
}

function get(object, path, defaultValue) {
  const parts = path.split(".");
  for (let part of parts) {
    if (!object) return defaultValue;
    object = object[part];
  }
  return object ?? defaultValue;
}

function pick(fn) {
  return typeof fn === "string" ? (v) => get(v, fn) : fn;
}

export function sortBy(array, fn) {
  fn = pick(fn);
  return array.sort((a, b) => {
    const va = fn(a);
    const vb = fn(b);
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
}

export function toRadians(a) {
  return (a * Math.PI) / 180;
}

export class Camera {
  fov;
  near;
  far;
  width;
  height;
  camera;
  zoom;
  view;

  constructor({ fov, near, far, width, height, domElement, zoomFn }) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.width = width;
    this.height = height;

    this.camera = new THREE.PerspectiveCamera(
      fov,
      width / height,
      near,
      far + 1
    );

    this.camera.position.set(0, 0, this.far);

    this.zoom = d3
      .zoom()
      .scaleExtent([
        this.getScaleFromZ(this.far),
        this.getScaleFromZ(this.near),
      ])
      .on("zoom", (e) => {
        this.d3ZoomHandler(e);

        zoomFn && zoomFn(e);
      });

    this.view = d3.select(domElement);
    this.view.call(this.zoom);
    this.zoom.transform(
      this.view,
      d3.zoomIdentity
        .translate(this.width / 2, this.height / 2)
        .scale(this.getScaleFromZ(this.far))
    );
  }

  d3ZoomHandler(e) {
    const scale = e.transform.k;
    const x = -(e.transform.x - this.width / 2) / scale;
    const y = (e.transform.y - this.height / 2) / scale;
    const z = this.getZFromScale(scale);
    this.camera.position.set(x, y, z);
  }

  getScaleFromZ(camera_z_position) {
    const half_fov = this.fov / 2;
    const half_fov_radians = toRadians(half_fov);
    const half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
    const fov_height = half_fov_height * 2;
    const scale = this.height / fov_height;
    return scale;
  }

  getZFromScale(scale) {
    const half_fov = this.fov / 2;
    const half_fov_radians = toRadians(half_fov);
    const scale_height = this.height / scale;
    const camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
    return camera_z_position;
  }
}

export class MeshGeometry {
  threeGeom = new THREE.Geometry();
  idx = 0;

  addMeshCoords(meshCoords, transform, color, z = 0) {
    const indices = [];

    for (let j = 0; j < meshCoords.length; j++) {
      const [v1, v2, v3] = meshCoords[j];

      const a = new THREE.Vector3(transform.x + v1[0], transform.y - v1[1], z);
      const b = new THREE.Vector3(transform.x + v2[0], transform.y - v2[1], z);
      const c = new THREE.Vector3(transform.x + v3[0], transform.y - v3[1], z);
      this.threeGeom.vertices.push(a, b, c);

      const face = new THREE.Face3(
        this.idx * 3 + 0,
        this.idx * 3 + 1,
        this.idx * 3 + 2
      );

      if (color) {
        face.vertexColors.push(color);
        face.vertexColors.push(color);
        face.vertexColors.push(color);
      }

      this.threeGeom.faces.push(face);

      indices.push(this.idx++);
    }

    return indices;
  }
}

export function mouseToThree(mouseX, mouseY, width, height) {
  return new THREE.Vector3(
    (mouseX / width) * 2 - 1,
    -(mouseY / height) * 2 + 1,
    1
  );
}
