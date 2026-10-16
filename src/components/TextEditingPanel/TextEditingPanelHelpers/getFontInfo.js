/**
 * Extracts font and text attributes from the content editor. The returned Font is the
 * raw, uncleaned font name; callers are responsible for cleaning it for display only.
 * @param {Object} instance - WebViewer instance
 * @param {Object} contentEditorRef - Reference to the content editor
 * @returns {Promise<{fontObject: Object, color: Object, attribute: Object}>}
 * @ignore
 */
const getFontInfo = async (
  instance,
  contentEditorRef,
) => {
  const attribute = contentEditorRef.current.getCachedTextAttributes()
    ?? await contentEditorRef.current.getTextAttributes();
  const color = new instance.Core.Annotations.Color(attribute.fontColor);

  const fontObject = {
    FontSize: attribute.fontSize,
    Font: typeof attribute.fontName === 'string' ? attribute.fontName : '',
    TextAlign: attribute.textAlign
  };

  return { fontObject, color, attribute };
};

export default getFontInfo;