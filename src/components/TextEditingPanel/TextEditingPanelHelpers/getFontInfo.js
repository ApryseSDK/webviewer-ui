/**
 * Extracts font and text attributes from the content editor
 * @param {Object} instance - WebViewer instance
 * @param {Object} contentEditorRef - Reference to the content editor
 * @param {Function} getFontName - Function to clean the font name
 * @returns {Promise<{fontObject: Object, color: Object, attribute: Object}>}
 * @ignore
 */
const getFontInfo = async (
  instance,
  contentEditorRef,
  getFontName
) => {
  const attribute = await contentEditorRef.current.getTextAttributes();
  const color = new instance.Core.Annotations.Color(attribute.fontColor);

  const fontObject = {
    FontSize: attribute.fontSize,
    Font: getFontName(attribute.fontName),
    TextAlign: attribute.textAlign
  };

  return { fontObject, color, attribute };
};

export default getFontInfo;