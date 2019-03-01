/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#isCreateRedactionEnabled__anchor
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:isCreateRedactionEnabled__anchor
 */
export default () => window.docViewer.getAnnotationManager().isCreateRedactionEnabled();
