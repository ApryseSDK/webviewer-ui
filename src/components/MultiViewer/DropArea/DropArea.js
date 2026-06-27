import React, { useRef } from 'react';
import selectors from 'selectors';
import './DropArea.scss';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import loadDocument from 'helpers/loadDocument';
import { buildTabUpdateForViewer, getTargetTabId } from 'helpers/multiViewerTabUpdate';
import { useDispatch, useSelector } from 'react-redux';
import getHashParameters from 'helpers/getHashParameters';

const propTypes = {
  documentViewerKey: PropTypes.number.isRequired,
};

// Todo Compare: Make stories for this component
const DropArea = ({ documentViewerKey }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileInput = useRef();
  const customMultiViewerAcceptedFileFormats = useSelector(selectors.getCustomMultiViewerAcceptedFileFormats);
  const isMultiTab = useSelector(selectors.getIsMultiTab);
  const tabManager = useSelector(selectors.getTabManager);
  const activeTab = useSelector(selectors.getActiveTab);
  const tabs = useSelector(selectors.getTabs);

  const browseFiles = () => fileInput.current.click();

  const loadDoc = (files) => {
    if (files.length) {
      const targetTabId = getTargetTabId(activeTab, tabs);
      if (isMultiTab && tabManager && (targetTabId || targetTabId === 0)) {
        tabManager.updateTab(targetTabId, buildTabUpdateForViewer({
          documentViewerKey,
          src: files[0],
          options: {},
          isMultiViewerMode: true,
        }));
      } else if (isMultiTab && tabManager) {
        tabManager.addTab(files[0], {
          setActive: true,
          saveCurrentActiveTabState: true,
        });
      } else {
        loadDocument(dispatch, files[0], {}, documentViewerKey);
      }
    }
  };
  const onDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    loadDoc(files);
  };
  const loadFile = (e) => {
    e.preventDefault();
    const { files } = e.target;
    loadDoc(files);
  };

  const wvServer = !!getHashParameters('webviewerServerURL', null);
  const acceptFormats = wvServer ? window.Core.SupportedFileFormats.SERVER : window.Core.SupportedFileFormats.CLIENT;

  return (
    <div className="DropArea" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <Icon glyph="icon-compare-file-open" />
      <div className="DropArea__text">{t('multiViewer.dragAndDrop')}</div>
      <div>{t('multiViewer.or')}</div>
      <button onClick={browseFiles}>{t('multiViewer.browse')}</button>
      <input ref={fileInput} className={'hidden'} type={'file'} onChange={loadFile}
        accept={(customMultiViewerAcceptedFileFormats || acceptFormats.map(
          (format) => `.${format}`,
        )).join(', ')}
      />
    </div>
  );
};

DropArea.propTypes = propTypes;

export default DropArea;
