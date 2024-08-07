const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { resolveApp } = require("./utils");

const envMode = process.env.envMode;

module.exports = merge(baseConfig, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "./js/[name].[chunkhash].js",
    clean: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                [
                  "@babel/preset-typescript",
                  {
                    allExtensions: true,
                  },
                ],
              ],
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
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "assets/styles/[contenthash].css",
    }),
  ],
});
