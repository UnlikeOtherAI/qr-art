import type { QRMatrix } from "./types";

export interface ModuleCorners {
  readonly bottomLeft: boolean;
  readonly bottomRight: boolean;
  readonly topLeft: boolean;
  readonly topRight: boolean;
}

export function resolveModuleCorners(matrix: QRMatrix, row: number, col: number): ModuleCorners {
  const top = matrix.isDark(row - 1, col);
  const right = matrix.isDark(row, col + 1);
  const bottom = matrix.isDark(row + 1, col);
  const left = matrix.isDark(row, col - 1);

  return {
    bottomLeft: !bottom && !left,
    bottomRight: !bottom && !right,
    topLeft: !top && !left,
    topRight: !top && !right,
  };
}
