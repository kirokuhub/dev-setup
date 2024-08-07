const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const { resolveApp } = require("./utils");

const envMode = process.env.envMode;

module.exports = merge(baseConfig, {
  mode: "development",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "./js/[name].[chunkhash].js",
    publicPath: "/",
  },
  devServer: {
    hot: true,
    open: false,
    port: 8080,
    host: "localhost",
    historyApiFallback: {
      index: "/index.html",
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          },
        ],
        include: resolveApp("src"),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      title: "TS-Vue-Webpack " + envMode + " Template",
      inject: "body",
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
});
