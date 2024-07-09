import core from 'core';

// a flag promise that's used to make sure that function calls to getSignatureDataToStore
// will resolve in the same order as they were called
let previewsPromise = Promise.resolve();
// returns an array of objects in the shape of: { annotation, preview }
// annotation: a copy of the annotation passed in
// imgSrc: preview of the annotation, a base64 string
export default async (annotations) => {
  // copy the annotation because we need to mutate the annotation object later if there're any styles changes
  // and we don't want the original annotation to be mutated as well
  // since it's been added to the canvas
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const newAnnotations = annotations.map(core.getAnnotationCopy);

  await previewsPromise;

  previewsPromise = Promise.all(
    newAnnotations.map((annotation) => {
      const oldStrokeThickness = annotation['StrokeThickness'];
      // Temporarily changing stroke thickness to 6 because it looks better in the preview image
      annotation['StrokeThickness'] = 6;
      const preview = signatureTool.getPreview(annotation);
      annotation['StrokeThickness'] = oldStrokeThickness;
      return preview;
    }),
  );

  const previews = await previewsPromise;
  return newAnnotations.map((annotation, i) => ({
    annotation,
    imgSrc: previews[i],
  }));
};
