import { encodeMatrix } from "./encode-matrix";
import { renderMatrixToCanvas } from "./render-canvas";
import { renderSvgFromMatrix } from "./render-svg";
import { resolveOptions } from "./resolve-options";
import type { QRCanvasTarget, QRCodeOptions, StyledQRCode } from "./types";

export function createStyledQRCode(content: string, options: QRCodeOptions = {}): StyledQRCode {
  const resolvedOptions = resolveOptions(options);
  const matrix = encodeMatrix(content, resolvedOptions.errorCorrectionLevel);

  return {
    matrix,
    drawToCanvas(target: QRCanvasTarget) {
      return renderMatrixToCanvas(target, matrix, resolvedOptions);
    },
    toSvg() {
      return renderSvgFromMatrix(matrix, resolvedOptions);
    },
  };
}
