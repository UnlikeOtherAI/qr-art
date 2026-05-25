import { describe, expect, it } from "vitest";

import { createStyledQRCode, encodeMatrix, renderSVG } from "../src";

describe("renderSVG", () => {
  it("renders a sized SVG QR code", () => {
    const svg = renderSVG("https://example.com", {
      color: "#1f2937",
      size: 256,
    });

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg" width="256"');
    expect(svg).toContain('fill="#1f2937"');
  });

  it("renders dot modules", () => {
    const svg = renderSVG("dots", {
      shape: "dot",
      size: 160,
    });

    expect(svg).toContain("<circle");
    expect(svg).not.toContain("<rect x=");
  });

  it("renders rounded square modules", () => {
    const svg = renderSVG("rounded", {
      cornerRadius: 0.4,
      shape: "square",
      size: 160,
    });

    expect(svg).toContain("<path");
  });

  it("uses mask functions for module colors", () => {
    const svg = renderSVG("mask", {
      mask: () => "#ff00aa",
    });

    expect(svg).toContain('fill="#ff00aa"');
  });

  it("renders a centered logo in SVG output", () => {
    const svg = renderSVG("logo", {
      logo: {
        src: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E",
      },
    });

    expect(svg).toContain("<image");
    expect(svg).toContain("clip-path=");
  });

  it("renders overlay logos without a logo background fill", () => {
    const svg = renderSVG("overlay", {
      logo: {
        overlay: true,
        src: "logo.png",
      },
    });

    expect(svg).not.toContain('rx="12" fill="#ffffff"');
    expect(svg).toContain("<image");
  });
});

describe("createStyledQRCode", () => {
  it("returns a reusable QR object", () => {
    const qr = createStyledQRCode("object-api", {
      mask: { preset: "rainbow", direction: "horizontal" },
    });

    expect(qr.matrix.moduleCount).toBeGreaterThan(0);
    expect(qr.toSvg()).toContain("<svg");
  });
});

describe("encodeMatrix", () => {
  it("marks finder modules", () => {
    const matrix = encodeMatrix("finder", "M");

    expect(matrix.isDark(0, 0)).toBe(true);
    expect(matrix.isFinder(0, 0)).toBe(true);
    expect(matrix.isFinder(matrix.moduleCount - 1, matrix.moduleCount - 1)).toBe(false);
  });
});
