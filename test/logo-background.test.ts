import { describe, expect, it } from "vitest";

import { parseHexColor, shouldMakePixelTransparent } from "../src/logo-background";

describe("parseHexColor", () => {
  it("parses six-character hex colors", () => {
    expect(parseHexColor("#f8fafc")).toEqual({
      blue: 252,
      green: 250,
      red: 248,
    });
  });

  it("parses shorthand hex colors", () => {
    expect(parseHexColor("#fff")).toEqual({
      blue: 255,
      green: 255,
      red: 255,
    });
  });
});

describe("shouldMakePixelTransparent", () => {
  it("matches near-white pixels within tolerance", () => {
    expect(
      shouldMakePixelTransparent(250, 250, 250, { blue: 255, green: 255, red: 255 }, 12),
    ).toBe(true);
  });

  it("keeps darker logo pixels opaque", () => {
    expect(
      shouldMakePixelTransparent(10, 80, 70, { blue: 255, green: 255, red: 255 }, 48),
    ).toBe(false);
  });
});
