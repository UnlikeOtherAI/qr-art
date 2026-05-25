import { describe, expect, it } from "vitest";

import { resolveModuleCorners } from "../src/module-corners";
import type { QRMatrix } from "../src/types";

describe("resolveModuleCorners", () => {
  it("rounds every corner for an isolated dark module", () => {
    const matrix = createMatrix([[true]]);

    expect(resolveModuleCorners(matrix, 0, 0)).toEqual({
      bottomLeft: true,
      bottomRight: true,
      topLeft: true,
      topRight: true,
    });
  });

  it("does not round corners on a shared horizontal edge", () => {
    const matrix = createMatrix([[true, true]]);

    expect(resolveModuleCorners(matrix, 0, 0)).toEqual({
      bottomLeft: true,
      bottomRight: false,
      topLeft: true,
      topRight: false,
    });
    expect(resolveModuleCorners(matrix, 0, 1)).toEqual({
      bottomLeft: false,
      bottomRight: true,
      topLeft: false,
      topRight: true,
    });
  });

  it("does not round corners on a shared vertical edge", () => {
    const matrix = createMatrix([[true], [true]]);

    expect(resolveModuleCorners(matrix, 0, 0)).toEqual({
      bottomLeft: false,
      bottomRight: false,
      topLeft: true,
      topRight: true,
    });
    expect(resolveModuleCorners(matrix, 1, 0)).toEqual({
      bottomLeft: true,
      bottomRight: true,
      topLeft: false,
      topRight: false,
    });
  });
});

function createMatrix(cells: readonly (readonly boolean[])[]): QRMatrix {
  return {
    cells,
    moduleCount: cells.length,
    isDark(row, col) {
      return cells[row]?.[col] === true;
    },
    isFinder() {
      return false;
    },
  };
}
