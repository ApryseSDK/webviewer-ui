import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFileAttachments } from 'helpers/getFileAttachments';
import { saveAs } from 'file-saver';
import Icon from 'components/Icon';
import core from 'core';
import './FileAttachmentPanel.scss';

const renderAttachment = (filename, onClickCallback, key) => {
  const fileExtension = filename.split('.').pop().toUpperCase();
  return (
    <li onClick={onClickCallback} key={key}>
      <span>{`[${fileExtension}] ${filename}`}</span>
    </li>
  );
};

const FileAttachmentPanel = () => {
  const [t] = useTranslation();
  const [fileAttachments, setFileAttachments] = useState({
    embeddedFiles: [],
    fileAttachmentAnnotations: [],
  });

  useEffect(() => {
    const updateFileAttachments = async () => {
      const attachments = await getFileAttachments();
      setFileAttachments(attachments);
    };
    core.addEventListener('annotationChanged', updateFileAttachments);
    updateFileAttachments();
    return () => {
      core.removeEventListener('annotationChanged', updateFileAttachments);
    };
  }, []);

  if (
    fileAttachments.embeddedFiles.length === 0 &&
    Object.entries(fileAttachments.fileAttachmentAnnotations).length === 0
  ) {
    return (
      <div className="no-attachment">
        <Icon className="empty-icon" glyph="illustration - empty state - outlines" />
        <div className="msg">{t('message.noAttachments')}</div>
      </div>
    );
  }
  return (
    <div className="fileAttachmentPanel">
      <div className="section">
        {fileAttachments.embeddedFiles.length ? <p className="title">{t('message.embeddedFiles')}</p> : null}
        <ul className="downloadable">
          {fileAttachments.embeddedFiles.map((file, idx) => renderAttachment(
            file.filename,
            () => {
              saveAs(file.blob, file.filename);
            },
            `embeddedFile_${idx}`,
          ),
          )}
        </ul>
      </div>

      {Object.entries(fileAttachments.fileAttachmentAnnotations).map(([pageNumber, fileAttachmentAnnotsPerPage]) => {
        return (
          <div key={pageNumber} className="section">
            <p className="title">
              {t('message.pageNum')}: {pageNumber}
            </p>
            <ul className="downloadable">
              {fileAttachmentAnnotsPerPage.map((fileAttachmentAnnot, idx) => renderAttachment(
                fileAttachmentAnnot.filename,
                () => {
                  core.setCurrentPage(fileAttachmentAnnot['PageNumber']);
                  core.selectAnnotation(fileAttachmentAnnot);
                  core.getAnnotationManager().trigger('annotationDoubleClicked', fileAttachmentAnnot);
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
