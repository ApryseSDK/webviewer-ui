import React from 'react';
import core from 'core';
import { useTranslation } from 'react-i18next';
import useOnDocumentFileNameEdit from 'hooks/useOnDocumentFileNameEdit';
import Button from 'components/Button';
import './EditorFileName.scss';
import PropTypes from 'prop-types';
import { isMobileSize } from 'helpers/getDeviceSize';

const EditorFileName = ({ dataElement, readOnly }) => {
  const { t } = useTranslation();
  const {
    isEditing,
    fileNameWithoutExtension,
    setFileNameWithoutExtension,
    startEditing,
    finishEditing,
    handleKeyDown,
  } = useOnDocumentFileNameEdit();

  // Hiding this component on mobile until we implement mobile functionality
  return !isMobileSize() && isEditing ? (
    <input
      type='text'
      className={'input-file-name'}
      aria-label={`${t('action.edit')} ${t('saveModal.fileName')} - ${core.getDocument()?.getFilename()}`}
      value={fileNameWithoutExtension}
      onChange={(e) => setFileNameWithoutExtension(e.target.value)}
      onBlur={finishEditing}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <Button
      dataElement={dataElement}
      className={'button-file-name'}
      label={core.getDocument()?.getFilename()}
      title={`${t('action.edit')} ${t('saveModal.fileName')} - ${core.getDocument()?.getFilename()}`}
      onClick={startEditing}
      disabled={readOnly}
    />
  );
};

EditorFileName.propTypes = {
  dataElement: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
};

export default EditorFileName;