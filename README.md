# QR Art

Styled QR code generation for browsers and Node.js.

```ts
import { renderSVG } from "@unlikeother/qr-art";

const svg = renderSVG("https://example.com", {
  size: 512,
  shape: "square",
  cornerRadius: 0.3,
  mask: { preset: "rainbow" },
  logo: {
    src: "/logo.svg",
    sizeRatio: 0.22,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 16,
  },
});
```

## Scripts

- `pnpm build` creates ESM, CommonJS, and type declarations.
- `pnpm test` runs unit tests.
- `pnpm lint` runs strict linting.
- `pnpm dev` serves `example.html`.
