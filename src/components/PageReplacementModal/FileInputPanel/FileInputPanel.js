import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import './FileInputPanel.scss';
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const FileInputPanel = ({ defaultValue, onFileSelect, acceptFormats, extension, setExtension, error }) => {
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
    <div className='FileInputPanel'>
      <label htmlFor='urlInput' className='url-input-header'>{t('link.enterUrlAlt')}</label>
      <div className='url-input'>
        <input type='text'
          id='urlInput'
          className={classNames({
            'file-input': true,
            'file-input--error': !!error,
          })
          }
          style={{ width: '100%', height: 32, paddingLeft: 8, fontSize: 13, boxSizing: 'border-box' }}
          value={value}
          onChange={onChange}
          placeholder={(customizableUI) ? '' : t('link.urlLink')}
          aria-describedby={error ? 'urlInputError' : undefined}
        />
        {error && <Icon glyph='icon-alert' />}
      </div>
      {error && (
        <div className='url-input-error' id='urlInputError'>
          <p aria-live='assertive' className='no-margin'>{t(error)}</p>
        </div>
      )}
      {(!setExtension) ? null :
        <div className='extension-dropdown'>
          <Dropdown
            disabled={!value}
            id='open-file-extension-dropdown'
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
          <label id='open-file-extension-dropdown-label'>{t('OpenFile.extension')}</label>
        </div>
      }
    </div>
  );
};

FileInputPanel.propTypes = {
  defaultValue: PropTypes.string,
  onFileSelect: PropTypes.func.isRequired,
  acceptFormats: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    PropTypes.arrayOf(PropTypes.string),
  ]),
  extension: PropTypes.string,
  setExtension: PropTypes.func,
  error: PropTypes.string,
};

export default FileInputPanel;