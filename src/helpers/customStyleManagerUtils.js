/**
 * Reads the internal custom-style mirror from an annotation.
 * @param {object} annotation Annotation instance.
 * @param {string} key Custom-data key.
 * @returns {string} Stored custom-style key.
 * @ignore
 */
export const getCustomData = (annotation, key) => annotation.getCustomData?.(key) || '';

/**
 * Writes the internal custom-style mirror on an annotation.
 * @param {object} annotation Annotation instance.
 * @param {string} key Custom-data key.
 * @param {string} value Custom-style key.
 * @ignore
 */
export const setCustomData = (annotation, key, value = '') => {
  if (!annotation.setCustomData || getCustomData(annotation, key) === value) {
    return;
  }

  annotation.setCustomData(key, value, true);
};

/**
 * Synchronizes a selected custom style with its annotation mirror.
 * @param {object} annotation Annotation instance.
 * @param {object} registry Style registry.
 * @param {string} scope Registry scope.
 * @param {string} customDataKey Annotation custom-data key.
 * @param {string} key Selected style key.
 * @returns {string} The stored key, or an empty string for a built-in style.
 * @ignore
 */
export const syncCustomStyleSelection = (annotation, registry, scope, customDataKey, key) => {
  const storedKey = registry.has(scope, key) ? key : '';
  setCustomData(annotation, customDataKey, storedKey);
  return storedKey;
};