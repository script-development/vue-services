import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
    },
    external: ["vue", "vuex", "vue-router", "axios"],
    plugins: [nodeResolve()],
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/index.js",
      format: "cjs",
      // name: "SerVue",
    },
    external: ["vue", "vuex", "vue-router", "axios"],
    plugins: [nodeResolve()],
  },
];
