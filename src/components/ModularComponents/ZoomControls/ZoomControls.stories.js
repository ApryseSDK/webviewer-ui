import React from 'react';
import ZoomControls from './ZoomControls';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'ModularComponents/ZoomControls',
  component: ZoomControls,
};

const store = configureStore({
  reducer: () => initialState
});

const noop = () => {};

export const BasicComponent = () => {
  const props = {
    getZoom: noop,
    setZoomHandler: noop,
    zoomValue: '100',
    zoomTo: noop,
    zoomIn: noop,
    zoomOut: noop,
    isZoomFlyoutMenuActive: false,
    isActive: true,
    dataElement: 'zoom-container',
    onFlyoutToggle: noop,
    onClick: noop
  };
  return (
    <Provider store={store}>
      <ZoomControls {...props} />
    </Provider>
  );
};