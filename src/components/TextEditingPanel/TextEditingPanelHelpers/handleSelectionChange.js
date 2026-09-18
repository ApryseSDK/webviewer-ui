import getFontInfo from './getFontInfo';

/**
 * Handles text selection changes in content edit mode
 * Orchestrates font extraction, validation, and state updates
 * @ignore
 */
const handleSelectionChange = async ({
  getFontName,
  setFonts,
  handleColorChange,
  setTextEditProperties,
  setFormat,
  setSelectionMode,
  contentEditorRef,
  isInContentEditMode,
  fonts,
  instance,
}) => {
  if (!isInContentEditMode) {
    return;
  }

  const { fontObject, color, attribute } = await getFontInfo(
    instance,
    contentEditorRef,
    getFontName
  );

  if (!fonts.includes(fontObject.Font)) {
    setFonts([...fonts, fontObject.Font]);
  }
  // We do this to prevent spamming the handleColorChange with same color, but we need a better approach.
  if (!fonts.includes(fontObject.Font)) {
    handleColorChange(null, color);
  }

  setTextEditProperties(fontObject);
  setFormat({ ...attribute, color });
  setSelectionMode(instance.Core.ContentEdit.Types.TEXT);
};

export default handleSelectionChange;