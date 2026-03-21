/**
 * Converts annotation coordinates to viewer coordinates because PDFNet uses PDF coordinates
 * @param {*} doc The PDF document
 * @param {number} pageNum The page number
 * @param {{x: number, y: number}} coordinates The coordinates to convert
 * @returns {{x: number, y: number}} Viewer coordinates
 * @ignore
 */
export const getCurrentDestViewerCoord = (doc, pageNum, { x, y }) => {
  return doc.getViewerCoordinates(pageNum, x, y);
};

/**
 * Normalizes outline coordinates based on page rotation. For 90 and 270 degree rotations, x and y coordinates are swapped
 * @param {{x: number, y: number}} coordinates The coordinates to normalize
 * @param {number} pageRotation The rotation of the page the coordinates are on
 * @returns {{x: number, y: number}} Normalized coordinates based on page rotation
 * @ignore
 */
export const normalizeOutlineCoord = ({ x, y }, pageRotation) => {
  if (pageRotation === window.Core.PageRotation.E_90 || pageRotation === window.Core.PageRotation.E_270) {
    return { x: y, y: x };
  }
  return { x, y };
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