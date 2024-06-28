import * as d3 from "d3";
import * as THREE from "three";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";
import {
  MAX_DELIVS,
  objectiveIDs,
  objectivesData,
  scenarioIDs,
} from "./data/objectivesData";
import {
  Camera,
  DROPLET_SHAPE,
  MeshGeometry,
  createInterps,
  mouseToThree,
  placeDropsUsingPhysics,
  sortBy,
  waterdrop,
  waterdropDelta,
  waterdropDeltaOutline,
} from "./utils";

const LEVELS = 5;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 10;
const SMALL_DROP_PAD_FACTOR = 1;
const LARGE_DROP_PAD_FACTOR = 1.5;

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
  const svgSelector = useRef();

  const { current: primaryKeys } = useRef(objectiveIDs);
  const { current: secondaryKeys } = useRef(
    scenarioIDs.filter((_, i) => i % SCEN_DIVISOR === 0)
  );

  const waterdropMatrix = useMemo(() => {
    const mat = {};

    for (let i = 0; i < primaryKeys.length; i++) {
      const obj = primaryKeys[i];
      const row = {};

      for (let j = 0; j < secondaryKeys.length; j++) {
        const scen = secondaryKeys[j];
        const i = createInterps(obj, scen, objectivesData, MAX_DELIVS);
        row[scen] = ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      }

      mat[obj] = row;
    }

    return mat;
  }, []);

  const waterdropMatrix2 = useMemo(() => {
    const mat = {};

    for (let i = 0; i < secondaryKeys.length; i++) {
      const scen = secondaryKeys[i];
      const row = {};

      for (let j = 0; j < primaryKeys.length; j++) {
        const obj = primaryKeys[j];
        const i = createInterps(obj, scen, objectivesData, MAX_DELIVS);
        row[obj] = ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      }

      mat[scen] = row;
    }

    return mat;
  }, []);

  useEffect(() => {
    winDim.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const width = winDim.current.width,
      height = winDim.current.height;

    const animationsObjects = [];
    let pointsMesh;
    const clock = new THREE.Clock();

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
      domElement: d3.select(".bubbles-wrapper").node(),
      zoomFn: (e) => {
        if (!outlineMat.current) return;
        outlineMat.current.opacity = d3
          .scaleLinear()
          .domain([1, 5])
          .range([0.1, 1])
          .clamp(true)(e.transform.k);
        outlineMat.current.needsUpdate = true;
        svgSelector.current.select(".svg-trans").attr("transform", e.transform);
      },
    });

    const waterdrops = initWaterdrops(waterdropMatrix);
    const waterdrops2 = initWaterdrops(waterdropMatrix2);

    const translation = [];

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera.camera);

      const g = pointsMesh.geometry;

      const delta = clock.getDelta();

      for (let i = 0; i < g.vertices.length; i++) {
        g.vertices[i].setX(g.vertices[i].x + delta * i);
      }

      g.verticesNeedUpdate = true;
    });

    const dropsGeometry = new MeshGeometry();
    const hovererGeometry = new MeshGeometry();
    const outlinePoints = [];

    const hovererMeshCoords = waterdrop(
      1,
      (waterdrops.innerNodesHeight / (1 + Math.SQRT1_2)) * 2 * 1.3
    );
    const outlineMeshCoords = waterdropDeltaOutline(0, 1, RAD_PX * 0.975);
    const meshIdxToLargeDropIdx = {};

    for (let i = 0; i < waterdrops.length; i++) {
      const nodes = waterdrops[i].innerNodes;
      const lx = waterdrops[i].x;
      const ly = -waterdrops[i].y;

      hovererGeometry
        .addMeshCoords(hovererMeshCoords, { x: lx, y: ly }, 0x00ff00)
        .forEach((meshIdx) => (meshIdxToLargeDropIdx[meshIdx] = i));

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
            (j % 5) / 50 + 0.001
          );
        }

        outlinePoints.push(
          ...outlineMeshCoords.map(
            ([x, y]) => new THREE.Vector3(xx + x, yy - y, (j % 5) / 50)
          )
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
      new THREE.BufferGeometry().setFromPoints(outlinePoints),
      (outlineMat.current = new THREE.LineBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0,
      }))
    );

    scene.add(lineMesh, dropsMesh, hovererMesh);

    let pointsGeometry = new THREE.Geometry();
    let colors = [];

    for (let i = 0; i < waterdrops.length; i++) {
      const nodes = waterdrops[i].innerNodes;
      const lx = waterdrops[i].x;
      const ly = -waterdrops[i].y;

      for (let j = 0; j < nodes.length; j++) {
        const { x, y, levs, maxLev } = nodes[j];
        const xx = lx + x;
        const yy = ly - y;

        pointsGeometry.vertices.push(new THREE.Vector3(xx, yy, 0.002));
        colors.push(
          new THREE.Color(
            interpolateWatercolorBlue(levs[Math.floor(LEVELS / 2)])
          )
        );
      }
    }
    pointsGeometry.colors = colors;

    let pointsMaterial = new THREE.PointsMaterial({
      size: 0.4,
      sizeAttenuation: true,
      vertexColors: THREE.VertexColors,
    });

    pointsMaterial.map = new THREE.TextureLoader().load(
      "https://blog.fastforwardlabs.com/images/2018/02/circle-1518727951930.png"
    );
    pointsMaterial.transparent = true;

    pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);

    scene.add(pointsMesh);

    camera.view.on("mousemove", function checkIntersects(e) {
      raycaster.setFromCamera(
        mouseToThree(e.x, e.y, width, height),
        camera.camera
      );
      const intersects = raycaster.intersectObject(hovererMesh);
      if (intersects[0]) {
        const intersect = sortBy(intersects, "distanceToRay")[0];
        const dropIdx = meshIdxToLargeDropIdx[intersect.faceIndex];

        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            ...tooltip.style,
            display: "block",
            left: e.x,
            top: e.y,
          },
          text: primaryKeys[dropIdx],
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

    svgSelector.current
      .attr("width", width)
      .attr("height", height)
      .call((s) => {
        s.append("rect")
          .attr("width", width)
          .attr("height", height)
          .attr("stroke", "none")
          .attr("fill", "transparent");
        // .on("mousemove", () => console.log("alo"));
      })
      .append("g")
      .attr("class", "svg-trans")
      .selectAll(".largeDrop")
      .data(waterdrops)
      .join((enter) => {
        return enter
          .append("g")
          .attr("class", "largeDrop")
          .call((s) => {
            s.append("path")
              .attr("d", DROPLET_SHAPE)
              .attr("fill", "none")
              .attr("stroke", "transparent")
              .attr("vector-effect", "non-scaling-stroke")
              .attr("stroke-width", 1)
              .on("mouseenter", function () {
                d3.select(this).attr("stroke", "lightgray");
              })
              .on("mouseleave", function () {
                d3.select(this).attr("stroke", "transparent");
              });
          });
      })
      .attr(
        "transform",
        ({ x, y }) =>
          `translate(${x}, ${y}) scale(${
            (waterdrops.innerNodesHeight / (1 + Math.SQRT1_2)) * 1.3
          })`
      );

    // TODO refactor
    camera.zoom.transform(
      svgSelector.current,
      d3.zoomIdentity
        .translate(camera.width / 2, camera.height / 2)
        .scale(camera.getScaleFromZ(camera.far))
    );
  }, []);

  return (
    <div className="bubbles-wrapper">
      <div className="bubbles-input-area"></div>
      <div className="bubbles-tooltip" style={tooltip.style}>
        {tooltip.text}
      </div>
      <div id="mosaic-area"></div>
      <svg
        className="mosaic-overlay"
        ref={(e) => (svgSelector.current = d3.select(e))}
      ></svg>
    </div>
  );
}

function initWaterdrops(waterdropMatrix) {
  const primaryKeys = Object.keys(waterdropMatrix);
  const secondaryKeys = Object.keys(Object.values(waterdropMatrix)[0]);
  const amtPrimaryKeys = primaryKeys.length;
  const amtSecondaryKeys = secondaryKeys.length;

  const largeDropRad = Math.max(
    1,
    Math.sqrt(amtSecondaryKeys / Math.PI) *
      RAD_PX *
      2 *
      SMALL_DROP_PAD_FACTOR *
      LARGE_DROP_PAD_FACTOR
  );
  const smallDropRad = Math.max(2, RAD_PX * SMALL_DROP_PAD_FACTOR);
  const largeNodesPos = placeDropsUsingPhysics(
    0,
    0,
    primaryKeys.map(() => ({
      r: largeDropRad,
    }))
  );

  const smallNodesPos = placeDropsUsingPhysics(
    0,
    0,
    secondaryKeys.map(() => ({
      r: smallDropRad,
    }))
  );

  const pLookup = {};
  const sLookup = {};

  const largeNodes = primaryKeys.map((primaryKey, primaryKeyIdx) => {
    pLookup[primaryKey] = primaryKeyIdx;
    const innerNodes = secondaryKeys.map((secondaryKey, secondaryKeyIdx) => {
      sLookup[secondaryKey] = secondaryKeyIdx;

      return {
        levs: waterdropMatrix[primaryKey][secondaryKey].map(
          (w, i) => Math.max(w, i == 0 ? MIN_LEV_VAL : 0) * RAD_PX
        ),
        maxLev: RAD_PX,
        tilt: Math.random() * 50 - 25,
        dur: Math.random() * 100 + 400,
        x: smallNodesPos[secondaryKeyIdx].x,
        y: smallNodesPos[secondaryKeyIdx].y,
        group: primaryKey,
      };
    });

    return {
      innerNodes,
      ...largeNodesPos[primaryKeyIdx],
      tilt: Math.random() * 50 - 25,
    };
  });

  largeNodes.innerNodesHeight = smallNodesPos.height;
  largeNodes.pLookup = smallNodesPos.pLookup;
  largeNodes.sLookup = smallNodesPos.sLookup;

  return largeNodes;
}
