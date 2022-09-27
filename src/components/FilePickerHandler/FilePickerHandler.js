import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import getHashParameters from 'helpers/getHashParameters';
import loadDocument from 'helpers/loadDocument';
import actions from 'actions';
import selectors from 'selectors';

import './FilePickerHandler.scss';

const FilePickerHandler = () => {
  const [isDisabled, isMultiTab, TabManager] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, 'filePickerHandler'),
      selectors.getIsMultiTab(state),
      selectors.getTabManager(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const openDocument = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(actions.openElement('progressModal'));
      dispatch(actions.closeElement('menuOverlay'));
      if (isMultiTab) {
        return TabManager.addTab(file, { saveCurrentActiveTabState: true, load: true });
      }
      loadDocument(dispatch, file);
    }
  };

  const wvServer = !!getHashParameters('webviewerServerURL', null);
  const acceptFormats = wvServer ? window.Core.SupportedFileFormats.SERVER : window.Core.SupportedFileFormats.CLIENT;

  return isDisabled ? null : (
    <div className="FilePickerHandler">
      <input
        id="file-picker"
        type="file"
        accept={acceptFormats.map(
          (format) => `.${format}`,
        ).join(', ')}
        onChange={openDocument}
      />
    </div>
  );
};

export default FilePickerHandler;
