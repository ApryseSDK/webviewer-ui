import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './FileInputPanel.scss'

const FileInputPanel = ({ defaultValue, onFileSelect }) => {
  const [t] = useTranslation();
  const [value, setValue] = useState(defaultValue || '');

  const onChange = (e) => {
    setValue(e.target.value);
    onFileSelect(e.target.value);
  };

  useEffect(() => {
    if (!defaultValue && defaultValue !== value) {
      setValue('');
    }
  });

  return (
    <div className="FileInputPanel">
      <div className="md-row">{t('link.url')+':'}</div>
      <div className="md-row" style={{ width:'50%' }}>
        <input type="text"
          className="url-input"
          style={{ width: '100%', height: 26 }}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default FileInputPanel;