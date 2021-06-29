const path = require("path");

module.exports = {
  entry: ["babel-polyfill", "./server/server.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "server.js",
  },
  node: {
    __dirname: false,
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "postcss-loader"],
      },
      {
        test: /\.jsx?$/,
        use: ["babel-loader", "astroturf/loader"],
      },
    ],
  },
};
