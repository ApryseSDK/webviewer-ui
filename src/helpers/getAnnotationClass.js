export const getAnnotationClass = annotation => {
  if (annotation instanceof Annotations.CaretAnnotation) {
    return 'caret';
  }
  if (annotation instanceof Annotations.CustomAnnotation) {
    return 'custom';
  }
  if (annotation instanceof Annotations.EllipseAnnotation) {
    return 'ellipse';
  }
  if (annotation instanceof Annotations.FileAttachmentAnnotation) {
    return 'fileattachment';
  }
  if (annotation instanceof Annotations.FreeHandAnnotation) {
    return 'freehand';
  }
  if (
    annotation instanceof Annotations.FreeTextAnnotation &&
    annotation.getIntent() === window.Annotations.FreeTextAnnotation.Intent.FreeTextCallout
  ) {
    return 'callout';
  }
  if (annotation instanceof Annotations.FreeTextAnnotation) {
    return 'freetext';
  }
  if (annotation instanceof Annotations.LineAnnotation) {
    return 'line';
  }
  if (annotation instanceof Annotations.Link) {
    return 'other';
  }
  if (annotation instanceof Annotations.PolygonAnnotation) {
    return 'polygon';
  }
  if (annotation instanceof Annotations.PolylineAnnotation) {
    return 'polyline';
  }
  if (annotation instanceof Annotations.RectangleAnnotation) {
    return 'rectangle';
  }
  if (annotation instanceof Annotations.RedactionAnnotation) {
    return 'redact';
  }
  if (annotation instanceof Annotations.SignatureWidgetAnnotation) {
    return 'signature';
  }
  if (annotation instanceof Annotations.StampAnnotation) {
    return 'stamp';
  }
  if (annotation instanceof Annotations.StickyAnnotation) {
    return 'stickyNote';
  }
  if (annotation instanceof Annotations.TextHighlightAnnotation) {
    return 'highlight';
  }
  if (annotation instanceof Annotations.TextStrikeoutAnnotation) {
    return 'strikeout';
  }
  if (annotation instanceof Annotations.TextUnderlineAnnotation) {
    return 'underline';
  }
  if (annotation instanceof Annotations.TextSquigglyAnnotation) {
    return 'squiggly';
  }
  if (annotation instanceof Annotations.Model3DAnnotation) {
    return '3D';
  }

  return 'other';
};
