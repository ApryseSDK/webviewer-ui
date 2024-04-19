import core from 'core';

export default (annotation) => {
  const { FreeTextAnnotation } = window.Core.Annotations;
  if (annotation instanceof FreeTextAnnotation && annotation.getAutoSizeType() !== FreeTextAnnotation.AutoSizeTypes.NONE) {
    const doc = core.getDocument();
    const pageNumber = annotation['PageNumber'];
    const pageInfo = doc.getPageInfo(pageNumber);
    const pageMatrix = doc.getPageMatrix(pageNumber);
    const pageRotation = doc.getPageRotation(pageNumber);
    annotation.fitText(pageInfo, pageMatrix, pageRotation);
  }
};