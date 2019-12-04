import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'components/Button';
import core from 'core';
import selectors from 'selectors';

import './ThumbnailControls.scss';

const propTypes = {
  index: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const dataElementName = 'thumbnailControl';

const ThumbnailControls = ({
  index,
  handleDelete,
}) => {
  const [isElementDisabled] = useSelector(state => [
    selectors.isElementDisabled(state, dataElementName),
  ]);

  const rotateClockwise = () => {
    core.rotatePages([index + 1], window.CoreControls.PageRotation.e_90);
  };

  const rotateCounterClockwise = () => {
    core.rotatePages([index + 1], window.CoreControls.PageRotation.e_270);
  };

  return isElementDisabled ? null : (
    <div className="thumbnailControls" data-element={dataElementName}>
      <Button
        img="ic_rotate_left_black_24px"
        onClick={rotateCounterClockwise}
        title="option.thumbnailPanel.rotateCounterClockwise"
      />
      <Button
        img="ic_delete_black_24px"
        onClick={handleDelete}
        title="option.thumbnailPanel.delete"
      />
      <Button
        img="ic_rotate_right_black_24px"
        onClick={rotateClockwise}
        title="option.thumbnailPanel.rotateClockwise"
      />
    </div>
  );
};

ThumbnailControls.propTypes = propTypes;

export default ThumbnailControls;