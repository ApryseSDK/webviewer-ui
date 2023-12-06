import React, { useRef } from 'react';
import selectors from 'selectors';
import './DropArea.scss';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import loadDocument from 'helpers/loadDocument';
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
  const [
    customMultiViewerAcceptedFileFormats,
  ] = useSelector((state) => [
    selectors.getCustomMultiViewerAcceptedFileFormats(state),
  ]);

  const browseFiles = () => fileInput.current.click();

  const onDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    if (files.length) {
      loadDocument(dispatch, files[0], {}, documentViewerKey);
    }
  };
  const loadFile = (e) => {
    e.preventDefault();
    const { files } = e.target;
    if (files.length) {
      loadDocument(dispatch, files[0], {}, documentViewerKey);
    }
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
