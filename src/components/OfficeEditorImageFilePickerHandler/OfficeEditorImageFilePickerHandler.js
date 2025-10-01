import React from 'react';
import actions from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import addImageToOfficeEditorDocument from 'src/helpers/addImageToOfficeEditorDocument';
import { OFFICE_EDITOR_ACCEPTED_IMAGE_FORMATS } from 'src/constants/officeEditor';

import '../FilePickerHandler/FilePickerHandler.scss';

const FilePickerHandler = () => {
  const dispatch = useDispatch();
  const activeFlyout = useSelector(selectors.getActiveFlyout);

  const openDocument = async (e) => {
    await addImageToOfficeEditorDocument(dispatch, actions, e, activeFlyout);
  };

  return (
    <div className="FilePickerHandler">
      <input
        id="office-editor-file-picker"
        type="file"
        accept={OFFICE_EDITOR_ACCEPTED_IMAGE_FORMATS}
        onChange={openDocument}
      />
    </div>
  );
};

export default FilePickerHandler;
