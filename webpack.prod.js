const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const webpack = require("webpack");

const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.md$/,
        use: "raw-loader",
      },
      {
        test: /\.json$/,
        loader: "json-loader",
        type: "javascript/auto",
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "diaryblogadminui",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Counter": "./src/components/Counter",
        "./DiaryBlogSpace": "./src/components/DiaryBlogSpace",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "@fortawesome/free-solid-svg-icons": {
          singleton: true,
          requiredVersion: deps["@fortawesome/free-solid-svg-icons"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
