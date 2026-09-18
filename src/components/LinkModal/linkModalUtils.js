export const URL_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

export const getIsInContentEditMode = (core, contentBoxEditor) => {
  try {
    return Boolean(
      contentBoxEditor
      && core.getContentEditManager()?.isInContentEditMode?.()
    );
  } catch (error) {
    console.error('Failed to determine content edit mode state.', error);
    return false;
  }
};

export const getPrepopulatedLinkURL = (
  core,
  activeDocumentViewerKey,
  isInContentEditMode,
  contentBoxEditor,
) => {
  if (isInContentEditMode) {
    try {
      if (!contentBoxEditor || typeof contentBoxEditor.getHyperlink !== 'function') {
        return '';
      }

      return contentBoxEditor.getHyperlink() || '';
    } catch {
      return '';
    }
  }

  const selectedText = core.getSelectedText(activeDocumentViewerKey);
  if (!selectedText) {
    return '';
  }

  const urls = selectedText.match(URL_REGEX);
  if (urls && urls.length > 0) {
    return urls[0];
  }

  return '';
};