const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const DotenvWebpackPlugin = require("dotenv-webpack");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = (env, argv) => {
  return {
    context: __dirname,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.[contenthash].js",
      clean: true,
      publicPath: "/",
    },
    devServer: {
      historyApiFallback: true,
      port: 3000,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|j?g|svg|gif)?$/,
          use: "file-loader",
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: "i18next-loader",
              options: {
                configFile: path.resolve(__dirname, "i18n-extract.config.js"),
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
        filename: "index.html",
      }),
      new DotenvWebpackPlugin({
        systemvars: true,
      }),
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5000000,
        cleanupOutdatedCaches: true,
      }),
    ],
  };
};
