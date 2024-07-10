import React from 'react';
import actions from 'actions';
import { useDispatch } from 'react-redux';
import getRootNode from 'helpers/getRootNode';
import core from 'core';
import DataElements from 'constants/dataElement';

import '../FilePickerHandler/FilePickerHandler.scss';

// TODO: Can we accept any other image formats?
const ACCEPTED_FORMATS = ['jpg', 'jpeg', 'png', 'bmp'].map(
  (format) => `.${format}`,
).join(', ');

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const FilePickerHandler = () => {
  const dispatch = useDispatch();

  const openDocument = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        dispatch(actions.openElement(DataElements.LOADING_MODAL));
        const base64 = await toBase64(file);
        await core.getOfficeEditor().insertImageAtCursor(base64);
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      } catch (error) {
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
        dispatch(actions.showWarningMessage({
          title: 'Error',
          message: error,
        }));
      }
      const picker = getRootNode().querySelector('#office-editor-file-picker');
      if (picker) {
        picker.value = '';
      }
    }
  };

  return (
    <div className="FilePickerHandler">
      <input
        id="office-editor-file-picker"
        type="file"
        accept={ACCEPTED_FORMATS}
        onChange={openDocument}
      />
    </div>
  );
};

export default FilePickerHandler;
