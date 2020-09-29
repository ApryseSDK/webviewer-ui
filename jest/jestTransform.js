const config = {
  babelrc: false,
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
  ],
};

module.exports = require("babel-jest").createTransformer(config);
