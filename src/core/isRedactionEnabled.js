/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#isRedactionEnabled__anchor
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:isRedactionEnabled__anchor
 */
export default () => window.docViewer.getAnnotationManager().isRedactionEnabled();
