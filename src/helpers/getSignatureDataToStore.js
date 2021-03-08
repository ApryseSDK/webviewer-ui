import core from 'core';

// a flag promise that's used to make sure that function calls to getSignatureDataToStore
// will resolve in the same order as they were called
let previewsPromise = Promise.resolve();
// returns an array of objects in the shape of: { annotation, preview }
// annotation: a copy of the annotation passed in
// imgSrc: preview of the annotation, a base64 string
export default async annotations => {
  // copy the annotation because we need to mutate the annotation object later if there're any styles changes
  // and we don't want the original annotation to be mutated as well
  // since it's been added to the canvas
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const newAnnotations = annotations.map(core.getAnnotationCopy);

  newAnnotations.forEach(annotation => {
    const pageRotation = core.getCompleteRotation(annotation.PageNumber);

    if (pageRotation === 0) {
      return;
    }

    rotateAnnotation(annotation, -pageRotation * 90);
  });

  await previewsPromise;

  previewsPromise = Promise.all(
    newAnnotations.map(annotation => {
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

/**
 * Rotate the annotation by the amount of rotation to make sure its preview's rotation is correct
 * @ignore
 */
function rotateAnnotation(annotation, rotation) {
  const rect = annotation.getRect();
  const center = {
    x: (rect.x1 + rect.x2) / 2,
    y: (rect.y1 + rect.y2) / 2,
  };

  if (annotation instanceof window.Annotations.FreeHandAnnotation) {
    const radianAngle = (-rotation * Math.PI) / 180;
    annotation.rotate(radianAngle, center);
  }

  if (annotation instanceof window.Annotations.StampAnnotation) {
    annotation.Rotation = (annotation.Rotation || 0) + rotation;
    rotation = Math.abs(rotation);

    if (rotation === 90 || rotation === 270) {
      annotation.setRect(
        new Annotations.Rect(
          center.x - annotation.Height / 2,
          center.y - annotation.Width / 2,
          center.x + annotation.Height / 2,
          center.y + annotation.Width / 2
        ),
      );
    }
  }
}