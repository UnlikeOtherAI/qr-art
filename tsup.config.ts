import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  noExternal: ["qrcode-generator"],
  sourcemap: true,
  target: "es2022",
});
