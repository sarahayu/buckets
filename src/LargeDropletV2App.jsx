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
  waterdrop,
  waterdropDelta,
  waterdropDeltaOutline,
} from "./utils";

const LEVELS = 5;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 2;
const SMALL_DROP_PAD_FACTOR = 1;
const LARGE_DROP_PAD_FACTOR = 1.5;
const ANIM_TIME = 3;
const HOVER_AREA_FACTOR = 1.3 / (1 + Math.SQRT1_2);

export default function LargeDropletV2App() {
  const winDim = useRef();
  const [tooltip, setTooltip] = useState({
    style: {},
  });
  const outlineMat = useRef();
  const svgSelector = useRef();
  const [grouping, setGrouping, groupingRef] = useStateRef("objective");
  const { current: filteredKeys } = useRef(
    scenarioIDs.filter((_, i) => i % SCEN_DIVISOR === 0)
  );

  const primaryRef = useRef();
  const secondaryRef = useRef();

  const primaryKeys = grouping === "objective" ? objectiveIDs : filteredKeys;
  const secondaryKeys = grouping === "objective" ? filteredKeys : objectiveIDs;

  primaryRef.current = primaryKeys;
  secondaryRef.current = secondaryKeys;

  const watConfig = useRef();
  const [reverseTranslation, setReverseTranslation, reverseTranslationRef] =
    useStateRef();
  const clockRef = useRef();

  const [scene] = useState(() => {
    const s = new THREE.Scene();
    s.background = new THREE.Color(0xefefef);
    return s;
  });
  const pointsMeshRef = useRef();

  useEffect(() => {
    winDim.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const width = winDim.current.width,
      height = winDim.current.height;

    svgSelector.current
      .attr("width", width)
      .attr("height", height)
      .call((s) => {
        s.append("rect")
          .attr("width", width)
          .attr("height", height)
          .attr("stroke", "none")
          .attr("fill", "transparent");
      })
      .append("g")
      .attr("class", "svg-trans");

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.querySelector("#mosaic-area").appendChild(renderer.domElement);

    const camera = new Camera({
      fov: 45,
      near: 1,
      far: 3000,
      width,
      height,
      domElement: d3.select(".bubbles-wrapper").node(),
      zoomFn: (e) => {
        svgSelector.current.select(".svg-trans").attr("transform", e.transform);

        if (!outlineMat.current) return;
        outlineMat.current.opacity = d3
          .scaleLinear()
          .domain([1, 5])
          .range([0.1, 1])
          .clamp(true)(e.transform.k);
        outlineMat.current.needsUpdate = true;
      },
    });

    const raycaster = new THREE.Raycaster();
    camera.view.on("mousemove", function checkIntersects(e) {
      raycaster.setFromCamera(
        mouseToThree(e.x, e.y, width, height),
        camera.camera
      );
      if (!pointsMeshRef.current) return;

      const intersects = raycaster.intersectObject(pointsMeshRef.current);
      if (intersects[0]) {
        const intersect = sortBy(intersects, "distanceToRay")[0];
        const dropIdx = intersect.index;
        const secondaryKey =
          secondaryRef.current[dropIdx % secondaryRef.current.length];

        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            ...tooltip.style,
            fontWeight: "normal",
          },
          text: secondaryKey,
        }));
      } else {
        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            ...tooltip.style,
            fontWeight: "bold",
          },
          text: tooltip.primaryText,
        }));
      }
    });

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera.camera);

      if (!reverseTranslationRef.current) return;

      if (clockRef.current.getElapsedTime() > ANIM_TIME) {
        setReverseTranslation(null);
        return;
      }

      const g = pointsMeshRef.current.geometry;

      updateGeom(
        g,
        watConfig.current,
        reverseTranslationRef.current,
        d3.easeExp(clockRef.current.getElapsedTime() / ANIM_TIME)
      );

      g.verticesNeedUpdate = true;
    });
  }, []);

  useEffect(() => {
    const prevConfig = watConfig.current;

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

    const config = initWaterdrops(mat);

    if (prevConfig) setReverseTranslation(calcTranslations(config, prevConfig));
    watConfig.current = config;
    clockRef.current = new THREE.Clock();

    const pointsMesh = initWaterdropsSimplified(config);

    svgSelector.current
      .select(".svg-trans")
      .selectAll(".largeDrop")
      .attr("display", "none");

    scene.remove(...scene.children);
    scene.add(pointsMesh);
    pointsMeshRef.current = pointsMesh;
    watConfig.current = config;
  }, [grouping]);

  useEffect(() => {
    if (reverseTranslationRef.current) return;

    const config = watConfig.current;

    const { dropsMesh, lineMesh } = initWaterdropsMesh(config);
    scene.add(dropsMesh, lineMesh);
    scene.remove(pointsMeshRef.current);

    outlineMat.current = lineMesh.material;

    svgSelector.current
      .select(".svg-trans")
      .selectAll(".largeDrop")
      .data(config.nodes)
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
          `translate(${x}, ${y}) scale(${config.height * HOVER_AREA_FACTOR})`
      )
      .on("mouseenter", function (e, d) {
        d3.select(this).select("path").attr("stroke", "lightgray");
        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            fontWeight: "bold",
          },
          text: d.key,
          primaryText: d.key,
        }));
      })
      .on("mousemove", function (e, d) {
        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            ...tooltip.style,
            display: "block",
            left: e.x,
            top: e.y,
          },
        }));
      })
      .on("mouseleave", function () {
        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            display: "none",
          },
          primaryText: null,
        }));
        d3.select(this).select("path").attr("stroke", "transparent");
      });
  }, [grouping, reverseTranslation]);

  return (
    <div className="bubbles-wrapper">
      <div
        className="bubbles-input-area"
        onChange={(e) => void setGrouping(e.target.value)}
      >
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

function calcTranslations(configObjScen, configScenObj) {
  const translations = {};

  for (const pKey of Object.keys(configObjScen.pLookup)) {
    const row = {};
    for (const sKey of Object.keys(configScenObj.pLookup)) {
      let { globalX: xStart, globalY: yStart } =
        configObjScen.nodes[configObjScen.pLookup[pKey]].nodes[
          configObjScen.sLookup[sKey]
        ];

      let { globalX: xEnd, globalY: yEnd } =
        configScenObj.nodes[configScenObj.pLookup[sKey]].nodes[
          configScenObj.sLookup[pKey]
        ];

      row[sKey] = [xEnd - xStart, yEnd - yStart];
    }

    translations[pKey] = row;
  }

  return translations;
}

function updateGeom(g, endConfig, reverseTranslations, t) {
  let idx = 0;
  t = 1 - t;

  for (let i = 0; i < endConfig.nodes.length; i++) {
    const nodes = endConfig.nodes[i].nodes;
    const pKey = endConfig.nodes[i].key;

    for (let j = 0; j < nodes.length; j++) {
      const { globalX: endX, globalY: endY, key: sKey } = nodes[j];

      const [dx, dy] = reverseTranslations[pKey][sKey];

      g.vertices[idx].setX(endX + t * dx);
      g.vertices[idx].setY(-(endY + t * dy));

      idx++;
    }
  }
}

function initWaterdropsMesh(configDrops) {
  const dropsGeometry = new MeshGeometry();
  const outlinePoints = [];

  const outlineMeshCoords = waterdropDeltaOutline(0, 1, RAD_PX * 0.975);

  for (let i = 0; i < configDrops.nodes.length; i++) {
    const nodes = configDrops.nodes[i].nodes;

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
  const lineMesh = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(outlinePoints),
    new THREE.LineBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0,
    })
  );

  return {
    dropsMesh,
    lineMesh,
  };
}

function initWaterdropsSimplified(configDrops) {
  const pointsGeometry = new THREE.Geometry();

  for (let i = 0; i < configDrops.nodes.length; i++) {
    const nodes = configDrops.nodes[i].nodes;

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
