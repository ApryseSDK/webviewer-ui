import core from 'core';

// helper function to get all the link annotations that are grouped with the passed in annotation
export default (annotation) => {
  const groupedLinks =
    core.getAnnotationManager()
      .getGroupAnnotations(annotation)
      .filter((groupedAnnotation) => groupedAnnotation instanceof window.Core.Annotations.Link);
  return groupedLinks;
};
