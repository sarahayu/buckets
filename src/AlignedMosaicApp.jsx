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
  radsToDropWidth,
  waterdrop,
  waterdropDelta,
} from "./utils";
import { useNavigate } from "react-router-dom";

function toRadians(a) {
  return (a * Math.PI) / 180;
}

const LEVELS = 5;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 1;
const LARGE_DROPLET_PAD_FACTOR = 0.1;
const PX_BIAS = 1;

export default function LargeDropletMosaicApp() {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const navigate = useNavigate();
  const winDim = useRef();
  const [tooltip, setTooltip] = useState({
    style: {
      display: "none",
      position: "absolute",
      "pointer-events": "none",
    },
    text: "hello",
  });

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
    const scale = 1,
      r = Math.max(2, scale * RAD_PX * LARGE_DROPLET_PAD_FACTOR);
    const largeNodesDropSize = {};

    const nodesArr = Object.keys(objToWaterLevels).map((obj, i1) => {
      const smallNodes = objToWaterLevels[obj].map((_, idx) => ({
        r,
        id: idx,
      }));
      const nodesPos = placeDropsUsingPhysics(0, 0, smallNodes, true);

      largeNodesDropSize[i1] = radsToDropWidth(smallNodes.map(({ r }) => r));

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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animate);
    document.querySelector("#mosaic-area").appendChild(renderer.domElement);
    const view = d3.select(renderer.domElement);
    const raycaster = new THREE.Raycaster();

    function mouseToThree(mouseX, mouseY) {
      return new THREE.Vector3(
        (mouseX / width) * 2 - 1,
        -(mouseY / height) * 2 + 1,
        1
      );
    }

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

        for (let l = levs.length - 1; l >= 0; l--) {
          const ll1 = l !== levs.length - 1 ? levs[l + 1] : 0;
          const ll2 = levs[l];

          const coords = waterdropDelta(ll1 / maxLev, ll2 / maxLev, RAD_PX);

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

    let largePointsGeometry = new THREE.Geometry();

    const idxToDrop = [];

    idx = 0;
    for (let i = 0; i < nodesArr.length; i++) {
      let x = largeNodesPos[i].x;
      let y = largeNodesPos[i].y;

      const coords = waterdrop(
        1,
        (largeNodesDropSize[i] * Math.SQRT2) / Math.SQRT1_2 // TODO why does this work
      );

      for (let k = 0; k < coords.length; k++) {
        const [v1, v2, v3] = coords[k];

        let a = new THREE.Vector3(x + v1[0], -y - v1[1], 0);
        let b = new THREE.Vector3(x + v2[0], -y - v2[1], 0);
        let c = new THREE.Vector3(x + v3[0], -y - v3[1], 0);
        largePointsGeometry.vertices.push(a, b, c);

        let face = new THREE.Face3(idx * 3 + 0, idx * 3 + 1, idx * 3 + 2);
        face.vertexColors.push(0x00ff00);
        face.vertexColors.push(0x00ff00);
        face.vertexColors.push(0x00ff00);
        largePointsGeometry.faces.push(face);

        idxToDrop.push(i);
        idx++;
      }
    }

    let mat = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      depthTest: false,
    });

    let mat2 = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      depthTest: false,
      transparent: true,
      opacity: 0,
    });
    const points = new THREE.Mesh(pointsGeometry, mat);
    const largePoints = new THREE.Mesh(largePointsGeometry, mat2);
    const hoverContainer = new THREE.Object3D();

    scene.add(points);
    scene.add(largePoints);
    scene.add(hoverContainer);

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

    function sortBy(array, fn) {
      fn = pick(fn);
      return array.sort((a, b) => {
        const va = fn(a);
        const vb = fn(b);
        if (va < vb) return -1;
        if (va > vb) return 1;
        return 0;
      });
    }

    function sortIntersectsByDistanceToRay(intersects) {
      return sortBy(intersects, "distanceToRay");
    }

    function checkIntersects(mouse_position) {
      let mouse_vector = mouseToThree(...mouse_position);
      raycaster.setFromCamera(mouse_vector, camera);
      let intersects = raycaster.intersectObject(largePoints);
      if (intersects[0]) {
        let sorted_intersects = sortIntersectsByDistanceToRay(intersects);
        let intersect = sorted_intersects[0];
        let index = intersect.faceIndex;
        let datum = idxToDrop[index];

        highlightPoint(datum);

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
        removeHighlights();

        setTooltip((tooltip) => ({
          ...tooltip,
          style: {
            ...tooltip.style,
            display: "none",
          },
        }));
      }
    }

    view.on("mousemove", (e) => {
      const mouseX = e.x,
        mouseY = e.y;
      let mouse_position = [mouseX, mouseY];
      checkIntersects(mouse_position);
    });
    view.on("mouseleave", () => {
      removeHighlights();
    });

    let lastDatum = -1;

    function highlightPoint(datum) {
      if (lastDatum === datum) return;

      removeHighlights();
      lastDatum = datum;

      // const xx = largeNodesPos[datum].x,
      //   yy = -largeNodesPos[datum].y,
      //   rad = largeNodesPos[datum].r;

      // const pointsGeometry = new THREE.Geometry();
      // const coords = waterdrop(1, rad);

      // const col = new THREE.Color(0xff0000);

      // let idx = 0;
      // for (let k = 0; k < coords.length; k++) {
      //   const [v1, v2, v3] = coords[k];

      //   let a = new THREE.Vector3(xx + v1[0], yy - v1[1], 0);
      //   let b = new THREE.Vector3(xx + v2[0], yy - v2[1], 0);
      //   let c = new THREE.Vector3(xx + v3[0], yy - v3[1], 0);
      //   pointsGeometry.vertices.push(a, b, c);

      //   let face = new THREE.Face3(idx * 3 + 0, idx * 3 + 1, idx * 3 + 2);
      //   face.vertexColors.push(col);
      //   face.vertexColors.push(col);
      //   face.vertexColors.push(col);
      //   pointsGeometry.faces.push(face);
      //   idx++;
      // }

      // let mat = new THREE.MeshBasicMaterial({
      //   vertexColors: THREE.VertexColors,
      //   depthTest: false,
      // });
      // const point = new THREE.Mesh(pointsGeometry, mat);
      // hoverContainer.add(point);
    }

    function removeHighlights() {
      hoverContainer.remove(...hoverContainer.children);
      lastDatum = -1;
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
