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

  const elements = list.map((item, i) => {
    const isSelected = id === item.id;
    let img = null;
    if (item.hasOwnProperty('thumbnail') && item.thumbnail === '') {
      img = <div className="li-div-img with-border"></div>
    } else if (item.hasOwnProperty('thumbnail')) {
      img = <img src={item.thumbnail} className="li-div-img" />
    }
    let imgHolder = null;
    if (item.hasOwnProperty('thumbnail')) {
      imgHolder = <div className="li-div">{img}</div>
    }
    const modalClass = classNames({
      selected: isSelected
    });

    return (<li key={i} onClick={() => onRowClick(item.id)} className={modalClass}>
      {imgHolder}
      <div className="li-div-txt" >{item.filename}</div>
    </li>);
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