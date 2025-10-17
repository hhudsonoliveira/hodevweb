// ============================================================================
// webpack.config.js — Build configuration
// ============================================================================
// Supports both development and production builds with asset optimization.
// ============================================================================

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    // ---------------- Entry / Output ----------------
    entry: path.resolve(__dirname, "script/index.js"),

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "assets/js/[name].[contenthash].js" : "assets/js/[name].js",
      assetModuleFilename: "assets/[hash][ext][query]",
      clean: true, // ensures dist/ is wiped before each build
    },

    // ---------------- Mode / Source maps ----------------
    mode: isProd ? "production" : "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",

    // ---------------- Module rules ----------------
    module: {
      rules: [
        // JavaScript (ES6+)
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },

        // CSS
        {
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },

        // SCSS (future-proof, if added)
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },

        // Images
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/imgs/[name][hash][ext]",
          },
        },

        // Fonts
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][hash][ext]",
          },
        },
      ],
    },

    // ---------------- Plugins ----------------
    plugins: [
      new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "index.html"),
        filename: "index.html",
        inject: "body",
      }),

      new MiniCssExtractPlugin({
        filename: isProd ? "assets/css/[name].[contenthash].css" : "assets/css/[name].css",
      }),
    ],

    // ---------------- Optimization ----------------
    optimization: {
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: "single",
    },

    // ---------------- Dev Server ----------------
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      port: 3000,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
    },
  };
};
