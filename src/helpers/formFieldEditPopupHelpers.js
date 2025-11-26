import { redrawAnnotation, triggerAnnotationChangedEventWithModify } from '../components/FormFieldPanel/utils';

/**
 * @ignore
 * Creates dimension change handlers for form field edit popups
 * @param {Object} annotation - The Core.Annotation object
 * @param {Function} getPageWidth - Function to get page width
 * @param {Function} getPageHeight - Function to get page height
 * @param {Function} setWidth - State setter for width
 * @param {Function} setHeight - State setter for height
 * @returns {Object} Object containing onWidthChange and onHeightChange functions
 */
export const createDimensionChangeHandlers = (annotation, getPageWidth, getPageHeight, setWidth, setHeight) => {
  const validateWidth = (width) => {
    const documentWidth = getPageWidth();
    const maxWidth = documentWidth - annotation.X;
    if (width > maxWidth) {
      return maxWidth;
    }
    return width;
  };

  const validateHeight = (height) => {
    const documentHeight = getPageHeight();
    const maxHeight = documentHeight - annotation.Y;
    if (height > maxHeight) {
      return maxHeight;
    }
    return height;
  };

  const onWidthChange = (width) => {
    const validatedWidth = validateWidth(width);
    annotation.setWidth(validatedWidth);
    setWidth(validatedWidth);
    redrawAnnotation(annotation);
    triggerAnnotationChangedEventWithModify([annotation]);
  };

  const onHeightChange = (height) => {
    const validatedHeight = validateHeight(height);
    annotation.setHeight(validatedHeight);
    setHeight(validatedHeight);
    redrawAnnotation(annotation);
    triggerAnnotationChangedEventWithModify([annotation]);
  };

  return {
    onWidthChange,
    onHeightChange,
    validateWidth,
    validateHeight,
  };
};
