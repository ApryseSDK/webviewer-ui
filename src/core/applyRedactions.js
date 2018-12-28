/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#applyRedactions__anchor
 */
export default annotations =>  {
    window.docViewer.getAnnotationManager().applyRedactions(annotations);
  };
  