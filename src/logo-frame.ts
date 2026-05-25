import type { ResolvedQRLogoOptions } from "./types";

export interface LogoFrame {
  readonly bottom: number;
  readonly frameSize: number;
  readonly imageSize: number;
  readonly imageX: number;
  readonly imageY: number;
  readonly right: number;
  readonly x: number;
  readonly y: number;
}

export function resolveLogoFrame(
  size: number,
  logo: ResolvedQRLogoOptions | undefined,
): LogoFrame | undefined {
  if (!logo) {
    return undefined;
  }

  const imageSize = size * logo.sizeRatio;
  const frameSize = imageSize + logo.padding * 2;
  const x = (size - frameSize) / 2;
  const y = (size - frameSize) / 2;

  return {
    bottom: y + frameSize,
    frameSize,
    imageSize,
    imageX: (size - imageSize) / 2,
    imageY: (size - imageSize) / 2,
    right: x + frameSize,
    x,
    y,
  };
}

export function moduleTouchesLogoFrame(
  x: number,
  y: number,
  size: number,
  frame: LogoFrame | undefined,
): boolean {
  if (!frame) {
    return false;
  }

  return x <= frame.right && x + size >= frame.x && y <= frame.bottom && y + size >= frame.y;
}
