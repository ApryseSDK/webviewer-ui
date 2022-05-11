import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './FileInputPanel.scss';
import Dropdown from 'components/Dropdown';

const FileInputPanel = ({ defaultValue, onFileSelect, acceptFormats, extension, setExtension }) => {
  const [t] = useTranslation();
  const [value, setValue] = useState(defaultValue || '');

  const onChange = e => {
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
      <div className="url-input-header">{t('link.url')}</div>
      <div className="url-input">
        <input type="text"
          style={{ width: '100%', height: 32, paddingLeft: 8, fontSize: 13, boxSizing: 'border-box' }}
          value={value}
          onChange={onChange}
          placeholder={t('link.urlLink')}
        />
      </div>
      { (!setExtension) ? null :
        <div className="extension-dropdown">
          <Dropdown
            disabled={!value}
            placeholder={t('tool.select')}
            onClick={e => e.stopPropagation()}
            items={acceptFormats}
            onClickItem={setExtension}
            currentSelectionKey={extension}
          />
          <p>{t('OpenFile.extension')}</p>
        </div>
      }
    </div>
  );
};

export default FileInputPanel;