import React from 'react';
import { useStore, useSelector, useDispatch, shallowEqual } from 'react-redux';

import { supportedClientOnlyExtensions } from 'constants/supportedFiles';
import loadDocument from 'helpers/loadDocument';
import actions from 'actions';
import selectors from 'selectors';

import './FilePickerHandler.scss';

const FilePickerHandler = () => {
  const isDisabled = useSelector(
    state => selectors.isElementDisabled(state, 'filePickerHandler'),
    shallowEqual,
  );
  const dispatch = useDispatch();
  const store = useStore();

  const openDocument = e => {
    const file = e.target.files[0];
    if (file) {
      dispatch(actions.setDocumentFile(file));
      dispatch(actions.openElement('progressModal'));
      dispatch(actions.closeElement('menuOverlay'));
      loadDocument(store.getState(), dispatch);
    }
  };

  return isDisabled ? null : (
    <div className="FilePickerHandler">
      <input
        id="file-picker"
        type="file"
        accept={supportedClientOnlyExtensions.join(', ')}
        onChange={openDocument}
      />
    </div>
  );
};

export default FilePickerHandler;
