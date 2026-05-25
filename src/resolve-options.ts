import { clamp } from "./clamp";
import type { QRCodeOptions, ResolvedQRCodeOptions, ResolvedQRLogoOptions } from "./types";

const DEFAULT_COLOR = "#111827";
const DEFAULT_BACKGROUND = "#ffffff";
const DEFAULT_SIZE = 320;
const DEFAULT_MARGIN = 4;
const DEFAULT_CORNER_RADIUS = 0;
const DEFAULT_LOGO_SIZE_RATIO = 0.22;
const DEFAULT_LOGO_PADDING = 8;
const DEFAULT_LOGO_BORDER_RADIUS = 12;

export function resolveOptions(options: QRCodeOptions = {}): ResolvedQRCodeOptions {
  const logo = resolveLogo(options.logo);

  return {
    backgroundColor: options.backgroundColor ?? DEFAULT_BACKGROUND,
    color: options.color ?? DEFAULT_COLOR,
    cornerRadius: clampFinite(options.cornerRadius, DEFAULT_CORNER_RADIUS, 0, 0.5),
    errorCorrectionLevel: options.errorCorrectionLevel ?? (logo ? "H" : "M"),
    logo,
    margin: clampFinite(options.margin, DEFAULT_MARGIN, 0, 20),
    mask: options.mask,
    shape: options.shape ?? "square",
    size: Math.round(clampFinite(options.size, DEFAULT_SIZE, 64, 4096)),
  };
}

function resolveLogo(logo: QRCodeOptions["logo"]): ResolvedQRLogoOptions | undefined {
  if (!logo) {
    return undefined;
  }

  return {
    alt: logo.alt ?? "Logo",
    backgroundColor: logo.backgroundColor ?? (logo.overlay ? "transparent" : DEFAULT_BACKGROUND),
    borderRadius: clampFinite(logo.borderRadius, DEFAULT_LOGO_BORDER_RADIUS, 0, 512),
    crossOrigin: logo.crossOrigin ?? "anonymous",
    image: logo.image,
    padding: clampFinite(logo.padding, DEFAULT_LOGO_PADDING, 0, 128),
    sizeRatio: clampFinite(logo.sizeRatio, DEFAULT_LOGO_SIZE_RATIO, 0.05, 0.45),
    src: logo.src,
  };
}

function clampFinite(
  value: number | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return clamp(value, min, max);
}
