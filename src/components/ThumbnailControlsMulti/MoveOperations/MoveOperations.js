import React from 'react';
import Button from 'components/Button';
import '../ThumbnailControlsMulti.scss';
import PropTypes from 'prop-types';

function MoveOperations({ moveToTop, moveToBottom }) {
  return (
    <>
      <Button
        className={'button-hover'}
        dataElement="moveToTop"
        img="icon-page-move-up"
        onClick={moveToTop}
        title="action.moveToTop"
      />
      <Button
        className={'button-hover'}
        dataElement="moveToBottom"
        img="icon-page-move-down"
        onClick={moveToBottom}
        title="action.moveToBottom"
      />
    </>
  );
}

MoveOperations.propTypes = {
  moveToTop: PropTypes.func,
  moveToBottom: PropTypes.func,
};

export default MoveOperations;
