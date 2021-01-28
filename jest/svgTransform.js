/**
 * Custom jest transformer for svg files.
 *
 * When we import (require) svg files, this transformer process the file. During unit test rendering we only use
 * DOM and not the visual UI, we only return svg object that tells original path it was loaded from,
 * so we can verify that correct file was loaded.
 *
 * If we would get the original svg it would be hard to determine which svg file we got.
 *
 * By default Jest does not know how to load svg files thus custom transform.
 *
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
module.exports = {
  process(src, filename) {
    return `module.exports = '<svg data-filename="${path.relative(process.cwd(), filename)}" data-unit-test="svg content removed - see svgTransform.js for more info"/>'`;
  },
};
