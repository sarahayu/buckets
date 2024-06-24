import * as d3 from "d3";
import * as THREE from "three";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";
import {
  DELIV_KEY_STRING,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectivesData,
} from "./data/objectivesData";
import {
  DROPLET_SHAPE,
  WATERDROP_ICON,
  clamp,
  createInterps,
  criteriaSort,
  percentToRatioFilled,
  placeDropsUsingPhysics,
  waterdrop,
} from "./utils";
import { useNavigate } from "react-router-dom";

function toRadians(a) {
  return (a * Math.PI) / 180;
}

const LEVELS = 5;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 2;
const LARGE_DROPLET_PAD_FACTOR = 0.5;
const PX_BIAS = 1;

export default function LargeDropletMosaicApp() {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const navigate = useNavigate();
  const winDim = useRef();

  const orderedObjToScens = useMemo(() => {
    const unorderedObjToScens = {};

    // don't process all scenes, too many small drops causes lag
    objectiveIDs.forEach(
      (obj) =>
        (unorderedObjToScens[obj] = criteriaSort(
          "alphabetical",
          objectivesData,
          obj
        )
          .filter((_, i) => i % SCEN_DIVISOR == 0)
          .reverse())
    );

    return unorderedObjToScens;
  }, []);

  const objToWaterLevels = useMemo(() => {
    const retVal = {};

    objectiveIDs.forEach((obj) => {
      retVal[obj] = orderedObjToScens[obj].map((s) => {
        const i = createInterps(obj, s, objectivesData, MAX_DELIVS);
        return ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      });
    });

    return retVal;
  }, []);

  useEffect(() => {
    winDim.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const width = winDim.current.width,
      height = winDim.current.height;

    const nodesArr = Object.keys(objToWaterLevels)
      .map((obj) => {
        const scale = 1;

        const nodesPos = placeDropsUsingPhysics(
          0,
          0,
          objToWaterLevels[obj].map((levs, idx) => ({
            r: Math.max(
              2,

              scale * RAD_PX * LARGE_DROPLET_PAD_FACTOR
            ),
            id: idx,
          })),
          true
        );

        const nodes = nodesPos.map(({ id: idx, x, y }) => ({
          levs: objToWaterLevels[obj][idx].map(
            (w, i) =>
              ((Math.max(w, i == 0 ? MIN_LEV_VAL : 0) * scale * 1) /
                Math.max(objToWaterLevels[obj][idx][0], MIN_LEV_VAL)) *
              RAD_PX
          ),
          maxLev: RAD_PX,
          tilt: Math.random() * 50 - 25,
          dur: Math.random() * 100 + 400,
          startX: x,
          startY: y,
          obj,
        }));

        return nodes;
      })
      .reverse();

    const largeNodesRads = {};

    const largeNodesPos = placeDropsUsingPhysics(
      0,
      0,
      nodesArr.map((largeDrop, idx) => ({
        r: (largeNodesRads[idx] = Math.max(
          1,
          Math.sqrt(d3.sum(largeDrop.map((d) => d.maxLev)) / Math.PI) * 3
        )),
        id: idx,
      }))
    ).map(({ x, y }, i) => ({
      x,
      y,
      tilt: Math.random() * 50 - 25,
      r: largeNodesRads[i],
    }));

    const fov = 160;
    const near = 1;
    const far = 100;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      fov,
      width / height,
      near,
      far + 1
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animate);
    document.querySelector("#mosaic-area").appendChild(renderer.domElement);
    const view = d3.select(renderer.domElement);

    function getScaleFromZ(camera_z_position) {
      let half_fov = fov / 2;
      let half_fov_radians = toRadians(half_fov);
      let half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
      let fov_height = half_fov_height * 2;
      let scale = height / fov_height; // Divide visualization height by height derived from field of view
      return scale;
    }

    function getZFromScale(scale) {
      let half_fov = fov / 2;
      let half_fov_radians = toRadians(half_fov);
      let scale_height = height / scale;
      let camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
      return camera_z_position;
    }

    function zoomHandler(e) {
      let scale = e.transform.k;
      let x = -(e.transform.x - width / 2) / scale;
      let y = (e.transform.y - height / 2) / scale;
      let z = getZFromScale(scale);
      camera.position.set(x, y, z);
    }

    const zoom = d3
      .zoom()
      .scaleExtent([getScaleFromZ(far), getScaleFromZ(near)])
      .on("zoom", zoomHandler);

    function setUpZoom() {
      view.call(zoom);
      let initial_scale = getScaleFromZ(far);
      var initial_transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initial_scale);
      zoom.transform(view, initial_transform);
      camera.position.set(0, 0, far);
    }
    setUpZoom();

    scene.background = new THREE.Color(0xefefef);

    let pointsGeometry = new THREE.Geometry();

    let idx = 0;
    for (let i = 0; i < nodesArr.length; i++) {
      const nodes = nodesArr[i];
      let x = largeNodesPos[i].x;
      let y = largeNodesPos[i].y;
      for (let j = 0; j < nodes.length; j++) {
        const { startX, startY, levs, maxLev } = nodes[j];
        let xx = x + startX;
        let yy = -(y + startY);

        for (let l = 0; l < levs.length; l++) {
          const ll = levs[l];

          const coords = waterdrop(ll / maxLev);

          const col = new THREE.Color(interpolateWatercolorBlue(l / LEVELS));

          for (let k = 0; k < coords.length; k++) {
            const [v1, v2, v3] = coords[k];

            let a = new THREE.Vector3(xx + v1[0], yy - v1[1], 0);
            let b = new THREE.Vector3(xx + v2[0], yy - v2[1], 0);
            let c = new THREE.Vector3(xx + v3[0], yy - v3[1], 0);
            pointsGeometry.vertices.push(a, b, c);

            let face = new THREE.Face3(idx * 3 + 0, idx * 3 + 1, idx * 3 + 2);
            face.vertexColors.push(col);
            face.vertexColors.push(col);
            face.vertexColors.push(col);
            pointsGeometry.faces.push(face);
            idx++;
          }
        }
      }
    }

    let mat = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
    const points = new THREE.Mesh(pointsGeometry, mat);

    scene.add(points);

    function animate() {
      renderer.render(scene, camera);
    }
  }, []);

  return (
    <div className="bubbles-wrapper">
      <div className="bubbles-input-area"></div>
      <div id="mosaic-area"></div>
    </div>
  );
}
