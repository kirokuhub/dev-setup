import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import { checker } from "vite-plugin-checker";
import postcssPresetEnv from "postcss-preset-env";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import postcssPxToViewport8Plugin from "postcss-px-to-viewport-8-plugin";
import postcssStylePxToViewportPlugin from "./src/plugins/postcss-style-px-to-viewport-plugin";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv(),
        postcssPxToViewport8Plugin({
          unitToConvert: "px",
          viewportWidth: 375,
          unitPrecision: 5,
          propList: ["*"],
          viewportUnit: "vw",
          fontViewportUnit: "vw",
          selectorBlackList: [".ignore", ".hairlines", ".ig-"],
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
          include: undefined,
          exclude: [/node_modules/],
          landscape: false,
          landscapeUnit: "vw",
          landscapeWidth: 568,
        }),
      ],
    },
  },
  plugins: [
    postcssStylePxToViewportPlugin({
      unitToConvert: "px",
      viewportWidth: 375,
      unitPrecision: 5,
      viewportUnit: "vw",
      fontViewportUnit: "vw",
      minPixelValue: 1,
    }),
    vue(),
    legacy(),
    checker({
      typescript: true,
      vueTsc: true,
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ["vue", "pinia", "vue-router"],
    }),
    Components({
      dts: "src/components.d.ts",
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2015",
  },
  envDir: "./env",
});
