import { encodeMatrix } from "./encode-matrix";
import { escapeXml } from "./escape-xml";
import { formatNumber } from "./format-number";
import { hashString } from "./hash-string";
import { resolveModuleCorners } from "./module-corners";
import { resolveModuleColor } from "./module-color";
import { resolveOptions } from "./resolve-options";
import { svgModulePath } from "./svg-module-path";
import type { QRCodeOptions, QRMatrix, ResolvedQRCodeOptions, ResolvedQRLogoOptions } from "./types";

export function renderSVG(content: string, options: QRCodeOptions = {}): string {
  const resolvedOptions = resolveOptions(options);
  const matrix = encodeMatrix(content, resolvedOptions.errorCorrectionLevel);

  return renderSvgFromMatrix(matrix, resolvedOptions);
}

export function renderSvgFromMatrix(
  matrix: QRMatrix,
  options: ResolvedQRCodeOptions,
): string {
  const totalModules = matrix.moduleCount + options.margin * 2;
  const moduleSize = options.size / totalModules;
  const offset = moduleSize * options.margin;
  const children: string[] = [];

  if (options.backgroundColor !== "transparent") {
    children.push(
      `<rect width="100%" height="100%" fill="${escapeXml(options.backgroundColor)}"/>`,
    );
  }

  for (let row = 0; row < matrix.moduleCount; row += 1) {
    for (let col = 0; col < matrix.moduleCount; col += 1) {
      if (!matrix.isDark(row, col)) {
        continue;
      }

      children.push(renderModule(matrix, options, row, col, moduleSize, offset));
    }
  }

  children.push(renderLogo(options.size, options.logo));

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${options.size}" height="${options.size}" viewBox="0 0 ${options.size} ${options.size}" role="img" aria-label="QR code">`,
    ...children,
    "</svg>",
  ].join("");
}

function renderModule(
  matrix: QRMatrix,
  options: ResolvedQRCodeOptions,
  row: number,
  col: number,
  moduleSize: number,
  offset: number,
): string {
  const x = offset + col * moduleSize;
  const y = offset + row * moduleSize;
  const normalizedX = matrix.moduleCount === 1 ? 0 : col / (matrix.moduleCount - 1);
  const normalizedY = matrix.moduleCount === 1 ? 0 : row / (matrix.moduleCount - 1);
  const color = resolveModuleColor(
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
    const radius = moduleSize / 2;

    return `<circle cx="${formatNumber(x + radius)}" cy="${formatNumber(y + radius)}" r="${formatNumber(radius)}" fill="${escapeXml(color)}"/>`;
  }

  const cornerRadius = moduleSize * options.cornerRadius;

  if (cornerRadius <= 0) {
    return `<rect x="${formatNumber(x)}" y="${formatNumber(y)}" width="${formatNumber(moduleSize)}" height="${formatNumber(moduleSize)}" fill="${escapeXml(color)}"/>`;
  }

  const corners = resolveModuleCorners(matrix, row, col);

  return `<path d="${svgModulePath(x, y, moduleSize, cornerRadius, corners)}" fill="${escapeXml(color)}"/>`;
}

function renderLogo(size: number, logo: ResolvedQRLogoOptions | undefined): string {
  if (!logo?.src) {
    return "";
  }

  const imageSize = size * logo.sizeRatio;
  const frameSize = imageSize + logo.padding * 2;
  const frameX = (size - frameSize) / 2;
  const frameY = (size - frameSize) / 2;
  const imageX = (size - imageSize) / 2;
  const imageY = (size - imageSize) / 2;
  const radius = Math.min(logo.borderRadius, frameSize / 2);
  const clipId = `qr-logo-${hashString(logo.src)}`;
  const pieces: string[] = [];

  if (logo.backgroundColor !== "transparent") {
    pieces.push(
      `<rect x="${formatNumber(frameX)}" y="${formatNumber(frameY)}" width="${formatNumber(frameSize)}" height="${formatNumber(frameSize)}" rx="${formatNumber(radius)}" fill="${escapeXml(logo.backgroundColor)}"/>`,
    );
  }

  if (radius > 0) {
    pieces.push(
      `<defs><clipPath id="${clipId}"><rect x="${formatNumber(imageX)}" y="${formatNumber(imageY)}" width="${formatNumber(imageSize)}" height="${formatNumber(imageSize)}" rx="${formatNumber(Math.max(radius - logo.padding, 0))}"/></clipPath></defs>`,
    );
  }

  pieces.push(
    `<image href="${escapeXml(logo.src)}" x="${formatNumber(imageX)}" y="${formatNumber(imageY)}" width="${formatNumber(imageSize)}" height="${formatNumber(imageSize)}" preserveAspectRatio="xMidYMid meet"${radius > 0 ? ` clip-path="url(#${clipId})"` : ""}/>`,
  );

  return pieces.join("");
}
