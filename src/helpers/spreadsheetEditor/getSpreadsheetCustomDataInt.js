/**
 * @ignore
 * Get a custom data property from an annotation and parse it as an integer.
 * @param {Core.Annotations.Annotation} annotation
 * @param {string} key
 * @returns {number} - The parsed integer value, or 0 if not found
 */
const getSpreadsheetCustomDataInt = (annotation, key) => Number.parseInt(annotation.getCustomData(key), 10) || 0;

export default getSpreadsheetCustomDataInt;
