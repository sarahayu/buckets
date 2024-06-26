import * as d3 from "d3";
import * as THREE from "three";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";
import { MAX_DELIVS, objectivesData } from "./data/objectivesData";
import {
  createInterps,
  criteriaSort,
  placeDropsUsingPhysics,
  radsToDropWidth,
  sortBy,
  toRadians,
  waterdrop,
  waterdropDelta,
} from "./utils";

const LEVELS = 5;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 1;
const LARGE_DROPLET_PAD_FACTOR = 0.1;

export default function LargeDropletApp() {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const winDim = useRef();
  const [tooltip, setTooltip] = useState({
    style: {
      display: "none",
      position: "absolute",
      "pointer-events": "none",
    },
  });

  const objToScens = useMemo(() => {
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
    const unorderedObjToWaterLevels = {};

    objectiveIDs.forEach((obj) => {
      unorderedObjToWaterLevels[obj] = objToScens[obj].map((s) => {
        const i = createInterps(obj, s, objectivesData, MAX_DELIVS);
        return ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      });
    });

    return unorderedObjToWaterLevels;
  }, []);

  useEffect(() => {
    winDim.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const width = winDim.current.width,
      height = winDim.current.height;

    const scale = 1,
      r = Math.max(2, scale * RAD_PX * LARGE_DROPLET_PAD_FACTOR);
    const largeNodesDropSize = {};

    const nodesArr = Object.keys(objToWaterLevels).map((obj, i) => {
      const smallNodes = objToWaterLevels[obj].map((_, idx) => ({
        r,
        id: idx,
      }));
      const nodesPos = placeDropsUsingPhysics(0, 0, smallNodes, true);

      largeNodesDropSize[i] = radsToDropWidth(smallNodes.map(({ r }) => r));

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
    });

    const largeNodesRads = {};
    const largeNodes = nodesArr.map((largeDrop, idx) => ({
      r: (largeNodesRads[idx] = Math.max(
        1,
        Math.sqrt(d3.sum(largeDrop.map((d) => d.maxLev)) / Math.PI) * 2
      )),
      id: idx,
    }));

    const largeNodesPos = placeDropsUsingPhysics(0, 0, largeNodes).map(
      ({ x, y }, i) => ({
        x,
        y,
        tilt: Math.random() * 50 - 25,
        r: largeNodesRads[i],
      })
    );

    const fov = 150;
    const near = 1;
    const far = 100;

    function mouseToThree(mouseX, mouseY) {
      return new THREE.Vector3(
        (mouseX / width) * 2 - 1,
        -(mouseY / height) * 2 + 1,
        1
      );
    }

    function getScaleFromZ(camera_z_position) {
      const half_fov = fov / 2;
      const half_fov_radians = toRadians(half_fov);
      const half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
      const fov_height = half_fov_height * 2;
      const scale = height / fov_height;
      return scale;
    }

    function getZFromScale(scale) {
      const half_fov = fov / 2;
      const half_fov_radians = toRadians(half_fov);
      const scale_height = height / scale;
      const camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
      return camera_z_position;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animate);
    document.querySelector("#mosaic-area").appendChild(renderer.domElement);

    const view = d3.select(renderer.domElement);
    view.on("mousemove", (e) => {
      checkIntersects([e.x, e.y]);
    });
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xefefef);
    const camera = new THREE.PerspectiveCamera(
      fov,
      width / height,
      near,
      far + 1
    );
    const raycaster = new THREE.Raycaster();

    const zoom = d3
      .zoom()
      .scaleExtent([getScaleFromZ(far), getScaleFromZ(near)])
      .on("zoom", function (e) {
        const scale = e.transform.k;
        const x = -(e.transform.x - width / 2) / scale;
        const y = (e.transform.y - height / 2) / scale;
        const z = getZFromScale(scale);
        camera.position.set(x, y, z);
      });

    function setUpZoom() {
      view.call(zoom);
      const initial_scale = getScaleFromZ(far);
      var initial_transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initial_scale);
      zoom.transform(view, initial_transform);
      camera.position.set(0, 0, far);
    }
    setUpZoom();

    const dropsGeometry = new THREE.Geometry();
    const hovererGeometry = new THREE.Geometry();

    let idx = 0;
    for (let i = 0; i < nodesArr.length; i++) {
      const nodes = nodesArr[i];
      const x = largeNodesPos[i].x;
      const y = largeNodesPos[i].y;
      for (let j = 0; j < nodes.length; j++) {
        const { startX, startY, levs, maxLev } = nodes[j];
        const xx = x + startX;
        const yy = -(y + startY);

        for (let j = levs.length - 1; j >= 0; j--) {
          const l1 = j !== levs.length - 1 ? levs[j + 1] : 0;
          const l2 = levs[j];

          const meshCoords = waterdropDelta(l1 / maxLev, l2 / maxLev, RAD_PX);

          const col = new THREE.Color(interpolateWatercolorBlue(j / LEVELS));

          for (let k = 0; k < meshCoords.length; k++) {
            const [v1, v2, v3] = meshCoords[k];

            const a = new THREE.Vector3(xx + v1[0], yy - v1[1], 0);
            const b = new THREE.Vector3(xx + v2[0], yy - v2[1], 0);
            const c = new THREE.Vector3(xx + v3[0], yy - v3[1], 0);
            dropsGeometry.vertices.push(a, b, c);

            const face = new THREE.Face3(idx * 3 + 0, idx * 3 + 1, idx * 3 + 2);
            face.vertexColors.push(col);
            face.vertexColors.push(col);
            face.vertexColors.push(col);
            dropsGeometry.faces.push(face);
            idx++;
          }
        }
      }
    }

    const idxToDrop = [];

    idx = 0;
    for (let i = 0; i < nodesArr.length; i++) {
      const x = largeNodesPos[i].x;
      const y = largeNodesPos[i].y;

      const meshCoords = waterdrop(
        1,
        (largeNodesDropSize[i] * Math.SQRT2) / Math.SQRT1_2 // TODO why does this work
      );

      for (let j = 0; j < meshCoords.length; j++) {
        const [v1, v2, v3] = meshCoords[j];

        const a = new THREE.Vector3(x + v1[0], -y - v1[1], 0);
        const b = new THREE.Vector3(x + v2[0], -y - v2[1], 0);
        const c = new THREE.Vector3(x + v3[0], -y - v3[1], 0);
        hovererGeometry.vertices.push(a, b, c);

        const face = new THREE.Face3(idx * 3 + 0, idx * 3 + 1, idx * 3 + 2);
        face.vertexColors.push(0x00ff00);
        face.vertexColors.push(0x00ff00);
        face.vertexColors.push(0x00ff00);
        hovererGeometry.faces.push(face);

        idxToDrop.push(i);
        idx++;
      }
    }

    const dropsMesh = new THREE.Mesh(
      dropsGeometry,
      new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        depthTest: false,
      })
    );
    const hovererMesh = new THREE.Mesh(
      hovererGeometry,
      new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        depthTest: false,
        transparent: true,
        opacity: 0,
      })
    );

    scene.add(dropsMesh);
    scene.add(hovererMesh);

    function checkIntersects(mouse_position) {
      const mouse_vector = mouseToThree(...mouse_position);
      raycaster.setFromCamera(mouse_vector, camera);
      const intersects = raycaster.intersectObject(hovererMesh);
      if (intersects[0]) {
        const sorted_intersects = sortBy(intersects, "distanceToRay");
        const intersect = sorted_intersects[0];
        const index = intersect.faceIndex;
        const datum = idxToDrop[index];

        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            ...tooltip.style,
            display: "block",
            left: mouse_position[0],
            top: mouse_position[1],
          },
          text: objectiveIDs[datum],
        }));
      } else {
        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            ...tooltip.style,
            display: "none",
          },
        }));
      }
    }

    function animate() {
      renderer.render(scene, camera);
    }
  }, []);

  return (
    <div className="bubbles-wrapper">
      <div className="bubbles-input-area"></div>
      <div className="bubbles-tooltip" style={tooltip.style}>
        {tooltip.text}
      </div>
      <div id="mosaic-area"></div>
    </div>
  );
}
