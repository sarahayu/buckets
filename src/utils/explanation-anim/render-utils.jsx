import * as d3 from "d3";

const CIRC_RAD = Math.SQRT1_2;
const DROP_RAD = 1;
const CIRC_HEIGHT = CIRC_RAD + CIRC_RAD;
const DROP_HEIGHT = DROP_RAD + CIRC_RAD;
const HAT_START = (CIRC_RAD + DROP_RAD / 2) / DROP_HEIGHT;

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

export function waterdropDeltaOutline(yStart, yEnd, size = 2, subdivs = 10) {
  if (Math.abs(yStart - yEnd) < 0.01) return [];

  const rad = (size / 2 / DROP_RAD) * CIRC_RAD;

  const Y_DELTA = 1 / subdivs;

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

export function showElems(elemStr, container, displayVal) {
  (container || d3).selectAll(elemStr).style("display", displayVal || "block");
}

export function hideElems(elemStr, container) {
  (container || d3).selectAll(elemStr).style("display", "none");
}

export function removeElems(elemStr, container) {
  (container || d3).selectAll(elemStr).remove();
}
