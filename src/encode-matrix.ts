import qrcode from "qrcode-generator";

import { isFinderModule } from "./is-finder-module";
import type { ErrorCorrectionLevel, QRMatrix } from "./types";

export function encodeMatrix(content: string, errorCorrectionLevel: ErrorCorrectionLevel): QRMatrix {
  const qr = qrcode(0, errorCorrectionLevel);

  qr.addData(content);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const cells = Array.from({ length: moduleCount }, (_, row) =>
    Array.from({ length: moduleCount }, (_, col) => qr.isDark(row, col)),
  );

  return {
    cells,
    moduleCount,
    isDark(row, col) {
      return cells[row]?.[col] === true;
    },
    isFinder(row, col) {
      return isFinderModule(row, col, moduleCount);
    },
  };
}
