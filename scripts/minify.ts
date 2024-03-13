import * as esbuild from "https://deno.land/x/esbuild@v0.20.1/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";

const result = await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["./src/0.jsx", "./src/UI.jsx", "./src/main.js"],
  outdir: "./dist",
  bundle: true,
  platform: "node",
  format: "iife",
  loader: {
    ".js": "jsx",
  },
  jsx: "preserve",
  minify: true,
  target: ["ES6"],
});

// await result.watch();
// console.log("watching...");
console.log(result.outputFiles);
esbuild.stop();
