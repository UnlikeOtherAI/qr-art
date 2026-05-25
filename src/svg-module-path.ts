import { formatNumber } from "./format-number";
import type { ModuleCorners } from "./module-corners";

export function svgModulePath(
  x: number,
  y: number,
  size: number,
  radius: number,
  corners: ModuleCorners,
): string {
  const r = Math.min(radius, size / 2);
  const right = x + size;
  const bottom = y + size;

  return [
    `M ${formatNumber(x + (corners.topLeft ? r : 0))} ${formatNumber(y)}`,
    `L ${formatNumber(right - (corners.topRight ? r : 0))} ${formatNumber(y)}`,
    corners.topRight
      ? `Q ${formatNumber(right)} ${formatNumber(y)} ${formatNumber(right)} ${formatNumber(y + r)}`
      : `L ${formatNumber(right)} ${formatNumber(y)}`,
    `L ${formatNumber(right)} ${formatNumber(bottom - (corners.bottomRight ? r : 0))}`,
    corners.bottomRight
      ? `Q ${formatNumber(right)} ${formatNumber(bottom)} ${formatNumber(right - r)} ${formatNumber(bottom)}`
      : `L ${formatNumber(right)} ${formatNumber(bottom)}`,
    `L ${formatNumber(x + (corners.bottomLeft ? r : 0))} ${formatNumber(bottom)}`,
    corners.bottomLeft
      ? `Q ${formatNumber(x)} ${formatNumber(bottom)} ${formatNumber(x)} ${formatNumber(bottom - r)}`
      : `L ${formatNumber(x)} ${formatNumber(bottom)}`,
    `L ${formatNumber(x)} ${formatNumber(y + (corners.topLeft ? r : 0))}`,
    corners.topLeft
      ? `Q ${formatNumber(x)} ${formatNumber(y)} ${formatNumber(x + r)} ${formatNumber(y)}`
      : `L ${formatNumber(x)} ${formatNumber(y)}`,
    "Z",
  ].join(" ");
}
