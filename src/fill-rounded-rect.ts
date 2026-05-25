import type { QRCanvasContext } from "./types";

export function fillRoundedRect(
  context: QRCanvasContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const resolvedRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + resolvedRadius, y);
  context.lineTo(x + width - resolvedRadius, y);
  context.arcTo(x + width, y, x + width, y + resolvedRadius, resolvedRadius);
  context.lineTo(x + width, y + height - resolvedRadius);
  context.arcTo(x + width, y + height, x + width - resolvedRadius, y + height, resolvedRadius);
  context.lineTo(x + resolvedRadius, y + height);
  context.arcTo(x, y + height, x, y + height - resolvedRadius, resolvedRadius);
  context.lineTo(x, y + resolvedRadius);
  context.arcTo(x, y, x + resolvedRadius, y, resolvedRadius);
  context.closePath();
  context.fill();
}
