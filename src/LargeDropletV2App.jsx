import * as d3 from "d3";
import * as THREE from "three";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";
import {
  MAX_DELIVS,
  objectiveIDs,
  objectivesData,
} from "./data/objectivesData";
import {
  Camera,
  MeshGeometry,
  createInterps,
  criteriaSort,
  mouseToThree,
  placeDropsUsingPhysics,
  sortBy,
  waterdrop,
  waterdropDelta,
} from "./utils";

const LEVELS = 5;
const RAD_PX = 10;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 5;
const SMALL_DROP_PAD_FACTOR = 0.6;

export default function LargeDropletV2App() {
  const winDim = useRef();
  const [tooltip, setTooltip] = useState({
    style: {
      display: "none",
      position: "absolute",
      pointerEvents: "none",
    },
  });
  const outlineMat = useRef();

  const objToWaterLevels = useMemo(() => {
    const objToLevels = {};

    for (let i = 0; i < objectiveIDs.length; i++) {
      const obj = objectiveIDs[i];
      const filteredSortedScens = criteriaSort(
        "alphabetical",
        objectivesData,
        obj
      ).filter((_, i) => i % SCEN_DIVISOR == 0);

      objToLevels[obj] = filteredSortedScens.map((s) => {
        const i = createInterps(obj, s, objectivesData, MAX_DELIVS);
        return ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      });
    }

    return objToLevels;
  }, []);

  useEffect(() => {
    winDim.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const width = winDim.current.width,
      height = winDim.current.height;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.querySelector("#mosaic-area").appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xefefef);
    const raycaster = new THREE.Raycaster();
    const camera = new Camera({
      fov: 160,
      near: 1,
      far: 100,
      width,
      height,
      domElement: renderer.domElement,
      zoomFn: (e) => {
        if (!outlineMat.current) return;
        outlineMat.current.opacity = d3
          .scaleLinear()
          .domain([1, 5])
          .range([0.1, 1])
          .clamp(true)(e.transform.k);
        outlineMat.current.needsUpdate = true;
      },
    });

    renderer.setAnimationLoop(() => void renderer.render(scene, camera.camera));

    const largeNodes = initNodes(objToWaterLevels);

    const dropsGeometry = new MeshGeometry();
    const hovererGeometry = new MeshGeometry();
    const outlineGeometry = new MeshGeometry();

    const hovererMeshCoords = waterdrop(
      1,
      (largeNodes.innerNodesHeight / (1 + Math.SQRT1_2)) * 2 // TODO fix
    );
    const outlineMeshCoords = waterdrop(1, RAD_PX * 0.99);
    const idxToDrop = {};

    for (let i = 0; i < largeNodes.length; i++) {
      const nodes = largeNodes[i].innerNodes;
      const lx = largeNodes[i].x;
      const ly = -largeNodes[i].y;

      hovererGeometry
        .addMeshCoords(hovererMeshCoords, { x: lx, y: ly }, 0x00ff00)
        .forEach((meshIdx) => (idxToDrop[meshIdx] = i));

      for (let j = 0; j < nodes.length; j++) {
        const { x, y, levs, maxLev } = nodes[j];
        const xx = lx + x;
        const yy = ly - y;

        for (let k = levs.length - 1; k >= 0; k--) {
          const l1 = k !== levs.length - 1 ? levs[k + 1] : 0;
          const l2 = levs[k];

          const meshCoords = waterdropDelta(l1 / maxLev, l2 / maxLev, RAD_PX);
          const color = new THREE.Color(interpolateWatercolorBlue(k / LEVELS));

          dropsGeometry.addMeshCoords(
            meshCoords,
            { x: xx, y: yy },
            color,
            (j % 5) / 20
          );
        }

        outlineGeometry.addMeshCoords(
          outlineMeshCoords,
          { x: xx, y: yy },
          null,
          (j % 5) / 20 - 0.001
        );
      }
    }

    const dropsMesh = new THREE.Mesh(
      dropsGeometry.threeGeom,
      new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
      })
    );
    const hovererMesh = new THREE.Mesh(
      hovererGeometry.threeGeom,
      new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        transparent: true,
        opacity: 0,
      })
    );
    const lineMesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(outlineGeometry.threeGeom),
      (outlineMat.current = new THREE.LineBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0,
      }))
    );

    // lineMesh.renderOrder = -1;
    scene.add(lineMesh, dropsMesh, hovererMesh);

    camera.view.on("mousemove", function checkIntersects(e) {
      raycaster.setFromCamera(
        mouseToThree(e.x, e.y, width, height),
        camera.camera
      );
      const intersects = raycaster.intersectObject(hovererMesh);
      if (intersects[0]) {
        const intersect = sortBy(intersects, "distanceToRay")[0];
        const datum = idxToDrop[intersect.faceIndex];

        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            ...tooltip.style,
            display: "block",
            left: e.x,
            top: e.y,
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
    });
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

function initNodes(objToWaterLevels) {
  const amtObjectives = Object.values(objToWaterLevels).length;
  const amtScenarios = Object.values(objToWaterLevels)[0].length;

  const smallDropRad = Math.max(2, RAD_PX * SMALL_DROP_PAD_FACTOR);
  const largeDropRad = Math.max(
    1,
    Math.sqrt((RAD_PX * amtScenarios) / Math.PI) * 4
  );

  const smallNodesPos = placeDropsUsingPhysics(
    0,
    0,
    d3.range(amtScenarios).map((_, id) => ({
      r: smallDropRad,
      id,
    }))
  );
  const largeNodesPos = placeDropsUsingPhysics(
    0,
    0,
    d3.range(amtObjectives).map((_, id) => ({
      r: largeDropRad,
      id,
    }))
  );

  const largeNodes = Object.keys(objToWaterLevels).map((obj, objId) => {
    const innerNodes = smallNodesPos.map(({ id: idx, x, y }) => ({
      levs: objToWaterLevels[obj][idx].map(
        (w, i) => Math.max(w, i == 0 ? MIN_LEV_VAL : 0) * RAD_PX
      ),
      maxLev: RAD_PX,
      tilt: Math.random() * 50 - 25,
      dur: Math.random() * 100 + 400,
      x,
      y,
      obj,
    }));

    return {
      innerNodes,
      ...largeNodesPos[objId],
      tilt: Math.random() * 50 - 25,
    };
  });

  largeNodes.innerNodesHeight = smallNodesPos.height;

  return largeNodes;
}
