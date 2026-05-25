export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type QRModuleShape = "square" | "dot";

export type QRMaskDirection = "horizontal" | "vertical" | "diagonal" | "radial";

export type QRMaskPreset = "rainbow";

export interface QRMaskOptions {
  readonly preset: QRMaskPreset;
  readonly colors?: readonly string[];
  readonly direction?: QRMaskDirection;
}

export interface QRModuleContext {
  readonly col: number;
  readonly row: number;
  readonly isFinder: boolean;
  readonly size: number;
  readonly x: number;
  readonly y: number;
  readonly normalizedX: number;
  readonly normalizedY: number;
  readonly color: string;
}

export type QRModuleColorResolver = (module: QRModuleContext) => string;

export type QRMask = QRMaskOptions | QRModuleColorResolver;

export interface QRLogoOptions {
  readonly alt?: string;
  readonly backgroundColor?: string;
  readonly borderRadius?: number;
  readonly crossOrigin?: "" | "anonymous" | "use-credentials";
  readonly image?: CanvasImageSource;
  readonly overlay?: boolean;
  readonly padding?: number;
  readonly sizeRatio?: number;
  readonly src?: string;
}

export interface QRCodeOptions {
  readonly backgroundColor?: string;
  readonly color?: string;
  readonly cornerRadius?: number;
  readonly errorCorrectionLevel?: ErrorCorrectionLevel;
  readonly logo?: QRLogoOptions;
  readonly margin?: number;
  readonly mask?: QRMask;
  readonly shape?: QRModuleShape;
  readonly size?: number;
}

export interface QRMatrix {
  readonly cells: readonly (readonly boolean[])[];
  readonly moduleCount: number;
  isDark(row: number, col: number): boolean;
  isFinder(row: number, col: number): boolean;
}

export type QRCanvasContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface QRCanvasTarget {
  height: number;
  width: number;
  getContext(contextId: "2d"): QRCanvasContext | null;
}

export interface StyledQRCode {
  readonly matrix: QRMatrix;
  drawToCanvas(target: QRCanvasTarget): Promise<void>;
  toSvg(): string;
}

export interface ResolvedQRLogoOptions {
  readonly alt: string;
  readonly backgroundColor: string;
  readonly borderRadius: number;
  readonly crossOrigin: "" | "anonymous" | "use-credentials";
  readonly image: CanvasImageSource | undefined;
  readonly padding: number;
  readonly sizeRatio: number;
  readonly src: string | undefined;
}

export interface ResolvedQRCodeOptions {
  readonly backgroundColor: string;
  readonly color: string;
  readonly cornerRadius: number;
  readonly errorCorrectionLevel: ErrorCorrectionLevel;
  readonly logo: ResolvedQRLogoOptions | undefined;
  readonly margin: number;
  readonly mask: QRMask | undefined;
  readonly shape: QRModuleShape;
  readonly size: number;
}
