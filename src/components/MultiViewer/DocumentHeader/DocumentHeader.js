import React, { useEffect, useState } from 'react';
import ToggleZoomOverlay from 'components/ToggleZoomOverlay';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import classNames from 'classnames';
import core from 'core';
import { useTranslation } from 'react-i18next';
import downloadPdf from 'helpers/downloadPdf';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import actions from 'actions';

import './DocumentHeader.scss';

const propTypes = {
  documentViewerKey: PropTypes.number.isRequired,
  docLoaded: PropTypes.bool.isRequired,
  isSyncing: PropTypes.bool.isRequired,
};

// Todo Compare: Make stories for this component
const DocumentHeader = ({
  documentViewerKey,
  docLoaded,
  isSyncing,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filename, setFileName] = useState('Untitled');
  const [saveButtonDisabled] = useSelector((state) => [selectors.isElementDisabled(state, DataElements.MULTI_VIEWER_SAVE_DOCUMENT_BUTTON)]);

  useEffect(() => {
    const stopSyncing = () => dispatch(actions.setSyncViewer(null));
    const onLoaded = () => setFileName(core.getDocument(documentViewerKey)?.getFilename());
    const unLoaded = () => setFileName('Untitled');
    core.addEventListener('documentLoaded', onLoaded, undefined, documentViewerKey);
    core.addEventListener('documentUnloaded', unLoaded, undefined, documentViewerKey);
    core.addEventListener('displayModeUpdated', stopSyncing, undefined, documentViewerKey);
    setFileName(core.getDocument(1)?.getFilename() || 'Untitled');
    return () => {
      core.removeEventListener('documentLoaded', onLoaded, documentViewerKey);
      core.removeEventListener('documentUnloaded', unLoaded, documentViewerKey);
      core.removeEventListener('displayModeUpdated', stopSyncing, documentViewerKey);
    };
  }, [documentViewerKey]);

  const closeDocument = () => core.closeDocument(documentViewerKey);
  const onClickSync = () => dispatch(actions.setSyncViewer(isSyncing ? null : documentViewerKey));
  const onSaveDocument = () => downloadPdf(dispatch, undefined, documentViewerKey);

  return (
    <div
      className={classNames('DocumentHeader', { hidden: !docLoaded })}
      id={`header${documentViewerKey}`}
    >
      <ToggleZoomOverlay documentViewerKey={documentViewerKey} />
      <div className="file-name">{filename}</div>
      <div className="control-buttons">
        {!saveButtonDisabled &&
          <Button img="icon-save" onClick={onSaveDocument} dataElement={DataElements.MULTI_VIEWER_SAVE_DOCUMENT_BUTTON} title={t('multiViewer.save')} />
        }
        <Button img="icon-sync" onClick={onClickSync} isActive={isSyncing} title={t(`multiViewer.${isSyncing ? 'stop' : 'start'}Sync`)} />
        <Button img="icon-close" onClick={closeDocument} title={t('multiViewer.closeDocument')} />
      </div>
    </div>
  );
};

DocumentHeader.propTypes = propTypes;

export default DocumentHeader;
