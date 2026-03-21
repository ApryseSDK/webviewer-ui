import core from 'core';

/**
 * @ignore
 * handler for auto size font toggle
 * @param {FreeTextAnnotation} freeTextAnnot annotation to toggle auto size font
 * @param {function} setAutoSizeFont function to set auto size font
 * @param {boolean} isAutoSizeFont current auto size font value
 * @param {number} [documentViewerKey=1] key identifying the document viewer whose annotation manager should be used (defaults to 1)
 */
export default (freeTextAnnot, setAutoSizeFont, isAutoSizeFont, documentViewerKey = 1) => {
  if (isAutoSizeFont) {
    freeTextAnnot.switchOutFromAutoFontSize();
  } else {
    freeTextAnnot.switchToAutoFontSize();
  }
  const annotationManager = core.getAnnotationManager(documentViewerKey);
  annotationManager.trigger('annotationChanged', [[freeTextAnnot], 'modify', {}]);

  setAutoSizeFont(!isAutoSizeFont);
  annotationManager.redrawAnnotation(freeTextAnnot);
};

