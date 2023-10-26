import React from 'react';
import './MultiViewerWrapper.scss';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const MultiViewerWrapper = ({ children }) => {
  const isMultiViewerReady = useSelector((state) => selectors.isMultiViewerReady(state));
  return isMultiViewerReady ? <>{children}</> : null;
};

export default MultiViewerWrapper;