// webpack.config.js

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssImport = require("postcss-import");
const postcssApply = require("postcss-apply");

module.exports = {
  // Other Webpack config options...

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [
                postcssImport(),
                postcssApply()
              ]
            }
          }
        ]
      }
    ]
  }
};