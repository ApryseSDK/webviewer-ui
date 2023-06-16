import { getMap } from '../constants/map';
/**
 * @typedef {string} StyleTab The style tab in the annotation style popup window. See {@link UI.AnnotationStylePopupTabs} for valid style tabs.
 */

/**
 * @typedef {object} AnnotationStyleTabConfiguration
 * @property {string[]} styleTabs Indicates the available style tabs in the annotation style popup window. See {@link UI.AnnotationStylePopupTabs}.
 * @property {string} currentStyleTab The current tab in the annotation style popup window.
 */

/**
 * Returns the style popup tab configurations for the specified annotation type.
 * If there was no annotation key specified, it will return the style popup tab configurations for all the annotations.
 * @method UI.getAnnotationStylePopupTabs
 * @param {string} [annotationKey] Indicate the type of an annotation, see {@link UI.AnnotationKeys}.
 * @return {AnnotationStyleTabConfiguration[]}
  @example
  WebViewer(...)
    .then(function(instance) {
        console.log(instance.UI.getAnnotationStylePopupTabs());
      );
    });
 */

export default (annotationKey) => {
  const map = getMap();
  const annotationTabs = {};
  if (annotationKey) {
    const targetAnnotation = map[annotationKey];
    if (!targetAnnotation) {
      return console.error('No such annotation exist. Please provide a valid annotation key.');
    }
    annotationTabs[annotationKey] = {
      styleTabs: targetAnnotation.styleTabs,
      currentStyleTab: targetAnnotation.currentStyleTab,
    };
  } else {
    const annotationKeys = Object.keys(map);
    annotationKeys.forEach((annotationKey) => {
      annotationTabs[annotationKey] = {
        styleTabs: map[annotationKey].styleTabs,
        currentStyleTab: map[annotationKey].currentStyleTab,
      };
    });
    return annotationTabs;
  }
  return annotationTabs;
};