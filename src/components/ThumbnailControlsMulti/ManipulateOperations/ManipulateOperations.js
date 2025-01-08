import React from 'react';
import Button from 'components/Button';
import '../ThumbnailControlsMulti.scss';
import PropTypes from 'prop-types';

function ManipulateOperations({ onInsert, onReplace, onExtractPages, onDeletePages }) {
  return (
    <>
      <Button
        className={'button-hover'}
        dataElement="thumbnailsControlInsert"
        img="icon-page-insertion-insert"
        onClick={onInsert}
        title="action.insert"
      />
      <Button
        className={'button-hover'}
        dataElement="thumbnailsControlReplace"
        img="icon-page-replacement"
        onClick={onReplace}
        title="action.replace"
      />
      <Button
        className={'button-hover'}
        dataElement="thumbnailsControlExtract"
        img="icon-page-manipulation-extract"
        onClick={onExtractPages}
        title="action.extract"
      />
      <Button
        className={'button-hover'}
        dataElement="thumbnailsControlDelete"
        img="icon-delete-line"
        onClick={onDeletePages}
        title="action.delete"
      />
    </>
  );
}

ManipulateOperations.propTypes = {
  onInsert: PropTypes.func,
  onReplace: PropTypes.func,
  onExtractPages: PropTypes.func,
  onDeletePages: PropTypes.func,
};

export default ManipulateOperations;
