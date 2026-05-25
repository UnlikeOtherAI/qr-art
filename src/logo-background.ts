import { clamp } from "./clamp";

export interface LogoBackgroundTransparencyOptions {
  readonly color?: string;
  readonly crossOrigin?: "" | "anonymous" | "use-credentials";
  readonly quality?: number;
  readonly tolerance?: number;
  readonly type?: "image/png" | "image/webp";
}

export interface RgbColor {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
}

const DEFAULT_TRANSPARENT_COLOR = "#ffffff";
const DEFAULT_TOLERANCE = 48;

export async function makeLogoBackgroundTransparent(
  source: Blob | string,
  options: LogoBackgroundTransparencyOptions = {},
): Promise<string> {
  if (typeof document === "undefined" || typeof Image === "undefined") {
    throw new Error("Logo background transparency requires a browser-like DOM environment.");
  }

  const imageUrl = typeof source === "string" ? source : URL.createObjectURL(source);

  try {
    const image = await loadImage(
      imageUrl,
      typeof source === "string" ? options.crossOrigin : undefined,
    );
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create a 2D canvas context.");
    }

    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const transparentColor = parseHexColor(options.color ?? DEFAULT_TRANSPARENT_COLOR);
    const tolerance = clamp(options.tolerance ?? DEFAULT_TOLERANCE, 0, 442);

    applyTransparentColor(imageData.data, transparentColor, tolerance);
    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL(options.type ?? "image/png", options.quality);
  } finally {
    if (typeof source !== "string") {
      URL.revokeObjectURL(imageUrl);
    }
  }
}

export function parseHexColor(value: string): RgbColor {
  const normalized = value.trim().replace(/^#/, "");

  if (/^[\da-f]{3}$/i.test(normalized)) {
    return {
      blue: parseInt(`${normalized[2]}${normalized[2]}`, 16),
      green: parseInt(`${normalized[1]}${normalized[1]}`, 16),
      red: parseInt(`${normalized[0]}${normalized[0]}`, 16),
    };
  }

  if (/^[\da-f]{6}$/i.test(normalized)) {
    return {
      blue: parseInt(normalized.slice(4, 6), 16),
      green: parseInt(normalized.slice(2, 4), 16),
      red: parseInt(normalized.slice(0, 2), 16),
    };
  }

  throw new Error("Logo transparency color must be a hex color.");
}

export function shouldMakePixelTransparent(
  red: number,
  green: number,
  blue: number,
  transparentColor: RgbColor,
  tolerance: number,
): boolean {
  const redDiff = red - transparentColor.red;
  const greenDiff = green - transparentColor.green;
  const blueDiff = blue - transparentColor.blue;

  return Math.sqrt(redDiff * redDiff + greenDiff * greenDiff + blueDiff * blueDiff) <= tolerance;
}

function applyTransparentColor(
  data: Uint8ClampedArray,
  transparentColor: RgbColor,
  tolerance: number,
): void {
  for (let index = 0; index < data.length; index += 4) {
    if (shouldMakePixelTransparent(
      data[index] ?? 0,
      data[index + 1] ?? 0,
      data[index + 2] ?? 0,
      transparentColor,
      tolerance,
    )) {
      data[index + 3] = 0;
    }
  }
}

async function loadImage(
  src: string,
  crossOrigin: "" | "anonymous" | "use-credentials" | undefined,
): Promise<HTMLImageElement> {
  const image = new Image();

  if (crossOrigin !== undefined) {
    image.crossOrigin = crossOrigin;
  }

  image.src = src;
  await image.decode();

  return image;
}
