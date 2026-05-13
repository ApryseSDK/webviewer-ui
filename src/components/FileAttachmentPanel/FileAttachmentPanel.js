import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFileAttachments, getEmbeddedFileData } from 'helpers/getFileAttachments';
import Spinner from '../Spinner';
import { saveAs } from 'file-saver';
import Icon from 'components/Icon';
import useCore from 'hooks/useCore';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';

import './FileAttachmentPanel.scss';
import { panelData, panelNames } from 'constants/panel';
const getActualFileName = (filename) => {
  const fileNameRegex = /[^\\\/]+$/g;
  return filename.match(fileNameRegex)[0];
};

const renderAttachment = (filename, onClickCallback, key, showFileIdProcessSpinner) => {
  filename = getActualFileName(filename);
  const fileExtension = filename.split('.').pop().toUpperCase();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClickCallback();
    }
  };

  if (showFileIdProcessSpinner === key) {
    return (
      <li key={key}>
        <button
          className='embedSpinner'
          onClick={onClickCallback}
          onKeyDown={handleKeyDown}
          type="button"
        >
          {`[${fileExtension}] ${filename}`}<Spinner inPanel height={'15px'} width={'15px'}/>
        </button>
      </li>
    );
  }
  return (
    <li key={key}>
      <button
        className='embedSpinner'
        onClick={onClickCallback}
        onKeyDown={handleKeyDown}
        type="button"
      >
        {`[${fileExtension}] ${filename}`}
      </button>
    </li>
  );
};



const initialFilesDefault = { embeddedFiles: [], fileAttachmentAnnotations: [] };

const FileAttachmentPanel = ({ initialFiles = initialFilesDefault }) => {
  const { core } = useCore();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [fileAttachments, setFileAttachments] = useState(initialFiles);
  const isMultiTab = useSelector(selectors.getIsMultiTab);
  const tabManager = useSelector(selectors.getTabManager);
  const [showFileIdProcessSpinner, setFileIdProcessSpinner] = useState(null);

  useEffect(() => {
    const updateFileAttachments = async () => {
      const attachments = await getFileAttachments(core);
      setFileAttachments(attachments);
    };
    const clearSpinner = () => {
      setFileIdProcessSpinner(null);
    };
    core.addEventListener('annotationChanged', updateFileAttachments);
    core.addEventListener('documentLoaded', updateFileAttachments);
    core.addEventListener('fileAttachmentDataAvailable', clearSpinner);
    updateFileAttachments();
    return () => {
      core.removeEventListener('annotationChanged', updateFileAttachments);
      core.removeEventListener('documentLoaded', updateFileAttachments);
      core.removeEventListener('fileAttachmentDataAvailable', clearSpinner);
    };
  }, [core]);

  if (
    fileAttachments.embeddedFiles.length === 0 &&
    Object.entries(fileAttachments.fileAttachmentAnnotations).length === 0
  ) {
    return (
      <div className="fileAttachmentPanel">
        <div className="empty-panel-container">
          <Icon className="empty-icon" glyph={panelData[panelNames.FILE_ATTACHMENT].icon}/>
          <div className="empty-message">{t('message.noAttachments')}</div>
        </div>
      </div>
    );
  }

  const attachmentPanelItemOnClick = async (fileAttachmentAnnot) => {
    if (isMultiTab) {
      dispatch(actions.openElement(DataElements.LOADING_MODAL));
      try {
        const blob = await fileAttachmentAnnot.getFileData();
        const filename = getActualFileName(fileAttachmentAnnot.filename);
        const newTabId = await tabManager.addTab(blob, { filename });
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
        dispatch(actions.closeElement(DataElements.LEFT_PANEL));
        await tabManager.setActiveTab(newTabId);
      } catch (error) {
        console.error('Error opening file attachment:', error);
        dispatch(actions.openElement(DataElements.ERROR_MODAL));
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      } finally {
        setFileIdProcessSpinner(null);
      }
    } else {
      return core.getAnnotationManager().trigger('annotationDoubleClicked', fileAttachmentAnnot);
    }
  };

  return (
    <div className="fileAttachmentPanel">
      <div className="section">
        {fileAttachments.embeddedFiles.length ? <h2 className="title">{t('message.embeddedFiles')}</h2> : null}
        <ul className="downloadable">
          {fileAttachments.embeddedFiles.map((file, idx) => renderAttachment(
            getActualFileName(file.filename),
            () => {
              setFileIdProcessSpinner(`embeddedFile_${idx}`);
              getEmbeddedFileData(file.fileObject).then((blob) => {
                saveAs(blob, getActualFileName(file.filename));
              }).finally(() => {
                setFileIdProcessSpinner(null);
              });
            },
            `embeddedFile_${idx}`,
            showFileIdProcessSpinner
          )
          )}
        </ul>
      </div>

      {Object.entries(fileAttachments.fileAttachmentAnnotations).map(([pageNumber, fileAttachmentAnnotsPerPage]) => {
        return (
          <div key={pageNumber} className="section">
            <h2 className="title">
              {t('message.pageNum')} {pageNumber}
            </h2>
            <ul className="downloadable">
              {fileAttachmentAnnotsPerPage.map((fileAttachmentAnnot, idx) => renderAttachment(
                getActualFileName(fileAttachmentAnnot.filename),
                () => {
                  setFileIdProcessSpinner(`fileAttachmentAnnotation_${idx}`);
                  core.setCurrentPage(fileAttachmentAnnot['PageNumber']);
                  core.selectAnnotation(fileAttachmentAnnot);
                  attachmentPanelItemOnClick(fileAttachmentAnnot);
                },
                `fileAttachmentAnnotation_${idx}`,
                showFileIdProcessSpinner
              ),
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default FileAttachmentPanel;
