import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Button from 'components/Button';

import actions from 'actions';
import selectors from 'selectors';


const StampToolButton = () => {
  const [isStampOverlayOpen] = useSelector(
    state => [
      selectors.isElementOpen(state, 'stampOverlay'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(actions.toggleElement('stampOverlay'));
    // dispatch(actions.toggleElement('stampModal'));
  };

  return (
    <Button
      isActive={isStampOverlayOpen}
      img={'ic_annotation_stamp_black_24px'}
      onClick={handleClick}
    />
  );
};

export default StampToolButton;
