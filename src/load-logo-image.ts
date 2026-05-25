import type { ResolvedQRLogoOptions } from "./types";

export async function loadLogoImage(
  logo: ResolvedQRLogoOptions,
): Promise<CanvasImageSource | undefined> {
  if (logo.image) {
    return logo.image;
  }

  if (!logo.src || typeof Image === "undefined") {
    return undefined;
  }

  const image = new Image();
  image.alt = logo.alt;
  image.crossOrigin = logo.crossOrigin;
  image.src = logo.src;

  await image.decode();

  return image;
}
