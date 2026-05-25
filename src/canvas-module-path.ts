import type { ModuleCorners } from "./module-corners";
import type { QRCanvasContext } from "./types";

export function traceModulePath(
  context: QRCanvasContext,
  x: number,
  y: number,
  size: number,
  radius: number,
  corners: ModuleCorners,
): void {
  const r = Math.min(radius, size / 2);
  const right = x + size;
  const bottom = y + size;

  context.beginPath();
  context.moveTo(x + (corners.topLeft ? r : 0), y);
  context.lineTo(right - (corners.topRight ? r : 0), y);

  if (corners.topRight) {
    context.quadraticCurveTo(right, y, right, y + r);
  } else {
    context.lineTo(right, y);
  }

  context.lineTo(right, bottom - (corners.bottomRight ? r : 0));

  if (corners.bottomRight) {
    context.quadraticCurveTo(right, bottom, right - r, bottom);
  } else {
    context.lineTo(right, bottom);
  }

  context.lineTo(x + (corners.bottomLeft ? r : 0), bottom);

  if (corners.bottomLeft) {
    context.quadraticCurveTo(x, bottom, x, bottom - r);
  } else {
    context.lineTo(x, bottom);
  }

  context.lineTo(x, y + (corners.topLeft ? r : 0));

  if (corners.topLeft) {
    context.quadraticCurveTo(x, y, x + r, y);
  } else {
    context.lineTo(x, y);
  }

  context.closePath();
}
