import React from 'react';
import './MultiViewerWrapper.scss';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';

const MultiViewerWrapper = ({ children, wrapOnlyInMultiViewerMode = false }) => {
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const isMultiViewerReady = useSelector((state) => selectors.isMultiViewerReady(state));
  return isMultiViewerReady || (wrapOnlyInMultiViewerMode && !isMultiViewerMode) ? <>{children}</> : null;
};

MultiViewerWrapper.propTypes = {
  children: PropTypes.any,
  wrapOnlyInMultiViewerMode: PropTypes.bool,
};

export default MultiViewerWrapper;