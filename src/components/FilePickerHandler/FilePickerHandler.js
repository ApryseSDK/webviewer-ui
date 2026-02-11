import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import getHashParameters from 'helpers/getHashParameters';
import loadDocument from 'helpers/loadDocument';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';

import './FilePickerHandler.scss';

const FilePickerHandler = () => {
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, 'filePickerHandler'));
  const isMultiTab = useSelector(selectors.getIsMultiTab);
  const TabManager = useSelector(selectors.getTabManager, shallowEqual);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  const dispatch = useDispatch();

  const openDocument = async (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(actions.openElement(DataElements.PROGRESS_MODAL));
      dispatch(actions.closeElement(DataElements.MENU_OVERLAY));
      if (isMultiTab) {
        await TabManager.addTab(file, { saveCurrentActiveTabState: true, load: true });
      } else {
        await loadDocument(dispatch, file, {}, activeDocumentViewerKey);
      }
    }
    e.target.value = '';
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
