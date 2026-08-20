import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("site", { force: true, recursive: true });
await mkdir("site", { recursive: true });
await cp("dist", "site/dist", { recursive: true });

const [html, bundle] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("dist/index.js"),
]);
const bundleVersion = createHash("sha256").update(bundle).digest("hex").slice(0, 12);
await writeFile("site/index.html", html.replace("__BUILD_VERSION__", bundleVersion));
