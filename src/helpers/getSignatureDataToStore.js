import core from 'core';

// returns an array of objects in the shape of: { annotation, preview }
// annotation: a copy of the annotation passed in
// imgSrc: preview of the annotation, a base64 string
export default async annotations => {
  // copy the annotation because we need to mutate the annotation object later if there're any styles changes
  // and we don't want the original annotation to be mutated as well
  // since it's been added to the canvas
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const newAnnotations = annotations.map(core.getAnnotationCopy);
  const previews = await Promise.all(
    annotations.map(annotation => {
      annotation['StrokeThickness'] = 6;
      return signatureTool.getPreview(annotation);
    }),
  );

  return newAnnotations.map((annotation, i) => ({
    annotation,
    imgSrc: previews[i],
  }));
};