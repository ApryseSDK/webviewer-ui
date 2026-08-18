import core from 'core';
import getRootNode from './getRootNode';

export default (rootNodeOverride) => {
  const freetextAnnots = core.getAnnotationsList().filter((annot) => annot instanceof window.Core.Annotations.FreeTextAnnotation);
  const editBoxManager = core.getAnnotationManager().getEditBoxManager();
  const isEditingFreetext = freetextAnnots.some((annot) => {
    const editor = editBoxManager.getExistingEditor(annot);
    return editor ? editor.hasFocus() : false;
  });
  const rootNode = rootNodeOverride || getRootNode();
  const { activeElement } = rootNode || {};

  return (activeElement && (
    activeElement instanceof window.HTMLInputElement ||
    activeElement instanceof window.HTMLTextAreaElement ||
    activeElement.className.includes('ql-editor') ||
    isEditingFreetext ||
    (activeElement?.tagName?.toLowerCase() === 'input' && activeElement?.getAttribute('type') === 'text') ||
    activeElement?.tagName?.toLowerCase() === 'textarea'
  ));
};
