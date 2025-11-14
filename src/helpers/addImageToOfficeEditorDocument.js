import DataElements from 'src/constants/dataElement';
import fileToBase64 from './fileToBase64';
import core from 'core';

async function addImageToOfficeEditorDocument(dispatch, actions, e, activeFlyout) {
  const file = e.target.files[0];

  if (file) {
    try {
      dispatch(actions.openElement(DataElements.LOADING_MODAL));
      const base64 = await fileToBase64(file);
      await core.getOfficeEditor().insertImageAtCursor(base64);
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      dispatch(actions.closeElement(activeFlyout));
    } catch (error) {
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      dispatch(actions.closeElement(activeFlyout));
      dispatch(actions.showWarningMessage({
        title: 'Error',
        message: error.toString(),
      }));
    }
  }

  e.target.value = '';
}

export default addImageToOfficeEditorDocument;