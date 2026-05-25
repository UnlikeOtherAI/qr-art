import { describe, expect, it } from "vitest";

import { moduleTouchesLogoFrame, resolveLogoFrame } from "../src/logo-frame";
import { renderSvgFromMatrix } from "../src/render-svg";
import { resolveOptions } from "../src/resolve-options";
import type { QRMatrix } from "../src/types";

describe("moduleTouchesLogoFrame", () => {
  it("matches modules that touch the logo frame", () => {
    const frame = resolveLogoFrame(100, {
      alt: "Logo",
      backgroundColor: "#ffffff",
      borderRadius: 0,
      crossOrigin: "anonymous",
      image: undefined,
      padding: 0,
      sizeRatio: 0.2,
      src: "logo.svg",
    });

    expect(moduleTouchesLogoFrame(20, 40, 20, frame)).toBe(true);
    expect(moduleTouchesLogoFrame(0, 0, 20, frame)).toBe(false);
  });

  it("omits modules that touch a centered logo frame", () => {
    const svg = renderSvgFromMatrix(createMatrix(5), resolveOptions({
      logo: {
        backgroundColor: "transparent",
        borderRadius: 0,
        padding: 0,
        sizeRatio: 0.2,
        src: "logo.svg",
      },
      margin: 0,
      size: 100,
    }));

    expect(svg.match(/fill="#111827"/g)).toHaveLength(16);
  });
});

function createMatrix(moduleCount: number): QRMatrix {
  const cells = Array.from({ length: moduleCount }, () =>
    Array.from({ length: moduleCount }, () => true),
  );

  return {
    cells,
    moduleCount,
    isDark(row, col) {
      return cells[row]?.[col] === true;
    },
    isFinder() {
      return false;
    },
  };
}
