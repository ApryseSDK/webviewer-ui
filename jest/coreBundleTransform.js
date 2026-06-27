// Jest transformer used only for the Vite-built `webviewer-core.min.js`.
//
// 1. Targets Node 20 (CI baseline) so preset-env keeps the bundle's native classes
//    intact. The default browserslist would downlevel them to ES5 and break
//    the mixin chain at runtime ("Cannot call a class as a function").
//
// 2. Strips `import.meta.url` (used by Vite's `__vitePreload`), which Jest's
//    CommonJS VM rejects as a SyntaxError. `import.meta.url` becomes "" and
//    bare `import.meta` becomes `{ url: "", env: {} }`. Tests don't use
//    these values, so inert placeholders are safe.
const replaceImportMeta = ({ types: t }) => ({
  name: "replace-import-meta",
  visitor: {
    MemberExpression(path) {
      const { node } = path;
      if (
        node.object?.type === "MetaProperty" &&
        node.object.meta?.name === "import" &&
        node.object.property?.name === "meta" &&
        !node.computed &&
        node.property?.name === "url"
      ) {
        path.replaceWith(t.stringLiteral(""));
      }
    },
    MetaProperty(path) {
      const { node } = path;
      if (node.meta?.name === "import" && node.property?.name === "meta") {
        path.replaceWith(t.objectExpression([
          t.objectProperty(t.identifier("url"), t.stringLiteral("")),
          t.objectProperty(t.identifier("env"), t.objectExpression([])),
        ]));
      }
    },
  },
});

module.exports = require("babel-jest").createTransformer({
  babelrc: false,
  presets: [["@babel/preset-env", { targets: { node: "20" } }]],
  plugins: [replaceImportMeta],
});
