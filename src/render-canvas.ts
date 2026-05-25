import { encodeMatrix } from "./encode-matrix";
import { fillRoundedRect } from "./fill-rounded-rect";
import { loadLogoImage } from "./load-logo-image";
import { traceModulePath } from "./canvas-module-path";
import { resolveModuleCorners } from "./module-corners";
import { resolveModuleColor } from "./module-color";
import { resolveOptions } from "./resolve-options";
import type {
  QRCanvasContext,
  QRCanvasTarget,
  QRCodeOptions,
  QRMatrix,
  ResolvedQRCodeOptions,
  ResolvedQRLogoOptions,
} from "./types";

export async function renderCanvas(
  target: QRCanvasTarget,
  content: string,
  options: QRCodeOptions = {},
): Promise<void> {
  const resolvedOptions = resolveOptions(options);
  const matrix = encodeMatrix(content, resolvedOptions.errorCorrectionLevel);

  await renderMatrixToCanvas(target, matrix, resolvedOptions);
}

export async function renderMatrixToCanvas(
  target: QRCanvasTarget,
  matrix: QRMatrix,
  options: ResolvedQRCodeOptions,
): Promise<void> {
  target.width = options.size;
  target.height = options.size;

  const context = target.getContext("2d");

  if (!context) {
    throw new Error("Could not create a 2D canvas context.");
  }

  context.clearRect(0, 0, options.size, options.size);

  if (options.backgroundColor !== "transparent") {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, options.size, options.size);
  }

  drawModules(context, matrix, options);
  await drawLogo(context, options.size, options.logo);
}

function drawModules(
  context: QRCanvasContext,
  matrix: QRMatrix,
  options: ResolvedQRCodeOptions,
): void {
  const totalModules = matrix.moduleCount + options.margin * 2;
  const moduleSize = options.size / totalModules;
  const offset = moduleSize * options.margin;

  for (let row = 0; row < matrix.moduleCount; row += 1) {
    for (let col = 0; col < matrix.moduleCount; col += 1) {
      if (!matrix.isDark(row, col)) {
        continue;
      }

      const x = offset + col * moduleSize;
      const y = offset + row * moduleSize;
      const normalizedX = matrix.moduleCount === 1 ? 0 : col / (matrix.moduleCount - 1);
      const normalizedY = matrix.moduleCount === 1 ? 0 : row / (matrix.moduleCount - 1);

      context.fillStyle = resolveModuleColor(
        {
          col,
          color: options.color,
          isFinder: matrix.isFinder(row, col),
          normalizedX,
          normalizedY,
          row,
          size: moduleSize,
          x,
          y,
        },
        options,
      );

      if (options.shape === "dot") {
        context.beginPath();
        context.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2, 0, Math.PI * 2);
        context.fill();
      } else if (options.cornerRadius > 0) {
        traceModulePath(
          context,
          x,
          y,
          moduleSize,
          moduleSize * options.cornerRadius,
          resolveModuleCorners(matrix, row, col),
        );
        context.fill();
      } else {
        context.fillRect(x, y, moduleSize, moduleSize);
      }
    }
  }
}

async function drawLogo(
  context: QRCanvasContext,
  size: number,
  logo: ResolvedQRLogoOptions | undefined,
): Promise<void> {
  if (!logo) {
    return;
  }

  const imageSize = size * logo.sizeRatio;
  const frameSize = imageSize + logo.padding * 2;
  const frameX = (size - frameSize) / 2;
  const frameY = (size - frameSize) / 2;
  const imageX = (size - imageSize) / 2;
  const imageY = (size - imageSize) / 2;
  const radius = Math.min(logo.borderRadius, frameSize / 2);

  if (logo.backgroundColor !== "transparent") {
    context.fillStyle = logo.backgroundColor;
    fillRoundedRect(context, frameX, frameY, frameSize, frameSize, radius);
  }

  const image = await loadLogoImage(logo);

  if (image) {
    context.drawImage(image, imageX, imageY, imageSize, imageSize);
  }
}
