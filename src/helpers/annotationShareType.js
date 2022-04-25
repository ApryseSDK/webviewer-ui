// CUSTOM WISEflow

import ShareTypes from 'src/constants/shareTypes';

/**
 * Get share type using custom data type "shareType"
 * @param {Annotation} annot annotation to add share type to
 * @return {string} share type [ASSESSORS, PARTICIPANTS, ALL, NONE]. Defaults to ShareTypes.NONE.
 */
const getAnnotationShareType = annot => annot.getCustomData('shareType') || ShareTypes.NONE;

/**
 * Get share type using custom data type "shareType"
 * @param {Annotation} annot
 * @param {string} shareType [ASSESSORS, PARTICIPANTS, ALL, NONE]
 *
 * @returns {Annotation} annot with share type set
 */
const setAnnotationShareType = (annot, shareType) => {
  annot.setCustomData('shareType', shareType);
  return annot;
};

export { getAnnotationShareType, setAnnotationShareType };
