import typescript from "@rollup/plugin-typescript";
import { uglify } from "rollup-plugin-uglify";
import postcss from "rollup-plugin-postcss";

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

export default {
  input: "./src/index.ts",
  output: {
    file: "./build/index.min.js",
    format: "es",
  },
  plugins: [
    postcss({ modules: true }),
    typescript(),
    isProd && uglify(),
  ].filter(Boolean),
};
