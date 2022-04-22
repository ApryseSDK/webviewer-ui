// CUSTOM WISEflow

/**
 * Get share type using custom data type "sharetype"
 * @param {Annotation} annot annotation to add share type to
 * @return {string} share type [ASSESSORS, PARTICIPANTS, ALL, NONE]. If none is set, returns empty string.
 */
const getAnnotationShareType = annot => annot.getCustomData('sharetype');

/**
 * Get share type using custom data type "sharetype"
 * @param {Annotation} annot
 * @param {string} shareType [ASSESSORS, PARTICIPANTS, ALL, NONE]
 * 
 * @returns {Annotation} annot with share type set
 */
const setAnnotationShareType = (annot, shareType) => {
  annot.setCustomData('sharetype', shareType);
  return annot;
}

export { getAnnotationShareType, setAnnotationShareType };
