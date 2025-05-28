import React, { useState, useEffect, useCallback } from 'react';
import core from 'core';
import { useTranslation } from 'react-i18next';
import useOnDocumentFileNameEdit from 'hooks/useOnDocumentFileNameEdit';
import Button from 'components/Button';
import './EditorFileName.scss';
import PropTypes from 'prop-types';
import { isMobileSize } from 'helpers/getDeviceSize';
import classNames from 'classnames';
import useOnDocumentUnloaded from 'hooks/useOnDocumentUnloaded';
import { FILESAVERJS_MAX_NAME_LENTH } from 'src/constants/fileName';


const EditorFileName = ({ dataElement }) => {
  const { t } = useTranslation();
  const {
    viewOnly,
    extension,
    isEditing,
    fileNameWithoutExtension,
    setFileNameWithoutExtension,
    startEditing,
    finishEditing,
    handleKeyDown,
  } = useOnDocumentFileNameEdit();

  const buttonTitlePrefix = viewOnly ? '' : `${t('action.edit')} ${t('saveModal.fileName')} - `;
  const [fileName, setFileName] = useState(core.getDocument()?.getFilename());

  useEffect(() => {
    const getFileName = () => {
      setFileName(core.getDocument()?.getFilename());
    };
    core.addEventListener('documentLoaded', getFileName);
    getFileName();
    return () => core.removeEventListener('documentLoaded', getFileName);
  }, []);

  const handleDocumentUnloaded = useCallback(() => {
    setFileName('');
  }, []);

  useOnDocumentUnloaded(handleDocumentUnloaded);

  useEffect(() => {
    if (fileNameWithoutExtension && extension) {
      setFileName(`${fileNameWithoutExtension}${extension}`);
    }
  }, [fileNameWithoutExtension, extension]);

  // Hiding this component on mobile until we implement mobile functionality
  return !isMobileSize() && (isEditing && !viewOnly) ? (
    <input
      maxLength={FILESAVERJS_MAX_NAME_LENTH - extension.length}
      type='text'
      className={'input-file-name'}
      aria-label={`${t('action.edit')} ${t('saveModal.fileName')} - ${fileName}`}
      value={fileNameWithoutExtension}
      onChange={(e) => setFileNameWithoutExtension(e.target.value)}
      onBlur={finishEditing}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <Button
      dataElement={dataElement}
      className={classNames({
        'button-file-name': true,
        [dataElement]: true,
      })}
      label={fileName}
      title={`${buttonTitlePrefix}${fileName}`}
      onClick={startEditing}
      disabled={viewOnly}
    />
  );
};

EditorFileName.propTypes = {
  dataElement: PropTypes.string.isRequired,
};

export default EditorFileName;