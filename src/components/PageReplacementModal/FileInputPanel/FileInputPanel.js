import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import './FileInputPanel.scss';
import Dropdown from 'components/Dropdown';

const FileInputPanel = ({ defaultValue, onFileSelect, acceptFormats, extension, setExtension }) => {
  const [t] = useTranslation();
  const [value, setValue] = useState(defaultValue || '');
  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);

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
      <label htmlFor="urlInput" className="url-input-header">{t('link.enterUrlAlt')}</label>
      <div className="url-input">
        <input type="text"
          id="urlInput"
          className="file-input"
          style={{ width: '100%', height: 32, paddingLeft: 8, fontSize: 13, boxSizing: 'border-box' }}
          value={value}
          onChange={onChange}
          placeholder={(customizableUI) ? '' : t('link.urlLink')}
        />
      </div>
      {(!setExtension) ? null :
        <div className="extension-dropdown">
          <Dropdown
            disabled={!value}
            id="open-file-extension-dropdown"
            labelledById='open-file-extension-dropdown-label'
            placeholder={t('tool.selectAnOption')}
            onClick={(e) => e.stopPropagation()}
            items={acceptFormats}
            ariaLabel={t('OpenFile.extension')}
            onClickItem={setExtension}
            currentSelectionKey={extension}
            maxHeight={200}
            height={32}
          />
          <label id="open-file-extension-dropdown-label">{t('OpenFile.extension')}</label>
        </div>
      }
    </div>
  );
};

export default FileInputPanel;