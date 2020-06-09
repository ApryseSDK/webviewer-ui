import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Button from 'components/Button';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

const RubberStampToolButton = () => {
  const [isSignatureOverlayOpen] = useSelector(
    state => [
      selectors.isElementOpen(state, 'stampOverlay'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();


  const handleClick = () => {
    dispatch(actions.toggleElement('stampOverlay'));
  };

  const buttonClass = classNames({
    'down-arrow': true,
  });

  return (
    <Button
      className={buttonClass}
      isActive={isSignatureOverlayOpen}
      img="ic_annotation_stamp_black_24px"
      onClick={handleClick}
      title="annotation.rubberStamp"
    />
  );
};

export default RubberStampToolButton;