const config = {
  babelrc: false,
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", {
      runtime: "automatic",
      importSource: "@emotion/react",
    }],
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    "@emotion/babel-plugin",
  ],
};

module.exports = require("babel-jest").createTransformer(config);
