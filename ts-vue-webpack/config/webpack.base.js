const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader/dist/index");
const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");
const copyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const envMode = process.env.envMode;

require("dotenv").config({ path: `./env/.env` });
require("dotenv").config({ path: `./env/.env.${envMode}` });

const { resolveApp } = require("./utils");

const prefixRE = /^VUE_APP_/;
let env = {};
for (const key in process.env) {
  if (key == "NODE_ENV" || key == "BASE_URL" || prefixRE.test(key)) {
    env[key] = JSON.stringify(process.env[key]);
  }
}

const getTerserPluginArgs = function () {
  if (process.env.NODE_ENV === "production") {
    return {
      parallel: true,
      extractComments: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    };
  }

  return {
    parallel: true,
  };
};

module.exports = {
  entry: path.resolve(__dirname, "../src/main.ts"),
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset",
        generator: {
          filename: "assets/images/[hash][ext][query]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash:8].[name][ext]",
        },
      },
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        include: resolveApp("src"),
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        ...env,
      },
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new VueLoaderPlugin(),
    ComponentsPlugin({
      resolvers: [VantResolver()],
    }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: resolveApp("public"),
          to: resolveApp("dist"),
          globOptions: {
            dot: true,
            gitignore: false,
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`😊 The Chunks have been built!!!`],
      },
      clearConsole: true,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.analyMode == "true" ? "server" : "disabled",
      generateStatsFile: false,
      statsOptions: { source: false },
    }),
  ],
  stats: "errors-only",
  resolve: {
    alias: {
      "@": resolveApp("src"),
      "@images": resolveApp("src/assets/images"),
    },
    extensions: [".ts", ".tsx", ".js", ".vue", ".mjs"],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin(getTerserPluginArgs()),
    ],
  },
};
