const { liveServer } = require("rollup-plugin-live-server");
const resolve = require("@rollup/plugin-node-resolve");
const babel = require("rollup-plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");

module.exports = {
  input: "./main.js",
  output: {
    file: "./dist/bundle.js",
    format: "es",
    name: "bundle",
    sourceMap: "inline",
  },
  plugins: [
    commonjs({
      include: "../../node_modules/**",
    }),
    resolve(),
    babel({
      exclude: "node_modules/**",
    }),
    liveServer({
      port: 8001,
      host: "0.0.0.0",
      file: "index.html",
      mount: [
        ["/dist", "./dist"],
        ["/src", "./src"],
        ["/node_modules", "../../node_modules"],
      ],
      open: true,
      wait: 500,
    }),
  ],
};
