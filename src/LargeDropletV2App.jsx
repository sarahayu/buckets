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
  useStateRef,
  waterdropDelta,
  waterdropDeltaOutline,
} from "./utils";

const LEVELS = 5;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 2; // debugging purposes, don't render all scenarios to speed things up
const SMALL_DROP_PAD_FACTOR = 1.75;
const LARGE_DROP_PAD_FACTOR = 1.5;
const ANIM_TIME = 3;
const HOVER_AREA_FACTOR = 1.3 / (1 + Math.SQRT1_2);
const FILTERED_KEYS = scenarioIDs.filter((_, i) => i % SCEN_DIVISOR === 0);

export default function LargeDropletV2App() {
  const width = window.innerWidth,
    height = window.innerHeight;

  const { current: scene } = useRef(getScene());

  const [grouping, setGrouping] = useState("objective");
  const [tooltip, setTooltip] = useState({});

  const primaryKeysRef = useRef();
  const secondaryKeysRef = useRef();

  const waterdrops = useRef();

  const clockRef = useRef();

  const dropsMeshRef = useRef();
  const outlineMeshRef = useRef();
  const pointsMeshRef = useRef();

  const [reverseTranslation, setReverseTranslation, reverseTranslationRef] =
    useStateRef();

  primaryKeysRef.current =
    grouping === "objective" ? objectiveIDs : FILTERED_KEYS;
  secondaryKeysRef.current =
    grouping === "objective" ? FILTERED_KEYS : objectiveIDs;

  useEffect(function initialize() {
    d3.select("#mosaic-svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "svg-trans")
      .on("mousemove", function (e) {
        const { x, y } = e;
        setTooltip((tooltip) => ({
          ...tooltip,
          x,
          y,
        }));
      });

    initTHREE();
  }, []);

  useEffect(
    function onChangeGrouping() {
      d3.select("#mosaic-svg")
        .select(".svg-trans")
        .selectAll(".largeDrop")
        .attr("display", "none");

      const prevWaterdrops = waterdrops.current;
      waterdrops.current = initWaterdrops(
        getWaterlevels(
          grouping,
          primaryKeysRef.current,
          secondaryKeysRef.current
        )
      );

      if (prevWaterdrops)
        setReverseTranslation(
          calcTranslations(waterdrops.current, prevWaterdrops)
        );

      pointsMeshRef.current = initWaterdropsMeshSimplified(waterdrops.current);

      scene.remove(dropsMeshRef.current, outlineMeshRef.current);
      scene.add(pointsMeshRef.current);

      clockRef.current = new THREE.Clock();
    },
    [grouping]
  );

  useEffect(
    function onGroupingAnimationEnd() {
      if (reverseTranslationRef.current) return;

      scene.remove(pointsMeshRef.current);

      const { dropsMesh, outlineMesh } = initWaterdropsMesh(waterdrops.current);
      dropsMeshRef.current = dropsMesh;
      outlineMeshRef.current = outlineMesh;
      scene.add(dropsMesh, outlineMesh);

      updateLargeDropSVG(
        d3.select("#mosaic-svg").select(".svg-trans"),
        waterdrops.current,
        (d) =>
          setTooltip((tooltip) => ({
            ...tooltip,
            text: d.key,
            primaryText: d.key,
          })),
        () =>
          setTooltip((tooltip) => ({
            ...tooltip,
            text: "",
            primaryText: "",
          }))
      );
    },
    [reverseTranslation]
  );

  function initTHREE() {
    const camera = new Camera({
      fov: 45,
      near: 1,
      far: 3000,
      width,
      height,
      domElement: d3.select(".bubbles-wrapper").node(),
      zoomFn: (e) => {
        d3.select("#mosaic-svg")
          .select(".svg-trans")
          .attr("transform", e.transform);

        if (!outlineMeshRef.current) return;
        outlineMeshRef.current.material.opacity = d3
          .scaleLinear()
          .domain([1, 5])
          .range([0.1, 1])
          .clamp(true)(e.transform.k);
        outlineMeshRef.current.material.needsUpdate = true;
      },
    });

    camera.view.on("mousemove", (e) => {
      if (!pointsMeshRef.current) return;

      const { x, y } = mouseToThree(e.x, e.y, width, height);
      const intersects = camera.intersectObject(x, y, pointsMeshRef.current);

      if (intersects[0]) {
        const intersect = sortBy(intersects, "distanceToRay")[0];
        const secondaryKey =
          secondaryKeysRef.current[
            intersect.index % secondaryKeysRef.current.length
          ];

        setTooltip((tooltip) => ({
          ...tooltip,
          secondaryText: secondaryKey,
        }));
      } else {
        setTooltip((tooltip) => ({
          ...tooltip,
          secondaryText: "",
        }));
      }
    });

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.querySelector("#mosaic-webgl").appendChild(renderer.domElement);

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera.camera);

      if (!reverseTranslationRef.current) return;

      if (clockRef.current.getElapsedTime() > ANIM_TIME) {
        setReverseTranslation(null);
        return;
      }

      updateGeom(
        pointsMeshRef.current.geometry,
        waterdrops.current,
        reverseTranslationRef.current,
        d3.easeExp(clockRef.current.getElapsedTime() / ANIM_TIME)
      );

      pointsMeshRef.current.geometry.verticesNeedUpdate = true;
    });
  }

  return (
    <div className="bubbles-wrapper">
      <InputArea
        grouping={grouping}
        onChange={(e) => void setGrouping(e.target.value)}
      />
      <div className="bubbles-tooltip" style={getTooltipStyle(tooltip)}>
        {tooltip.secondaryText || tooltip.primaryText}
      </div>
      <div id="mosaic-webgl"></div>
      <svg id="mosaic-svg"></svg>
    </div>
  );
}

function InputArea({ grouping, onChange }) {
  return (
    <div className="bubbles-input-area" onChange={onChange}>
      <input
        type="radio"
        name="grouping"
        value="objective"
        id="objective"
        checked={grouping === "objective"}
      />
      <label htmlFor="objective">objective</label>
      <input
        type="radio"
        name="grouping"
        value="scenario"
        id="scenario"
        checked={grouping === "scenario"}
      />
      <label htmlFor="scenario">scenario</label>
    </div>
  );
}

/*-------------------------------------------- !! spaghetti code below !! --------------------------------------------------------------------*/

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

      const levs = waterdropMatrix[primaryKey][secondaryKey].map(
        (w, i) => Math.max(w, i == 0 ? MIN_LEV_VAL : 0) * RAD_PX
      );

      return {
        levs,
        maxLev: RAD_PX,
        domLev: calcDomLev(levs),
        tilt: Math.random() * 50 - 25,
        dur: Math.random() * 100 + 400,
        x: smallNodesPos[secondaryKeyIdx].x,
        y: smallNodesPos[secondaryKeyIdx].y,
        group: primaryKey,
        key: secondaryKey,
        globalX:
          largeNodesPos[primaryKeyIdx].x + smallNodesPos[secondaryKeyIdx].x,
        globalY:
          largeNodesPos[primaryKeyIdx].y + smallNodesPos[secondaryKeyIdx].y,
      };
    });

    return {
      nodes: innerNodes,
      x: largeNodesPos[primaryKeyIdx].x,
      y: largeNodesPos[primaryKeyIdx].y,
      tilt: Math.random() * 50 - 25,
      key: primaryKey,
    };
  });

  return {
    nodes: largeNodes,
    height: smallNodesPos.height,
    pLookup: pLookup,
    sLookup: sLookup,
  };
}

function initWaterdropsMesh(waterdrops) {
  const dropsGeometry = new MeshGeometry();
  const outlinePoints = [];

  const outlineMeshCoords = waterdropDeltaOutline(0, 1, RAD_PX * 0.975);

  for (let i = 0; i < waterdrops.nodes.length; i++) {
    const nodes = waterdrops.nodes[i].nodes;

    for (let j = 0; j < nodes.length; j++) {
      const { globalX: x, globalY: y, levs, maxLev } = nodes[j];

      for (let k = levs.length - 1; k >= 0; k--) {
        const l1 = k !== levs.length - 1 ? levs[k + 1] : 0;
        const l2 = levs[k];

        const meshCoords = waterdropDelta(l1 / maxLev, l2 / maxLev, RAD_PX);
        const color = new THREE.Color(interpolateWatercolorBlue(k / LEVELS));

        dropsGeometry.addMeshCoords(
          meshCoords,
          { x: x, y: -y },
          color,
          (j % 5) / 50 + 0.02
        );
      }

      outlinePoints.push(
        ...outlineMeshCoords.map(
          ([dx, dy]) => new THREE.Vector3(x + dx, -y - dy, (j % 5) / 50 + 0.01)
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
  const outlineMesh = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(outlinePoints),
    new THREE.LineBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0,
    })
  );

  return {
    dropsMesh,
    outlineMesh,
  };
}

function initWaterdropsMeshSimplified(waterdrops) {
  const pointsGeometry = new THREE.Geometry();

  for (let i = 0; i < waterdrops.nodes.length; i++) {
    const nodes = waterdrops.nodes[i].nodes;

    for (let j = 0; j < nodes.length; j++) {
      const { globalX: x, globalY: y, levs, domLev } = nodes[j];

      const color = domLev > 0 ? interpolateWatercolorBlue(domLev) : "white";

      pointsGeometry.vertices.push(new THREE.Vector3(x, -y, 0));
      pointsGeometry.colors.push(new THREE.Color(color));
    }
  }

  const pointsMaterial = new THREE.PointsMaterial({
    size: RAD_PX * 2,
    sizeAttenuation: true,
    vertexColors: THREE.VertexColors,
    map: new THREE.TextureLoader().load("drop.png"),
    transparent: true,
  });

  const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);

  return pointsMesh;
}

function calcTranslations(waterdropsObjScen, waterdropsScenObj) {
  const translations = {};

  for (const pKey of Object.keys(waterdropsObjScen.pLookup)) {
    const row = {};
    for (const sKey of Object.keys(waterdropsScenObj.pLookup)) {
      let { globalX: xStart, globalY: yStart } =
        waterdropsObjScen.nodes[waterdropsObjScen.pLookup[pKey]].nodes[
          waterdropsObjScen.sLookup[sKey]
        ];

      let { globalX: xEnd, globalY: yEnd } =
        waterdropsScenObj.nodes[waterdropsScenObj.pLookup[sKey]].nodes[
          waterdropsScenObj.sLookup[pKey]
        ];

      row[sKey] = [xEnd - xStart, yEnd - yStart];
    }

    translations[pKey] = row;
  }

  return translations;
}

function updateGeom(g, endWaterdrops, reverseTranslations, t) {
  let idx = 0;
  t = 1 - t;

  for (let i = 0; i < endWaterdrops.nodes.length; i++) {
    const nodes = endWaterdrops.nodes[i].nodes;
    const pKey = endWaterdrops.nodes[i].key;

    for (let j = 0; j < nodes.length; j++) {
      const { globalX: endX, globalY: endY, key: sKey } = nodes[j];

      const [dx, dy] = reverseTranslations[pKey][sKey];

      g.vertices[idx].setX(endX + t * dx);
      g.vertices[idx].setY(-(endY + t * dy));

      idx++;
    }
  }
}

function getScene() {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0xefefef);
  return s;
}

function getTooltipStyle(tooltip) {
  return {
    display: tooltip.secondaryText || tooltip.primaryText ? "initial" : "none",
    left: tooltip.x,
    top: tooltip.y,
  };
}

function updateLargeDropSVG(container, waterdrops, onHover, onUnhover) {
  container
    .selectAll(".largeDrop")
    .data(waterdrops.nodes)
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
            .attr("stroke-width", 1);
        });
    })
    .attr("display", "initial")
    .attr(
      "transform",
      ({ x, y }) =>
        `translate(${x}, ${y}) scale(${waterdrops.height * HOVER_AREA_FACTOR})`
    )
    .on("mouseenter", function (e, d) {
      d3.select(this).select("path").attr("stroke", "lightgray");
      onHover(d);
    })
    .on("mouseleave", function (e, d) {
      d3.select(this).select("path").attr("stroke", "transparent");
      onUnhover(d);
    });
}

function getWaterlevels(grouping, primaryKeys, secondaryKeys) {
  const mat = {};

  if (grouping === "objective") {
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
  } else if (grouping === "scenario") {
    for (let i = 0; i < primaryKeys.length; i++) {
      const scen = primaryKeys[i];
      const row = {};

      for (let j = 0; j < secondaryKeys.length; j++) {
        const obj = secondaryKeys[j];
        const i = createInterps(obj, scen, objectivesData, MAX_DELIVS);
        row[obj] = ticksExact(0, 1, LEVELS + 1).map((d) => i(d));
      }

      mat[scen] = row;
    }
  }

  return mat;
}

// TODO fix colors
function calcDomLev(levs) {
  levs = [1, ...levs, 0]; // include full level=1 because dominant lev might just be white

  let mean = 0;
  for (let i = 0; i < levs.length - 1; i++) {
    const dif = levs[i] - levs[i + 1];
    mean += (dif * (i - 1)) / (LEVELS + 4);
  }

  return mean;
}
