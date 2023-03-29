import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { saveAs } from 'file-saver';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import { getAttachmentIcon, isImage, decompressFileContent } from 'helpers/ReplyAttachmentManager';

import './ReplyAttachmentList.scss';

const ImagePreview = ({ file }) => {
  const [src, setSrc] = useState();

  useEffect(() => {
    if (file instanceof File) {
      setSrc(URL.createObjectURL(file));
    } else if (!file.url) {
      decompressFileContent(file).then((blob) => {
        setSrc(URL.createObjectURL(blob));
      });
    }
  }, [file]);

  return <img src={src} />;
};

const ReplyAttachmentList = ({ files, isEditing, fileDeleted }) => {
  const [tabManager, previewEnabled] = useSelector((state) => [
    selectors.getTabManager(state),
    selectors.isReplyAttachmentPreviewEnabled(state)
  ]);

  const onClick = async (e, file) => {
    e.preventDefault();
    e.stopPropagation();

    if (!tabManager) {
      return console.warn('Can\'t open attachment in non-multi-tab mode');
    }

    let fileData;
    if (file instanceof File) {
      fileData = file;
    } else if (file.url) {
      fileData = file.url;
    } else {
      fileData = await decompressFileContent(file);
    }

    fileData && tabManager.addTab(fileData, {
      filename: file.name,
      setActive: true,
      saveCurrentActiveTabState: true
    });
  };

  const onDelete = (e, file) => {
    e.preventDefault();
    e.stopPropagation();

    fileDeleted(file);
  };

  const onDownload = async (e, file) => {
    e.preventDefault();
    e.stopPropagation();

    const fileData = file.url ? file.url : await decompressFileContent(file);
    saveAs(fileData, file.name);
  };

  return (
    <div className="reply-attachment-list">
      {files.map((file, i) => (
        <div
          className="reply-attachment"
          key={i}
          onClick={(e) => onClick(e, file)}
        >
          {previewEnabled && isImage(file) && (
            <div className="reply-attachment-preview">
              <ImagePreview file={file} />
            </div>
          )}
          <div className="reply-attachment-info">
            <Icon
              className="reply-attachment-icon"
              glyph={getAttachmentIcon(file)}
            />
            <Tooltip content={file.name}>
              <div className="reply-file-name">{file.name}</div>
            </Tooltip>
            {isEditing ? (
              <Button
                className="attachment-button"
                img="icon-close"
                onClick={(e) => onDelete(e, file)}
              />
            ) : (
              <Button
                className="attachment-button"
                img="icon-download"
                onClick={(e) => onDownload(e, file)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReplyAttachmentList;
