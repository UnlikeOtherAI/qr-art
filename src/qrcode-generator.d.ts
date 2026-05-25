declare module "qrcode-generator" {
  import type { ErrorCorrectionLevel } from "./types";

  export interface QRCodeGenerator {
    addData(data: string): void;
    getModuleCount(): number;
    isDark(row: number, col: number): boolean;
    make(): void;
  }

  export default function qrcode(
    typeNumber: number,
    errorCorrectionLevel: ErrorCorrectionLevel,
  ): QRCodeGenerator;
}
