
/**
 * Sets the available style tabs in the style popup for a specific annotation type.
 * @method UI.setAnnotationStylePopupTabs
 * @param {string} annotationKey The annotation type. See {@link UI.AnnotationKeys}.
 * @param {string[]} newAnnotationStyleTabs Indicates the available style tabs for the annotation. See {@link UI.AnnotationStylePopupTabs}.
 * @param {string} [initialTab] The initial style tab. It should be one of the elements in newAnnotationStyleTabs if passed to the API.
  @example
  WebViewer(...)
    .then(function(instance) {
      instance.UI.setAnnotationStylePopupTabs(
        instance.UI.AnnotationKeys.FREE_TEXT,
        [
          instance.UI.AnnotationStylePopupTabs.TEXT_COLOR,
          instance.UI.AnnotationStylePopupTabs.FILL_COLOR
        ],
        instance.UI.AnnotationStylePopupTabs.FILL_COLOR
      );
    });
 */

import { updateAnnotationStylePopupTabs, copyMapWithDataProperties } from '../constants/map';
import actions from 'actions';

export default (store) => (annotationKey, newAnnotationStyleTabs, initialTab) => {
  const result =
    updateAnnotationStylePopupTabs(annotationKey, newAnnotationStyleTabs, initialTab);
  if (result === true) {
    const newColorMap = copyMapWithDataProperties('currentStyleTab', 'iconColor');
    store.dispatch(actions.setColorMap(newColorMap));
  }
};