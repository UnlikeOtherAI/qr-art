# QR TypeScript Library Brief

## Goal

Build a TypeScript QR code library that can generate styled QR codes from browser code and backend Node.js code.

## Core Requirements

- Generate QR codes from a text input or URL.
- Let callers set the final image size in pixels.
- Let callers set the base QR color.
- Let callers apply a color mask, including a rainbow preset.
- Let callers provide a custom mask function for per-module color control.
- Let callers place a logo in the middle of the QR code.
- Let callers set the logo size, padding, background color, and border radius.
- Let callers round square QR modules on exposed outer corners while keeping shared internal joins filled.
- Let callers choose square modules or dot modules.
- Work in frontend environments.
- Work in backend environments, at minimum through SVG string generation.

## Public API Shape

```ts
import { createStyledQRCode, renderCanvas, renderSVG } from "@unlikeother/qr-art";

const svg = renderSVG("https://example.com", {
  size: 512,
  color: "#111827",
  backgroundColor: "#ffffff",
  shape: "square",
  cornerRadius: 0.35,
  mask: {
    preset: "rainbow",
    direction: "diagonal",
  },
  logo: {
    src: "/logo.svg",
    sizeRatio: 0.22,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 16,
  },
});

const qr = createStyledQRCode("hello", { shape: "dot" });
document.body.innerHTML = qr.toSvg();

await renderCanvas(canvas, "hello", { size: 320 });
```

## Implementation Notes

- Use a proven QR encoder for the matrix generation.
- Keep styling in this package: SVG renderer, Canvas renderer, masks, logo placement, rounded modules, and dot rendering.
- Default to high error correction when a logo is configured.
- Keep files focused and under 500 lines.
- Provide a root `example.html` that imports the built browser bundle from `dist/index.js`.
