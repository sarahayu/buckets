import * as d3 from "d3";
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
  createInterps,
  criteriaSort,
  percentToRatioFilled,
  placeDropsUsingPhysics,
} from "./utils";
import { useNavigate } from "react-router-dom";

const LEVELS = 3;
const RAD_PX = 3;
const MIN_LEV_VAL = 0.1;
const SCEN_DIVISOR = 20;
const LARGE_DROPLET_PAD_FACTOR = 1.5;
const PX_BIAS = 1;

export default function LargeDropletMosaicApp({ watercolor = false }) {
  const { current: objectiveIDs } = useRef(Object.keys(objectivesData));
  const navigate = useNavigate();
  const winDim = useRef();
  const [normalize, setNormalize] = useState(false);

  const orderedObjToScens = useMemo(() => {
    const unorderedObjToScens = {};
    const mapSorted = {};

    // don't process all scenes, too many small drops causes lag
    objectiveIDs.forEach(
      (obj) =>
        (unorderedObjToScens[obj] = criteriaSort("median", objectivesData, obj)
          .filter((_, i) => i % SCEN_DIVISOR == 0)
          .reverse())
    );

    const mid = Math.floor(unorderedObjToScens[objectiveIDs[0]].length / 2);
    const sortedObjs = objectiveIDs.sort((a, b) => {
      return (
        d3.median(
          objectivesData[a][SCENARIO_KEY_STRING][unorderedObjToScens[a][mid]][
            DELIV_KEY_STRING
          ]
        ) -
        d3.median(
          objectivesData[b][SCENARIO_KEY_STRING][unorderedObjToScens[b][mid]][
            DELIV_KEY_STRING
          ]
        )
      );
    });

    sortedObjs.forEach(
      (obj) => void (mapSorted[obj] = unorderedObjToScens[obj])
    );
    return mapSorted;
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

  const canvasRef = useRef();
  const contextRef = useRef();
  const docRef = useRef();

  useEffect(() => {
    winDim.current = {
      width: 1536,
      height: 703,
    };

    const width = winDim.current.width,
      height = winDim.current.height;

    canvasRef.current = d3
      .select("#mosaic-area")
      .append("canvas")
      .attr("id", "canvas")
      .attr("width", width)
      .attr("height", height);
    contextRef.current = canvasRef.current.node().getContext("2d");

    canvasRef.current = canvasRef.current.node();

    docRef.current = d3.select(document.createElement("custom"));
  }, []);

  useEffect(() => {
    const context = contextRef.current;

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
              (normalize ? 1 : Math.max(levs[0], MIN_LEV_VAL)) *
                scale *
                RAD_PX *
                LARGE_DROPLET_PAD_FACTOR
            ),
            id: idx,
          }))
        );

        const nodes = nodesPos.map(({ id: idx, x, y }) => ({
          levs: objToWaterLevels[obj][idx].map(
            (w, i) =>
              Math.max(w, i == 0 ? MIN_LEV_VAL : 0) *
              scale *
              (normalize
                ? 1 / Math.max(objToWaterLevels[obj][idx][0], MIN_LEV_VAL)
                : 1) *
              RAD_PX
          ),
          maxLev:
            (normalize
              ? 1
              : Math.max(objToWaterLevels[obj][idx][0], MIN_LEV_VAL) * scale) *
            RAD_PX,
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
          Math.sqrt(d3.sum(largeDrop.map((d) => d.maxLev)) / Math.PI) * 8
        )),
        id: idx,
      }))
    ).map(({ x, y }, i) => ({
      x,
      y,
      tilt: Math.random() * 50 - 25,
      r: largeNodesRads[i],
    }));

    const zoomInfo = {
      centerX: width / 2,
      lastCenterX: width / 2,
      centerY: height / 2,
      lastCenterY: height / 2,
      scale: 1,
      lastScale: 1,
    };

    function drawCanvas() {
      context.setTransform(1, 0, 0, 1, 0, 0);

      context.translate(zoomInfo.centerX, zoomInfo.centerY);
      context.scale(zoomInfo.scale, zoomInfo.scale);
      context.translate(-width / 2, -height / 2);

      context.clearRect(-width, -height, width * 3, height * 3);

      zoomInfo.lastScale = zoomInfo.scale;
      zoomInfo.lastCenterX = zoomInfo.centerX;
      zoomInfo.lastCenterY = zoomInfo.centerY;

      nodesArr.forEach(function (smallDrops, i) {
        const largeDrop = largeNodesPos[i];

        context.save();
        context.translate(largeDrop.x + width / 2, largeDrop.y + height / 2);
        context.rotate((largeDrop.tilt * Math.PI) / 180);

        smallDrops.forEach(function ({ levs, maxLev, startX, startY, tilt }) {
          context.save();
          context.translate(startX, startY);
          context.rotate((tilt * Math.PI) / 180);
          context.scale(maxLev, maxLev);

          context.beginPath();
          WATERDROP_ICON.draw(context, 2);
          context.clip();

          levs.forEach((l, i) => {
            context.fillStyle = interpolateWatercolorBlue(i / LEVELS);
            context.beginPath();
            context.rect(
              -1,
              Math.SQRT1_2 -
                percentToRatioFilled(l / maxLev) * (1 + Math.SQRT1_2) +
                (l === 0 ? PX_BIAS / maxLev : 0),
              2,
              2
            );
            context.fill();
            context.closePath();
          });

          context.restore();
        });

        context.restore();
      });
    }

    let ease = d3.easeCubicInOut,
      duration = 1,
      timeElapsed = 0,
      interpolator = null,
      vOld = [width / 2, height / 2, width];

    function zoomToCanvas() {
      const v = [width / 2, height / 2, width / 4];

      interpolator = d3.interpolateZoom(vOld, v);

      duration = Math.max(1000, Math.min(3000, interpolator.duration));
      timeElapsed = 0;
      vOld = v;
    }

    function interpolateZoom(dt) {
      if (interpolator) {
        timeElapsed += dt;
        const t = ease(timeElapsed / duration);

        zoomInfo.centerX = interpolator(t)[0];
        zoomInfo.centerY = interpolator(t)[1];
        zoomInfo.scale = width / interpolator(t)[2];

        if (timeElapsed >= duration) {
          interpolator = null;
        }
      }
    }

    // zoomToCanvas();

    let dt = 0;
    const t = d3.timer(function (elapsed) {
      interpolateZoom(elapsed - dt);
      dt = elapsed;
      drawCanvas();
    });

    const MAX_ZOOM = 5;
    const MIN_ZOOM = 0.1;
    const SCROLL_SENSITIVITY = 0.001;
    const canvas = canvasRef.current;

    // Gets the relevant location from a mouse or single touch event
    function getEventLocation(e) {
      if (e.touches && e.touches.length == 1) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY };
      }
    }

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    function onPointerDown(e) {
      isDragging = true;
      dragStart.x = getEventLocation(e).x - zoomInfo.centerX;
      dragStart.y = getEventLocation(e).y - zoomInfo.centerY;
    }

    function onPointerUp(e) {
      isDragging = false;
      initialPinchDistance = null;
      zoomInfo.lastScale = zoomInfo.scale;
    }

    function onPointerMove(e) {
      if (isDragging) {
        zoomInfo.centerX = getEventLocation(e).x - dragStart.x;
        zoomInfo.centerY = getEventLocation(e).y - dragStart.y;
      }
    }

    function handleTouch(e, singleTouchHandler) {
      if (e.touches.length == 1) {
        singleTouchHandler(e);
      } else if (e.type == "touchmove" && e.touches.length == 2) {
        isDragging = false;
        handlePinch(e);
      }
    }

    let initialPinchDistance = null;

    function handlePinch(e) {
      e.preventDefault();

      let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

      let currentDistance =
        (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

      if (initialPinchDistance == null) {
        initialPinchDistance = currentDistance;
      } else {
        adjustZoom(null, currentDistance / initialPinchDistance);
      }
    }

    function adjustZoom(zoomAmount, zoomFactor) {
      if (!isDragging) {
        if (zoomAmount) {
          zoomInfo.scale += zoomAmount;
        } else if (zoomFactor) {
          console.log(zoomFactor);
          zoomInfo.scale = zoomFactor * zoomInfo.lastScale;
        }

        zoomInfo.scale = Math.min(zoomInfo.scale, MAX_ZOOM);
        zoomInfo.scale = Math.max(zoomInfo.scale, MIN_ZOOM);
      }
    }

    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("touchstart", (e) => handleTouch(e, onPointerDown));
    canvas.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("touchend", (e) => handleTouch(e, onPointerUp));
    canvas.addEventListener("mousemove", onPointerMove);
    canvas.addEventListener("touchmove", (e) => handleTouch(e, onPointerMove));
    canvas.addEventListener("wheel", (e) =>
      adjustZoom(e.deltaY * SCROLL_SENSITIVITY)
    );

    return function stopTimer() {
      t.stop();
    };
  }, [normalize]);

  return (
    <div className="bubbles-wrapper">
      <div className="bubbles-input-area">
        <input
          type="checkbox"
          id="norm"
          checked={normalize}
          onChange={() => void setNormalize((e) => !e)}
        />
        <label htmlFor="norm">normalize</label>
      </div>
      <div id="mosaic-area"></div>
    </div>
  );
}
