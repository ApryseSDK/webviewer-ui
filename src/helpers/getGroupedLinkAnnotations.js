import core from 'core';

// helper function to get all the link annotations that are grouped with the passed in annotation
export default (annotation) => {
  const groupedLinks = [];
  const groupedAnnotations = core.getAnnotationManager().getGroupAnnotations(annotation);
  groupedAnnotations.forEach((annot) => {
    const groupedLinksOfAnnot = annot.getGroupedChildren().filter((childrenAnnotation) => childrenAnnotation instanceof window.Core.Annotations.Link);
    groupedLinks.push(...groupedLinksOfAnnot);
  });

  return groupedLinks;
};
