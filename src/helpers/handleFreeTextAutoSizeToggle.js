import core from 'core';

/**
 * @ignore
 * handler for auto size font toggle
 * @param {FreeTextAnnotation} annotation annotation to toggle auto size font
 * @param {function} setAutoSizeFont function to set auto size font
 * @param {boolean} isAutoSizeFont current auto size font value
 */
export default (annotation, setAutoSizeFont, isAutoSizeFont) => {
  const freeTextAnnot = annotation;
  const calculatedFontSize = freeTextAnnot.getCalculatedFontSize();
  if (isAutoSizeFont) {
    freeTextAnnot.FontSize = calculatedFontSize;
  } else {
    freeTextAnnot.switchToAutoFontSize();
  }

  setAutoSizeFont(!isAutoSizeFont);
  core.getAnnotationManager().redrawAnnotation(freeTextAnnot);
};

