import * as d3 from "d3";
import * as THREE from "three";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { interpolateWatercolorBlue, ticksExact } from "./bucket-lib/utils";
import {
  DELIV_KEY_STRING,
  MAX_DELIVS,
  SCENARIO_KEY_STRING,
  objectiveIDs,
  objectivesData,
  scenarioIDs,
} from "./data/objectivesData";
import {
  Camera,
  DROPLET_SHAPE,
  MeshGeometry,
  createInterps,
  mapBy,
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
const SCEN_DIVISOR = 1; // debugging purposes, don't render all scenarios to speed things up
const SMALL_DROP_PAD_FACTOR = 1.75;
const LARGE_DROP_PAD_FACTOR = 1.5;
const ANIM_TIME = 1;
const HOVER_AREA_FACTOR = 1.3 / (1 + Math.SQRT1_2);
const FILTERED_KEYS = scenarioIDs.filter((_, i) => i % SCEN_DIVISOR === 0);

// ensures order-consistent traversal
const flattenedData = (function () {
  const _flattenedData = [];
  let idx = 0;
  for (const obj of objectiveIDs) {
    for (const scen of FILTERED_KEYS) {
      _flattenedData.push({
        id: idx,
        objective: obj,
        scenario: scen,
        deliveries:
          objectivesData[obj][SCENARIO_KEY_STRING][scen][DELIV_KEY_STRING],
      });
      idx++;
    }
  }

  return _flattenedData;
})();

export default function LargeDropletV2App() {
  const width = window.innerWidth,
    height = window.innerHeight;

  const { current: scene } = useRef(getScene());

  const waterdrops1 = useRef();
  const waterdrops2 = useRef();

  if (!waterdrops1.current) waterdrops1.current = initWaterdrops("objective");
  if (!waterdrops2.current) waterdrops2.current = initWaterdrops("scenario");

  const [grouping, setGrouping, groupingRef] = useStateRef("objective");
  const [tooltip, setTooltip] = useState({});

  const waterdrops = useRef();

  const clockRef = useRef();

  const dropsMeshRef = useRef(new WaterdropMesh());
  const pointsMeshRef = useRef(new WaterdropSimplifiedMesh());

  const [reverseTranslation, setReverseTranslation, reverseTranslationRef] =
    useStateRef();

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

      waterdrops.current =
        grouping === "objective" ? waterdrops1.current : waterdrops2.current;

      if (prevWaterdrops) {
        setReverseTranslation(
          calcTranslations(waterdrops.current, prevWaterdrops)
        );
        pointsMeshRef.current.draw(scene);
      }

      dropsMeshRef.current.remove(scene);

      clockRef.current = new THREE.Clock();
    },
    [grouping]
  );

  useEffect(
    function onGroupingAnimationEnd() {
      if (reverseTranslationRef.current) return;

      pointsMeshRef.current.createMesh(waterdrops.current);
      dropsMeshRef.current.createMesh(waterdrops.current);

      pointsMeshRef.current.remove(scene);
      dropsMeshRef.current.draw(scene);

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

        if (!dropsMeshRef.current) return;

        dropsMeshRef.current.updateOutlineVisibility(
          d3.scaleLinear().domain([1, 5]).range([0.1, 1]).clamp(true)(
            e.transform.k
          )
        );
      },
    });

    camera.view.on("mousemove", (e) => {
      if (!pointsMeshRef.current) return;

      const { x, y } = mouseToThree(e.x, e.y, width, height);

      const intersectID = pointsMeshRef.current.intersectObject(camera, x, y);

      if (intersectID) {
        const waterdropIntersected = flattenedData.find(
          (n) => n.id === intersectID
        );

        setTooltip((tooltip) => ({
          ...tooltip,
          secondaryText:
            groupingRef.current === "objective"
              ? waterdropIntersected.scenario
              : waterdropIntersected.objective,
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

      const dt = clockRef.current.getDelta();

      if (clockRef.current.getElapsedTime() > ANIM_TIME) {
        setReverseTranslation(null);
        return;
      }

      pointsMeshRef.current.updatePoints(
        waterdrops.current,
        reverseTranslationRef.current,
        dt / ANIM_TIME
      );
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

// TODO optimize!!
function initWaterdrops(grouping) {
  const groupKeys = grouping === "objective" ? objectiveIDs : FILTERED_KEYS;
  const memberKeys = grouping === "objective" ? FILTERED_KEYS : objectiveIDs;

  const amtGroups = groupKeys.length;
  const amtPerGroup = memberKeys.length;

  const largeDropRad = Math.max(
    1,
    Math.sqrt(amtPerGroup / Math.PI) *
      RAD_PX *
      2 *
      SMALL_DROP_PAD_FACTOR *
      LARGE_DROP_PAD_FACTOR
  );
  const smallDropRad = Math.max(2, RAD_PX * SMALL_DROP_PAD_FACTOR);

  const largeNodesPos = mapBy(
    placeDropsUsingPhysics(
      0,
      0,
      groupKeys.map((p) => ({
        r: largeDropRad,
        id: p,
      }))
    ),
    ({ id }) => id
  );

  const smallNodesPhys = placeDropsUsingPhysics(
    0,
    0,
    memberKeys.map((s) => ({
      r: smallDropRad,
      id: s,
    }))
  );

  const smallNodesPos = mapBy(smallNodesPhys, ({ id }) => id);

  const nodes = [];
  const groupNodes = [];
  const nodeIDtoIdx = {};

  let idx = 0;

  for (const node of flattenedData) {
    const { id, objective, scenario, deliveries } = node;

    const i = createInterps(objective, scenario, objectivesData, MAX_DELIVS);
    const wds = ticksExact(0, 1, LEVELS + 1).map((d) => i(d));

    const levs = wds.map(
      (w, i) => Math.max(w, i == 0 ? MIN_LEV_VAL : 0) * RAD_PX
    );

    const groupID = grouping === "objective" ? objective : scenario;
    const memberID = grouping === "objective" ? scenario : objective;

    nodes.push({
      id,
      levs,
      maxLev: RAD_PX,
      domLev: calcDomLev(levs),
      tilt: Math.random() * 50 - 25,
      dur: Math.random() * 100 + 400,
      x: smallNodesPos[memberID].x,
      y: smallNodesPos[memberID].y,
      group: groupID,
      key: memberID,
      globalX: largeNodesPos[groupID].x + smallNodesPos[memberID].x,
      globalY: largeNodesPos[groupID].y + smallNodesPos[memberID].y,
    });

    nodeIDtoIdx[id] = idx++;
  }

  for (const groupKey of groupKeys) {
    groupNodes.push({
      x: largeNodesPos[groupKey].x,
      y: largeNodesPos[groupKey].y,
      tilt: Math.random() * 50 - 25,
      key: groupKey,
      height: smallNodesPhys.height,
    });
  }

  return {
    nodes: nodes,
    nodeIDtoIdx,
    groups: groupNodes,
  };
}

function calcTranslations(waterdropsTo, waterdropsFrom) {
  const translations = {};

  for (const nodeTo of waterdropsTo.nodes) {
    const { id, globalX: endX, globalY: endY } = nodeTo;

    const nodeFromIdx = waterdropsFrom.nodeIDtoIdx[id];
    const nodeFrom = waterdropsFrom.nodes[nodeFromIdx];

    const { globalX: startX, globalY: startY } = nodeFrom;

    translations[id] = [endX - startX, endY - startY];
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
    .data(waterdrops.groups)
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
      ({ x, y, height }) =>
        `translate(${x}, ${y}) scale(${height * HOVER_AREA_FACTOR})`
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

class WaterdropMesh {
  dropsMesh;
  outlineMesh;

  added = false;

  // caching vertex ownership so we can update existing vertices instead of creating new one each time
  idToVertInfo = {};

  createMesh(waterdrops) {
    if (!this.dropsMesh) {
      this.initializeMeshes(waterdrops);
    } else {
      this.updateMeshes(waterdrops);
    }
  }

  draw(scene) {
    if (!this.added) {
      scene.add(this.dropsMesh);
      scene.add(this.outlineMesh);
      this.added = true;
    }
  }

  remove(scene) {
    if (this.added) {
      scene.remove(this.dropsMesh);
      scene.remove(this.outlineMesh);
      this.added = false;
    }
  }

  initializeMeshes(waterdrops) {
    const dropsGeometry = new MeshGeometry();
    const outlinePoints = [];

    const outlineMeshCoords = waterdropDeltaOutline(0, 1, RAD_PX * 0.975);

    let outlineVertexIdx = 0,
      shapeVertexIdx = 0;

    for (let i = 0; i < waterdrops.nodes.length; i++) {
      const { id, globalX: x, globalY: y, levs, maxLev } = waterdrops.nodes[i];

      let outlineVerticesAdded = outlineMeshCoords.length,
        shapeVerticesAdded = 0;

      for (let k = levs.length - 1; k >= 0; k--) {
        const l1 = k !== levs.length - 1 ? levs[k + 1] : 0;
        const l2 = levs[k];

        const meshCoords = waterdropDelta(l1 / maxLev, l2 / maxLev, RAD_PX);
        const color = new THREE.Color(interpolateWatercolorBlue(k / LEVELS));

        dropsGeometry.addMeshCoords(
          meshCoords,
          { x: x, y: -y },
          color,
          (i % 5) / 50 + 0.02
        );

        shapeVerticesAdded += meshCoords.length * 3;
      }

      outlinePoints.push(
        ...outlineMeshCoords.map(
          ([dx, dy]) => new THREE.Vector3(x + dx, -y - dy, (i % 5) / 50 + 0.01)
        )
      );

      this.idToVertInfo[id] = {
        shapeVertRange: [shapeVertexIdx, shapeVerticesAdded],
        outlineVertRange: [outlineVertexIdx, outlineVerticesAdded],
        centroid: [x, y],
      };

      shapeVertexIdx += shapeVerticesAdded;
      outlineVertexIdx += outlineVerticesAdded;
    }

    this.dropsMesh = new THREE.Mesh(
      dropsGeometry.threeGeom,
      new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
      })
    );

    this.outlineMesh = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(outlinePoints),
      new THREE.LineBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0,
      })
    );
  }

  updateOutlineVisibility(opac) {
    if (!this.outlineMesh) return;
    this.outlineMesh.material.opacity = opac;
    this.outlineMesh.material.needsUpdate = true;
  }

  updateMeshes(waterdrops) {
    for (let i = 0; i < waterdrops.nodes.length; i++) {
      const { id, globalX: newX, globalY: newY } = waterdrops.nodes[i];

      const [sviStart, sviLen] = this.idToVertInfo[id].shapeVertRange;
      const [oviStart, oviLen] = this.idToVertInfo[id].outlineVertRange;
      const [oldX, oldY] = this.idToVertInfo[id].centroid;

      const dx = newX - oldX,
        dy = newY - oldY;

      const shapeGeom = this.dropsMesh.geometry;
      const outlineGeom = this.outlineMesh.geometry;

      for (let i = 0; i < sviLen; i++) {
        const x = shapeGeom.vertices[sviStart + i].x,
          y = shapeGeom.vertices[sviStart + i].y;
        shapeGeom.vertices[sviStart + i].setX(x + dx);
        shapeGeom.vertices[sviStart + i].setY(y - dy);
      }

      this.idToVertInfo[id].centroid = [newX, newY];

      // TODO find out how to update pos of points
      // for (let i = 0; i < oviLen; i++) {
      //   const x = outlineGeom.attributes.position.array[(oviStart + i) * 3 + 0],
      //     y = outlineGeom.attributes.position.array[(oviStart + i) * 3 + 1];
      //   outlineGeom.attributes.position.array[(oviStart + i) * 3 + 0] =
      //     x + dt * dx;
      //   outlineGeom.attributes.position.array[(oviStart + i) * 3 + 1] = -(
      //     y +
      //     dt * dy
      //   );
      // }

      shapeGeom.verticesNeedUpdate = true;
      // outlineGeom.verticesNeedUpdate = true;
    }
  }
}

class WaterdropSimplifiedMesh {
  mesh;
  added = false;

  vertToId = {};
  idToVert = {};

  draw(scene) {
    if (!this.added) {
      scene.add(this.mesh);
      this.added = true;
    }
  }

  remove(scene) {
    if (this.added) {
      scene.remove(this.mesh);
      this.added = false;
    }
  }

  createMesh(waterdrops) {
    if (!this.mesh) {
      this.initializeMesh(waterdrops);
    }

    this.updateMesh(waterdrops);

    return this.mesh;
  }

  initializeMesh(waterdrops) {
    const pointsGeometry = new THREE.Geometry();

    for (let i = 0; i < waterdrops.nodes.length; i++) {
      const { id, globalX: x, globalY: y, levs, domLev } = waterdrops.nodes[i];

      const color = domLev > 0 ? interpolateWatercolorBlue(domLev) : "white";

      pointsGeometry.vertices.push(new THREE.Vector3(x, -y, 0));
      pointsGeometry.colors.push(new THREE.Color(color));

      this.vertToId[i] = id;
      this.idToVert[id] = i;
    }

    const pointsMaterial = new THREE.PointsMaterial({
      size: RAD_PX * 2,
      sizeAttenuation: true,
      vertexColors: THREE.VertexColors,
      map: new THREE.TextureLoader().load("drop.png"),
      transparent: true,
    });

    this.mesh = new THREE.Points(pointsGeometry, pointsMaterial);
  }

  updateMesh(waterdrops) {
    for (let i = 0; i < waterdrops.nodes.length; i++) {
      const { id, globalX: newX, globalY: newY } = waterdrops.nodes[i];
      const idx = this.idToVert[id];

      this.mesh.geometry.vertices[idx].setX(newX);
      this.mesh.geometry.vertices[idx].setY(-newY);
    }

    this.mesh.geometry.verticesNeedUpdate = true;
  }

  updatePoints(waterdrops, translations, dt) {
    const verts = this.mesh.geometry.vertices;

    for (let i = 0; i < waterdrops.nodes.length; i++) {
      const { id } = waterdrops.nodes[i];
      const idx = this.idToVert[id];

      const [dx, dy] = translations[id];

      const x = verts[idx].x;
      const y = verts[idx].y;

      verts[idx].setX(x + dt * dx);
      verts[idx].setY(y - dt * dy);
    }

    this.mesh.geometry.verticesNeedUpdate = true;
  }

  intersectObject(camera, x, y) {
    const intersects = camera.intersectObject(x, y, this.mesh);

    if (intersects[0]) {
      const intersect = sortBy(intersects, "distanceToRay")[0];
      return this.vertToId[intersect.index];
    }

    return null;
  }
}
