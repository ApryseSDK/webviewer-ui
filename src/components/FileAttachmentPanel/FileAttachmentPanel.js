import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFileAttachments, getEmbeddedFileData } from 'helpers/getFileAttachments';
import Spinner from '../Spinner';
import { saveAs } from 'file-saver';
import Icon from 'components/Icon';
import core from 'core';
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
  if (showFileIdProcessSpinner === key) {
    return (
      <li onClick={onClickCallback} key={key}>
        <div className='embedSpinner'>{`[${fileExtension}] ${filename}`}<Spinner height={15} width={15}/></div>
      </li>
    );
  }
  return (
    <li onClick={onClickCallback} key={key}>
      {`[${fileExtension}] ${filename}`}
    </li>
  );
};

const initialFilesDefault = { embeddedFiles: [], fileAttachmentAnnotations: [] };

const FileAttachmentPanel = ({ initialFiles = initialFilesDefault }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [fileAttachments, setFileAttachments] = useState(initialFiles);
  const isMultiTab = useSelector(selectors.getIsMultiTab);
  const tabManager = useSelector(selectors.getTabManager);
  const [showFileIdProcessSpinner, setFileIdProcessSpinner] = useState(null);

  useEffect(() => {
    const updateFileAttachments = async () => {
      const attachments = await getFileAttachments();
      setFileAttachments(attachments);
    };
    core.addEventListener('annotationChanged', updateFileAttachments);
    core.addEventListener('documentLoaded', updateFileAttachments);
    updateFileAttachments();
    return () => {
      core.removeEventListener('annotationChanged', updateFileAttachments);
      core.removeEventListener('documentLoaded', updateFileAttachments);
    };
  }, []);

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
      setTimeout(async () => {
        const blob = await fileAttachmentAnnot.getFileData();
        const filename = getActualFileName(fileAttachmentAnnot.filename);
        const newTabId = await tabManager.addTab(blob, { filename });
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
        dispatch(actions.closeElement(DataElements.LEFT_PANEL));
        await tabManager.setActiveTab(newTabId);
      }, 100);
    } else {
      return core.getAnnotationManager().trigger('annotationDoubleClicked', fileAttachmentAnnot);
    }
  };

  return (
    <div className="fileAttachmentPanel">
      <div className="section">
        {fileAttachments.embeddedFiles.length ? <p className="title">{t('message.embeddedFiles')}</p> : null}
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
            <p className="title">
              {t('message.pageNum')} {pageNumber}
            </p>
            <ul className="downloadable">
              {fileAttachmentAnnotsPerPage.map((fileAttachmentAnnot, idx) => renderAttachment(
                getActualFileName(fileAttachmentAnnot.filename),
                async () => {
                  core.setCurrentPage(fileAttachmentAnnot['PageNumber']);
                  core.selectAnnotation(fileAttachmentAnnot);
                  await attachmentPanelItemOnClick(fileAttachmentAnnot);
                },
                `fileAttachmentAnnotation_${idx}`,
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
