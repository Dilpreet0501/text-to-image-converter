import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {defineConfig} from "rollup";

export default defineConfig({
  input: 'src/server.ts',
  output: {
    dir:"dist",
    format: "es",
    name:"text-to-image-converter",

  },
  external: ['express', 'fs-extra', 'path', 'dotenv'],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    json(),
  ],
});

