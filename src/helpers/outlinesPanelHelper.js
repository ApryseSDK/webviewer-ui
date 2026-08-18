import outlineUtils from 'helpers/OutlineUtils';

/**
 * Resolves an outline's expanded state, allowing an explicit user choice to override the panel default.
 * @param {Object} outlineState The persisted UI state for an outline
 * @param {boolean} shouldAutoExpandOutlines Whether outlines should be expanded by default
 * @returns {boolean} Whether the outline is expanded
 * @ignore
 */
export const isOutlineExpanded = (outlineState, shouldAutoExpandOutlines = false) => {
  return outlineState?.isExpanded ?? shouldAutoExpandOutlines;
};

/**
 * Flattens the currently visible portion of an outline tree for rendering in a single virtualized list.
 * @param {Array} outlines The root outlines
 * @param {Object} outlinesStateMap The outline UI state keyed by outline path
 * @param {boolean} shouldAutoExpandOutlines Whether all outline branches should be expanded
 * @returns {Array<{outline: Object, nestingLevel: number}>} The visible outlines in tree order
 * @ignore
 */
export const getVisibleOutlines = (outlines, outlinesStateMap = {}, shouldAutoExpandOutlines = false) => {
  if (!Array.isArray(outlines)) {
    return [];
  }

  const visibleOutlines = [];
  const pendingOutlines = outlines.map((outline) => ({ outline, nestingLevel: 0 })).reverse();

  while (pendingOutlines.length) {
    const visibleOutline = pendingOutlines.pop();
    const { outline, nestingLevel } = visibleOutline;
    visibleOutlines.push(visibleOutline);

    const outlinePath = outlineUtils.getPath(outline);
    const isExpanded = isOutlineExpanded(outlinesStateMap[outlinePath], shouldAutoExpandOutlines);
    if (isExpanded) {
      const children = outline.getChildren();
      if (Array.isArray(children)) {
        for (let childIndex = children.length - 1; childIndex >= 0; childIndex--) {
          pendingOutlines.push({ outline: children[childIndex], nestingLevel: nestingLevel + 1 });
        }
      }
    }
  }

  return visibleOutlines;
};

/**
 * Gets the page width and height. If the page is rotated 90 or 270 degrees, the width and height are swapped.
 * @param {*} doc The document (Core.Document)
 * @param {*} pageNum The page number (1-indexed)
 * @returns {{width: number, height: number}} The width and height of the page
 * @ignore
 */
export const getPageWidthAndHeight = (doc, pageNum) => {
  if (!doc?.getPageRotation) {
    return { width: 0, height: 0 };
  }
  const pageRotation = doc.getPageRotation(pageNum) / 90;
  const pageInfo = doc.getPageInfo(pageNum);
  const shouldSwapWidthAndHeight = pageRotation === window.Core.PageRotation.E_90 || pageRotation === window.Core.PageRotation.E_270;
  const width = shouldSwapWidthAndHeight ? pageInfo.height : pageInfo.width;
  const height = shouldSwapWidthAndHeight ? pageInfo.width : pageInfo.height;
  return { width, height };
};

/**
 * Gets the default destination coordinates. The default destination is the top-left of the
 * page's current rotation, which may be different from the top-left of the unrotated page (0,0).
 * @param {*} doc The document (Core.Document)
 * @param {number} pageNum The page number (1-indexed)
 * @returns {{x: number, y: number}} The default destination coordinates (origin at top-left of unrotated page)
 * @ignore
 */
export const getDefaultDestCoord = (doc, pageNum) => {
  if (!doc?.getPageRotation) {
    return { x: 0, y: 0 };
  }
  const pageRotation = doc.getPageRotation(pageNum) / 90;
  const { width, height } = getPageWidthAndHeight(doc, pageNum);
  if (pageRotation === 0) { // default: top-left of unrotated page
    return { x: 0, y: 0 };
  } else if (pageRotation === window.Core.PageRotation.E_90) { // default: bottom-left of unrotated page
    return { x: 0, y: height };
  } else if (pageRotation === window.Core.PageRotation.E_180) { // default: bottom-right of unrotated page
    return { x: width, y: height };
  } else if (pageRotation === window.Core.PageRotation.E_270) { // default: top-right of unrotated page
    return { x: width, y: 0 };
  }
  return { x: 0, y: 0 };
};

/**
 * Converts unrotated viewer coordinates (Y-down from the unrotated top-left) to PDF user space
 * coordinates (origin at unrotated bottom-left, Y-up) for use with PDFNet.Destination.createXYZ.
 *
 * The worker applies the inverse of this conversion when reading back destinations, so the
 * round-trip preserves the original displayed coordinates:
 *   original coords → convertToPDFDestCoord → createXYZ → worker reads back → original coords
 *
 * @param {*} doc The document (Core.Document)
 * @param {number} pageNum The page number (1-indexed)
 * @param {{x: number, y: number}} coordinates The unrotated viewer coordinates to convert, in viewer page coordinates (origin at unrotated top-left, Y-down)
 * @returns {{x: number, y: number}} PDF user space coordinates suitable for PDFNet.Destination.createXYZ(page, x, y, zoom)
 * @ignore
 */
export const convertToPDFDestCoord = (doc, pageNum, { x, y }) => {
  const { height } = getPageWidthAndHeight(doc, pageNum);
  return { x: x, y: height - y };
};

/**
 *  Returns the provided name or a default name
 * @param {Object} params
 * @param {string} params.name The provided name for the outline, will be converted to string if it is not already a string
 * @param {string} params.currentDestText The text of the current destination
 * @param {string} params.defaultDestText The default destination text to compare against
 * @param {string} params.areaDestinationText The area selection destination text to compare against
 * @param {string} params.defaultName The default name to use if no valid name is provided and current destination is default or area
 * @returns {string} The name to use for the outline
 * @ignore
 */
export const getOutlineName = ({
  name,
  currentDestText,
  defaultDestText,
  areaDestinationText,
  defaultName,
}) => {
  let outlineName = String(name);
  if (![defaultDestText, areaDestinationText].includes(currentDestText) && !name) {
    outlineName = currentDestText.slice(0, 40);
  } else if (!name) {
    outlineName = defaultName;
  }
  return outlineName;
};
