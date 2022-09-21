import core from 'core';

export default () => {
  const freetextAnnots = core.getAnnotationsList().filter((annot) => annot instanceof window.Annotations.FreeTextAnnotation);
  const isEditingFreetext = freetextAnnots.some((annot) => annot.getEditor()?.hasFocus());
  const { activeElement } = document;

  return (
    activeElement instanceof window.HTMLInputElement ||
    activeElement instanceof window.HTMLTextAreaElement ||
    activeElement.className.includes('ql-editor') ||
    isEditingFreetext ||
    (activeElement?.tagName?.toLowerCase() === 'input' && activeElement?.getAttribute('type') === 'text') ||
    activeElement?.tagName?.toLowerCase() === 'textarea'
  );
};
