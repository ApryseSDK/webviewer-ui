import core from 'core';

/**
 * @param {Annotation} annotation
 * @returns {string} The author of the annotation
 */
function getAnnotationAuthor(annotation) {
  return core.getDisplayAuthor(annotation['Author']);
}

export default getAnnotationAuthor;