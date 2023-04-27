export const getAnnotationClass = (annotation) => {
  if (annotation instanceof window.Core.Annotations.CaretAnnotation) {
    return 'caret';
  }
  if (annotation instanceof window.Core.Annotations.CustomAnnotation) {
    return 'custom';
  }
  if (annotation instanceof window.Core.Annotations.EllipseAnnotation) {
    return 'ellipse';
  }
  if (annotation instanceof window.Core.Annotations.FileAttachmentAnnotation) {
    return 'fileattachment';
  }
  if (annotation instanceof window.Core.Annotations.FreeHandAnnotation) {
    return 'freehand';
  }
  if (
    annotation instanceof window.Core.Annotations.FreeTextAnnotation &&
    annotation.getIntent() === window.Core.Annotations.FreeTextAnnotation.Intent.FreeTextCallout
  ) {
    return 'callout';
  }
  if (annotation instanceof window.Core.Annotations.FreeTextAnnotation) {
    return 'freetext';
  }
  if (annotation instanceof window.Core.Annotations.LineAnnotation) {
    return 'line';
  }
  if (annotation instanceof window.Core.Annotations.Link) {
    return 'other';
  }
  if (annotation instanceof window.Core.Annotations.PolygonAnnotation) {
    return 'polygon';
  }
  if (annotation instanceof window.Core.Annotations.PolylineAnnotation) {
    return 'polyline';
  }
  if (annotation instanceof window.Core.Annotations.RectangleAnnotation) {
    return 'rectangle';
  }
  if (annotation instanceof window.Core.Annotations.RedactionAnnotation) {
    return 'redact';
  }
  if (annotation instanceof window.Core.Annotations.SignatureWidgetAnnotation) {
    return 'signature';
  }
  if (annotation instanceof window.Core.Annotations.StampAnnotation) {
    return 'stamp';
  }
  if (annotation instanceof window.Core.Annotations.StickyAnnotation) {
    return 'stickyNote';
  }
  if (annotation instanceof window.Core.Annotations.TextHighlightAnnotation) {
    return 'highlight';
  }
  if (annotation instanceof window.Core.Annotations.TextStrikeoutAnnotation) {
    return 'strikeout';
  }
  if (annotation instanceof window.Core.Annotations.TextUnderlineAnnotation) {
    return 'underline';
  }
  if (annotation instanceof window.Core.Annotations.TextSquigglyAnnotation) {
    return 'squiggly';
  }
  if (annotation instanceof window.Core.Annotations.Model3DAnnotation) {
    return '3D';
  }

  return 'other';
};
