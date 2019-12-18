import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import defaultTool from 'constants/defaultTool';
import Button from 'components/Button';
import ToolButton from 'components/ToolButton';
import getClassName from 'helpers/getClassName';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';


const StampToolButton = () => {
  const [isSignatureModalOpen, isSignatureOverlayOpen] = useSelector(
    state => [
      selectors.isElementOpen(state, 'signatureModal'),
      selectors.isElementOpen(state, 'signatureOverlay'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const handleClick = () => {
    // dispatch(actions.toggleElement('stampOverlay'));
    dispatch(actions.toggleElement('stampModal'));
  };

  return (
    <Button
      isActive={isSignatureModalOpen || isSignatureOverlayOpen}
      img={'ic_annotation_stamp_black_24px'}
      onClick={handleClick}
    />
  );
};

export default StampToolButton;
