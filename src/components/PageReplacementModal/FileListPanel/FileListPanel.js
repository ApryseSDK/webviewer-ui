import React, { useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import './FileListPanel.scss';

const FileListPanel = ({ defaultValue, onFileSelect, list = [] }) => {
  const [t] = useTranslation();
  const { id } = defaultValue || {};

  const onRowClick = (id) => {
    onFileSelect(list.find(item => item.id === id));
  };

  const onRowKeyDown = (event, id) => {
    if (event.key === 'Enter') {
      onFileSelect(list.find(item => item.id === id));
    }
  };

  const getFileThumbnail = (item) => {
    if (item.hasOwnProperty('thumbnail')) {
      let src = null;
      const thumbnail = item.thumbnail;
      if (thumbnail.url) {
        src = thumbnail.url;
      } else if (thumbnail.toDataURL) {
        src = thumbnail.toDataURL();
      }
      //If thumbnail doesnt have a url or is canvas then we just show a blank square
      const img = <img src={src} className="li-div-img" />
      return (<div className="li-div">{img}</div>);
    } else {
      return null;
    }
  }

  const elements = list.map((item, i) => {
    const isSelected = id === item.id;
    const modalClass = classNames({
      selected: isSelected
    });

    const thumbnail = getFileThumbnail(item);

    return (
      <li tabIndex="0" key={i} onClick={() => onRowClick(item.id)} onKeyDown={(event) => onRowKeyDown(event, item.id)} className={modalClass}>
        {thumbnail}
        <div className="li-div-txt" >{item.filename}</div>
      </li>
    );
  });

  return (
    <div className="FileListPanel">
      <ul>
        {elements}
      </ul>
    </div>
  );
}

export default FileListPanel;