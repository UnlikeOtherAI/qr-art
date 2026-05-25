import { clamp } from "./clamp";
import type { QRModuleContext, QRMaskOptions, ResolvedQRCodeOptions } from "./types";

const RAINBOW_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
] as const;

export function resolveModuleColor(
  context: QRModuleContext,
  options: ResolvedQRCodeOptions,
): string {
  if (typeof options.mask === "function") {
    return options.mask(context);
  }

  if (options.mask?.preset === "rainbow") {
    return resolveRainbowColor(context, options.mask);
  }

  return options.color;
}

function resolveRainbowColor(context: QRModuleContext, mask: QRMaskOptions): string {
  const colors = mask.colors?.length ? mask.colors : RAINBOW_COLORS;
  const progress = resolveProgress(context, mask.direction ?? "diagonal");
  const colorIndex = Math.min(colors.length - 1, Math.floor(progress * colors.length));

  return colors[colorIndex] ?? RAINBOW_COLORS[0];
}

function resolveProgress(context: QRModuleContext, direction: QRMaskOptions["direction"]): number {
  switch (direction) {
    case "horizontal":
      return clamp(context.normalizedX, 0, 1);
    case "vertical":
      return clamp(context.normalizedY, 0, 1);
    case "radial": {
      const x = context.normalizedX - 0.5;
      const y = context.normalizedY - 0.5;

      return clamp(Math.sqrt(x * x + y * y) / Math.SQRT1_2, 0, 1);
    }
    case "diagonal":
    default:
      return clamp((context.normalizedX + context.normalizedY) / 2, 0, 1);
  }
}
